"use client";

import { Select, SelectItem } from "@heroui/react";
import { useTheme } from "@/lib/context/ThemeContext";
import { TOOLS, TOOL_CATEGORY_CONFIG, TOOL_CATEGORY_ORDER } from "@/data/site/tools";
import { showToast } from "@/lib/toast";

interface ToolsTabProps {
  siteId: string;
}

export function ToolsTab({ siteId }: ToolsTabProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  // Group tools by category
  const groupedTools = TOOLS.reduce((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, typeof TOOLS>);

  return (
    <div className={`rounded-2xl border overflow-hidden ${
      isLight
        ? "bg-white border-slate-200"
        : "bg-[var(--bg-secondary)] border-[var(--border-tertiary)]"
    }`}>
      {/* Header */}
      <div className={`px-6 py-5 border-b ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isLight ? "bg-slate-100 text-slate-500" : "bg-[var(--bg-elevated)] text-slate-400"}`}>
              <svg width={18} height={18} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>Site Tools</h3>
              <p className="text-xs text-slate-500">{TOOLS.length} tools available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tools by Category */}
      <div className={`divide-y ${isLight ? "divide-slate-200" : "divide-[var(--border-tertiary)]"}`}>
        {TOOL_CATEGORY_ORDER.map((category) => {
          const categoryTools = groupedTools[category];
          if (!categoryTools || categoryTools.length === 0) return null;
          const config = TOOL_CATEGORY_CONFIG[category];

          return (
            <div key={category} className="p-6">
              {/* Category Header */}
              <div className="flex items-center gap-2.5 mb-4">
                <div className={`w-6 h-6 rounded-md text-slate-500 flex items-center justify-center ${isLight ? "bg-slate-100" : "bg-[var(--bg-elevated)]"}`}>
                  <svg width={14} height={14} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d={config.icon} />
                  </svg>
                </div>
                <span className={`text-xs font-semibold uppercase tracking-wider ${isLight ? "text-slate-500" : "text-slate-400"}`}>{category}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${isLight ? "text-slate-500 bg-slate-100" : "text-slate-600 bg-[var(--bg-elevated)]"}`}>{categoryTools.length}</span>
              </div>

              {/* Tools List */}
              <div className="space-y-2">
                {categoryTools.map((tool) => (
                  <div
                    key={tool.title}
                    className={`group flex items-center justify-between gap-4 p-3 rounded-xl border border-transparent transition-all ${
                      isLight
                        ? "bg-slate-50 hover:bg-slate-100 hover:border-slate-200"
                        : "bg-[var(--bg-primary)] hover:bg-[var(--bg-elevated)]/50 hover:border-[var(--border-primary)]/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                        isLight
                          ? "bg-slate-100 text-slate-500 group-hover:text-slate-600"
                          : "bg-[var(--bg-elevated)] text-slate-500 group-hover:text-slate-400"
                      }`}>
                        <svg width={18} height={18} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                          <path d={tool.icon} />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <h4 className={`text-sm font-medium truncate ${isLight ? "text-slate-700" : "text-slate-200"}`}>{tool.title}</h4>
                        <p className="text-xs text-slate-500 truncate">{tool.desc}</p>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex-shrink-0">
                      {tool.select ? (
                        <Select
                          aria-label="PHP Version"
                          defaultSelectedKeys={["8.1.1"]}
                          classNames={{
                            trigger: `rounded-lg border-0 h-8 min-h-8 w-[110px] ${isLight ? "bg-slate-100 text-slate-700" : "bg-[var(--bg-elevated)] text-slate-200"}`,
                            value: `text-xs ${isLight ? "text-slate-700" : "text-slate-200"}`,
                            popoverContent: `${isLight ? "bg-white text-slate-700" : "bg-[var(--bg-elevated)] text-slate-200"}`,
                          }}
                          size="sm"
                          onChange={(e) => {
                            if (e.target.value) {
                              showToast.success(`PHP version updated to ${e.target.value}`);
                            }
                          }}
                        >
                          <SelectItem key="8.1.1">PHP 8.1.1</SelectItem>
                          <SelectItem key="8.0.0">PHP 8.0.0</SelectItem>
                          <SelectItem key="7.4.0">PHP 7.4.0</SelectItem>
                        </Select>
                      ) : tool.danger ? (
                        <button
                          onClick={() => showToast.success(`${tool.title} executed`)}
                          className="h-8 px-4 rounded-lg bg-rose-500/10 text-rose-400 text-xs font-medium hover:bg-rose-500/15 transition-colors"
                        >
                          {tool.btn}
                        </button>
                      ) : (
                        <button
                          onClick={() => showToast.success(`${tool.title} executed`)}
                          className={`h-8 px-4 rounded-lg text-xs font-medium transition-colors ${
                          isLight
                            ? "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
                            : "bg-[var(--bg-elevated)] text-slate-300 hover:bg-[var(--border-primary)] hover:text-slate-100"
                        }`}>
                          {tool.btn}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
