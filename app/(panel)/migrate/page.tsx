"use client";

import { useState, useEffect, useCallback, Fragment } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { showToast } from "@/lib/toast";
import { ROUTES } from "@/config/routes";
import {
  SOURCE_CARDS,
  CONNECTION_FIELDS,
  MOCK_DISCOVERED_SITES,
  MIGRATION_STEPS,
  MIGRATION_STATUS_LABELS,
  type MigrationSource,
  type MigrationStatus,
  type DiscoveredSite,
} from "@/data/migration";

type SiteWithSelection = DiscoveredSite & { selected: boolean };

const spinner = (
  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export default function MigratePage() {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);
  const router = useRouter();

  const [visible, setVisible] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSource, setSelectedSource] = useState<MigrationSource | null>(null);
  const [connectionTested, setConnectionTested] = useState(false);
  const [testing, setTesting] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [sites, setSites] = useState<SiteWithSelection[]>([]);
  const [migrationProgress, setMigrationProgress] = useState<
    Record<string, { progress: number; status: MigrationStatus }>
  >({});
  const [migrationComplete, setMigrationComplete] = useState(false);

  // Initialize sites when entering step 2
  useEffect(() => {
    if (currentStep === 2 && selectedSource && sites.length === 0) {
      const discovered = MOCK_DISCOVERED_SITES[selectedSource];
      setSites(discovered.map((s) => ({ ...s, selected: true })));
    }
  }, [currentStep, selectedSource, sites.length]);

  // Migration simulation
  useEffect(() => {
    if (currentStep !== 3) return;

    const entries = Object.entries(migrationProgress);
    if (entries.length === 0) return;

    const allDone = entries.every(
      ([, v]) => v.status === "complete" || v.status === "failed"
    );
    if (allDone) return;

    const interval = setInterval(() => {
      setMigrationProgress((prev) => {
        const next = { ...prev };
        let allFinished = true;

        const ids = Object.keys(next);
        const failTargetId = ids.length >= 3 ? ids[ids.length - 1] : null;

        for (const id of ids) {
          const entry = { ...next[id] };

          if (entry.status === "complete" || entry.status === "failed") {
            next[id] = entry;
            continue;
          }

          allFinished = false;

          // Simulate failure for the last site at ~60%
          if (id === failTargetId && entry.progress >= 58) {
            entry.status = "failed" as MigrationStatus;
            next[id] = entry;
            continue;
          }

          if (entry.status === "pending" && entry.progress === 0) {
            entry.status = "copying";
          }

          const increment = Math.floor(Math.random() * 4) + 2;
          entry.progress = Math.min(entry.progress + increment, 100);

          if (entry.progress >= 100) {
            entry.progress = 100;
            entry.status = "complete";
          } else if (entry.progress >= 70) {
            entry.status = "configuring";
          } else if (entry.progress >= 40) {
            entry.status = "importing";
          }

          next[id] = entry;
        }

        return next;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [currentStep, migrationProgress]);

  // Check for migration completion
  useEffect(() => {
    if (currentStep !== 3) return;
    const entries = Object.entries(migrationProgress);
    if (entries.length === 0) return;

    const allDone = entries.every(
      ([, v]) => v.status === "complete" || v.status === "failed"
    );
    const anyComplete = entries.some(([, v]) => v.status === "complete");

    if (allDone && anyComplete && !migrationComplete) {
      setMigrationComplete(true);
      import("canvas-confetti").then((m) =>
        m.default({ particleCount: 150, spread: 70, origin: { y: 0.6 } })
      );
    }
  }, [currentStep, migrationProgress, migrationComplete]);

  const handleTestConnection = useCallback(() => {
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      setConnectionTested(true);
      showToast.success("Connection established successfully");
    }, 2000);
  }, []);

  const handleStartMigration = useCallback(() => {
    const selected = sites.filter((s) => s.selected);
    const progress: Record<string, { progress: number; status: MigrationStatus }> = {};
    for (const s of selected) {
      progress[s.id] = { progress: 0, status: "pending" };
    }
    setMigrationProgress(progress);
    setMigrationComplete(false);
    setCurrentStep(3);
  }, [sites]);

  const handleRetry = useCallback((siteId: string) => {
    setMigrationComplete(false);
    setMigrationProgress((prev) => ({
      ...prev,
      [siteId]: { progress: 0, status: "pending" },
    }));
  }, []);

  const toggleSite = useCallback((id: string) => {
    setSites((prev) =>
      prev.map((s) => (s.id === id ? { ...s, selected: !s.selected } : s))
    );
  }, []);

  const toggleAll = useCallback(() => {
    setSites((prev) => {
      const allSelected = prev.every((s) => s.selected);
      return prev.map((s) => ({ ...s, selected: !allSelected }));
    });
  }, []);

  const selectedCount = sites.filter((s) => s.selected).length;
  const sourceName = selectedSource
    ? SOURCE_CARDS.find((c) => c.id === selectedSource)?.name ?? ""
    : "";

  const cardClass = isLight
    ? "bg-white border-slate-200"
    : "bg-[var(--bg-elevated)] border-[var(--border-tertiary)]";

  const inputClass = `w-full h-10 rounded-xl border px-3 text-sm font-medium outline-none transition-colors ${
    isLight
      ? "bg-white border-slate-200 text-slate-800 focus:border-slate-400"
      : "bg-[var(--bg-primary)] border-[var(--border-tertiary)] text-slate-200 focus:border-[var(--border-primary)]"
  }`;

  const labelClass = `text-xs font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`;

  const btnPrimary = `h-10 px-5 rounded-xl text-white text-sm font-semibold transition-all shadow-lg flex items-center gap-2 disabled:opacity-60 ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`;

  const btnSecondary = `h-10 px-5 rounded-xl text-sm font-medium transition-colors ${
    isLight
      ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
      : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
  }`;

  // ---- Progress Bar ----
  const renderProgressBar = () => (
    <div className="flex items-center w-full max-w-[700px] mb-12">
      {MIGRATION_STEPS.map((label, i) => (
        <Fragment key={label}>
          {i > 0 && (
            <div
              className={`flex-1 h-0.5 ${
                i <= currentStep
                  ? accent.progress || "bg-emerald-500"
                  : isLight
                  ? "bg-slate-200"
                  : "bg-slate-700"
              }`}
            />
          )}
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                i < currentStep
                  ? `${accent.button} text-white`
                  : i === currentStep
                  ? `${accent.button} text-white ring-4 ${isLight ? "ring-slate-100" : "ring-[var(--bg-primary)]"}`
                  : `border-2 ${isLight ? "border-slate-300 text-slate-400" : "border-slate-600 text-slate-500"}`
              }`}
            >
              {i < currentStep ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span
              className={`text-xs mt-2 font-medium ${
                i <= currentStep
                  ? isLight
                    ? "text-slate-700"
                    : "text-slate-200"
                  : isLight
                  ? "text-slate-400"
                  : "text-slate-500"
              }`}
            >
              {label}
            </span>
          </div>
        </Fragment>
      ))}
    </div>
  );

  // ---- Step 0: Choose Source ----
  const renderStep0 = () => (
    <div className="max-w-[700px] w-full">
      <div className="text-center mb-8">
        <h1 className={`text-2xl font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
          Where are you migrating from?
        </h1>
        <p className="text-sm text-slate-400 mt-2">Select your current hosting provider</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-8">
        {SOURCE_CARDS.map((card) => (
          <button
            key={card.id}
            onClick={() => {
              setSelectedSource(card.id);
              setCurrentStep(1);
              setConnectionTested(false);
              setFormValues({});
            }}
            className={`relative rounded-2xl border p-6 cursor-pointer hover:scale-[1.02] transition-all text-left ${cardClass}`}
          >
            {card.badge && (
              <span
                className={`absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full text-white ${accent.button}`}
              >
                {card.badge}
              </span>
            )}
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                isLight ? "bg-slate-100" : "bg-white/5"
              }`}
            >
              <svg
                className={`w-6 h-6 ${isLight ? "text-slate-600" : "text-slate-300"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={card.iconPath} />
              </svg>
            </div>
            <h3 className={`font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>{card.name}</h3>
            <p className="text-xs text-slate-400 mt-1">{card.description}</p>
          </button>
        ))}
      </div>
    </div>
  );

  // ---- Step 1: Connection Details ----
  const renderStep1 = () => {
    const fields = CONNECTION_FIELDS[selectedSource!];
    return (
      <div className="max-w-[700px] w-full">
        <div className="text-center mb-8">
          <h1 className={`text-2xl font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
            Connect to {sourceName}
          </h1>
          <p className="text-sm text-slate-400 mt-2">Enter your connection credentials</p>
        </div>

        <div className={`rounded-2xl border p-6 space-y-5 ${cardClass}`}>
          {fields.map((field) => (
            <div key={field.name}>
              <label className={`block mb-1.5 ${labelClass}`}>{field.label}</label>
              {field.type === "textarea" ? (
                <textarea
                  className={`${inputClass} h-24 py-2 font-mono resize-none`}
                  placeholder={field.placeholder}
                  value={formValues[field.name] || ""}
                  onChange={(e) =>
                    setFormValues((prev) => ({ ...prev, [field.name]: e.target.value }))
                  }
                />
              ) : (
                <input
                  type={field.type}
                  className={inputClass}
                  placeholder={field.placeholder}
                  value={formValues[field.name] || ""}
                  onChange={(e) =>
                    setFormValues((prev) => ({ ...prev, [field.name]: e.target.value }))
                  }
                />
              )}
            </div>
          ))}

          <div className="flex items-center gap-3 pt-2">
            <button
              className={btnPrimary}
              onClick={handleTestConnection}
              disabled={testing}
            >
              {testing ? (
                <>
                  {spinner} Testing...
                </>
              ) : (
                "Test Connection"
              )}
            </button>

            {connectionTested && (
              <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Connection successful
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <button
            className={btnSecondary}
            onClick={() => {
              setCurrentStep(0);
              setConnectionTested(false);
            }}
          >
            Back
          </button>
          <button
            className={btnPrimary}
            disabled={!connectionTested}
            onClick={() => setCurrentStep(2)}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  // ---- Step 2: Select Sites ----
  const renderStep2 = () => {
    const allSelected = sites.length > 0 && sites.every((s) => s.selected);
    return (
      <div className="max-w-[700px] w-full">
        <div className="text-center mb-8">
          <h1 className={`text-2xl font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
            Found {sites.length} sites
          </h1>
          <p className="text-sm text-slate-400 mt-2">Select the sites you want to migrate</p>
        </div>

        <div className={`rounded-2xl border overflow-hidden ${cardClass}`}>
          {/* Header */}
          <div
            className={`flex items-center gap-4 px-5 py-3 text-xs font-medium border-b ${
              isLight ? "bg-slate-50 text-slate-500 border-slate-200" : "bg-white/[0.02] text-slate-400 border-[var(--border-tertiary)]"
            }`}
          >
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
              className="w-4 h-4 rounded accent-emerald-500"
            />
            <span className="flex-1">Site</span>
            <span className="w-44 truncate">URL</span>
            <span className="w-16 text-right">Size</span>
            <span className="w-20 text-right">WP Version</span>
          </div>

          {/* Rows */}
          {sites.map((site) => (
            <div
              key={site.id}
              className={`flex items-center gap-4 px-5 py-3 border-b last:border-b-0 transition-colors ${
                isLight
                  ? "border-slate-100 hover:bg-slate-50"
                  : "border-[var(--border-tertiary)]/50 hover:bg-white/[0.02]"
              }`}
            >
              <input
                type="checkbox"
                checked={site.selected}
                onChange={() => toggleSite(site.id)}
                className="w-4 h-4 rounded accent-emerald-500"
              />
              <span className={`flex-1 font-semibold text-sm ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                {site.name}
              </span>
              <span className="w-44 font-mono text-xs text-slate-400 truncate">{site.url}</span>
              <span className={`w-16 text-right text-sm ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                {site.size}
              </span>
              <span className="w-20 text-right">
                <span
                  className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full ${
                    isLight ? "bg-slate-100 text-slate-600" : "bg-white/5 text-slate-400"
                  }`}
                >
                  {site.wpVersion}
                </span>
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-4">
            <button className={btnSecondary} onClick={() => setCurrentStep(1)}>
              Back
            </button>
            <span className="text-sm text-slate-400">
              {selectedCount} sites selected ({sites.length} total)
            </span>
          </div>
          <button
            className={btnPrimary}
            disabled={selectedCount === 0}
            onClick={handleStartMigration}
          >
            Start Migration
          </button>
        </div>
      </div>
    );
  };

  // ---- Step 3: Migration Progress ----
  const renderStep3 = () => {
    const entries = Object.entries(migrationProgress);
    const totalProgress = entries.length
      ? Math.round(entries.reduce((sum, [, v]) => sum + v.progress, 0) / entries.length)
      : 0;

    return (
      <div className="max-w-[700px] w-full">
        <div className="text-center mb-8">
          <h1 className={`text-2xl font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
            {migrationComplete ? "Migration Complete!" : "Migrating your sites..."}
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            {migrationComplete
              ? "Your sites have been successfully migrated to LimeWP"
              : "Please keep this page open while we transfer your sites"}
          </p>
        </div>

        {/* Overall progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${isLight ? "text-slate-600" : "text-slate-300"}`}>
              Overall Progress
            </span>
            <span className={`text-sm font-semibold ${isLight ? "text-slate-700" : "text-slate-200"}`}>
              {totalProgress}%
            </span>
          </div>
          <div
            className={`h-3 rounded-full overflow-hidden ${isLight ? "bg-slate-100" : "bg-white/5"}`}
          >
            <div
              className={`h-full rounded-full transition-all duration-500 ${accent.progress || "bg-emerald-500"}`}
              style={{ width: `${totalProgress}%` }}
            />
          </div>
        </div>

        {/* Per-site cards */}
        <div className="space-y-3">
          {entries.map(([id, data]) => {
            const site = sites.find((s) => s.id === id);
            if (!site) return null;
            const isFailed = data.status === "failed";
            return (
              <div
                key={id}
                className={`rounded-2xl border p-4 ${cardClass}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-semibold ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                    {site.name}
                  </span>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-medium ${
                        isFailed ? "text-rose-400" : data.status === "complete" ? "text-emerald-400" : "text-slate-400"
                      }`}
                    >
                      {MIGRATION_STATUS_LABELS[data.status]}
                    </span>
                    <span className={`text-sm font-semibold ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                      {data.progress}%
                    </span>
                  </div>
                </div>
                <div
                  className={`h-2 rounded-full overflow-hidden ${isLight ? "bg-slate-100" : "bg-white/5"}`}
                >
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isFailed ? "bg-rose-500" : accent.progress || "bg-emerald-500"
                    }`}
                    style={{ width: `${data.progress}%` }}
                  />
                </div>
                {isFailed && (
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-rose-400">
                      Migration failed. Please retry or contact support.
                    </span>
                    <button
                      className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
                      onClick={() => handleRetry(id)}
                    >
                      Retry
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Completion card */}
        {migrationComplete && (
          <div className={`rounded-2xl border p-8 mt-6 text-center ${cardClass}`}>
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h2 className={`text-xl font-bold mb-2 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              Migration Complete!
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              Your sites are now live on LimeWP. You can manage them from the dashboard.
            </p>
            <button className={btnPrimary + " mx-auto"} onClick={() => router.push(ROUTES.DASHBOARD)}>
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors ${
        isLight ? "bg-white" : "bg-[var(--bg-primary)]"
      }`}
    >
      {/* Top bar */}
      <div className="px-6 py-4 flex items-center justify-between">
        <Image
          src="/limewp-logo.svg"
          alt="LimeWP"
          width={100}
          height={28}
          className={isLight ? "brightness-0" : ""}
        />
        <button
          onClick={() => router.push(ROUTES.DASHBOARD)}
          className="text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
        >
          &larr; Back to dashboard
        </button>
      </div>

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col items-center px-4 py-8 transition-all duration-500 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
      >
        {renderProgressBar()}

        {currentStep === 0 && renderStep0()}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>
    </div>
  );
}
