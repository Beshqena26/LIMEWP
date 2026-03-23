"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import AppShell from "@/app/components/AppShell";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { showToast } from "@/lib/toast";
import { ConfirmDialog } from "@/app/components/ui/ConfirmDialog";

/* ────────────── mock data ────────────── */

interface StagingEnv {
  url: string;
  createdAt: string;
  size: string;
  syncStatus: "in-sync" | "out-of-date" | "never-synced";
}

interface EnvComparison {
  label: string;
  live: string;
  staging: string;
  differs: boolean;
}

const STAGING_DATA: StagingEnv = {
  url: "https://staging.example.com",
  createdAt: "2026-03-10",
  size: "1.8 GB",
  syncStatus: "out-of-date",
};

const ENV_COMPARISON: EnvComparison[] = [
  { label: "WordPress Version", live: "6.7.1", staging: "6.7.1", differs: false },
  { label: "PHP Version", live: "8.3.6", staging: "8.2.12", differs: true },
  { label: "Last Modified", live: "2026-03-20", staging: "2026-03-15", differs: true },
  { label: "Active Plugins", live: "12", staging: "10", differs: true },
  { label: "Theme", live: "Flavor Theme 3.2", staging: "Flavor Theme 3.2", differs: false },
  { label: "Database Size", live: "245 MB", staging: "238 MB", differs: true },
];

/* ────────────── helpers ────────────── */

function getSyncBadge(status: StagingEnv["syncStatus"]) {
  if (status === "in-sync") return { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", ring: "ring-emerald-500/20", label: "In sync" };
  if (status === "out-of-date") return { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400", ring: "ring-amber-500/20", label: "Out of date" };
  return { bg: "bg-slate-500/10", text: "text-slate-400", dot: "bg-slate-400", ring: "ring-slate-500/20", label: "Never synced" };
}

/* ────────────── component ────────────── */

export default function StagingPage() {
  const params = useParams();
  const siteId = params.siteId as string;
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  // Core state
  const [hasStaging, setHasStaging] = useState(false);
  const [creating, setCreating] = useState(false);

  // Action states
  const [pushing, setPushing] = useState(false);
  const [pulling, setPulling] = useState(false);

  // Confirm modals
  const [showPushConfirm, setShowPushConfirm] = useState(false);
  const [showPullConfirm, setShowPullConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  /* ── handlers ── */

  const handleCreateStaging = useCallback(async () => {
    setCreating(true);
    await new Promise((r) => setTimeout(r, 2500));
    setCreating(false);
    setHasStaging(true);
    showToast.success("Staging environment created successfully");
  }, []);

  const handlePushToLive = useCallback(async () => {
    setShowPushConfirm(false);
    setPushing(true);
    await new Promise((r) => setTimeout(r, 2500));
    setPushing(false);
    showToast.success("Staging changes pushed to live site");
  }, []);

  const handlePullFromLive = useCallback(async () => {
    setShowPullConfirm(false);
    setPulling(true);
    await new Promise((r) => setTimeout(r, 2500));
    setPulling(false);
    showToast.success("Live site pulled to staging environment");
  }, []);

  const handleDeleteStaging = useCallback(() => {
    setShowDeleteConfirm(false);
    setHasStaging(false);
    showToast.success("Staging environment deleted");
  }, []);

  /* ── shared styles ── */

  const cardClass = `rounded-2xl border transition-all ${
    isLight
      ? "bg-white border-slate-200"
      : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"
  }`;

  const labelClass = `text-xs font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`;

  const spinner = (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );

  const syncBadge = getSyncBadge(STAGING_DATA.syncStatus);

  return (
    <AppShell>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className={`text-2xl font-bold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
          Staging Environment
        </h1>
        <p className={`text-sm ${isLight ? "text-slate-600" : "text-slate-500"}`}>
          Test changes safely for{" "}
          <span className={`font-medium ${isLight ? "text-slate-700" : "text-slate-300"}`}>
            {decodeURIComponent(siteId)}
          </span>
        </p>
      </div>

      {/* ═══════════ STATE 1: No Staging (Empty State) ═══════════ */}
      {!hasStaging && !creating && (
        <div className={cardClass}>
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            {/* Branch/fork icon */}
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
              isLight ? "bg-slate-100" : "bg-[var(--bg-elevated)]"
            }`}>
              <svg className={`w-8 h-8 ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
              </svg>
            </div>

            <h2 className={`text-xl font-semibold mb-2 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              No staging environment
            </h2>
            <p className={`text-sm max-w-sm mb-8 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              Create a staging copy of your live site to test changes safely before pushing them to production.
            </p>

            <button
              onClick={handleCreateStaging}
              className={`h-12 px-8 rounded-xl text-white text-sm font-semibold transition-all shadow-lg flex items-center gap-2 ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Create Staging
            </button>
          </div>
        </div>
      )}

      {/* ═══════════ Creating Animation ═══════════ */}
      {creating && (
        <div className={cardClass}>
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
              isLight ? "bg-slate-100" : "bg-[var(--bg-elevated)]"
            }`}>
              <svg className={`w-8 h-8 animate-spin ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <h2 className={`text-xl font-semibold mb-2 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              Creating staging environment…
            </h2>
            <p className={`text-sm ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              Cloning your live site. This may take a moment.
            </p>
          </div>
        </div>
      )}

      {/* ═══════════ STATE 2: Active Staging ═══════════ */}
      {hasStaging && !creating && (
        <>
          {/* Status Card */}
          <div className={`${cardClass} mb-6`}>
            <div className="p-6">
              <h2 className={`text-base font-semibold mb-5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                Staging Status
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Staging URL */}
                <div className={`rounded-xl p-4 border ${
                  isLight ? "bg-slate-50 border-slate-200" : "bg-[var(--bg-primary)]/50 border-[var(--border-tertiary)]"
                }`}>
                  <p className={labelClass}>Staging URL</p>
                  <a
                    href={STAGING_DATA.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sm font-semibold mt-1 inline-flex items-center gap-1.5 hover:underline ${accent.text}`}
                  >
                    {STAGING_DATA.url.replace("https://", "")}
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </a>
                </div>

                {/* Created */}
                <div className={`rounded-xl p-4 border ${
                  isLight ? "bg-slate-50 border-slate-200" : "bg-[var(--bg-primary)]/50 border-[var(--border-tertiary)]"
                }`}>
                  <p className={labelClass}>Created</p>
                  <p className={`text-sm font-semibold mt-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                    {STAGING_DATA.createdAt}
                  </p>
                </div>

                {/* Size */}
                <div className={`rounded-xl p-4 border ${
                  isLight ? "bg-slate-50 border-slate-200" : "bg-[var(--bg-primary)]/50 border-[var(--border-tertiary)]"
                }`}>
                  <p className={labelClass}>Size</p>
                  <p className={`text-sm font-semibold mt-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                    {STAGING_DATA.size}
                  </p>
                </div>

                {/* Sync Status */}
                <div className={`rounded-xl p-4 border ${
                  isLight ? "bg-slate-50 border-slate-200" : "bg-[var(--bg-primary)]/50 border-[var(--border-tertiary)]"
                }`}>
                  <p className={labelClass}>Sync Status</p>
                  <div className="mt-1.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ring-1 ${syncBadge.bg} ${syncBadge.ring}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${syncBadge.dot}`} />
                      <span className={`text-xs font-semibold ${syncBadge.text}`}>{syncBadge.label}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            {/* Push to Live */}
            <button
              onClick={() => setShowPushConfirm(true)}
              disabled={pushing}
              className={`h-10 px-5 rounded-xl text-white text-sm font-semibold transition-all shadow-lg flex items-center gap-2 disabled:opacity-60 ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}
            >
              {pushing ? (
                <>{spinner} Pushing…</>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  Push to Live
                </>
              )}
            </button>

            {/* Pull from Live */}
            <button
              onClick={() => setShowPullConfirm(true)}
              disabled={pulling}
              className={`h-10 px-5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 border disabled:opacity-60 ${
                isLight
                  ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                  : "bg-[var(--bg-secondary)] border-[var(--border-tertiary)] text-slate-200 hover:bg-[var(--bg-elevated)] hover:border-[var(--border-primary)]"
              }`}
            >
              {pulling ? (
                <>{spinner} Pulling…</>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12M12 16.5V3" />
                  </svg>
                  Pull from Live
                </>
              )}
            </button>

            {/* Open Staging */}
            <button
              onClick={() => showToast.info("Opening staging site...")}
              className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                isLight
                  ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  : "text-slate-400 hover:bg-[var(--bg-elevated)] hover:text-slate-200"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              Open Staging
            </button>

            {/* Delete Staging */}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                isLight
                  ? "text-red-500 hover:bg-red-50"
                  : "text-red-400 hover:bg-red-500/10"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              Delete Staging
            </button>
          </div>

          {/* Environment Comparison */}
          <div className={`${cardClass} overflow-hidden`}>
            <div className="p-6 pb-0">
              <h2 className={`text-base font-semibold mb-5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                Environment Comparison
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
                    <th className={`text-left text-xs font-semibold uppercase tracking-wider px-6 py-4 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                      Property
                    </th>
                    <th className={`text-left text-xs font-semibold uppercase tracking-wider px-6 py-4 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        Live
                      </div>
                    </th>
                    <th className={`text-left text-xs font-semibold uppercase tracking-wider px-6 py-4 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-sky-400" />
                        Staging
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ENV_COMPARISON.map((row) => (
                    <tr
                      key={row.label}
                      className={`border-b last:border-b-0 transition-colors ${
                        isLight
                          ? "border-slate-100 hover:bg-slate-50"
                          : "border-[var(--border-tertiary)]/50 hover:bg-[var(--bg-primary)]/50"
                      }`}
                    >
                      <td className={`px-6 py-4 text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                        {row.label}
                      </td>
                      <td className={`px-6 py-4 text-sm font-mono ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                        {row.live}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-mono ${
                            row.differs
                              ? "text-amber-500 font-semibold"
                              : isLight ? "text-slate-600" : "text-slate-300"
                          }`}>
                            {row.staging}
                          </span>
                          {row.differs && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20">
                              differs
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ═══════════ Confirmation Modals ═══════════ */}

      {/* Push to Live */}
      <ConfirmDialog
        open={showPushConfirm}
        onClose={() => setShowPushConfirm(false)}
        onConfirm={handlePushToLive}
        title="Push to Live?"
        message="This will overwrite your live site with the staging version. All current live changes that aren't in staging will be lost."
        confirmText="Push to Live"
        variant="warning"
      />

      {/* Pull from Live */}
      <ConfirmDialog
        open={showPullConfirm}
        onClose={() => setShowPullConfirm(false)}
        onConfirm={handlePullFromLive}
        title="Pull from Live?"
        message="This will overwrite your staging environment with the current live site. Any uncommitted staging changes will be lost."
        confirmText="Pull from Live"
        variant="warning"
      />

      {/* Delete Staging */}
      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteStaging}
        title="Delete Staging Environment?"
        message="This will permanently delete the staging environment and all its data. This action cannot be undone."
        confirmText="Delete Staging"
        variant="danger"
        requireTypedConfirmation="DELETE"
      />
    </AppShell>
  );
}
