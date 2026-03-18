"use client";

import { useState } from "react";
import { useTheme } from "@/lib/context/ThemeContext";
import { cn } from "@/lib/utils";
import { getColorClasses } from "@/lib/utils/colors";

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

const getFileIcon = (file: FileItem, isLight: boolean) => {
  if (file.type === "folder") {
    return {
      bg: isLight ? "bg-amber-500/15" : "bg-amber-500/10",
      color: isLight ? "text-amber-600" : "text-amber-400",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
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
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
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
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
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
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
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
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
          </svg>
        ),
      };
    case "json":
      return {
        bg: isLight ? "bg-emerald-500/15" : "bg-emerald-500/10",
        color: isLight ? "text-emerald-600" : "text-emerald-400",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
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
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
      };
    case "txt":
    case "md":
      return {
        bg: isLight ? "bg-zinc-200" : "bg-zinc-500/10",
        color: isLight ? "text-zinc-600" : "text-zinc-400",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
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
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
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
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        ),
      };
    default:
      return {
        bg: isLight ? "bg-zinc-200" : "bg-zinc-500/10",
        color: isLight ? "text-zinc-500" : "text-zinc-400",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        ),
      };
  }
};

export function FileManagerTab() {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const colors = getColorClasses(accentColor);

  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [currentPath] = useState(["public_html"]);
  const [searchQuery, setSearchQuery] = useState("");

  const sortedFiles = [...FILES].sort((a, b) => {
    if (a.type === "folder" && b.type !== "folder") return -1;
    if (a.type !== "folder" && b.type === "folder") return 1;
    return a.name.localeCompare(b.name);
  });

  const filteredFiles = sortedFiles.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFileSelection = (name: string) => {
    setSelectedFiles(prev =>
      prev.includes(name)
        ? prev.filter(n => n !== name)
        : [...prev, name]
    );
  };

  const toggleAllFiles = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map(f => f.name));
    }
  };

  const folderCount = filteredFiles.filter(f => f.type === "folder").length;
  const fileCount = filteredFiles.filter(f => f.type === "file").length;

  return (
    <div className={cn(
      "rounded-2xl border overflow-hidden",
      isLight
        ? "bg-white border-zinc-200"
        : "bg-gradient-to-br from-[#1C1C1F] via-[#1A1A1D] to-[#161618] border-[#2A2A2E]/80"
    )}>
      {/* Header */}
      <div className={cn(
        "px-5 py-4 border-b",
        isLight ? "border-zinc-200 bg-zinc-50/50" : "border-[#2A2A2E]/50 bg-[#1E1E21]/30"
      )}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center ring-1",
              colors.bg, colors.ring
            )}>
              <svg className={cn("w-5 h-5", colors.text)} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
              </svg>
            </div>
            <div>
              <h3 className={cn("text-sm font-semibold", isLight ? "text-zinc-800" : "text-zinc-100")}>
                File Manager
              </h3>
              <p className="text-xs text-zinc-500">Browse and manage your site files</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className={cn(
              "h-9 px-4 rounded-xl text-xs font-medium transition-all ring-1 flex items-center gap-2",
              isLight
                ? "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 ring-zinc-200"
                : "bg-[#27272A]/60 text-zinc-300 hover:bg-[#27272A] ring-white/[0.06]"
            )}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              Upload
            </button>
            <button className={cn(
              "h-9 px-4 rounded-xl text-xs font-semibold transition-all ring-1 flex items-center gap-2",
              colors.bg, colors.text, colors.ring
            )}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
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
            isLight ? "border-zinc-200 bg-white" : "border-[#2A2A2E]/30 bg-[#1E1E21]/20"
          )}>
            {/* Left: Actions */}
            <div className="flex items-center gap-1">
              <button className={cn(
                "h-8 px-3 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5",
                isLight
                  ? "hover:bg-zinc-100 text-zinc-500 hover:text-zinc-700"
                  : "hover:bg-white/[0.04] text-zinc-400 hover:text-zinc-200"
              )}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <span className="hidden sm:inline">New File</span>
              </button>

              <div className={cn("w-px h-5 mx-1", isLight ? "bg-zinc-200" : "bg-zinc-700/50")} />

              <button className={cn(
                "h-8 px-3 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5",
                isLight
                  ? "hover:bg-zinc-100 text-zinc-500 hover:text-zinc-700"
                  : "hover:bg-white/[0.04] text-zinc-400 hover:text-zinc-200"
              )}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                <span className="hidden sm:inline">Download</span>
              </button>

              <button className={cn(
                "h-8 px-3 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5",
                isLight
                  ? "hover:bg-zinc-100 text-zinc-500 hover:text-zinc-700"
                  : "hover:bg-white/[0.04] text-zinc-400 hover:text-zinc-200"
              )}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                </svg>
                <span className="hidden sm:inline">Copy</span>
              </button>

              <button className={cn(
                "h-8 px-3 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5",
                isLight
                  ? "hover:bg-zinc-100 text-zinc-500 hover:text-zinc-700"
                  : "hover:bg-white/[0.04] text-zinc-400 hover:text-zinc-200"
              )}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                </svg>
                <span className="hidden sm:inline">Rename</span>
              </button>

              <div className={cn("w-px h-5 mx-1 hidden md:block", isLight ? "bg-zinc-200" : "bg-zinc-700/50")} />

              <button className={cn(
                "h-8 px-3 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 hidden md:flex",
                isLight
                  ? "hover:bg-zinc-100 text-zinc-500 hover:text-zinc-700"
                  : "hover:bg-white/[0.04] text-zinc-400 hover:text-zinc-200"
              )}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
                <span className="hidden lg:inline">Compress</span>
              </button>

              <button className={cn(
                "h-8 px-3 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5",
                "hover:bg-rose-500/10",
                isLight ? "text-zinc-500 hover:text-rose-500" : "text-zinc-400 hover:text-rose-400"
              )}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>

            {/* Right: Search & View Toggle */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    "h-8 w-36 lg:w-44 pl-8 pr-3 rounded-lg border text-xs focus:outline-none transition-all",
                    isLight
                      ? "bg-white border-zinc-200 text-zinc-700 placeholder:text-zinc-400 focus:border-zinc-300 focus:ring-1 focus:ring-zinc-200"
                      : "bg-[#27272A]/50 border-[#3F3F46]/30 text-zinc-300 placeholder:text-zinc-500 focus:border-zinc-600 focus:ring-1 focus:ring-zinc-700"
                  )}
                />
                <svg className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <div className={cn(
                "flex items-center rounded-lg p-0.5",
                isLight ? "bg-zinc-100" : "bg-[#27272A]/50"
              )}>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "w-7 h-7 rounded-md flex items-center justify-center transition-all",
                    viewMode === "list"
                      ? isLight ? "bg-white shadow-sm text-zinc-700" : "bg-[#3F3F46] text-zinc-200"
                      : isLight ? "text-zinc-400 hover:text-zinc-600" : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "w-7 h-7 rounded-md flex items-center justify-center transition-all",
                    viewMode === "grid"
                      ? isLight ? "bg-white shadow-sm text-zinc-700" : "bg-[#3F3F46] text-zinc-200"
                      : isLight ? "text-zinc-400 hover:text-zinc-600" : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                </button>
              </div>

              <button className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center transition-all",
                isLight
                  ? "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700"
                  : "bg-[#27272A]/50 text-zinc-400 hover:bg-[#27272A] hover:text-zinc-200"
              )}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </button>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className={cn(
            "px-4 py-2.5 border-b",
            isLight ? "border-zinc-200 bg-zinc-50/30" : "border-[#2A2A2E]/30 bg-[#1A1A1D]/30"
          )}>
            <div className="flex items-center gap-1.5 text-sm">
              <button className={cn(
                "flex items-center gap-1 font-medium transition-colors",
                colors.text, "hover:opacity-80"
              )}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                root
              </button>
              {currentPath.map((segment, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <svg className={cn("w-3.5 h-3.5", isLight ? "text-zinc-400" : "text-zinc-600")} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                  <button className={cn(
                    "transition-colors",
                    i === currentPath.length - 1
                      ? isLight ? "text-zinc-800 font-medium" : "text-zinc-200 font-medium"
                      : cn(colors.text, "hover:opacity-80")
                  )}>
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
                  ? "bg-zinc-100/60 text-zinc-500 border-b border-zinc-200"
                  : "bg-[#1E1E21]/60 text-zinc-500 border-b border-[#2A2A2E]/30"
              )}>
                <div className="col-span-5 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                    onChange={toggleAllFiles}
                    className={cn(
                      "w-3.5 h-3.5 rounded border-2 transition-colors cursor-pointer",
                      isLight ? "border-zinc-300" : "border-zinc-600"
                    )}
                  />
                  <span>Name</span>
                </div>
                <div className="col-span-2">Size</div>
                <div className="col-span-3">Modified</div>
                <div className="col-span-2 text-right">Permissions</div>
              </div>

              {/* Files */}
              <div className={cn("divide-y", isLight ? "divide-zinc-100" : "divide-[#2A2A2E]/20")}>
                {filteredFiles.map((file) => {
                  const icon = getFileIcon(file, isLight);
                  const isSelected = selectedFiles.includes(file.name);

                  return (
                    <div
                      key={file.name}
                      className={cn(
                        "group grid grid-cols-12 gap-4 px-4 py-2.5 transition-colors items-center cursor-pointer",
                        isSelected
                          ? isLight ? "bg-zinc-100" : "bg-[#27272A]/30"
                          : isLight ? "hover:bg-zinc-50" : "hover:bg-white/[0.02]"
                      )}
                      onClick={() => toggleFileSelection(file.name)}
                    >
                      <div className="col-span-5 flex items-center gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleFileSelection(file.name)}
                          onClick={(e) => e.stopPropagation()}
                          className={cn(
                            "w-3.5 h-3.5 rounded border-2 transition-colors cursor-pointer",
                            isLight ? "border-zinc-300" : "border-zinc-600"
                          )}
                        />
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                          icon.bg, icon.color
                        )}>
                          {icon.icon}
                        </div>
                        <span className={cn(
                          "text-sm font-medium truncate transition-colors",
                          isLight
                            ? file.type === "folder" ? "text-zinc-800" : "text-zinc-600"
                            : file.type === "folder" ? "text-zinc-100" : "text-zinc-300"
                        )}>
                          {file.name}
                        </span>
                      </div>
                      <div className="col-span-2 text-xs text-zinc-500">{file.size}</div>
                      <div className="col-span-3 text-xs text-zinc-500">{file.modified}</div>
                      <div className="col-span-2 flex items-center justify-end gap-2">
                        <span className={cn(
                          "text-xs font-mono",
                          isLight ? "text-zinc-400" : "text-zinc-500"
                        )}>
                          {file.permissions}
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className={cn(
                              "w-6 h-6 rounded-md flex items-center justify-center transition-all",
                              isLight
                                ? "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700"
                                : "bg-zinc-800/60 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
                            )}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className={cn(
                              "w-6 h-6 rounded-md flex items-center justify-center transition-all",
                              isLight
                                ? "bg-zinc-100 text-zinc-500 hover:bg-rose-100 hover:text-rose-500"
                                : "bg-zinc-800/60 text-zinc-400 hover:bg-rose-500/20 hover:text-rose-400"
                            )}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {filteredFiles.map((file) => {
                  const icon = getFileIcon(file, isLight);
                  const isSelected = selectedFiles.includes(file.name);

                  return (
                    <div
                      key={file.name}
                      onClick={() => toggleFileSelection(file.name)}
                      className={cn(
                        "group relative p-3 rounded-xl border cursor-pointer transition-all",
                        isSelected
                          ? cn(colors.bg, "border-transparent ring-1", colors.ring)
                          : isLight
                            ? "bg-zinc-50 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300"
                            : "bg-[#1E1E21] border-[#2A2A2E] hover:bg-[#27272A] hover:border-[#3F3F46]"
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
                        isLight ? "text-zinc-700" : "text-zinc-200"
                      )}>
                        {file.name}
                      </p>
                      <p className="text-[10px] text-zinc-500 text-center mt-0.5">
                        {file.size}
                      </p>

                      {/* Selection indicator */}
                      {isSelected && (
                        <div className={cn(
                          "absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center",
                          colors.bg
                        )}>
                          <svg className={cn("w-3 h-3", colors.text)} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className={cn(
            "px-4 py-3 border-t flex items-center justify-between gap-4",
            isLight ? "border-zinc-200 bg-zinc-50/50" : "border-[#2A2A2E]/50 bg-[#1A1A1D]/30"
          )}>
            <div className="flex items-center gap-3 text-xs text-zinc-500">
              {selectedFiles.length > 0 ? (
                <span className={colors.text}>{selectedFiles.length} selected</span>
              ) : (
                <>
                  <span>{folderCount} folders</span>
                  <span className={isLight ? "text-zinc-300" : "text-zinc-700"}>•</span>
                  <span>{fileCount} files</span>
                </>
              )}
            </div>

            {/* Storage Bar */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <svg className={cn("w-4 h-4", isLight ? "text-zinc-400" : "text-zinc-500")} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                </svg>
                <span className="text-xs text-zinc-500">Storage:</span>
              </div>
              <div className={cn(
                "w-32 h-2 rounded-full overflow-hidden",
                isLight ? "bg-zinc-200" : "bg-[#3F3F46]"
              )}>
                <div
                  className={cn("h-full rounded-full", colors.progress)}
                  style={{ width: "21%" }}
                />
              </div>
              <span className={cn("text-xs font-medium", isLight ? "text-zinc-600" : "text-zinc-400")}>
                2.1 GB / 10 GB
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
