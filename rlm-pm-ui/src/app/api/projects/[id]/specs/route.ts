import { NextRequest, NextResponse } from "next/server";
import { db, projects } from "@/lib/db";
import { eq } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

interface FileNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: FileNode[];
}

// Recursively build file tree
function buildFileTree(dirPath: string, basePath: string): FileNode[] {
  const nodes: FileNode[] = [];

  if (!fs.existsSync(dirPath)) {
    return nodes;
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relativePath = path.relative(basePath, fullPath).replace(/\\/g, "/");

    if (entry.isDirectory()) {
      nodes.push({
        name: entry.name,
        path: relativePath,
        type: "folder",
        children: buildFileTree(fullPath, basePath),
      });
    } else if (
      entry.name.endsWith(".md") ||
      entry.name.endsWith(".json") ||
      entry.name.endsWith(".yaml") ||
      entry.name.endsWith(".yml")
    ) {
      nodes.push({
        name: entry.name,
        path: relativePath,
        type: "file",
      });
    }
  }

  // Sort: folders first, then files, alphabetically
  return nodes.sort((a, b) => {
    if (a.type === "folder" && b.type === "file") return -1;
    if (a.type === "file" && b.type === "folder") return 1;
    return a.name.localeCompare(b.name);
  });
}

// GET /api/projects/[id]/specs - Get file tree or file content
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get("file");

    // Get project from database
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .get();

    if (!project) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Project not found" } },
        { status: 404 }
      );
    }

    const rlmPath = path.join(project.localPath, "RLM");

    // If file path specified, return file content
    if (filePath) {
      const fullPath = path.join(rlmPath, filePath);

      // Security: ensure path is within RLM folder
      if (!fullPath.startsWith(rlmPath)) {
        return NextResponse.json(
          { error: { code: "FORBIDDEN", message: "Access denied" } },
          { status: 403 }
        );
      }

      const exists = fs.existsSync(fullPath);
      const content = exists ? fs.readFileSync(fullPath, "utf-8") : "";

      return NextResponse.json({
        data: {
          path: filePath,
          content,
          exists,
        },
      });
    }

    // Otherwise, return file tree for specs folder
    const specsPath = path.join(rlmPath, "specs");
    const files = buildFileTree(specsPath, rlmPath);

    // Also include progress files
    const progressPath = path.join(rlmPath, "progress");
    const progressFiles = buildFileTree(progressPath, rlmPath);

    // Include templates
    const templatesPath = path.join(rlmPath, "templates");
    const templateFiles = buildFileTree(templatesPath, rlmPath);

    const allFiles: FileNode[] = [
      { name: "specs", path: "specs", type: "folder", children: files },
      { name: "progress", path: "progress", type: "folder", children: progressFiles },
      { name: "templates", path: "templates", type: "folder", children: templateFiles },
    ];

    return NextResponse.json({ data: { files: allFiles } });
  } catch (error) {
    console.error("Error fetching specs:", error);
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message: "Failed to fetch specs" } },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id]/specs - Update file content
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { file, content } = body;

    if (!file || content === undefined) {
      return NextResponse.json(
        { error: { code: "BAD_REQUEST", message: "File and content are required" } },
        { status: 400 }
      );
    }

    // Get project from database
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .get();

    if (!project) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Project not found" } },
        { status: 404 }
      );
    }

    const rlmPath = path.join(project.localPath, "RLM");
    const fullPath = path.join(rlmPath, file);

    // Security: ensure path is within RLM folder
    if (!fullPath.startsWith(rlmPath)) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Access denied" } },
        { status: 403 }
      );
    }

    // Ensure directory exists
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write file
    fs.writeFileSync(fullPath, content, "utf-8");

    return NextResponse.json({
      data: {
        message: "File saved",
        path: file,
      },
    });
  } catch (error) {
    console.error("Error saving spec file:", error);
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message: "Failed to save file" } },
      { status: 500 }
    );
  }
}
