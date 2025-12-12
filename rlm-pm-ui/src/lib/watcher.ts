import chokidar, { FSWatcher } from "chokidar";
import { EventEmitter } from "events";
import * as path from "path";

export interface FileChangeEvent {
  type: "add" | "change" | "unlink";
  path: string;
  projectId: string;
  timestamp: Date;
}

class FileWatcherService extends EventEmitter {
  private watchers: Map<string, FSWatcher> = new Map();
  private static instance: FileWatcherService;

  private constructor() {
    super();
  }

  public static getInstance(): FileWatcherService {
    if (!FileWatcherService.instance) {
      FileWatcherService.instance = new FileWatcherService();
    }
    return FileWatcherService.instance;
  }

  public watchProject(projectId: string, projectPath: string): void {
    // Don't watch if already watching
    if (this.watchers.has(projectId)) {
      return;
    }

    const rlmPath = path.join(projectPath, "RLM");

    // Watch patterns
    const watchPatterns = [
      path.join(rlmPath, "specs", "**", "*.md"),
      path.join(rlmPath, "tasks", "**", "*.md"),
      path.join(rlmPath, "progress", "*.json"),
      path.join(rlmPath, "progress", "token-usage", "*.json"),
      path.join(rlmPath, "research", "**", "*"),
    ];

    const watcher = chokidar.watch(watchPatterns, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 300,
        pollInterval: 100,
      },
    });

    watcher
      .on("add", (filePath) => this.handleChange("add", filePath, projectId, projectPath))
      .on("change", (filePath) => this.handleChange("change", filePath, projectId, projectPath))
      .on("unlink", (filePath) => this.handleChange("unlink", filePath, projectId, projectPath));

    this.watchers.set(projectId, watcher);
    console.log(`[FileWatcher] Started watching project: ${projectId}`);
  }

  public unwatchProject(projectId: string): void {
    const watcher = this.watchers.get(projectId);
    if (watcher) {
      watcher.close();
      this.watchers.delete(projectId);
      console.log(`[FileWatcher] Stopped watching project: ${projectId}`);
    }
  }

  public isWatching(projectId: string): boolean {
    return this.watchers.has(projectId);
  }

  private handleChange(
    type: "add" | "change" | "unlink",
    filePath: string,
    projectId: string,
    projectPath: string
  ): void {
    const relativePath = path.relative(projectPath, filePath).replace(/\\/g, "/");

    const event: FileChangeEvent = {
      type,
      path: relativePath,
      projectId,
      timestamp: new Date(),
    };

    console.log(`[FileWatcher] ${type}: ${relativePath}`);
    this.emit("change", event);
  }

  public getActiveWatchers(): string[] {
    return Array.from(this.watchers.keys());
  }
}

export const fileWatcher = FileWatcherService.getInstance();
