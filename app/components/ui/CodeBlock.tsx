"use client";

import { cn } from "@/lib/utils";

interface CodeBlockProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function CodeBlock({ title = "Terminal", children, className }: CodeBlockProps) {
  return (
    <div className={cn("relative bg-[#09090B] rounded-xl overflow-hidden", className)}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E1E21]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <span className="text-zinc-500 text-xs font-mono ml-2">{title}</span>
        </div>
        <button className="text-zinc-500 hover:text-zinc-300 transition-colors p-1 rounded hover:bg-[#1E1E21]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
          </svg>
        </button>
      </div>
      <div className="p-5 overflow-x-auto">
        <pre className="font-mono text-sm">
          <code>{children}</code>
        </pre>
      </div>
    </div>
  );
}
