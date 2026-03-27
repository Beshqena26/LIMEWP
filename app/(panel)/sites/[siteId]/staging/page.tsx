"use client";

import { useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AppShell from "@/app/components/AppShell";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { showToast } from "@/lib/toast";
import { ConfirmDialog } from "@/app/components/ui/ConfirmDialog";
import { Toggle } from "@/app/components/ui/Toggle";

/* ─── Types ─── */
interface EnvRow { label: string; live: string; staging: string; differs: boolean }
interface SyncEntry { id: string; action: "push" | "pull"; date: string; components: string[]; status: "success" | "failed" }
interface Step { label: string; detail: string; done: boolean; active: boolean }

/* ─── Data ─── */
const STG = {
  url: "https://staging.flavor-theme.com", wpAdmin: "https://staging.flavor-theme.com/wp-admin",
  size: "1.8 GB", syncStatus: "out-of-date" as "in-sync" | "out-of-date", lastSynced: "2h ago",
  user: "admin_staging", pass: "wp_stg_K9mX2pR7vL",
};
const ENV_ROWS: EnvRow[] = [
  { label: "WordPress Version", live: "6.7.1", staging: "6.7.1", differs: false },
  { label: "PHP Version", live: "8.3.6", staging: "8.2.12", differs: true },
  { label: "Last Modified", live: "2026-03-22", staging: "2026-03-15", differs: true },
  { label: "Active Plugins", live: "12", staging: "10", differs: true },
  { label: "Theme", live: "Flavor Theme 3.2", staging: "Flavor Theme 3.2", differs: false },
  { label: "Database Size", live: "245 MB", staging: "238 MB", differs: true },
];
const HISTORY: SyncEntry[] = [
  { id: "1", action: "push", date: "2h ago", components: ["Files", "Database"], status: "success" },
  { id: "2", action: "pull", date: "5d ago", components: ["Database"], status: "success" },
  { id: "3", action: "push", date: "10d ago", components: ["Files", "Database", "Media"], status: "failed" },
];
const CREATE_STEPS = [
  { label: "Cloning files", detail: "2,847 files" }, { label: "Copying database", detail: "23 tables" },
  { label: "Configuring environment", detail: "URLs & paths" }, { label: "Disabling emails & indexing", detail: "Safety" },
  { label: "Done!", detail: "Ready" },
];
const SYNC_STEPS = [
  { label: "Creating backup" }, { label: "Transferring files", progress: "342/2,847" },
  { label: "Importing database", progress: "15/23 tables" }, { label: "Updating URLs" },
  { label: "Flushing caches" }, { label: "Complete!" },
];

/* ─── Icons ─── */
const P = { // path data
  branch: "M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z",
  plus: "M12 4.5v15m7.5-7.5h-15",
  up: "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5",
  down: "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12M12 16.5V3",
  trash: "M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0",
  ext: "M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25",
  clip: "M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184",
  ok: "M4.5 12.75l6 6 9-13.5",
  eye: "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z",
  eyeC: "M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  eyeX: "M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88",
  back: "M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18",
  chev: "M19.5 8.25l-7.5 7.5-7.5-7.5",
};

function Ic({ d, c = "w-5 h-5" }: { d: string; c?: string }) {
  return <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={d} /></svg>;
}
function Ic2({ d1, d2, c = "w-5 h-5" }: { d1: string; d2: string; c?: string }) {
  return <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={d1} /><path strokeLinecap="round" strokeLinejoin="round" d={d2} /></svg>;
}
function Spin({ c = "w-4 h-4" }: { c?: string }) {
  return <svg className={`animate-spin ${c}`} fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>;
}

/* ─── Step List (shared by create + sync) ─── */
function StepList({ steps, muted, isLight }: { steps: { label: string; detail?: string; progress?: string; done: boolean; active: boolean }[]; muted: string; isLight: boolean }) {
  return (
    <div className="space-y-2">
      {steps.map((s, i) => (
        <div key={i} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-500 ${
          s.done ? (isLight ? "bg-emerald-50" : "bg-emerald-500/10") : s.active ? (isLight ? "bg-slate-50" : "bg-[var(--bg-elevated)]") : "opacity-30"
        }`}>
          {s.done ? (
            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0"><Ic d={P.ok} c="w-3 h-3 text-white" /></div>
          ) : s.active ? (
            <Spin c="w-5 h-5 text-violet-500 flex-shrink-0" />
          ) : (
            <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${isLight ? "border-slate-200" : "border-slate-600"}`} />
          )}
          <span className={`text-sm flex-1 ${s.done ? "text-emerald-600" : s.active ? (isLight ? "text-slate-800" : "text-slate-100") : ""}`}>{s.label}</span>
          {s.detail && <span className={`text-xs flex-shrink-0 ${s.done ? "text-emerald-500" : muted}`}>{s.detail}</span>}
          {s.progress && s.active && <span className={`text-xs font-mono ${muted}`}>{s.progress}</span>}
        </div>
      ))}
    </div>
  );
}

/* ─── StagingTab ─── */
export function StagingTab({ siteId }: { siteId: string }) {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);
  const muted = isLight ? "text-slate-400" : "text-slate-500";
  const card = `rounded-2xl border ${isLight ? "bg-white border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"}`;
  const secBtn = `h-9 px-4 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-white/5 text-slate-300 hover:bg-white/10"}`;
  const divider = isLight ? "divide-slate-100" : "divide-white/[0.04]";

  const [hasStaging, setHasStaging] = useState(false);
  const [creating, setCreating] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [cloneFiles, setCloneFiles] = useState(true);
  const [cloneDb, setCloneDb] = useState(true);
  const [cloneMedia, setCloneMedia] = useState(false);
  const [stagingSlug, setStagingSlug] = useState("staging");
  const [urlMode, setUrlMode] = useState<"subdomain" | "custom">("subdomain");
  const [customDomain, setCustomDomain] = useState("");
  const [createPwProtect, setCreatePwProtect] = useState(true);
  const [createNoEmail, setCreateNoEmail] = useState(true);
  const [pwProtect, setPwProtect] = useState(true);
  const [stgPw, setStgPw] = useState("stg_Abc123Xyz");
  const [showPw, setShowPw] = useState(false);
  const [noEmail, setNoEmail] = useState(true);
  const [noIndex, setNoIndex] = useState(true);
  const [autoExp, setAutoExp] = useState(false);
  const [sFiles, setSFiles] = useState(true);
  const [sDb, setSDb] = useState(true);
  const [sMedia, setSMedia] = useState(true);
  const [sPlug, setSPlug] = useState(false);
  const [sTheme, setSTheme] = useState(false);
  const [pushDlg, setPushDlg] = useState(false);
  const [pullDlg, setPullDlg] = useState(false);
  const [delDlg, setDelDlg] = useState(false);
  const [syncProg, setSyncProg] = useState(false);
  const [syncAct, setSyncAct] = useState<"push" | "pull">("push");
  const [syncSteps, setSyncSteps] = useState<{ label: string; progress?: string; done: boolean; active: boolean }[]>([]);
  const [menu, setMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const copyTimer = useRef<NodeJS.Timeout | null>(null);

  const copy = useCallback((txt: string, id: string) => {
    navigator.clipboard.writeText(txt);
    setCopied(id);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(null), 2000);
    showToast.success("Copied");
  }, []);

  const CopyBtn = ({ t, id }: { t: string; id: string }) => (
    <button onClick={() => copy(t, id)} className={`p-1 rounded-lg transition-colors ${copied === id ? "text-emerald-500" : isLight ? "text-slate-400 hover:text-slate-600" : "text-slate-500 hover:text-slate-300"}`}>
      <Ic d={copied === id ? P.ok : P.clip} c="w-3.5 h-3.5" />
    </button>
  );

  const EyeBtn = ({ show, toggle }: { show: boolean; toggle: () => void }) => (
    <button onClick={toggle} className={`p-0.5 ${muted}`}>
      {show ? <Ic d={P.eyeX} c="w-3.5 h-3.5" /> : <Ic2 d1={P.eye} d2={P.eyeC} c="w-3.5 h-3.5" />}
    </button>
  );

  const handleCreate = useCallback(async () => {
    setShowCreateModal(false);
    setCreating(true);
    // Apply creation settings to active staging state
    setPwProtect(createPwProtect);
    setNoEmail(createNoEmail);
    const s: Step[] = CREATE_STEPS.map((x) => ({ ...x, done: false, active: false }));
    setSteps(s);
    for (let i = 0; i < CREATE_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, 800));
      setSteps((p) => p.map((x, j) => ({ ...x, active: j === i, done: j < i || (j === i && i === CREATE_STEPS.length - 1) })));
    }
    await new Promise((r) => setTimeout(r, 600));
    setCreating(false); setHasStaging(true);
    showToast.success("Staging environment created");
  }, [createPwProtect, createNoEmail]);

  const runSync = useCallback(async (act: "push" | "pull") => {
    setSyncAct(act); setSyncProg(true);
    const s = SYNC_STEPS.map((x) => ({ ...x, done: false, active: false }));
    setSyncSteps(s);
    for (let i = 0; i < SYNC_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, 900));
      setSyncSteps((p) => p.map((x, j) => ({ ...x, active: j === i, done: j < i || (j === i && i === SYNC_STEPS.length - 1) })));
    }
    await new Promise((r) => setTimeout(r, 2000));
    setSyncProg(false);
    showToast.success(act === "push" ? "Pushed to live" : "Pulled from live");
  }, []);

  const onPush = useCallback(() => { setPushDlg(false); runSync("push"); }, [runSync]);
  const onPull = useCallback(() => { setPullDlg(false); runSync("pull"); }, [runSync]);
  const onDel = useCallback(() => { setDelDlg(false); setHasStaging(false); showToast.success("Staging deleted"); }, []);
  const noSync = !sFiles && !sDb && !sMedia && !sPlug && !sTheme;
  const badge = STG.syncStatus === "in-sync"
    ? { dot: "bg-emerald-400", txt: isLight ? "text-emerald-700" : "text-emerald-400", label: "In Sync" }
    : { dot: "bg-amber-400", txt: isLight ? "text-amber-700" : "text-amber-400", label: "Out of Date" };

  return (
    <>
      {/* STATE 1: Empty */}
      {!hasStaging && !creating && (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${isLight ? "bg-violet-50" : "bg-violet-500/10"}`}>
            <Ic d={P.branch} c="w-7 h-7 text-violet-500" />
          </div>
          <h2 className={`text-lg font-semibold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>No staging environment</h2>
          <p className={`text-sm mb-6 ${muted}`}>Create a copy of your live site to test changes safely</p>
          <button onClick={() => setShowCreateModal(true)} className={`h-10 px-6 rounded-xl text-white text-sm font-semibold transition-all flex items-center gap-2 ${accent.button} ${accent.buttonHover}`}>
            <Ic d={P.plus} c="w-4 h-4" /> Create Staging
          </button>
        </div>
      )}

      {/* STATE 2: Creating */}
      {creating && (
        <div className="flex flex-col items-center py-20 px-6">
          <Spin c="w-8 h-8 text-violet-500 mb-6" />
          <h2 className={`text-lg font-semibold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>Creating staging environment</h2>
          <p className={`text-sm mb-8 ${muted}`}>This usually takes a minute or two</p>
          <div className="w-full max-w-sm">
            <StepList steps={steps} muted={muted} isLight={isLight} />
          </div>
        </div>
      )}

      {/* STATE 3: Active */}
      {hasStaging && !creating && (
        <div className="space-y-6">
          {/* Header bar */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h1 className={`text-xl font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>Staging</h1>
              <div className="flex items-center gap-2">
                <a href={STG.url} target="_blank" rel="noopener noreferrer" className={secBtn}>
                  <Ic d={P.ext} c="w-4 h-4" /> Open Staging
                </a>
                <div className="relative">
                  <button onClick={() => setMenu(!menu)} className={`h-9 px-4 rounded-xl text-white text-sm font-semibold transition-all flex items-center gap-2 ${accent.button} ${accent.buttonHover}`}>
                    Push to Live <Ic d={P.chev} c="w-3.5 h-3.5" />
                  </button>
                  {menu && (<>
                    <div className="fixed inset-0 z-10" onClick={() => setMenu(false)} />
                    <div className={`absolute right-0 top-full mt-1 w-44 rounded-xl border py-1 z-20 ${isLight ? "bg-white border-slate-200 shadow-lg" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)] shadow-2xl"}`}>
                      <button onClick={() => { setMenu(false); setPushDlg(true); }} className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 ${isLight ? "hover:bg-slate-50 text-slate-700" : "hover:bg-white/5 text-slate-200"}`}>
                        <Ic d={P.up} c="w-4 h-4 text-sky-500" /> Push to Live
                      </button>
                      <button onClick={() => { setMenu(false); setPullDlg(true); }} className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 ${isLight ? "hover:bg-slate-50 text-slate-700" : "hover:bg-white/5 text-slate-200"}`}>
                        <Ic d={P.down} c="w-4 h-4 text-violet-500" /> Pull from Live
                      </button>
                      <div className={`my-1 border-t ${isLight ? "border-slate-100" : "border-[var(--border-tertiary)]"}`} />
                      <button onClick={() => { setMenu(false); setDelDlg(true); }} className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 ${isLight ? "hover:bg-rose-50 text-rose-600" : "hover:bg-rose-500/10 text-rose-400"}`}>
                        <Ic d={P.trash} c="w-4 h-4" /> Delete Staging
                      </button>
                    </div>
                  </>)}
                </div>
              </div>
            </div>
            <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 mt-2 text-sm ${muted}`}>
              <a href={STG.url} target="_blank" rel="noopener noreferrer" className={`hover:underline ${isLight ? "text-slate-600" : "text-slate-300"}`}>{STG.url.replace("https://", "")}</a>
              <span>·</span><span>{STG.size}</span><span>·</span><span>Synced {STG.lastSynced}</span><span>·</span>
              <span className={`inline-flex items-center gap-1.5 ${badge.txt}`}><span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />{badge.label}</span>
            </div>
          </div>

          {/* Comparison table */}
          <div className={`${card} overflow-hidden`}>
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isLight ? "border-slate-100" : "border-[var(--border-tertiary)]"}`}>
                  <th className={`text-left text-[11px] font-semibold uppercase tracking-wider px-5 py-3 ${muted}`}>Property</th>
                  <th className={`text-left text-[11px] font-semibold uppercase tracking-wider px-5 py-3 ${muted}`}><span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" />Live</span></th>
                  <th className={`text-left text-[11px] font-semibold uppercase tracking-wider px-5 py-3 ${muted}`}><span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sky-400" />Staging</span></th>
                  <th className={`text-center text-[11px] font-semibold uppercase tracking-wider px-5 py-3 w-20 ${muted}`}>Status</th>
                </tr>
              </thead>
              <tbody>
                {ENV_ROWS.map((r) => (
                  <tr key={r.label} className={`border-b last:border-b-0 ${isLight ? "border-slate-50" : "border-[var(--border-tertiary)]"}`}>
                    <td className={`px-5 py-3 text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>{r.label}</td>
                    <td className={`px-5 py-3 text-sm font-mono ${isLight ? "text-slate-600" : "text-slate-300"}`}>{r.live}</td>
                    <td className={`px-5 py-3 text-sm font-mono ${r.differs ? "text-amber-500 font-semibold" : isLight ? "text-slate-600" : "text-slate-300"}`}>{r.staging}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        r.differs ? (isLight ? "bg-amber-50 text-amber-700" : "bg-amber-500/10 text-amber-400") : (isLight ? "bg-emerald-50 text-emerald-700" : "bg-emerald-500/10 text-emerald-400")
                      }`}>{r.differs ? "differs" : "match"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sync & Settings */}
          <div className={`${card} divide-y lg:divide-y-0 lg:divide-x ${divider}`}>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-5">
                <h3 className={`text-sm font-semibold mb-3 ${isLight ? "text-slate-800" : "text-slate-100"}`}>Sync Options</h3>
                <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
                  {([["Files", sFiles, setSFiles], ["Database", sDb, setSDb], ["Media", sMedia, setSMedia], ["Plugins", sPlug, setSPlug], ["Themes", sTheme, setSTheme]] as [string, boolean, (v: boolean) => void][]).map(([l, v, set]) => (
                    <label key={l} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={v} onChange={(e) => set(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500/20" />
                      <span className={`text-sm ${isLight ? "text-slate-700" : "text-slate-200"}`}>{l}</span>
                    </label>
                  ))}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <button onClick={() => setPushDlg(true)} disabled={noSync} className="h-8 px-3.5 rounded-lg text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 transition-colors disabled:opacity-50 flex items-center gap-1.5">
                    <Ic d={P.up} c="w-3.5 h-3.5" /> Push to Live
                  </button>
                  <button onClick={() => setPullDlg(true)} disabled={noSync} className="h-8 px-3.5 rounded-lg text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 transition-colors disabled:opacity-50 flex items-center gap-1.5">
                    <Ic d={P.down} c="w-3.5 h-3.5" /> Pull from Live
                  </button>
                </div>
                <p className={`text-xs ${muted}`}>Syncing overwrites the destination. A backup is created automatically.</p>
              </div>
              <div className="p-5">
                <h3 className={`text-sm font-semibold mb-3 ${isLight ? "text-slate-800" : "text-slate-100"}`}>Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className={`text-sm ${isLight ? "text-slate-700" : "text-slate-200"}`}>Password</span>
                      {pwProtect && <span className={`text-xs font-mono truncate ${muted}`}>{showPw ? stgPw : "••••••••"}</span>}
                      {pwProtect && <EyeBtn show={showPw} toggle={() => setShowPw(!showPw)} />}
                    </div>
                    <Toggle enabled={pwProtect} onChange={setPwProtect} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isLight ? "text-slate-700" : "text-slate-200"}`}>Disable Emails</span>
                    <Toggle enabled={noEmail} onChange={setNoEmail} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isLight ? "text-slate-700" : "text-slate-200"}`}>Block Indexing</span>
                    <Toggle enabled={noIndex} onChange={setNoIndex} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isLight ? "text-slate-700" : "text-slate-200"}`}>Auto-expire (30d)</span>
                    <Toggle enabled={autoExp} onChange={setAutoExp} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Access & History */}
          <div className={`${card} divide-y lg:divide-y-0 lg:divide-x ${divider}`}>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-5">
                <h3 className={`text-sm font-semibold mb-3 ${isLight ? "text-slate-800" : "text-slate-100"}`}>Quick Access</h3>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${muted}`}>Staging URL</span>
                    <div className="flex items-center gap-1">
                      <span className={`text-xs font-mono ${isLight ? "text-slate-600" : "text-slate-300"}`}>{STG.url.replace("https://", "")}</span>
                      <CopyBtn t={STG.url} id="url" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${muted}`}>WP Admin</span>
                    <a href={STG.wpAdmin} target="_blank" rel="noopener noreferrer" className={`text-xs font-medium flex items-center gap-1 ${isLight ? "text-sky-700 hover:text-sky-600" : "text-sky-400 hover:text-sky-300"}`}>
                      Open <Ic d={P.ext} c="w-3 h-3" />
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${muted}`}>Login</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-mono ${isLight ? "text-slate-600" : "text-slate-300"}`}>{STG.user}</span>
                      <span className={`text-xs ${muted}`}>/</span>
                      <span className={`text-xs font-mono ${isLight ? "text-slate-600" : "text-slate-300"}`}>{showLogin ? STG.pass : "••••••••"}</span>
                      <EyeBtn show={showLogin} toggle={() => setShowLogin(!showLogin)} />
                      <CopyBtn t={`${STG.user} / ${STG.pass}`} id="login" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h3 className={`text-sm font-semibold mb-3 ${isLight ? "text-slate-800" : "text-slate-100"}`}>Recent Syncs</h3>
                <div className="space-y-2">
                  {HISTORY.map((e) => (
                    <div key={e.id} className="flex items-center gap-2 text-sm">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${e.action === "push" ? "bg-sky-400" : "bg-violet-400"}`} />
                      <span className={`font-medium capitalize ${isLight ? "text-slate-700" : "text-slate-200"}`}>{e.action}</span>
                      <span className={muted}>·</span><span className={muted}>{e.date}</span>
                      <span className={muted}>·</span><span className={muted}>{e.components.join(", ")}</span>
                      <span className={muted}>·</span>
                      <span className={e.status === "success" ? "text-emerald-500" : "text-rose-500"}>{e.status === "success" ? "OK" : "Failed"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sync Progress Modal */}
      {syncProg && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className={`relative w-full max-w-md rounded-2xl p-6 animate-in fade-in zoom-in-95 duration-200 ${isLight ? "bg-white border border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border border-[var(--border-tertiary)]"}`}>
            <h3 className={`text-lg font-semibold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>{syncAct === "push" ? "Pushing to Live" : "Pulling from Live"}</h3>
            <p className={`text-sm mb-5 ${muted}`}>Do not close this window</p>
            <StepList steps={syncSteps} muted={muted} isLight={isLight} />
          </div>
        </div>
      )}

      {/* Confirm Dialogs */}
      {/* Create Staging Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className={`relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${isLight ? "bg-white" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border border-[var(--border-tertiary)]"}`}>
            <div className="p-6">
              <h3 className={`text-lg font-bold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>Create Staging</h3>
              <p className={`text-sm mb-6 ${muted}`}>Configure what to clone from your live site</p>

              {/* What to clone */}
              <div className="mb-5">
                <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${muted}`}>Clone</p>
                <div className="space-y-2.5">
                  <label className={`flex items-center gap-3 cursor-pointer group`}>
                    <input type="checkbox" checked={cloneFiles} onChange={(e) => setCloneFiles(e.target.checked)} className="w-4 h-4 rounded accent-emerald-500" />
                    <div>
                      <span className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>Files</span>
                      <span className={`text-xs ml-2 ${muted}`}>themes, plugins, wp-content</span>
                    </div>
                  </label>
                  <label className={`flex items-center gap-3 cursor-pointer group`}>
                    <input type="checkbox" checked={cloneDb} onChange={(e) => setCloneDb(e.target.checked)} className="w-4 h-4 rounded accent-emerald-500" />
                    <div>
                      <span className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>Database</span>
                      <span className={`text-xs ml-2 ${muted}`}>posts, pages, settings</span>
                    </div>
                  </label>
                  <label className={`flex items-center gap-3 cursor-pointer group`}>
                    <input type="checkbox" checked={cloneMedia} onChange={(e) => setCloneMedia(e.target.checked)} className="w-4 h-4 rounded accent-emerald-500" />
                    <div>
                      <span className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>Media uploads</span>
                      <span className={`text-xs ml-2 ${muted}`}>images, videos (can be large)</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Staging URL */}
              <div className="mb-5">
                <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${muted}`}>Staging URL</p>
                <div className={`flex rounded-xl p-1 mb-3 ${isLight ? "bg-slate-100" : "bg-white/[0.04]"}`}>
                  <button
                    onClick={() => setUrlMode("subdomain")}
                    className={`flex-1 h-8 rounded-lg text-xs font-medium transition-all ${
                      urlMode === "subdomain"
                        ? isLight ? "bg-white text-slate-800 shadow-sm" : "bg-[var(--bg-elevated)] text-slate-100 shadow-sm"
                        : isLight ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    LimeWP Subdomain
                  </button>
                  <button
                    onClick={() => setUrlMode("custom")}
                    className={`flex-1 h-8 rounded-lg text-xs font-medium transition-all ${
                      urlMode === "custom"
                        ? isLight ? "bg-white text-slate-800 shadow-sm" : "bg-[var(--bg-elevated)] text-slate-100 shadow-sm"
                        : isLight ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    Custom Domain
                  </button>
                </div>
                {urlMode === "subdomain" ? (
                  <div className={`flex items-center rounded-xl border overflow-hidden ${isLight ? "bg-slate-50 border-slate-200" : "bg-[var(--bg-elevated)] border-[var(--border-tertiary)]"}`}>
                    <input
                      type="text"
                      value={stagingSlug}
                      onChange={(e) => setStagingSlug(e.target.value.replace(/[^a-z0-9-]/g, ""))}
                      placeholder="staging"
                      className={`flex-1 h-10 px-3 text-sm font-mono outline-none bg-transparent ${isLight ? "text-slate-800 placeholder:text-slate-500" : "text-slate-200 placeholder:text-slate-500"}`}
                    />
                    <span className={`px-3 text-xs font-medium border-l whitespace-nowrap ${isLight ? "text-slate-400 border-slate-200 bg-slate-100" : "text-slate-500 border-[var(--border-tertiary)] bg-white/[0.02]"}`}>.limewp.com</span>
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                      placeholder="staging.yourdomain.com"
                      className={`w-full h-10 px-3 rounded-xl border text-sm font-mono outline-none transition-colors ${isLight ? "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-500 focus:border-slate-300" : "bg-[var(--bg-elevated)] border-[var(--border-tertiary)] text-slate-200 placeholder:text-slate-500 focus:border-[var(--border-primary)]"}`}
                    />
                    <p className={`text-[11px] mt-1.5 ${muted}`}>Point your domain&apos;s DNS to our servers after creation</p>
                  </div>
                )}
              </div>

              {/* Quick settings */}
              <div className="mb-6">
                <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${muted}`}>Settings</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isLight ? "text-slate-700" : "text-slate-200"}`}>Password protect</span>
                    <Toggle enabled={createPwProtect} onChange={setCreatePwProtect} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isLight ? "text-slate-700" : "text-slate-200"}`}>Disable emails</span>
                    <Toggle enabled={createNoEmail} onChange={setCreateNoEmail} />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowCreateModal(false)} className={`h-10 px-4 rounded-xl text-sm font-medium transition-colors ${isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}>
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!cloneFiles && !cloneDb}
                  className={`h-10 px-5 rounded-xl text-white text-sm font-semibold transition-all flex items-center gap-2 disabled:opacity-50 ${accent.button} ${accent.buttonHover}`}
                >
                  Create Staging
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={pushDlg} onClose={() => setPushDlg(false)} onConfirm={onPush} title="Push to Live?" message="Selected components on your live site will be overwritten with the staging version. A backup is created automatically." confirmText="Push to Live" variant="warning" />
      <ConfirmDialog open={pullDlg} onClose={() => setPullDlg(false)} onConfirm={onPull} title="Pull from Live?" message="Selected staging components will be overwritten with live data. Uncommitted staging changes will be lost." confirmText="Pull from Live" variant="warning" />
      <ConfirmDialog open={delDlg} onClose={() => setDelDlg(false)} onConfirm={onDel} title="Delete Staging?" message="This permanently deletes the staging environment and all its data. This cannot be undone." confirmText="Delete Staging" variant="danger" requireTypedConfirmation="DELETE" />
    </>
  );
}

/* ─── Page Wrapper ─── */
export default function StagingPage() {
  const params = useParams();
  const siteId = params.siteId as string;
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  return (
    <AppShell>
      <Link href={`/site?name=${encodeURIComponent(siteId)}`} className={`inline-flex items-center gap-1.5 text-sm font-medium mb-4 transition-colors ${isLight ? "text-slate-500 hover:text-slate-700" : "text-slate-400 hover:text-slate-200"}`}>
        <Ic d={P.back} c="w-4 h-4" /> Back to {decodeURIComponent(siteId)}
      </Link>
      <StagingTab siteId={siteId} />
    </AppShell>
  );
}
