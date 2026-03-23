"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Select, SelectItem } from "@heroui/react";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { TOOLS, TOOL_CATEGORY_CONFIG, TOOL_CATEGORY_ORDER } from "@/data/site/tools";
import { showToast } from "@/lib/toast";
import { ConfirmDialog } from "@/app/components/ui/ConfirmDialog";
import { Toggle } from "@/app/components/ui/Toggle";

interface ToolsTabProps {
  siteId: string;
}

/* ── WP-CLI mock responses ── */
const WPCLI_RESPONSES: Record<string, string> = {
  "core version": "6.7.1",
  "plugin list": [
    "+--------------------+--------+---------+",
    "| name               | status | version |",
    "+--------------------+--------+---------+",
    "| akismet            | active | 5.3.1   |",
    "| woocommerce        | active | 8.4.0   |",
    "| wordfence          | active | 7.11.2  |",
    "| contact-form-7     | inactive | 5.9.3 |",
    "+--------------------+--------+---------+",
  ].join("\n"),
  "theme list": [
    "+-----------------+--------+---------+",
    "| name            | status | version |",
    "+-----------------+--------+---------+",
    "| flavor          | active | 3.2.0   |",
    "| flavor-developer| inactive | 1.0.0 |",
    "+-----------------+--------+---------+",
  ].join("\n"),
  "cache flush": "Success: The cache was flushed.",
  "db size": "245 MB",
  "user list": [
    "+----+-----------+---------------+-------+",
    "| ID | user_login| user_email    | role  |",
    "+----+-----------+---------------+-------+",
    "| 1  | admin     | admin@site.com| admin |",
    "| 2  | editor    | ed@site.com   | editor|",
    "| 3  | subscriber| sub@site.com  | sub   |",
    "+----+-----------+---------------+-------+",
  ].join("\n"),
};

/* ── Mock DB tables ── */
const MOCK_DB_TABLES = [
  { name: "wp_posts", size: "45 MB", rows: "1.2K", overhead: "2.1 MB" },
  { name: "wp_options", size: "12 MB", rows: "890", overhead: "0.8 MB" },
  { name: "wp_postmeta", size: "89 MB", rows: "45K", overhead: "5.3 MB" },
  { name: "wp_comments", size: "8 MB", rows: "234", overhead: "0.3 MB" },
  { name: "wp_terms", size: "1 MB", rows: "67", overhead: "0.1 MB" },
];

/* ── Mock Cron events ── */
const MOCK_CRON_EVENTS = [
  { hook: "wp_update_plugins", schedule: "twicedaily", nextRun: "Mar 23, 2026 18:00", lastRun: "Mar 23, 2026 06:00" },
  { hook: "wp_scheduled_auto_draft_delete", schedule: "daily", nextRun: "Mar 24, 2026 00:00", lastRun: "Mar 23, 2026 00:00" },
  { hook: "wp_site_health_scheduled_check", schedule: "weekly", nextRun: "Mar 29, 2026 12:00", lastRun: "Mar 22, 2026 12:00" },
  { hook: "wp_privacy_delete_old_export_files", schedule: "hourly", nextRun: "Mar 23, 2026 14:00", lastRun: "Mar 23, 2026 13:00" },
];

export function ToolsTab({ siteId }: ToolsTabProps) {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  /* ── Search ── */
  const [searchQuery, setSearchQuery] = useState("");

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

  const isToggleable = (tool: (typeof TOOLS)[0]) => tool.btn === "Enable" || tool.btn === "Disable";

  // Confirm dialog state
  const [confirmTarget, setConfirmTarget] = useState<{
    title: string;
    message: string;
    confirmText: string;
    variant: "danger" | "warning" | "info";
    onConfirm: () => void;
  } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Configure modal state
  const [configureTarget, setConfigureTarget] = useState<string | null>(null);

  /* ── WP-CLI terminal state ── */
  const [wpcliInput, setWpcliInput] = useState("");
  const [wpcliHistory, setWpcliHistory] = useState<{ cmd: string; output: string }[]>([]);
  const wpcliEndRef = useRef<HTMLDivElement>(null);

  /* ── Database Optimize state ── */
  const [selectedTables, setSelectedTables] = useState<Record<string, boolean>>({});

  /* ── Cron Manager state ── */
  const [disabledCrons, setDisabledCrons] = useState<Record<string, boolean>>({});

  /* ── Maintenance Mode state ── */
  const [maintenanceModal, setMaintenanceModal] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState(
    "We are performing scheduled maintenance. We'll be back shortly."
  );

  /* ── Object Cache flush confirm ── */
  const [flushCacheConfirm, setFlushCacheConfirm] = useState(false);

  // Scroll WP-CLI terminal to bottom
  useEffect(() => {
    wpcliEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [wpcliHistory]);

  // Body lock for modals
  useEffect(() => {
    if (configureTarget || maintenanceModal) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [configureTarget, maintenanceModal]);

  // Escape key for modals
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (configureTarget && !actionLoading) setConfigureTarget(null);
        if (maintenanceModal && !actionLoading) setMaintenanceModal(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [configureTarget, maintenanceModal, actionLoading]);

  // Group tools by category
  const groupedTools = TOOLS.reduce(
    (acc, tool) => {
      if (!acc[tool.category]) acc[tool.category] = [];
      acc[tool.category].push(tool);
      return acc;
    },
    {} as Record<string, typeof TOOLS>
  );

  /* ── WP-CLI command handler ── */
  const handleWpcliSubmit = useCallback(() => {
    const cmd = wpcliInput.trim();
    if (!cmd) return;
    const response = WPCLI_RESPONSES[cmd] ?? `Error: '${cmd}' is not a registered wp command.`;
    setWpcliHistory((prev) => [...prev, { cmd: `wp ${cmd}`, output: response }]);
    setWpcliInput("");
  }, [wpcliInput]);

  const handleAction = useCallback(
    (tool: (typeof TOOLS)[0]) => {
      // Configure / Open Tool -> open modal
      if (tool.btn === "Configure" || tool.btn === "Open Tool") {
        setConfigureTarget(tool.title);
        return;
      }

      // Restart -> warning confirm
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

      // Toggleable tools (Enable/Disable) -> confirm then flip state
      if (isToggleable(tool)) {
        const currentlyEnabled = enabledTools[tool.title] ?? false;
        const action = currentlyEnabled ? "Disable" : "Enable";

        // Intercept Maintenance Mode enable -> show maintenance modal
        if (tool.title === "Maintenance Mode" && !currentlyEnabled) {
          setMaintenanceModal(true);
          return;
        }

        const isDangerous =
          tool.danger || (currentlyEnabled && (tool.title === "Force HTTPS" || tool.title === "Password Protection"));

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

      // Danger actions (non-toggleable) -> danger confirm
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
    },
    [enabledTools]
  );

  const handleConfigSave = useCallback(async () => {
    setActionLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    showToast.success(`${configureTarget} configuration saved`);
    setActionLoading(false);
    setConfigureTarget(null);
  }, [configureTarget]);

  const handleMaintenanceEnable = useCallback(async () => {
    setActionLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setEnabledTools((prev) => ({ ...prev, "Maintenance Mode": true }));
    setActionLoading(false);
    setMaintenanceModal(false);
    showToast.success("Maintenance Mode enabled");
  }, []);

  const handleFlushObjectCache = useCallback(async () => {
    setActionLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setActionLoading(false);
    setFlushCacheConfirm(false);
    showToast.success("Object cache flushed successfully");
  }, []);

  /* ── styles ── */
  const cardClass = `rounded-2xl border overflow-hidden ${
    isLight ? "bg-white border-slate-200" : "bg-[var(--bg-secondary)] border-[var(--border-tertiary)]"
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
    isLight ? "bg-white border border-slate-200" : "bg-[var(--bg-primary)] border border-[var(--border-tertiary)]"
  }`;
  const modalCardWideClass = `relative w-full max-w-2xl rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200 ${
    isLight ? "bg-white border border-slate-200" : "bg-[var(--bg-primary)] border border-[var(--border-tertiary)]"
  }`;

  const textPrimary = isLight ? "text-slate-800" : "text-slate-100";
  const textSecondary = isLight ? "text-slate-500" : "text-slate-400";

  /* ── Filter tools by search ── */
  const filterTools = (tools: typeof TOOLS) => {
    if (!searchQuery.trim()) return tools;
    const q = searchQuery.toLowerCase();
    return tools.filter(
      (t) => t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)
    );
  };

  /* ── Render configure modal content ── */
  const renderConfigureModalContent = () => {
    if (!configureTarget) return null;

    /* WP-CLI Terminal */
    if (configureTarget === "WP-CLI") {
      return (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => !actionLoading && setConfigureTarget(null)} aria-hidden="true" />
          <div
            className={`relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${
              isLight ? "bg-white border border-slate-200" : "bg-[var(--bg-primary)] border border-[var(--border-tertiary)]"
            }`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="wpcli-modal-title"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#0d1117]">
              <h3 id="wpcli-modal-title" className="text-sm font-semibold text-slate-100">WP-CLI Terminal</h3>
              <button
                onClick={() => setConfigureTarget(null)}
                className="text-slate-500 hover:text-slate-300 transition-colors"
                aria-label="Close WP-CLI terminal"
              >
                <svg width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="bg-[#0d1117]">
              {/* macOS traffic lights */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                <span className="text-xs font-mono text-slate-500 ml-3">wp-cli@{siteId}</span>
              </div>

              {/* Terminal output */}
              <div className="h-72 overflow-y-auto p-4 font-mono text-sm">
                <div className="text-slate-500 text-xs mb-3">
                  Welcome to WP-CLI Terminal. Commands are prefixed with &quot;wp&quot; automatically.
                </div>
                {wpcliHistory.map((entry, i) => (
                  <div key={i} className="mb-2">
                    <div className="text-emerald-400">$ {entry.cmd}</div>
                    <div className="text-slate-400 whitespace-pre-wrap">{entry.output}</div>
                  </div>
                ))}
                <div ref={wpcliEndRef} />
              </div>

              {/* Input */}
              <div className="flex items-center gap-2 px-4 py-3 border-t border-white/5">
                <span className="text-emerald-500 text-sm font-mono">wp</span>
                <input
                  id="wpcli-input"
                  type="text"
                  value={wpcliInput}
                  onChange={(e) => setWpcliInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleWpcliSubmit();
                  }}
                  placeholder="core version"
                  className="flex-1 bg-transparent text-sm font-mono text-slate-200 placeholder-slate-600 outline-none"
                  aria-label="WP-CLI command input"
                  autoFocus
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    /* PHP Info */
    if (configureTarget === "PHP Info") {
      return (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => setConfigureTarget(null)} aria-hidden="true" />
          <div className={modalCardClass} role="dialog" aria-modal="true" aria-labelledby="phpinfo-modal-title">
            <h3 id="phpinfo-modal-title" className={`text-lg font-semibold mb-5 ${textPrimary}`}>
              PHP Configuration
            </h3>

            <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0d1117] p-4 max-h-80 overflow-y-auto font-mono text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
{`PHP Version: 8.3.4
System: Linux server 5.15.0
Server API: FPM/FastCGI
Memory Limit: 256M
Max Execution Time: 300
Upload Max Filesize: 64M
Post Max Size: 64M
OPcache: Enabled
Extensions: curl, gd, mbstring, mysqli, openssl, zip, redis`}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setConfigureTarget(null)}
                className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${
                  isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      );
    }

    /* Database Optimize */
    if (configureTarget === "Database Optimize") {
      const allSelected = MOCK_DB_TABLES.every((t) => selectedTables[t.name]);
      return (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => setConfigureTarget(null)} aria-hidden="true" />
          <div className={modalCardWideClass} role="dialog" aria-modal="true" aria-labelledby="dbopt-modal-title">
            <h3 id="dbopt-modal-title" className={`text-lg font-semibold mb-5 ${textPrimary}`}>
              Database Optimize
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={`border-b ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
                    <th className="text-left py-2 pr-3 w-8">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={(e) => {
                          const val = e.target.checked;
                          const next: Record<string, boolean> = {};
                          MOCK_DB_TABLES.forEach((t) => (next[t.name] = val));
                          setSelectedTables(next);
                        }}
                        className="rounded"
                        aria-label="Select all tables"
                      />
                    </th>
                    <th className={`text-left py-2 pr-3 font-medium ${textSecondary}`}>Table</th>
                    <th className={`text-left py-2 pr-3 font-medium ${textSecondary}`}>Size</th>
                    <th className={`text-left py-2 pr-3 font-medium ${textSecondary}`}>Rows</th>
                    <th className={`text-left py-2 font-medium ${textSecondary}`}>Overhead</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_DB_TABLES.map((table) => (
                    <tr
                      key={table.name}
                      className={`border-b ${isLight ? "border-slate-100" : "border-[var(--border-tertiary)]/50"}`}
                    >
                      <td className="py-2.5 pr-3">
                        <input
                          type="checkbox"
                          checked={!!selectedTables[table.name]}
                          onChange={(e) =>
                            setSelectedTables((prev) => ({ ...prev, [table.name]: e.target.checked }))
                          }
                          className="rounded"
                          aria-label={`Select ${table.name}`}
                        />
                      </td>
                      <td className={`py-2.5 pr-3 font-mono text-xs ${textPrimary}`}>{table.name}</td>
                      <td className={`py-2.5 pr-3 ${textSecondary}`}>{table.size}</td>
                      <td className={`py-2.5 pr-3 ${textSecondary}`}>{table.rows}</td>
                      <td className={`py-2.5 ${textSecondary}`}>{table.overhead}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setConfigureTarget(null)}
                className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${
                  isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setActionLoading(true);
                  await new Promise((r) => setTimeout(r, 1500));
                  setActionLoading(false);
                  showToast.success("Selected tables repaired");
                }}
                disabled={actionLoading || !Object.values(selectedTables).some(Boolean)}
                className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors disabled:opacity-60 ${
                  isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
                }`}
              >
                Repair Selected
              </button>
              <button
                onClick={async () => {
                  setActionLoading(true);
                  await new Promise((r) => setTimeout(r, 1500));
                  setActionLoading(false);
                  showToast.success("Selected tables optimized");
                }}
                disabled={actionLoading || !Object.values(selectedTables).some(Boolean)}
                className={`h-10 px-5 rounded-xl text-white text-sm font-semibold transition-all shadow-lg disabled:opacity-60 ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}
              >
                Optimize Selected
              </button>
            </div>
          </div>
        </div>
      );
    }

    /* Cron Manager */
    if (configureTarget === "Cron Manager") {
      return (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => setConfigureTarget(null)} aria-hidden="true" />
          <div className={modalCardWideClass} role="dialog" aria-modal="true" aria-labelledby="cron-modal-title">
            <h3 id="cron-modal-title" className={`text-lg font-semibold mb-5 ${textPrimary}`}>
              Cron Manager
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={`border-b ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
                    <th className={`text-left py-2 pr-3 font-medium ${textSecondary}`}>Hook</th>
                    <th className={`text-left py-2 pr-3 font-medium ${textSecondary}`}>Schedule</th>
                    <th className={`text-left py-2 pr-3 font-medium ${textSecondary}`}>Next Run</th>
                    <th className={`text-left py-2 pr-3 font-medium ${textSecondary}`}>Last Run</th>
                    <th className={`text-right py-2 font-medium ${textSecondary}`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_CRON_EVENTS.map((event) => (
                    <tr
                      key={event.hook}
                      className={`border-b ${isLight ? "border-slate-100" : "border-[var(--border-tertiary)]/50"}`}
                    >
                      <td className={`py-2.5 pr-3 font-mono text-xs ${textPrimary}`}>{event.hook}</td>
                      <td className={`py-2.5 pr-3 ${textSecondary}`}>
                        <span
                          className={`inline-block text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                            isLight ? "bg-slate-100 text-slate-600" : "bg-[var(--bg-elevated)] text-slate-400"
                          }`}
                        >
                          {event.schedule}
                        </span>
                      </td>
                      <td className={`py-2.5 pr-3 text-xs ${textSecondary}`}>{event.nextRun}</td>
                      <td className={`py-2.5 pr-3 text-xs ${textSecondary}`}>{event.lastRun}</td>
                      <td className="py-2.5 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => showToast.success(`${event.hook} executed`)}
                            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                              isLight
                                ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            Run Now
                          </button>
                          <Toggle
                            enabled={!disabledCrons[event.hook]}
                            onChange={(val) =>
                              setDisabledCrons((prev) => ({ ...prev, [event.hook]: !val }))
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setConfigureTarget(null)}
                className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${
                  isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      );
    }

    /* Object Cache */
    if (configureTarget === "Object Cache") {
      return (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => !actionLoading && setConfigureTarget(null)} aria-hidden="true" />
          <div className={modalCardClass} role="dialog" aria-modal="true" aria-labelledby="objcache-modal-title">
            <h3 id="objcache-modal-title" className={`text-lg font-semibold mb-5 ${textPrimary}`}>
              Object Cache
            </h3>

            <div className="space-y-4">
              {/* Status */}
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className={`text-sm font-medium ${textPrimary}`}>Redis Connected</span>
              </div>

              {/* Info rows */}
              <div className={`rounded-xl border p-4 space-y-3 ${isLight ? "border-slate-200 bg-slate-50" : "border-[var(--border-tertiary)] bg-[var(--bg-elevated)]"}`}>
                <div className="flex justify-between text-sm">
                  <span className={textSecondary}>Host</span>
                  <span className={`font-mono ${textPrimary}`}>127.0.0.1:6379</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className={textSecondary}>Memory</span>
                    <span className={textPrimary}>45 MB / 256 MB</span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${isLight ? "bg-slate-200" : "bg-slate-700"}`}>
                    <div
                      className={`h-2 rounded-full ${accent.button}`}
                      style={{ width: `${(45 / 256) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={textSecondary}>Keys</span>
                  <span className={textPrimary}>2,847</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={textSecondary}>Hit Rate</span>
                  <span className="text-emerald-500 font-medium">94.7%</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setConfigureTarget(null)}
                className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${
                  isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
                }`}
              >
                Close
              </button>
              {flushCacheConfirm ? (
                <button
                  onClick={handleFlushObjectCache}
                  disabled={actionLoading}
                  className="h-10 px-5 rounded-xl text-white text-sm font-semibold bg-rose-500 hover:bg-rose-600 transition-colors shadow-lg disabled:opacity-60 flex items-center gap-2"
                >
                  {actionLoading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Flushing...
                    </>
                  ) : (
                    "Confirm Flush"
                  )}
                </button>
              ) : (
                <button
                  onClick={() => setFlushCacheConfirm(true)}
                  className={`h-10 px-5 rounded-xl text-white text-sm font-semibold transition-all shadow-lg ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}
                >
                  Flush Cache
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    /* Default configure modals (New Relic, Search & Replace, generic) */
    return (
      <div className={modalOverlayClass}>
        <div className={modalBackdropClass} onClick={() => !actionLoading && setConfigureTarget(null)} aria-hidden="true" />
        <div className={modalCardClass} role="dialog" aria-modal="true" aria-labelledby="configure-modal-title">
          <h3 id="configure-modal-title" className={`text-lg font-semibold mb-5 ${textPrimary}`}>
            Configure {configureTarget}
          </h3>

          <div className="space-y-4">
            {configureTarget === "New Relic Monitoring" ? (
              <>
                <div>
                  <label htmlFor="nr-license-key" className={labelClass}>
                    License Key
                  </label>
                  <input
                    id="nr-license-key"
                    type="text"
                    placeholder="Enter New Relic license key"
                    className={`${inputClass} mt-1.5`}
                  />
                </div>
                <div>
                  <label htmlFor="nr-app-name" className={labelClass}>
                    App Name
                  </label>
                  <input id="nr-app-name" type="text" placeholder={siteId} className={`${inputClass} mt-1.5`} />
                </div>
              </>
            ) : configureTarget === "Search & Replace" ? (
              <>
                <div>
                  <label htmlFor="sr-search" className={labelClass}>
                    Search for
                  </label>
                  <input
                    id="sr-search"
                    type="text"
                    placeholder="Text to find in database"
                    className={`${inputClass} mt-1.5`}
                  />
                </div>
                <div>
                  <label htmlFor="sr-replace" className={labelClass}>
                    Replace with
                  </label>
                  <input
                    id="sr-replace"
                    type="text"
                    placeholder="Replacement text"
                    className={`${inputClass} mt-1.5`}
                  />
                </div>
                <div
                  className={`rounded-xl p-3 border ${
                    isLight ? "bg-amber-50 border-amber-200" : "bg-amber-500/10 border-amber-500/20"
                  }`}
                >
                  <p className={`text-xs ${isLight ? "text-amber-700" : "text-amber-400"}`}>
                    This will modify your database directly. Make sure you have a recent backup before proceeding.
                  </p>
                </div>
              </>
            ) : (
              <div>
                <label htmlFor="tool-config" className={labelClass}>
                  Configuration
                </label>
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
                isLight
                  ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
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
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Configuration"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* ── Search Filter ── */}
      <div className={`${cardClass} p-4 mb-5`}>
        <div className="relative">
          <svg
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${textSecondary}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            id="tool-search"
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${inputClass} pl-10`}
          />
        </div>
      </div>

      <div className={cardClass}>
        {/* Header */}
        <div className={`px-6 py-5 border-b ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                isLight ? "bg-slate-100 text-slate-500" : "bg-[var(--bg-elevated)] text-slate-400"
              }`}
            >
              <svg
                width={18}
                height={18}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
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
            const categoryTools = filterTools(groupedTools[category] || []);
            if (!categoryTools || categoryTools.length === 0) return null;
            const config = TOOL_CATEGORY_CONFIG[category];

            return (
              <div key={category} className="p-6">
                <div className="flex items-center gap-2.5 mb-4">
                  <div
                    className={`w-6 h-6 rounded-md text-slate-500 flex items-center justify-center ${
                      isLight ? "bg-slate-100" : "bg-[var(--bg-elevated)]"
                    }`}
                  >
                    <svg
                      width={14}
                      height={14}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d={config.icon} />
                    </svg>
                  </div>
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider ${
                      isLight ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    {category}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                      isLight ? "text-slate-700 bg-slate-100" : "text-slate-400 bg-[var(--bg-elevated)]"
                    }`}
                  >
                    {categoryTools.length}
                  </span>
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
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                              isLight
                                ? "bg-slate-100 text-slate-500 group-hover:text-slate-600"
                                : "bg-[var(--bg-elevated)] text-slate-500 group-hover:text-slate-400"
                            }`}
                          >
                            <svg
                              width={18}
                              height={18}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <path d={tool.icon} />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4
                                className={`text-sm font-medium truncate ${
                                  isLight ? "text-slate-700" : "text-slate-200"
                                }`}
                              >
                                {tool.title}
                              </h4>
                              {toggleable && (
                                <span
                                  className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                    enabled
                                      ? "bg-emerald-500/10 text-emerald-500"
                                      : isLight
                                        ? "bg-slate-100 text-slate-400"
                                        : "bg-slate-800 text-slate-500"
                                  }`}
                                >
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
                                trigger: `rounded-lg border-0 h-8 min-h-8 w-[110px] ${
                                  isLight
                                    ? "bg-slate-100 text-slate-700"
                                    : "bg-[var(--bg-elevated)] text-slate-200"
                                }`,
                                value: `text-xs ${isLight ? "text-slate-700" : "text-slate-200"}`,
                                popoverContent: `${
                                  isLight ? "bg-white text-slate-700" : "bg-[var(--bg-elevated)] text-slate-200"
                                }`,
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

      {/* ── Configure Modals ── */}
      {configureTarget && renderConfigureModalContent()}

      {/* ── Maintenance Mode Modal ── */}
      {maintenanceModal && (
        <div className={modalOverlayClass}>
          <div
            className={modalBackdropClass}
            onClick={() => !actionLoading && setMaintenanceModal(false)}
            aria-hidden="true"
          />
          <div className={modalCardClass} role="dialog" aria-modal="true" aria-labelledby="maintenance-modal-title">
            <h3 id="maintenance-modal-title" className={`text-lg font-semibold mb-5 ${textPrimary}`}>
              Enable Maintenance Mode
            </h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="maintenance-message" className={labelClass}>
                  Maintenance Message
                </label>
                <textarea
                  id="maintenance-message"
                  value={maintenanceMessage}
                  onChange={(e) => setMaintenanceMessage(e.target.value)}
                  rows={4}
                  className={`w-full rounded-xl border px-3 py-3 text-sm font-medium outline-none transition-colors resize-y min-h-[100px] ${
                    isLight
                      ? "bg-white border-slate-200 text-slate-800 focus:border-slate-400"
                      : "bg-[var(--bg-primary)] border-[var(--border-tertiary)] text-slate-200 focus:border-[var(--border-primary)]"
                  } mt-1.5`}
                />
              </div>

              <div
                className={`rounded-xl p-3 border ${
                  isLight ? "bg-amber-50 border-amber-200" : "bg-amber-500/10 border-amber-500/20"
                }`}
              >
                <p className={`text-xs ${isLight ? "text-amber-700" : "text-amber-400"}`}>
                  Visitors will see the maintenance page. Logged-in admins can still access the site.
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setMaintenanceModal(false)}
                disabled={actionLoading}
                className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${
                  isLight
                    ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleMaintenanceEnable}
                disabled={actionLoading}
                className={`h-10 px-5 rounded-xl text-white text-sm font-semibold transition-all shadow-lg flex items-center gap-2 disabled:opacity-60 ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}
              >
                {actionLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Enabling...
                  </>
                ) : (
                  "Enable Maintenance Mode"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
