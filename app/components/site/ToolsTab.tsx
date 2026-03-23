"use client";

import { useState, useCallback } from "react";
import { Select, SelectItem } from "@heroui/react";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { TOOLS, TOOL_CATEGORY_CONFIG, TOOL_CATEGORY_ORDER } from "@/data/site/tools";
import { showToast } from "@/lib/toast";
import { ConfirmDialog } from "@/app/components/ui/ConfirmDialog";

interface ToolsTabProps {
  siteId: string;
}

export function ToolsTab({ siteId }: ToolsTabProps) {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  // Track enabled/disabled state for toggleable tools
  const [enabledTools, setEnabledTools] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const tool of TOOLS) {
      if (tool.btn === "Enable" || tool.btn === "Disable") {
        // "Force HTTPS" and "Early Hints" start enabled, rest start disabled
        init[tool.title] = tool.title === "Force HTTPS" || tool.title === "Early Hints";
      }
    }
    return init;
  });

  const isToggleable = (tool: typeof TOOLS[0]) => tool.btn === "Enable" || tool.btn === "Disable";

  // Confirm dialog state
  const [confirmTarget, setConfirmTarget] = useState<{ title: string; message: string; confirmText: string; variant: "danger" | "warning" | "info"; onConfirm: () => void } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Configure modal state
  const [configureTarget, setConfigureTarget] = useState<string | null>(null);

  // Group tools by category
  const groupedTools = TOOLS.reduce((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, typeof TOOLS>);

  const handleAction = useCallback((tool: typeof TOOLS[0]) => {
    // Configure / Open Tool → open modal
    if (tool.btn === "Configure" || tool.btn === "Open Tool") {
      setConfigureTarget(tool.title);
      return;
    }

    // Restart → warning confirm
    if (tool.btn === "Restart") {
      setConfirmTarget({
        title: `Restart ${tool.title.replace("Restart ", "")}?`,
        message: "Your site may be briefly unavailable during the restart.",
        confirmText: "Restart Now",
        variant: "warning",
        onConfirm: async () => {
          setActionLoading(true);
          await new Promise((r) => setTimeout(r, 2000));
          setActionLoading(false);
          setConfirmTarget(null);
          showToast.success(`${tool.title} completed`);
        },
      });
      return;
    }

    // Toggleable tools (Enable/Disable) → confirm then flip state
    if (isToggleable(tool)) {
      const currentlyEnabled = enabledTools[tool.title] ?? false;
      const action = currentlyEnabled ? "Disable" : "Enable";
      const isDangerous = tool.danger || (currentlyEnabled && (tool.title === "Force HTTPS" || tool.title === "Password Protection"));

      setConfirmTarget({
        title: `${action} ${tool.title}?`,
        message: currentlyEnabled
          ? `This will disable ${tool.title}. ${tool.desc}.`
          : `This will enable ${tool.title}. ${tool.desc}.`,
        confirmText: action,
        variant: isDangerous ? "warning" : "info",
        onConfirm: async () => {
          setActionLoading(true);
          await new Promise((r) => setTimeout(r, 1500));
          setEnabledTools((prev) => ({ ...prev, [tool.title]: !currentlyEnabled }));
          setActionLoading(false);
          setConfirmTarget(null);
          showToast.success(`${tool.title} ${currentlyEnabled ? "disabled" : "enabled"}`);
        },
      });
      return;
    }

    // Danger actions (non-toggleable) → danger confirm
    if (tool.danger) {
      setConfirmTarget({
        title: `${tool.btn} ${tool.title}?`,
        message: `This is a potentially destructive action. ${tool.desc}. Are you sure?`,
        confirmText: tool.btn || "Confirm",
        variant: "danger",
        onConfirm: async () => {
          setActionLoading(true);
          await new Promise((r) => setTimeout(r, 1500));
          setActionLoading(false);
          setConfirmTarget(null);
          showToast.success(`${tool.title} executed`);
        },
      });
      return;
    }

    showToast.success(`${tool.title} executed`);
  }, [enabledTools]);

  const handleConfigSave = useCallback(async () => {
    setActionLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    showToast.success(`${configureTarget} configuration saved`);
    setActionLoading(false);
    setConfigureTarget(null);
  }, [configureTarget]);

  /* ── styles ── */
  const cardClass = `rounded-2xl border overflow-hidden ${
    isLight
      ? "bg-white border-slate-200"
      : "bg-[var(--bg-secondary)] border-[var(--border-tertiary)]"
  }`;

  const inputClass = `w-full h-10 rounded-xl border px-3 text-sm font-medium outline-none transition-colors ${
    isLight
      ? "bg-white border-slate-200 text-slate-800 focus:border-slate-400"
      : "bg-[var(--bg-primary)] border-[var(--border-tertiary)] text-slate-200 focus:border-[var(--border-primary)]"
  }`;

  const labelClass = `text-xs font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`;

  const modalOverlayClass = "fixed inset-0 z-[100] flex items-center justify-center p-4";
  const modalBackdropClass = "absolute inset-0 bg-black/60 backdrop-blur-sm";
  const modalCardClass = `relative w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200 ${
    isLight
      ? "bg-white border border-slate-200"
      : "bg-[var(--bg-primary)] border border-[var(--border-tertiary)]"
  }`;

  return (
    <>
      <div className={cardClass}>
        {/* Header */}
        <div className={`px-6 py-5 border-b ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isLight ? "bg-slate-100 text-slate-500" : "bg-[var(--bg-elevated)] text-slate-400"}`}>
              <svg width={18} height={18} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>Site Tools</h3>
              <p className="text-xs text-slate-500">{TOOLS.length} tools available</p>
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
                <div className="flex items-center gap-2.5 mb-4">
                  <div className={`w-6 h-6 rounded-md text-slate-500 flex items-center justify-center ${isLight ? "bg-slate-100" : "bg-[var(--bg-elevated)]"}`}>
                    <svg width={14} height={14} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d={config.icon} />
                    </svg>
                  </div>
                  <span className={`text-xs font-semibold uppercase tracking-wider ${isLight ? "text-slate-500" : "text-slate-400"}`}>{category}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${isLight ? "text-slate-700 bg-slate-100" : "text-slate-400 bg-[var(--bg-elevated)]"}`}>{categoryTools.length}</span>
                </div>

                <div className="space-y-2">
                  {categoryTools.map((tool) => {
                    const toggleable = isToggleable(tool);
                    const enabled = enabledTools[tool.title] ?? false;
                    const buttonLabel = toggleable ? (enabled ? "Disable" : "Enable") : tool.btn;

                    return (
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
                          <svg width={18} height={18} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d={tool.icon} />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className={`text-sm font-medium truncate ${isLight ? "text-slate-700" : "text-slate-200"}`}>{tool.title}</h4>
                            {toggleable && (
                              <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                enabled
                                  ? "bg-emerald-500/10 text-emerald-500"
                                  : isLight ? "bg-slate-100 text-slate-400" : "bg-slate-800 text-slate-500"
                              }`}>
                                {enabled ? "On" : "Off"}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 truncate">{tool.desc}</p>
                        </div>
                      </div>

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
                              if (e.target.value) showToast.success(`PHP version updated to ${e.target.value}`);
                            }}
                          >
                            <SelectItem key="8.1.1">PHP 8.1.1</SelectItem>
                            <SelectItem key="8.0.0">PHP 8.0.0</SelectItem>
                            <SelectItem key="7.4.0">PHP 7.4.0</SelectItem>
                          </Select>
                        ) : (
                          <button
                            onClick={() => handleAction(tool)}
                            className={`h-8 px-4 rounded-lg text-xs font-medium transition-colors ${
                              tool.danger
                                ? "bg-rose-500/10 text-rose-400 hover:bg-rose-500/15"
                                : toggleable && enabled
                                  ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/15"
                                  : isLight
                                    ? "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
                                    : "bg-[var(--bg-elevated)] text-slate-300 hover:bg-[var(--border-primary)] hover:text-slate-100"
                            }`}
                          >
                            {buttonLabel}
                          </button>
                        )}
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Confirm Dialog ── */}
      <ConfirmDialog
        open={!!confirmTarget}
        onClose={() => setConfirmTarget(null)}
        onConfirm={() => confirmTarget?.onConfirm()}
        title={confirmTarget?.title ?? ""}
        message={confirmTarget?.message ?? ""}
        confirmText={confirmTarget?.confirmText ?? "Confirm"}
        variant={confirmTarget?.variant ?? "warning"}
        isLoading={actionLoading}
      />

      {/* ── Configure Modal ── */}
      {configureTarget && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => !actionLoading && setConfigureTarget(null)} aria-hidden="true" />
          <div className={modalCardClass} role="dialog" aria-modal="true" aria-labelledby="configure-modal-title">
            <h3 id="configure-modal-title" className={`text-lg font-semibold mb-5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              Configure {configureTarget}
            </h3>

            <div className="space-y-4">
              {configureTarget === "New Relic Monitoring" ? (
                <>
                  <div>
                    <label htmlFor="nr-license-key" className={labelClass}>License Key</label>
                    <input id="nr-license-key" type="text" placeholder="Enter New Relic license key" className={`${inputClass} mt-1.5`} />
                  </div>
                  <div>
                    <label htmlFor="nr-app-name" className={labelClass}>App Name</label>
                    <input id="nr-app-name" type="text" placeholder={siteId} className={`${inputClass} mt-1.5`} />
                  </div>
                </>
              ) : configureTarget === "Search & Replace" ? (
                <>
                  <div>
                    <label htmlFor="sr-search" className={labelClass}>Search for</label>
                    <input id="sr-search" type="text" placeholder="Text to find in database" className={`${inputClass} mt-1.5`} />
                  </div>
                  <div>
                    <label htmlFor="sr-replace" className={labelClass}>Replace with</label>
                    <input id="sr-replace" type="text" placeholder="Replacement text" className={`${inputClass} mt-1.5`} />
                  </div>
                  <div className={`rounded-xl p-3 border ${isLight ? "bg-amber-50 border-amber-200" : "bg-amber-500/10 border-amber-500/20"}`}>
                    <p className={`text-xs ${isLight ? "text-amber-700" : "text-amber-400"}`}>
                      This will modify your database directly. Make sure you have a recent backup before proceeding.
                    </p>
                  </div>
                </>
              ) : (
                <div>
                  <label htmlFor="tool-config" className={labelClass}>Configuration</label>
                  <textarea
                    id="tool-config"
                    placeholder="Enter configuration values..."
                    rows={4}
                    className={`w-full rounded-xl border px-3 py-3 text-sm font-medium outline-none transition-colors resize-y min-h-[100px] ${
                      isLight
                        ? "bg-white border-slate-200 text-slate-800 focus:border-slate-400"
                        : "bg-[var(--bg-primary)] border-[var(--border-tertiary)] text-slate-200 focus:border-[var(--border-primary)]"
                    } mt-1.5`}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setConfigureTarget(null)}
                disabled={actionLoading}
                className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${
                  isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleConfigSave}
                disabled={actionLoading}
                className={`h-10 px-5 rounded-xl text-white text-sm font-semibold transition-all shadow-lg flex items-center gap-2 disabled:opacity-60 ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}
              >
                {actionLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving…
                  </>
                ) : (
                  "Save Configuration"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
