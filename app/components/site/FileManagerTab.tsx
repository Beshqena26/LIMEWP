"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useTheme } from "@/lib/context/ThemeContext";
import { cn } from "@/lib/utils";
import { getColorClasses } from "@/lib/utils/colors";
import { showToast } from "@/lib/toast";
import { ConfirmDialog } from "@/app/components/ui/ConfirmDialog";

interface FileItem {
  name: string;
  type: "file" | "folder";
  size: string;
  modified: string;
  permissions?: string;
  extension?: string;
}

const FILES: FileItem[] = [
  { name: "wp-content", type: "folder", size: "256 MB", modified: "1 hour ago", permissions: "755" },
  { name: "wp-admin", type: "folder", size: "48 MB", modified: "3 days ago", permissions: "755" },
  { name: "wp-includes", type: "folder", size: "64 MB", modified: "3 days ago", permissions: "755" },
  { name: "wp-config.php", type: "file", size: "4.2 KB", modified: "2 hours ago", permissions: "644", extension: "php" },
  { name: "index.php", type: "file", size: "418 B", modified: "3 days ago", permissions: "644", extension: "php" },
  { name: "wp-login.php", type: "file", size: "48 KB", modified: "3 days ago", permissions: "644", extension: "php" },
  { name: ".htaccess", type: "file", size: "1.1 KB", modified: "1 week ago", permissions: "644", extension: "config" },
  { name: "robots.txt", type: "file", size: "256 B", modified: "2 weeks ago", permissions: "644", extension: "txt" },
  { name: "readme.html", type: "file", size: "7.3 KB", modified: "3 days ago", permissions: "644", extension: "html" },
  { name: "license.txt", type: "file", size: "19 KB", modified: "3 days ago", permissions: "644", extension: "txt" },
];

const FOLDER_CONTENTS: Record<string, FileItem[]> = {
  "wp-content": [
    { name: "themes", type: "folder", size: "24 MB", modified: "1 day ago", permissions: "755" },
    { name: "plugins", type: "folder", size: "180 MB", modified: "2 hours ago", permissions: "755" },
    { name: "uploads", type: "folder", size: "52 MB", modified: "30 min ago", permissions: "755" },
    { name: "debug.log", type: "file", size: "2.4 MB", modified: "5 min ago", permissions: "644", extension: "txt" },
  ],
  "wp-admin": [
    { name: "css", type: "folder", size: "8 MB", modified: "3 days ago", permissions: "755" },
    { name: "js", type: "folder", size: "12 MB", modified: "3 days ago", permissions: "755" },
    { name: "includes", type: "folder", size: "28 MB", modified: "3 days ago", permissions: "755" },
    { name: "index.php", type: "file", size: "1.2 KB", modified: "3 days ago", permissions: "644", extension: "php" },
  ],
};

const MOCK_FILE_CONTENTS: Record<string, string> = {
  "wp-config.php": `<?php
define('DB_NAME', 'wordpress');
define('DB_USER', 'root');
define('DB_PASSWORD', '');
define('DB_HOST', 'localhost');
define('DB_CHARSET', 'utf8');
define('DB_COLLATE', '');

$table_prefix = 'wp_';

define('WP_DEBUG', false);

if ( ! defined('ABSPATH') ) {
  define('ABSPATH', __DIR__ . '/');
}

require_once ABSPATH . 'wp-settings.php';`,
  ".htaccess": `# BEGIN WordPress
RewriteEngine On
RewriteBase /
RewriteRule ^index\\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
# END WordPress`,
  "index.php": `<?php
// Silence is golden.`,
  "robots.txt": `User-agent: *
Disallow: /wp-admin/
Allow: /wp-admin/admin-ajax.php

Sitemap: https://example.com/sitemap.xml`,
};

const getFileIcon = (file: FileItem, isLight: boolean) => {
  if (file.type === "folder") {
    return {
      bg: isLight ? "bg-amber-500/15" : "bg-amber-500/10",
      color: isLight ? "text-amber-600" : "text-amber-400",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-15a3 3 0 00-3 3V18a3 3 0 003 3h15zM1.5 10.146V6a3 3 0 013-3h5.379a2.25 2.25 0 011.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 013 3v1.146A4.483 4.483 0 0019.5 9h-15a4.483 4.483 0 00-3 1.146z" />
        </svg>
      ),
    };
  }

  const ext = file.extension || file.name.split(".").pop() || "";

  switch (ext) {
    case "php":
      return {
        bg: isLight ? "bg-indigo-500/15" : "bg-indigo-500/10",
        color: isLight ? "text-indigo-600" : "text-indigo-400",
        icon: (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.41 14.73c-1.47 0-2.19-.74-2.19-1.98v-.08h1.15v.08c0 .57.32.87.97.87.63 0 1-.32 1-.83 0-.53-.37-.79-1.14-.99-1.23-.33-1.86-.84-1.86-1.89 0-1.11.79-1.79 2.07-1.79 1.4 0 2.07.68 2.07 1.79v.04h-1.15v-.04c0-.47-.3-.72-.92-.72-.57 0-.89.27-.89.7 0 .42.33.64 1.06.83 1.3.35 1.95.87 1.95 2.03 0 1.17-.82 1.98-2.12 1.98zm5.59-.12h-1.15v-4.73h-1.51v-1h4.17v1h-1.51v4.73z" />
          </svg>
        ),
      };
    case "html":
    case "htm":
      return {
        bg: isLight ? "bg-orange-500/15" : "bg-orange-500/10",
        color: isLight ? "text-orange-600" : "text-orange-400",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
          </svg>
        ),
      };
    case "css":
    case "scss":
    case "sass":
      return {
        bg: isLight ? "bg-sky-500/15" : "bg-sky-500/10",
        color: isLight ? "text-sky-600" : "text-sky-400",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
          </svg>
        ),
      };
    case "js":
    case "ts":
    case "jsx":
    case "tsx":
      return {
        bg: isLight ? "bg-yellow-500/15" : "bg-yellow-500/10",
        color: isLight ? "text-yellow-600" : "text-yellow-500",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
          </svg>
        ),
      };
    case "json":
      return {
        bg: isLight ? "bg-emerald-500/15" : "bg-emerald-500/10",
        color: isLight ? "text-emerald-600" : "text-emerald-400",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25" />
          </svg>
        ),
      };
    case "config":
    case "htaccess":
    case "env":
      return {
        bg: isLight ? "bg-violet-500/15" : "bg-violet-500/10",
        color: isLight ? "text-violet-600" : "text-violet-400",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
      };
    case "txt":
    case "md":
      return {
        bg: isLight ? "bg-slate-200" : "bg-slate-500/10",
        color: isLight ? "text-slate-600" : "text-slate-400",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        ),
      };
    case "zip":
    case "tar":
    case "gz":
    case "rar":
      return {
        bg: isLight ? "bg-rose-500/15" : "bg-rose-500/10",
        color: isLight ? "text-rose-600" : "text-rose-400",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
        ),
      };
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "svg":
    case "webp":
      return {
        bg: isLight ? "bg-pink-500/15" : "bg-pink-500/10",
        color: isLight ? "text-pink-600" : "text-pink-400",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        ),
      };
    default:
      return {
        bg: isLight ? "bg-slate-200" : "bg-slate-500/10",
        color: isLight ? "text-slate-500" : "text-slate-400",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        ),
      };
  }
};

function getMockContent(filename: string): string {
  if (MOCK_FILE_CONTENTS[filename]) return MOCK_FILE_CONTENTS[filename];
  const ext = filename.split(".").pop() || "";
  if (["php"].includes(ext)) return `<?php\n// ${filename}\n`;
  if (["html", "htm"].includes(ext)) return `<!DOCTYPE html>\n<html>\n<head><title>${filename}</title></head>\n<body></body>\n</html>`;
  if (["css"].includes(ext)) return `/* ${filename} */\nbody {\n  margin: 0;\n}`;
  if (["js", "ts"].includes(ext)) return `// ${filename}\nconsole.log("loaded");`;
  if (["txt", "md", "log"].includes(ext)) return `${filename}\n`;
  return `// File contents of ${filename}`;
}

function isImageFile(file: FileItem): boolean {
  const ext = file.extension || file.name.split(".").pop() || "";
  return ["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext);
}

function isTextFile(file: FileItem): boolean {
  const ext = file.extension || file.name.split(".").pop() || "";
  return ["php", "html", "htm", "css", "scss", "js", "ts", "jsx", "tsx", "json", "txt", "md", "config", "htaccess", "env", "log", "xml", "yaml", "yml"].includes(ext);
}

export function FileManagerTab() {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const colors = getColorClasses(accentColor);

  // View state
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Navigation state
  const [currentPath, setCurrentPath] = useState<string[]>(["public_html"]);

  // Added files per folder path (key = path joined with "/")
  const [addedFiles, setAddedFiles] = useState<Record<string, FileItem[]>>({});

  // Removed file names per folder path
  const [removedFiles, setRemovedFiles] = useState<Record<string, string[]>>({});

  // Renamed files map per folder path: old name -> new name
  const [renamedFiles, setRenamedFiles] = useState<Record<string, Record<string, string>>>({});

  // Changed permissions per folder path: file name -> new perms
  const [changedPerms, setChangedPerms] = useState<Record<string, Record<string, string>>>({});

  // Modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [renameTarget, setRenameTarget] = useState<FileItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FileItem | null>(null);
  const [editTarget, setEditTarget] = useState<FileItem | null>(null);
  const [previewTarget, setPreviewTarget] = useState<FileItem | null>(null);
  const [permissionsTarget, setPermissionsTarget] = useState<FileItem | null>(null);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Form state
  const [newFileName, setNewFileName] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [renameValue, setRenameValue] = useState("");
  const [editContent, setEditContent] = useState("");
  const [permValue, setPermValue] = useState("");

  // Upload state
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Derive current path key for state maps
  const pathKey = currentPath.join("/");

  // Derive the base files for current directory
  const baseFiles = useMemo(() => {
    if (currentPath.length === 1) return FILES;
    const lastFolder = currentPath[currentPath.length - 1];
    return FOLDER_CONTENTS[lastFolder] || [];
  }, [currentPath]);

  // Apply mutations (added, removed, renamed, perms) to get current file list
  const currentFiles = useMemo(() => {
    const added = addedFiles[pathKey] || [];
    const removed = removedFiles[pathKey] || [];
    const renamed = renamedFiles[pathKey] || {};
    const perms = changedPerms[pathKey] || {};

    const combined = [...baseFiles, ...added]
      .filter(f => !removed.includes(f.name))
      .map(f => {
        const newName = renamed[f.name];
        const newPerm = perms[newName || f.name] || perms[f.name];
        return {
          ...f,
          name: newName || f.name,
          permissions: newPerm || f.permissions,
        };
      });

    return combined;
  }, [baseFiles, addedFiles, removedFiles, renamedFiles, changedPerms, pathKey]);

  const sortedFiles = useMemo(() => {
    return [...currentFiles].sort((a, b) => {
      if (a.type === "folder" && b.type !== "folder") return -1;
      if (a.type !== "folder" && b.type === "folder") return 1;
      return a.name.localeCompare(b.name);
    });
  }, [currentFiles]);

  const filteredFiles = useMemo(() => {
    return sortedFiles.filter(f =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sortedFiles, searchQuery]);

  const folderCount = filteredFiles.filter(f => f.type === "folder").length;
  const fileCount = filteredFiles.filter(f => f.type === "file").length;

  const toggleFileSelection = useCallback((name: string) => {
    setSelectedFiles(prev =>
      prev.includes(name)
        ? prev.filter(n => n !== name)
        : [...prev, name]
    );
  }, []);

  const toggleAllFiles = useCallback(() => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map(f => f.name));
    }
  }, [selectedFiles.length, filteredFiles]);

  // Navigate into a folder
  const navigateIntoFolder = useCallback((folderName: string) => {
    setCurrentPath(prev => [...prev, folderName]);
    setSelectedFiles([]);
    setSearchQuery("");
  }, []);

  // Navigate to a breadcrumb index
  const navigateToBreadcrumb = useCallback((index: number) => {
    setCurrentPath(prev => prev.slice(0, index + 1));
    setSelectedFiles([]);
    setSearchQuery("");
  }, []);

  // Handle file/folder click (double-click into folder, single click for selection)
  const handleItemDoubleClick = useCallback((file: FileItem) => {
    if (file.type === "folder") {
      navigateIntoFolder(file.name);
    } else if (isTextFile(file)) {
      setEditContent(getMockContent(file.name));
      setEditTarget(file);
    } else if (isImageFile(file)) {
      setPreviewTarget(file);
    }
  }, [navigateIntoFolder]);

  // Upload simulation
  const simulateUpload = useCallback((fileName: string) => {
    setUploadFileName(fileName);
    setIsUploading(true);
    setUploadProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 25 + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadProgress(100);
        setTimeout(() => {
          const ext = fileName.split(".").pop() || "";
          const newFile: FileItem = {
            name: fileName,
            type: "file",
            size: `${(Math.random() * 100 + 1).toFixed(1)} KB`,
            modified: "Just now",
            permissions: "644",
            extension: ext,
          };
          setAddedFiles(prev => ({
            ...prev,
            [pathKey]: [...(prev[pathKey] || []), newFile],
          }));
          setIsUploading(false);
          setShowUploadModal(false);
          setUploadFileName("");
          setUploadProgress(0);
          showToast.success(`Uploaded ${fileName}`);
        }, 400);
      } else {
        setUploadProgress(Math.min(progress, 99));
      }
    }, 200);
  }, [pathKey]);

  // Create new file
  const handleCreateFile = useCallback(() => {
    if (!newFileName.trim()) return;
    setActionLoading(true);
    setTimeout(() => {
      const ext = newFileName.split(".").pop() || "";
      const newFile: FileItem = {
        name: newFileName.trim(),
        type: "file",
        size: "0 B",
        modified: "Just now",
        permissions: "644",
        extension: ext,
      };
      setAddedFiles(prev => ({
        ...prev,
        [pathKey]: [...(prev[pathKey] || []), newFile],
      }));
      setActionLoading(false);
      setShowNewFileModal(false);
      setNewFileName("");
      showToast.success(`Created ${newFile.name}`);
    }, 500);
  }, [newFileName, pathKey]);

  // Create new folder
  const handleCreateFolder = useCallback(() => {
    if (!newFolderName.trim()) return;
    setActionLoading(true);
    setTimeout(() => {
      const newFolder: FileItem = {
        name: newFolderName.trim(),
        type: "folder",
        size: "0 B",
        modified: "Just now",
        permissions: "755",
      };
      setAddedFiles(prev => ({
        ...prev,
        [pathKey]: [...(prev[pathKey] || []), newFolder],
      }));
      setActionLoading(false);
      setShowNewFolderModal(false);
      setNewFolderName("");
      showToast.success(`Created folder ${newFolder.name}`);
    }, 500);
  }, [newFolderName, pathKey]);

  // Rename
  const handleRename = useCallback(() => {
    if (!renameTarget || !renameValue.trim()) return;
    setActionLoading(true);
    setTimeout(() => {
      setRenamedFiles(prev => ({
        ...prev,
        [pathKey]: {
          ...(prev[pathKey] || {}),
          [renameTarget.name]: renameValue.trim(),
        },
      }));
      setActionLoading(false);
      setRenameTarget(null);
      setRenameValue("");
      showToast.success(`Renamed to ${renameValue.trim()}`);
    }, 500);
  }, [renameTarget, renameValue, pathKey]);

  // Delete single
  const handleDeleteConfirm = useCallback(() => {
    if (!deleteTarget) return;
    setActionLoading(true);
    setTimeout(() => {
      setRemovedFiles(prev => ({
        ...prev,
        [pathKey]: [...(prev[pathKey] || []), deleteTarget.name],
      }));
      setActionLoading(false);
      setDeleteTarget(null);
      setSelectedFiles(prev => prev.filter(n => n !== deleteTarget.name));
      showToast.success(`Deleted ${deleteTarget.name}`);
    }, 500);
  }, [deleteTarget, pathKey]);

  // Bulk delete
  const handleBulkDelete = useCallback(() => {
    setActionLoading(true);
    setTimeout(() => {
      setRemovedFiles(prev => ({
        ...prev,
        [pathKey]: [...(prev[pathKey] || []), ...selectedFiles],
      }));
      const count = selectedFiles.length;
      setSelectedFiles([]);
      setActionLoading(false);
      setShowBulkDeleteConfirm(false);
      showToast.success(`Deleted ${count} items`);
    }, 500);
  }, [selectedFiles, pathKey]);

  // Save edited file
  const handleSaveEdit = useCallback(() => {
    if (!editTarget) return;
    setActionLoading(true);
    setTimeout(() => {
      setActionLoading(false);
      setEditTarget(null);
      setEditContent("");
      showToast.success(`Saved ${editTarget.name}`);
    }, 500);
  }, [editTarget]);

  // Save permissions
  const handleSavePermissions = useCallback(() => {
    if (!permissionsTarget || !permValue.trim()) return;
    if (!/^[0-7]{3}$/.test(permValue.trim())) {
      showToast.error("Invalid permissions. Use 3-digit octal (e.g. 755).");
      return;
    }
    setActionLoading(true);
    setTimeout(() => {
      setChangedPerms(prev => ({
        ...prev,
        [pathKey]: {
          ...(prev[pathKey] || {}),
          [permissionsTarget.name]: permValue.trim(),
        },
      }));
      setActionLoading(false);
      setPermissionsTarget(null);
      setPermValue("");
      showToast.success(`Permissions updated to ${permValue.trim()}`);
    }, 500);
  }, [permissionsTarget, permValue, pathKey]);

  // Lock body scroll for modals
  const anyModalOpen = showUploadModal || showNewFileModal || showNewFolderModal || !!renameTarget || !!editTarget || !!previewTarget || !!permissionsTarget;
  useEffect(() => {
    if (anyModalOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => { document.body.style.overflow = ""; };
  }, [anyModalOpen]);

  // Escape key for modals
  useEffect(() => {
    if (!anyModalOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showUploadModal) setShowUploadModal(false);
        else if (showNewFileModal) setShowNewFileModal(false);
        else if (showNewFolderModal) setShowNewFolderModal(false);
        else if (renameTarget) setRenameTarget(null);
        else if (editTarget) { setEditTarget(null); setEditContent(""); }
        else if (previewTarget) setPreviewTarget(null);
        else if (permissionsTarget) { setPermissionsTarget(null); setPermValue(""); }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [anyModalOpen, showUploadModal, showNewFileModal, showNewFolderModal, renameTarget, editTarget, previewTarget, permissionsTarget]);

  // Modal style helpers
  const modalOverlayClass = "fixed inset-0 z-[100] flex items-center justify-center p-4";
  const modalBackdropClass = "absolute inset-0 bg-black/60 backdrop-blur-sm";
  const modalCardClass = `relative w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200 ${isLight ? "bg-white border border-slate-200" : "bg-[var(--bg-primary)] border border-[var(--border-tertiary)]"}`;

  const inputClass = cn(
    "w-full h-10 px-3 text-sm rounded-xl border outline-none transition-all",
    isLight
      ? "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-500 focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
      : "bg-[var(--bg-elevated)] border-[var(--border-tertiary)] text-slate-100 placeholder-slate-500 focus:border-slate-500 focus:ring-1 focus:ring-slate-600"
  );

  const primaryBtnClass = cn(
    "h-10 px-5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",
    colors.bg, colors.text
  );

  const secondaryBtnClass = cn(
    "h-10 px-5 rounded-xl text-sm font-medium transition-colors",
    isLight
      ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
      : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
  );

  const loadingSpinner = (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );

  return (
    <div className={cn(
      "rounded-2xl border overflow-hidden",
      isLight
        ? "bg-white border-slate-200"
        : "bg-gradient-to-br from-[var(--bg-elevated)] via-[var(--gradient-card-to)] to-[var(--bg-tertiary)] border-[var(--border-tertiary)]"
    )}>
      {/* Storage Info Bar */}
      <div className={cn(
        "px-5 py-3 border-b flex items-center justify-between gap-4",
        isLight ? "border-slate-200 bg-slate-50/80" : "border-white/[0.06] bg-[var(--bg-secondary)]/50"
      )}>
        <div className="flex items-center gap-3">
          <svg className={cn("w-4 h-4", isLight ? "text-slate-400" : "text-slate-500")} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
          </svg>
          <span className={cn("text-xs font-medium", isLight ? "text-slate-600" : "text-slate-400")}>
            1.2 GB of 10 GB used
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-40 h-2 rounded-full overflow-hidden",
            isLight ? "bg-slate-200" : "bg-[var(--border-primary)]"
          )}>
            <div
              className={cn("h-full rounded-full transition-all", colors.progress)}
              style={{ width: "12%" }}
            />
          </div>
          <span className="text-[10px] text-slate-500 font-medium">12%</span>
        </div>
      </div>

      {/* Header */}
      <div className={cn(
        "px-5 py-4 border-b",
        isLight ? "border-slate-200 bg-slate-50/50" : "border-white/[0.06] bg-[var(--bg-secondary)]/30"
      )}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center ring-1",
              colors.bg, colors.ring
            )}>
              <svg className={cn("w-5 h-5", colors.text)} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
              </svg>
            </div>
            <div>
              <h3 className={cn("text-sm font-semibold", isLight ? "text-slate-800" : "text-slate-100")}>
                File Manager
              </h3>
              <p className="text-xs text-slate-500">Browse and manage your site files</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowUploadModal(true)}
              aria-label="Upload file"
              className={cn(
                "h-9 px-4 rounded-xl text-xs font-medium transition-all ring-1 flex items-center gap-2",
                isLight
                  ? "bg-slate-100 text-slate-700 hover:bg-slate-200 ring-slate-200"
                  : "bg-[var(--bg-elevated)]/60 text-slate-300 hover:bg-[var(--bg-elevated)] ring-white/[0.06]"
              )}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              Upload
            </button>
            <button
              onClick={() => { setNewFolderName(""); setShowNewFolderModal(true); }}
              aria-label="Create new folder"
              className={cn(
                "h-9 px-4 rounded-xl text-xs font-semibold transition-all ring-1 flex items-center gap-2",
                colors.bg, colors.text, colors.ring
              )}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
              </svg>
              New Folder
            </button>
          </div>
        </div>
      </div>

      <div>
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className={cn(
            "px-4 py-2 border-b flex items-center justify-between gap-4 flex-wrap",
            isLight ? "border-slate-200 bg-white" : "border-white/[0.06] bg-[var(--bg-secondary)]/20"
          )}>
            {/* Left: Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => { setNewFileName(""); setShowNewFileModal(true); }}
                aria-label="Create new file"
                className={cn(
                  "h-8 px-3 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5",
                  isLight
                    ? "hover:bg-slate-100 text-slate-500 hover:text-slate-700"
                    : "hover:bg-white/[0.04] text-slate-400 hover:text-slate-200"
                )}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <span className="hidden sm:inline">New File</span>
              </button>

              <div className={cn("w-px h-5 mx-1", isLight ? "bg-slate-200" : "bg-slate-700/50")} />

              <button
                onClick={() => {
                  if (selectedFiles.length === 0) { showToast.info("Select a file to download"); return; }
                  showToast.success(`Downloading ${selectedFiles.length} file(s)`);
                }}
                aria-label="Download selected files"
                className={cn(
                  "h-8 px-3 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5",
                  isLight
                    ? "hover:bg-slate-100 text-slate-500 hover:text-slate-700"
                    : "hover:bg-white/[0.04] text-slate-400 hover:text-slate-200"
                )}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                <span className="hidden sm:inline">Download</span>
              </button>

              <button
                onClick={() => {
                  if (selectedFiles.length === 0) { showToast.info("Select a file to copy"); return; }
                  showToast.success(`Copied ${selectedFiles.length} file(s)`);
                }}
                aria-label="Copy selected files"
                className={cn(
                  "h-8 px-3 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5",
                  isLight
                    ? "hover:bg-slate-100 text-slate-500 hover:text-slate-700"
                    : "hover:bg-white/[0.04] text-slate-400 hover:text-slate-200"
                )}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                </svg>
                <span className="hidden sm:inline">Copy</span>
              </button>

              <button
                onClick={() => {
                  if (selectedFiles.length !== 1) { showToast.info("Select a single file to rename"); return; }
                  const file = currentFiles.find(f => f.name === selectedFiles[0]);
                  if (file) { setRenameValue(file.name); setRenameTarget(file); }
                }}
                aria-label="Rename selected file"
                className={cn(
                  "h-8 px-3 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5",
                  isLight
                    ? "hover:bg-slate-100 text-slate-500 hover:text-slate-700"
                    : "hover:bg-white/[0.04] text-slate-400 hover:text-slate-200"
                )}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                </svg>
                <span className="hidden sm:inline">Rename</span>
              </button>

              <div className={cn("w-px h-5 mx-1 hidden md:block", isLight ? "bg-slate-200" : "bg-slate-700/50")} />

              <button
                onClick={() => {
                  if (selectedFiles.length === 0) { showToast.info("Select files to compress"); return; }
                  showToast.info(`Compressing ${selectedFiles.length} file(s)...`);
                }}
                aria-label="Compress selected files"
                className={cn(
                  "h-8 px-3 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 hidden md:flex",
                  isLight
                    ? "hover:bg-slate-100 text-slate-500 hover:text-slate-700"
                    : "hover:bg-white/[0.04] text-slate-400 hover:text-slate-200"
                )}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
                <span className="hidden lg:inline">Compress</span>
              </button>

              <button
                onClick={() => {
                  if (selectedFiles.length === 0) { showToast.info("Select files to delete"); return; }
                  if (selectedFiles.length === 1) {
                    const file = currentFiles.find(f => f.name === selectedFiles[0]);
                    if (file) setDeleteTarget(file);
                  } else {
                    setShowBulkDeleteConfirm(true);
                  }
                }}
                aria-label="Delete selected files"
                className={cn(
                  "h-8 px-3 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5",
                  "hover:bg-rose-500/10",
                  isLight ? "text-slate-500 hover:text-rose-500" : "text-slate-400 hover:text-rose-400"
                )}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>

            {/* Right: Search & View Toggle */}
            <div className="flex items-center gap-2">
              {/* Bulk actions when files selected */}
              {selectedFiles.length > 1 && (
                <div className="flex items-center gap-1.5 mr-2">
                  <button
                    onClick={() => setShowBulkDeleteConfirm(true)}
                    className="h-7 px-3 rounded-lg text-[11px] font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors flex items-center gap-1.5"
                    aria-label="Delete selected files"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    Delete Selected ({selectedFiles.length})
                  </button>
                  <button
                    onClick={() => showToast.info(`Compressing ${selectedFiles.length} files...`)}
                    className={cn(
                      "h-7 px-3 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1.5",
                      isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-white/[0.06] text-slate-300 hover:bg-white/[0.1]"
                    )}
                    aria-label="Compress selected files"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                    Compress
                  </button>
                </div>
              )}

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    "h-8 w-36 lg:w-44 pl-8 pr-3 rounded-lg border text-xs focus:outline-none transition-all",
                    isLight
                      ? "bg-white border-slate-200 text-slate-700 placeholder:text-slate-500 focus:border-slate-300 focus:ring-1 focus:ring-slate-200"
                      : "bg-white/[0.03] border-white/[0.08] text-slate-300 placeholder:text-slate-500 focus:border-white/[0.15] focus:ring-1 focus:ring-white/[0.06]"
                  )}
                />
                <svg className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <div className={cn(
                "flex items-center rounded-lg p-0.5",
                isLight ? "bg-slate-100" : "bg-[var(--bg-elevated)]/50"
              )}>
                <button
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                  className={cn(
                    "w-7 h-7 rounded-md flex items-center justify-center transition-all",
                    viewMode === "list"
                      ? isLight ? "bg-white shadow-sm text-slate-700" : "bg-[var(--border-primary)] text-slate-200"
                      : isLight ? "text-slate-400 hover:text-slate-600" : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                  className={cn(
                    "w-7 h-7 rounded-md flex items-center justify-center transition-all",
                    viewMode === "grid"
                      ? isLight ? "bg-white shadow-sm text-slate-700" : "bg-[var(--border-primary)] text-slate-200"
                      : isLight ? "text-slate-400 hover:text-slate-600" : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                </button>
              </div>

              <button
                onClick={() => showToast.success("File list refreshed")}
                aria-label="Refresh file list"
                className={cn(
                  "h-8 w-8 rounded-lg flex items-center justify-center transition-all",
                  isLight
                    ? "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                    : "bg-[var(--bg-elevated)]/50 text-slate-400 hover:bg-[var(--bg-elevated)] hover:text-slate-200"
                )}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </button>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className={cn(
            "px-4 py-2.5 border-b",
            isLight ? "border-slate-200 bg-slate-50/30" : "border-[var(--border-tertiary)] bg-[var(--gradient-card-to)]/30"
          )}>
            <div className="flex items-center gap-1.5 text-sm">
              <button
                onClick={() => navigateToBreadcrumb(0)}
                className={cn(
                  "flex items-center gap-1 font-medium transition-colors",
                  currentPath.length === 1
                    ? isLight ? "text-slate-800" : "text-slate-200"
                    : cn(colors.text, "hover:opacity-80")
                )}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                {currentPath[0]}
              </button>
              {currentPath.slice(1).map((segment, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <svg className={cn("w-3.5 h-3.5", isLight ? "text-slate-400" : "text-slate-600")} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                  <button
                    onClick={() => navigateToBreadcrumb(i + 1)}
                    className={cn(
                      "transition-colors",
                      i + 1 === currentPath.length - 1
                        ? isLight ? "text-slate-800 font-medium" : "text-slate-200 font-medium"
                        : cn(colors.text, "hover:opacity-80")
                    )}
                  >
                    {segment}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* File List */}
          {viewMode === "list" ? (
            <div>
              {/* Table Header */}
              <div className={cn(
                "grid grid-cols-12 gap-4 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider",
                isLight
                  ? "bg-slate-100/60 text-slate-500 border-b border-slate-200"
                  : "bg-[var(--bg-secondary)]/60 text-slate-500 border-b border-white/[0.06]"
              )}>
                <div className="col-span-5 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                    onChange={toggleAllFiles}
                    className={cn(
                      "w-3.5 h-3.5 rounded border-2 transition-colors cursor-pointer",
                      isLight ? "border-slate-300" : "border-slate-600"
                    )}
                  />
                  <span>Name</span>
                </div>
                <div className="col-span-2">Size</div>
                <div className="col-span-3">Modified</div>
                <div className="col-span-2 text-right">Permissions</div>
              </div>

              {/* Files */}
              <div className={cn("divide-y", isLight ? "divide-slate-100" : "divide-white/[0.04]")}>
                {filteredFiles.length === 0 && (
                  <div className="px-4 py-12 text-center">
                    <p className={cn("text-sm", isLight ? "text-slate-400" : "text-slate-500")}>
                      {searchQuery ? "No files match your search" : "This folder is empty"}
                    </p>
                  </div>
                )}
                {filteredFiles.map((file) => {
                  const icon = getFileIcon(file, isLight);
                  const isSelected = selectedFiles.includes(file.name);

                  return (
                    <div
                      key={file.name}
                      className={cn(
                        "group grid grid-cols-12 gap-4 px-4 py-2.5 transition-colors items-center cursor-pointer",
                        isSelected
                          ? isLight ? "bg-slate-100" : "bg-[var(--bg-elevated)]/30"
                          : isLight ? "hover:bg-slate-50" : "hover:bg-white/[0.02]"
                      )}
                      onClick={() => toggleFileSelection(file.name)}
                      onDoubleClick={() => handleItemDoubleClick(file)}
                    >
                      <div className="col-span-5 flex items-center gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleFileSelection(file.name)}
                          onClick={(e) => e.stopPropagation()}
                          className={cn(
                            "w-3.5 h-3.5 rounded border-2 transition-colors cursor-pointer",
                            isLight ? "border-slate-300" : "border-slate-600"
                          )}
                        />
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                          icon.bg, icon.color
                        )}>
                          {icon.icon}
                        </div>
                        <button
                          className={cn(
                            "text-sm font-medium truncate transition-colors text-left",
                            isLight
                              ? file.type === "folder" ? "text-slate-800 hover:text-blue-600" : "text-slate-600 hover:text-slate-800"
                              : file.type === "folder" ? "text-slate-100 hover:text-blue-400" : "text-slate-300 hover:text-slate-100"
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (file.type === "folder") {
                              navigateIntoFolder(file.name);
                            } else if (isTextFile(file)) {
                              setEditContent(getMockContent(file.name));
                              setEditTarget(file);
                            } else if (isImageFile(file)) {
                              setPreviewTarget(file);
                            }
                          }}
                        >
                          {file.name}
                        </button>
                      </div>
                      <div className="col-span-2 text-xs text-slate-500">{file.size}</div>
                      <div className="col-span-3 text-xs text-slate-500">{file.modified}</div>
                      <div className="col-span-2 flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); setPermValue(file.permissions || "644"); setPermissionsTarget(file); }}
                          aria-label={`Change permissions for ${file.name}`}
                          className={cn(
                            "text-xs font-mono transition-colors hover:underline",
                            isLight ? "text-slate-400 hover:text-slate-600" : "text-slate-500 hover:text-slate-300"
                          )}
                        >
                          {file.permissions}
                        </button>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {file.type === "file" && isTextFile(file) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditContent(getMockContent(file.name));
                                setEditTarget(file);
                              }}
                              aria-label={`Edit ${file.name}`}
                              className={cn(
                                "w-6 h-6 rounded-md flex items-center justify-center transition-all",
                                isLight
                                  ? "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                                  : "bg-slate-800/60 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                              )}
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25" />
                              </svg>
                            </button>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); setRenameValue(file.name); setRenameTarget(file); }}
                            aria-label={`Rename ${file.name}`}
                            className={cn(
                              "w-6 h-6 rounded-md flex items-center justify-center transition-all",
                              isLight
                                ? "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                                : "bg-slate-800/60 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                            )}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteTarget(file); }}
                            aria-label={`Delete ${file.name}`}
                            className={cn(
                              "w-6 h-6 rounded-md flex items-center justify-center transition-all",
                              isLight
                                ? "bg-slate-100 text-slate-500 hover:bg-rose-100 hover:text-rose-500"
                                : "bg-slate-800/60 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400"
                            )}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Grid View */
            <div className="p-4">
              {filteredFiles.length === 0 && (
                <div className="py-12 text-center">
                  <p className={cn("text-sm", isLight ? "text-slate-400" : "text-slate-500")}>
                    {searchQuery ? "No files match your search" : "This folder is empty"}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {filteredFiles.map((file) => {
                  const icon = getFileIcon(file, isLight);
                  const isSelected = selectedFiles.includes(file.name);

                  return (
                    <div
                      key={file.name}
                      onClick={() => toggleFileSelection(file.name)}
                      onDoubleClick={() => handleItemDoubleClick(file)}
                      className={cn(
                        "group relative p-3 rounded-xl border cursor-pointer transition-all",
                        isSelected
                          ? cn(colors.bg, "border-transparent ring-1", colors.ring)
                          : isLight
                            ? "bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                            : "bg-[var(--bg-secondary)] border-[var(--border-tertiary)] hover:bg-[var(--bg-elevated)] hover:border-[var(--border-primary)]"
                      )}
                    >
                      <div className={cn(
                        "w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center",
                        icon.bg, icon.color
                      )}>
                        {icon.icon}
                      </div>
                      <p className={cn(
                        "text-xs font-medium text-center truncate",
                        isLight ? "text-slate-700" : "text-slate-200"
                      )}>
                        {file.name}
                      </p>
                      <p className="text-[10px] text-slate-500 text-center mt-0.5">
                        {file.size}
                      </p>

                      {/* Selection indicator */}
                      {isSelected && (
                        <div className={cn(
                          "absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center",
                          colors.bg
                        )}>
                          <svg className={cn("w-3 h-3", colors.text)} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        </div>
                      )}

                      {/* Hover actions */}
                      <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => { e.stopPropagation(); setRenameValue(file.name); setRenameTarget(file); }}
                          aria-label={`Rename ${file.name}`}
                          className={cn(
                            "w-5 h-5 rounded flex items-center justify-center transition-all",
                            isLight ? "bg-white/80 text-slate-500 hover:text-slate-700 shadow-sm" : "bg-slate-800/80 text-slate-400 hover:text-slate-200"
                          )}
                        >
                          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteTarget(file); }}
                          aria-label={`Delete ${file.name}`}
                          className={cn(
                            "w-5 h-5 rounded flex items-center justify-center transition-all",
                            isLight ? "bg-white/80 text-slate-500 hover:text-rose-500 shadow-sm" : "bg-slate-800/80 text-slate-400 hover:text-rose-400"
                          )}
                        >
                          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className={cn(
            "px-4 py-3 border-t flex items-center justify-between gap-4",
            isLight ? "border-slate-200 bg-slate-50/50" : "border-[var(--border-tertiary)] bg-[var(--gradient-card-to)]/30"
          )}>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              {selectedFiles.length > 0 ? (
                <span className={colors.text}>{selectedFiles.length} selected</span>
              ) : (
                <>
                  <span>{folderCount} folders</span>
                  <span className={isLight ? "text-slate-300" : "text-slate-700"}>&#8226;</span>
                  <span>{fileCount} files</span>
                </>
              )}
            </div>

            {/* Storage Bar */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <svg className={cn("w-4 h-4", isLight ? "text-slate-400" : "text-slate-500")} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                </svg>
                <span className="text-xs text-slate-500">Storage:</span>
              </div>
              <div className={cn(
                "w-32 h-2 rounded-full overflow-hidden",
                isLight ? "bg-slate-200" : "bg-[var(--border-primary)]"
              )}>
                <div
                  className={cn("h-full rounded-full", colors.progress)}
                  style={{ width: "21%" }}
                />
              </div>
              <span className={cn("text-xs font-medium", isLight ? "text-slate-600" : "text-slate-400")}>
                2.1 GB / 10 GB
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MODALS ===== */}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className={modalOverlayClass} role="dialog" aria-modal="true" aria-labelledby="upload-modal-title">
          <div className={modalBackdropClass} onClick={() => !isUploading && setShowUploadModal(false)} aria-hidden="true" />
          <div className={modalCardClass}>
            <h3 id="upload-modal-title" className={cn("text-lg font-semibold mb-4", isLight ? "text-slate-800" : "text-slate-100")}>
              Upload File
            </h3>

            {!isUploading ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  const file = e.dataTransfer.files[0];
                  if (file) simulateUpload(file.name);
                }}
                className={cn(
                  "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
                  isDragOver
                    ? cn("border-blue-400", isLight ? "bg-blue-50" : "bg-blue-500/10")
                    : isLight ? "border-slate-300 hover:border-slate-400 bg-slate-50" : "border-[var(--border-tertiary)] hover:border-slate-500 bg-[var(--bg-elevated)]"
                )}
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) simulateUpload(file.name);
                  };
                  input.click();
                }}
              >
                <svg className={cn("w-10 h-10 mx-auto mb-3", isLight ? "text-slate-400" : "text-slate-500")} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <p className={cn("text-sm font-medium mb-1", isLight ? "text-slate-700" : "text-slate-200")}>
                  Drag & drop files here
                </p>
                <p className="text-xs text-slate-500">or click to browse</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <svg className={cn("w-5 h-5 flex-shrink-0", isLight ? "text-slate-500" : "text-slate-400")} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <span className={cn("text-sm font-medium truncate", isLight ? "text-slate-700" : "text-slate-200")}>
                    {uploadFileName}
                  </span>
                </div>
                <div className={cn("w-full h-2.5 rounded-full overflow-hidden", isLight ? "bg-slate-200" : "bg-[var(--border-primary)]")}>
                  <div
                    className={cn("h-full rounded-full transition-all duration-300", colors.progress)}
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 text-right">{Math.round(uploadProgress)}%</p>
              </div>
            )}

            <div className="flex gap-3 justify-end mt-5">
              <button
                onClick={() => { if (!isUploading) { setShowUploadModal(false); setUploadFileName(""); setUploadProgress(0); } }}
                disabled={isUploading}
                className={secondaryBtnClass}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New File Modal */}
      {showNewFileModal && (
        <div className={modalOverlayClass} role="dialog" aria-modal="true" aria-labelledby="new-file-modal-title">
          <div className={modalBackdropClass} onClick={() => !actionLoading && setShowNewFileModal(false)} aria-hidden="true" />
          <div className={modalCardClass}>
            <h3 id="new-file-modal-title" className={cn("text-lg font-semibold mb-4", isLight ? "text-slate-800" : "text-slate-100")}>
              Create New File
            </h3>
            <div className="mb-5">
              <label htmlFor="new-file-name" className={cn("text-sm font-medium mb-2 block", isLight ? "text-slate-700" : "text-slate-300")}>
                File name
              </label>
              <input
                id="new-file-name"
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="e.g. style.css"
                autoFocus
                onKeyDown={(e) => { if (e.key === "Enter") handleCreateFile(); }}
                className={inputClass}
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowNewFileModal(false)} disabled={actionLoading} className={secondaryBtnClass}>
                Cancel
              </button>
              <button
                onClick={handleCreateFile}
                disabled={!newFileName.trim() || actionLoading}
                className={primaryBtnClass}
              >
                {actionLoading ? <>{loadingSpinner} Creating...</> : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className={modalOverlayClass} role="dialog" aria-modal="true" aria-labelledby="new-folder-modal-title">
          <div className={modalBackdropClass} onClick={() => !actionLoading && setShowNewFolderModal(false)} aria-hidden="true" />
          <div className={modalCardClass}>
            <h3 id="new-folder-modal-title" className={cn("text-lg font-semibold mb-4", isLight ? "text-slate-800" : "text-slate-100")}>
              Create New Folder
            </h3>
            <div className="mb-5">
              <label htmlFor="new-folder-name" className={cn("text-sm font-medium mb-2 block", isLight ? "text-slate-700" : "text-slate-300")}>
                Folder name
              </label>
              <input
                id="new-folder-name"
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="e.g. assets"
                autoFocus
                onKeyDown={(e) => { if (e.key === "Enter") handleCreateFolder(); }}
                className={inputClass}
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowNewFolderModal(false)} disabled={actionLoading} className={secondaryBtnClass}>
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim() || actionLoading}
                className={primaryBtnClass}
              >
                {actionLoading ? <>{loadingSpinner} Creating...</> : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {renameTarget && (
        <div className={modalOverlayClass} role="dialog" aria-modal="true" aria-labelledby="rename-modal-title">
          <div className={modalBackdropClass} onClick={() => !actionLoading && setRenameTarget(null)} aria-hidden="true" />
          <div className={modalCardClass}>
            <h3 id="rename-modal-title" className={cn("text-lg font-semibold mb-4", isLight ? "text-slate-800" : "text-slate-100")}>
              Rename {renameTarget.type === "folder" ? "Folder" : "File"}
            </h3>
            <div className="mb-5">
              <label htmlFor="rename-value" className={cn("text-sm font-medium mb-2 block", isLight ? "text-slate-700" : "text-slate-300")}>
                New name
              </label>
              <input
                id="rename-value"
                type="text"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                autoFocus
                onKeyDown={(e) => { if (e.key === "Enter") handleRename(); }}
                className={inputClass}
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setRenameTarget(null)} disabled={actionLoading} className={secondaryBtnClass}>
                Cancel
              </button>
              <button
                onClick={handleRename}
                disabled={!renameValue.trim() || renameValue === renameTarget.name || actionLoading}
                className={primaryBtnClass}
              >
                {actionLoading ? <>{loadingSpinner} Renaming...</> : "Rename"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation (single file) */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={`Delete ${deleteTarget?.type === "folder" ? "Folder" : "File"}`}
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={actionLoading}
      />

      {/* Bulk Delete Confirmation */}
      <ConfirmDialog
        open={showBulkDeleteConfirm}
        onClose={() => setShowBulkDeleteConfirm(false)}
        onConfirm={handleBulkDelete}
        title="Delete Selected Items"
        message={`Are you sure you want to delete ${selectedFiles.length} selected items? This action cannot be undone.`}
        confirmText={`Delete ${selectedFiles.length} Items`}
        variant="danger"
        isLoading={actionLoading}
      />

      {/* Code Editor Modal */}
      {editTarget && (
        <div className={modalOverlayClass} role="dialog" aria-modal="true" aria-labelledby="editor-modal-title">
          <div className={modalBackdropClass} onClick={() => !actionLoading && (() => { setEditTarget(null); setEditContent(""); })()} aria-hidden="true" />
          <div className={`relative w-full max-w-2xl rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200 ${isLight ? "bg-white border border-slate-200" : "bg-[var(--bg-primary)] border border-[var(--border-tertiary)]"}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 id="editor-modal-title" className={cn("text-lg font-semibold", isLight ? "text-slate-800" : "text-slate-100")}>
                {editTarget.name}
              </h3>
              <button
                onClick={() => { setEditTarget(null); setEditContent(""); }}
                aria-label="Close editor"
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                  isLight ? "hover:bg-slate-100 text-slate-500" : "hover:bg-white/[0.06] text-slate-400"
                )}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full h-64 p-4 rounded-xl font-mono text-xs bg-[#0d1117] text-slate-300 border-0 outline-none resize-none"
              spellCheck={false}
            />
            <div className="flex gap-3 justify-end mt-4">
              <button onClick={() => { setEditTarget(null); setEditContent(""); }} disabled={actionLoading} className={secondaryBtnClass}>
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={actionLoading}
                className={primaryBtnClass}
              >
                {actionLoading ? <>{loadingSpinner} Saving...</> : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Preview Modal */}
      {previewTarget && (
        <div className={modalOverlayClass} role="dialog" aria-modal="true" aria-labelledby="preview-modal-title">
          <div className={modalBackdropClass} onClick={() => setPreviewTarget(null)} aria-hidden="true" />
          <div className={`relative w-full max-w-2xl rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200 ${isLight ? "bg-white border border-slate-200" : "bg-[var(--bg-primary)] border border-[var(--border-tertiary)]"}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 id="preview-modal-title" className={cn("text-lg font-semibold", isLight ? "text-slate-800" : "text-slate-100")}>
                {previewTarget.name}
              </h3>
              <button
                onClick={() => setPreviewTarget(null)}
                aria-label="Close preview"
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                  isLight ? "hover:bg-slate-100 text-slate-500" : "hover:bg-white/[0.06] text-slate-400"
                )}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {isImageFile(previewTarget) ? (
              <div className={cn(
                "rounded-xl p-8 flex items-center justify-center",
                isLight ? "bg-slate-100" : "bg-[var(--bg-elevated)]"
              )}>
                <div className="text-center">
                  <svg className={cn("w-16 h-16 mx-auto mb-3", isLight ? "text-pink-400" : "text-pink-500")} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  <p className={cn("text-sm font-medium", isLight ? "text-slate-600" : "text-slate-400")}>
                    Image Preview
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{previewTarget.name} ({previewTarget.size})</p>
                </div>
              </div>
            ) : (
              <pre className="w-full h-64 p-4 rounded-xl font-mono text-xs bg-[#0d1117] text-slate-300 overflow-auto whitespace-pre-wrap">
                {getMockContent(previewTarget.name)}
              </pre>
            )}

            <div className="flex gap-3 justify-end mt-4">
              <button onClick={() => setPreviewTarget(null)} className={secondaryBtnClass}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {permissionsTarget && (
        <div className={modalOverlayClass} role="dialog" aria-modal="true" aria-labelledby="perms-modal-title">
          <div className={modalBackdropClass} onClick={() => !actionLoading && (() => { setPermissionsTarget(null); setPermValue(""); })()} aria-hidden="true" />
          <div className={modalCardClass}>
            <h3 id="perms-modal-title" className={cn("text-lg font-semibold mb-1", isLight ? "text-slate-800" : "text-slate-100")}>
              Change Permissions
            </h3>
            <p className={cn("text-sm mb-4", isLight ? "text-slate-500" : "text-slate-400")}>
              {permissionsTarget.name}
            </p>

            <div className="mb-5">
              <label htmlFor="perm-value" className={cn("text-sm font-medium mb-2 block", isLight ? "text-slate-700" : "text-slate-300")}>
                Chmod value (e.g. 755, 644)
              </label>
              <input
                id="perm-value"
                type="text"
                value={permValue}
                onChange={(e) => setPermValue(e.target.value.replace(/[^0-7]/g, "").slice(0, 3))}
                placeholder="755"
                maxLength={3}
                autoFocus
                onKeyDown={(e) => { if (e.key === "Enter") handleSavePermissions(); }}
                className={cn(inputClass, "font-mono tracking-widest text-center text-lg")}
              />
              <div className={cn("mt-3 text-xs space-y-1.5 p-3 rounded-lg", isLight ? "bg-slate-50 text-slate-500" : "bg-[var(--bg-elevated)] text-slate-400")}>
                <p><span className="font-medium">Owner:</span> {permValue[0] ? ["---", "--x", "-w-", "-wx", "r--", "r-x", "rw-", "rwx"][parseInt(permValue[0])] || "---" : "---"}</p>
                <p><span className="font-medium">Group:</span> {permValue[1] ? ["---", "--x", "-w-", "-wx", "r--", "r-x", "rw-", "rwx"][parseInt(permValue[1])] || "---" : "---"}</p>
                <p><span className="font-medium">Public:</span> {permValue[2] ? ["---", "--x", "-w-", "-wx", "r--", "r-x", "rw-", "rwx"][parseInt(permValue[2])] || "---" : "---"}</p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button onClick={() => { setPermissionsTarget(null); setPermValue(""); }} disabled={actionLoading} className={secondaryBtnClass}>
                Cancel
              </button>
              <button
                onClick={handleSavePermissions}
                disabled={permValue.length !== 3 || actionLoading}
                className={primaryBtnClass}
              >
                {actionLoading ? <>{loadingSpinner} Saving...</> : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
