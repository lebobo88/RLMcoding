"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  FileText,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  File,
  Save,
  RotateCcw,
  Eye,
  Edit3,
} from "lucide-react";
import ParticleButton from "@/components/kokonutui/particle-button";
import { cn } from "@/lib/utils";

interface FileNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: FileNode[];
}

interface SpecFile {
  path: string;
  content: string;
  exists: boolean;
}

export default function SpecsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const fileParam = searchParams.get("file");

  const [files, setFiles] = useState<FileNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<SpecFile | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(["specs"])
  );

  // Fetch file tree
  useEffect(() => {
    fetch(`/api/projects/${params.id}/specs`)
      .then((r) => r.json())
      .then((res) => {
        if (res.data?.files) {
          setFiles(res.data.files);
        }
        setLoading(false);
      });
  }, [params.id]);

  // Load file from URL param
  useEffect(() => {
    if (fileParam) {
      loadFile(fileParam);
    }
  }, [fileParam, params.id]);

  const loadFile = async (filePath: string) => {
    try {
      const res = await fetch(
        `/api/projects/${params.id}/specs?file=${encodeURIComponent(filePath)}`
      );
      const data = await res.json();
      if (data.data) {
        setSelectedFile(data.data);
        setEditedContent(data.data.content);
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Failed to load file:", err);
    }
  };

  const saveFile = async () => {
    if (!selectedFile) return;
    setSaving(true);
    try {
      await fetch(`/api/projects/${params.id}/specs`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file: selectedFile.path,
          content: editedContent,
        }),
      });
      setSelectedFile({ ...selectedFile, content: editedContent });
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to save file:", err);
    } finally {
      setSaving(false);
    }
  };

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const hasChanges = selectedFile && editedContent !== selectedFile.content;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <FileText className="h-6 w-6 text-green-500" />
            Specifications
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            View and edit RLM specification files
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* File Tree */}
        <div className="lg:col-span-1 p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3 flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            Files
          </h3>
          <div className="space-y-1">
            <FileTree
              nodes={files}
              selectedPath={selectedFile?.path}
              expandedFolders={expandedFolders}
              onSelect={(path) => loadFile(path)}
              onToggleFolder={toggleFolder}
            />
          </div>
        </div>

        {/* Editor */}
        <div className="lg:col-span-3">
          {selectedFile ? (
            <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden">
              {/* Editor Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4 text-neutral-500" />
                  <span className="font-mono text-sm text-neutral-700 dark:text-neutral-300">
                    {selectedFile.path}
                  </span>
                  {hasChanges && (
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <ParticleButton
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditedContent(selectedFile.content);
                          setIsEditing(false);
                        }}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Cancel
                      </ParticleButton>
                      <ParticleButton
                        size="sm"
                        onClick={saveFile}
                        disabled={saving || !hasChanges}
                      >
                        <Save className="h-4 w-4 mr-1" />
                        {saving ? "Saving..." : "Save"}
                      </ParticleButton>
                    </>
                  ) : (
                    <>
                      <ParticleButton
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(false)}
                        className={!isEditing ? "bg-blue-50 dark:bg-blue-900/20" : ""}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </ParticleButton>
                      <ParticleButton size="sm" onClick={() => setIsEditing(true)}>
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </ParticleButton>
                    </>
                  )}
                </div>
              </div>

              {/* Content Area */}
              <div className="h-[60vh] overflow-auto">
                {isEditing ? (
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full h-full p-4 font-mono text-sm bg-transparent text-neutral-800 dark:text-neutral-200 resize-none focus:outline-none"
                    spellCheck={false}
                  />
                ) : (
                  <div className="p-4 prose dark:prose-invert max-w-none">
                    <MarkdownPreview content={selectedFile.content} />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[60vh] rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <div className="text-center">
                <FileText className="h-12 w-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
                <p className="text-neutral-500 dark:text-neutral-400">
                  Select a file to view or edit
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FileTree({
  nodes,
  selectedPath,
  expandedFolders,
  onSelect,
  onToggleFolder,
  depth = 0,
}: {
  nodes: FileNode[];
  selectedPath?: string;
  expandedFolders: Set<string>;
  onSelect: (path: string) => void;
  onToggleFolder: (path: string) => void;
  depth?: number;
}) {
  return (
    <div className="space-y-0.5">
      {nodes.map((node) => {
        const isExpanded = expandedFolders.has(node.path);
        const isSelected = node.path === selectedPath;

        if (node.type === "folder") {
          return (
            <div key={node.path}>
              <button
                onClick={() => onToggleFolder(node.path)}
                className="w-full flex items-center gap-1 px-2 py-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                style={{ paddingLeft: `${depth * 12 + 8}px` }}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-neutral-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-neutral-400" />
                )}
                <FolderOpen className="h-4 w-4 text-amber-500" />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  {node.name}
                </span>
              </button>
              {isExpanded && node.children && (
                <FileTree
                  nodes={node.children}
                  selectedPath={selectedPath}
                  expandedFolders={expandedFolders}
                  onSelect={onSelect}
                  onToggleFolder={onToggleFolder}
                  depth={depth + 1}
                />
              )}
            </div>
          );
        }

        return (
          <button
            key={node.path}
            onClick={() => onSelect(node.path)}
            className={cn(
              "w-full flex items-center gap-2 px-2 py-1.5 rounded transition-colors",
              isSelected
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                : "hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
            )}
            style={{ paddingLeft: `${depth * 12 + 28}px` }}
          >
            <File className="h-4 w-4 text-neutral-400" />
            <span className="text-sm truncate">{node.name}</span>
          </button>
        );
      })}
    </div>
  );
}

function MarkdownPreview({ content }: { content: string }) {
  // Simple markdown rendering - in production, use a proper markdown library
  const lines = content.split("\n");

  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        if (line.startsWith("# ")) {
          return (
            <h1 key={i} className="text-2xl font-bold mt-6 mb-2">
              {line.slice(2)}
            </h1>
          );
        }
        if (line.startsWith("## ")) {
          return (
            <h2 key={i} className="text-xl font-semibold mt-4 mb-2">
              {line.slice(3)}
            </h2>
          );
        }
        if (line.startsWith("### ")) {
          return (
            <h3 key={i} className="text-lg font-medium mt-3 mb-1">
              {line.slice(4)}
            </h3>
          );
        }
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return (
            <li key={i} className="ml-4">
              {line.slice(2)}
            </li>
          );
        }
        if (line.startsWith("```")) {
          return null; // Skip code fence markers
        }
        if (line.trim() === "") {
          return <br key={i} />;
        }
        return <p key={i}>{line}</p>;
      })}
    </div>
  );
}
