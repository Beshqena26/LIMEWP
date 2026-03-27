"use client";

import { useState } from "react";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { showToast } from "@/lib/toast";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { Toggle } from "../ui/Toggle";
import { NoApiKeys } from "../empty-states";

/* ─── Types ─── */
type Permission = "read" | "read_write" | "full";

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  suffix: string;
  created: string;
  type: "live" | "test";
  permission: Permission;
}

interface Webhook {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  lastTriggered: string;
}

/* ─── Mock data ─── */
const INITIAL_API_KEYS: ApiKey[] = [
  { id: "k1", name: "Production Key", prefix: "lwp_sk_", suffix: "mN4o", created: "Jan 15, 2026", type: "live", permission: "full" },
  { id: "k2", name: "Test Key", prefix: "lwp_sk_test_", suffix: "xY9z", created: "Jan 10, 2026", type: "test", permission: "read" },
];

const INITIAL_WEBHOOKS: Webhook[] = [
  { id: "wh1", url: "https://example.com/webhook", events: ["site.created", "backup.completed"], active: true, lastTriggered: "2 hours ago" },
  { id: "wh2", url: "https://slack.com/api/hooks/abc123", events: ["site.down"], active: true, lastTriggered: "Never" },
];

const PERMISSION_LABELS: Record<Permission, string> = { read: "Read Only", read_write: "Read & Write", full: "Full Access" };
const PERMISSION_COLORS: Record<Permission, { bg: string; text: string }> = {
  full: { bg: "bg-violet-500/10", text: "text-violet-400" },
  read_write: { bg: "bg-sky-500/10", text: "text-sky-400" },
  read: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
};

const ALL_EVENTS = ["site.created", "site.deleted", "site.down", "backup.completed", "backup.failed", "deploy.started", "deploy.finished"];

/* ─── Helpers ─── */
function generateKeyId() {
  return "k" + Math.random().toString(36).slice(2, 9);
}
function generateFullKey(prefix: string) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = prefix;
  for (let i = 0; i < 32; i++) key += chars[Math.floor(Math.random() * chars.length)];
  return key;
}

/* ─── Root ─── */
export function ApiKeysTab() {
  const [keys, setKeys] = useState<ApiKey[]>(INITIAL_API_KEYS);
  const [webhooks, setWebhooks] = useState<Webhook[]>(INITIAL_WEBHOOKS);

  return (
    <div className="space-y-6">
      <ApiKeysCard keys={keys} setKeys={setKeys} />
      <WebhooksCard webhooks={webhooks} setWebhooks={setWebhooks} />
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════
   API KEYS CARD
   ═════════════════════════════════════════════════════════════════════ */
function ApiKeysCard({ keys, setKeys }: { keys: ApiKey[]; setKeys: React.Dispatch<React.SetStateAction<ApiKey[]>> }) {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<ApiKey | null>(null);

  const cardClass = `relative rounded-2xl border overflow-hidden ${isLight ? "bg-white border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"}`;

  const handleCreate = (key: ApiKey) => {
    setKeys((prev) => [key, ...prev]);
  };

  const handleRevoke = () => {
    if (!revokeTarget) return;
    setKeys((prev) => prev.filter((k) => k.id !== revokeTarget.id));
    showToast.success(`API key "${revokeTarget.name}" revoked`);
    setRevokeTarget(null);
  };

  const handleCopy = (key: ApiKey) => {
    const masked = `${key.prefix}••••••••${key.suffix}`;
    navigator.clipboard.writeText(masked);
    showToast.success("Key copied to clipboard");
  };

  return (
    <>
      <div className={cardClass}>
        <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl ${accent.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3`} />

        <div className="relative p-6">
          {/* ── Header ── */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${accent.bg} ${accent.text} ring-1 ${accent.ring} flex items-center justify-center`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                </svg>
              </div>
              <div>
                <h3 className={`text-base font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>API Keys</h3>
                <p className="text-xs text-slate-500">Manage your API access</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className={`bg-gradient-to-r ${accent.gradient} text-white font-semibold text-sm rounded-xl h-9 px-4 shadow-lg ${accent.buttonShadow} flex items-center gap-2 transition-opacity hover:opacity-90`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              New Key
            </button>
          </div>

          {/* ── Usage Stats ── */}
          <UsageStats activeKeys={keys.length} isLight={isLight} accent={accent} />

          {/* ── Key List ── */}
          {keys.length === 0 ? (
            <NoApiKeys onAction={() => setShowCreateModal(true)} />
          ) : (
            <div className="space-y-4">
              {keys.map((key) => (
                <KeyRow key={key.id} apiKey={key} isLight={isLight} onRevoke={() => setRevokeTarget(key)} onCopy={() => handleCopy(key)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Create Modal ── */}
      {showCreateModal && (
        <CreateKeyModal isLight={isLight} accent={accent} onClose={() => setShowCreateModal(false)} onCreate={handleCreate} />
      )}

      {/* ── Revoke Confirm ── */}
      <ConfirmDialog
        open={!!revokeTarget}
        onClose={() => setRevokeTarget(null)}
        onConfirm={handleRevoke}
        title="Revoke API Key"
        message={`Are you sure you want to revoke "${revokeTarget?.name}"? Any applications using this key will immediately lose access.`}
        confirmText="Revoke Key"
        variant="danger"
      />
    </>
  );
}

/* ── Usage Stats Strip ── */
function UsageStats({ activeKeys, isLight, accent }: { activeKeys: number; isLight: boolean; accent: ReturnType<typeof getColorClasses> }) {
  const stats = [
    { label: "Total Requests (30d)", value: "12,847" },
    { label: "Rate Limit", value: "60 req/min" },
    { label: "Active Keys", value: String(activeKeys) },
  ];

  return (
    <div className={`grid grid-cols-3 gap-3 mb-6`}>
      {stats.map((s) => (
        <div
          key={s.label}
          className={`px-4 py-3 rounded-xl text-center ${
            isLight ? "bg-slate-50 border border-slate-100" : "bg-[var(--bg-elevated)]/50 border border-[var(--border-tertiary)]"
          }`}
        >
          <p className={`text-lg font-bold ${accent.text}`}>{s.value}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

/* ── Key Row ── */
function KeyRow({ apiKey, isLight, onRevoke, onCopy }: { apiKey: ApiKey; isLight: boolean; onRevoke: () => void; onCopy: () => void }) {
  const perm = PERMISSION_COLORS[apiKey.permission];
  return (
    <div className={`p-4 rounded-xl ${isLight ? "bg-slate-50" : "bg-[var(--bg-elevated)]/50"}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${apiKey.type === "live" ? "bg-emerald-500/10" : "bg-amber-500/10"}`}>
            <svg className={`w-4 h-4 ${apiKey.type === "live" ? "text-emerald-400" : "text-amber-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>{apiKey.name}</p>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${perm.bg} ${perm.text}`}>
                {PERMISSION_LABELS[apiKey.permission]}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Created {apiKey.created}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Copy */}
          <button
            onClick={onCopy}
            className={`font-medium text-xs rounded-lg h-8 px-3 flex items-center gap-1.5 transition-colors ${
              isLight ? "bg-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-300" : "bg-[var(--border-primary)] text-slate-400 hover:text-slate-200"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
            </svg>
            Copy
          </button>
          {/* Revoke */}
          <button
            onClick={onRevoke}
            className="font-medium text-xs rounded-lg h-8 px-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
          >
            Revoke
          </button>
        </div>
      </div>
      <div className={`font-mono text-sm px-4 py-2.5 rounded-lg border ${
        isLight ? "bg-slate-100 text-slate-600 border-slate-200" : "bg-[var(--bg-secondary)] text-slate-400 border-[var(--border-tertiary)]"
      }`}>
        {apiKey.prefix}••••••••••••••••{apiKey.suffix}
      </div>
    </div>
  );
}

/* ── Create Key Modal ── */
function CreateKeyModal({
  isLight,
  accent,
  onClose,
  onCreate,
}: {
  isLight: boolean;
  accent: ReturnType<typeof getColorClasses>;
  onClose: () => void;
  onCreate: (key: ApiKey) => void;
}) {
  const [name, setName] = useState("");
  const [permission, setPermission] = useState<Permission>("read");
  const [createdKey, setCreatedKey] = useState<{ full: string; apiKey: ApiKey } | null>(null);
  const [copied, setCopied] = useState(false);

  const inputClass = `w-full h-10 px-3.5 rounded-xl border text-sm transition-all outline-none ${
    isLight ? "bg-white border-slate-300 text-slate-800 focus:border-slate-400" : "bg-[var(--bg-elevated)] border-[var(--border-primary)] text-slate-200 focus:border-[var(--border-secondary)]"
  }`;

  const handleCreate = () => {
    if (!name.trim()) return;
    const prefix = "lwp_sk_";
    const fullKey = generateFullKey(prefix);
    const suffix = fullKey.slice(-4);
    const now = new Date();
    const created = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const newKey: ApiKey = {
      id: generateKeyId(),
      name: name.trim(),
      prefix,
      suffix,
      created,
      type: "live",
      permission,
    };
    setCreatedKey({ full: fullKey, apiKey: newKey });
    onCreate(newKey);
  };

  const handleCopyFull = () => {
    if (!createdKey) return;
    navigator.clipboard.writeText(createdKey.full);
    setCopied(true);
    showToast.success("API key copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    onClose();
  };

  const permissions: Permission[] = ["read", "read_write", "full"];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} aria-hidden="true" />

      {/* Modal */}
      <div
        className={`relative w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200 ${
          isLight ? "bg-white border border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border border-[var(--border-tertiary)]"
        }`}
      >
        {!createdKey ? (
          <>
            {/* Create form */}
            <h3 className={`text-lg font-semibold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>Create API Key</h3>
            <p className={`text-sm mb-5 ${isLight ? "text-slate-500" : "text-slate-400"}`}>Generate a new key to access the LimeWP API.</p>

            {/* Name */}
            <label className="block text-[11px] uppercase tracking-wider text-slate-500 font-medium mb-2">Key Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Production, CI/CD Pipeline"
              className={inputClass}
              autoFocus
            />

            {/* Permissions */}
            <label className="block text-[11px] uppercase tracking-wider text-slate-500 font-medium mb-2 mt-5">Permissions</label>
            <div className="flex gap-2">
              {permissions.map((p) => {
                const selected = permission === p;
                const colors = PERMISSION_COLORS[p];
                return (
                  <button
                    key={p}
                    onClick={() => setPermission(p)}
                    className={`text-xs font-semibold px-3.5 py-2 rounded-xl border transition-all ${
                      selected
                        ? `${colors.bg} ${colors.text} border-current`
                        : isLight
                        ? "bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300"
                        : "bg-[var(--bg-elevated)] text-slate-400 border-[var(--border-tertiary)] hover:border-[var(--border-primary)]"
                    }`}
                  >
                    {PERMISSION_LABELS[p]}
                  </button>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={handleClose}
                className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${
                  isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!name.trim()}
                className={`h-10 px-5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r ${accent.gradient} text-white shadow-lg ${accent.buttonShadow}`}
              >
                Create Key
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Key reveal screen */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>Key Created</h3>
                <p className="text-xs text-slate-500">{createdKey.apiKey.name}</p>
              </div>
            </div>

            {/* Warning */}
            <div className={`flex items-start gap-3 px-4 py-3 rounded-xl mb-4 ${isLight ? "bg-amber-50 border border-amber-200" : "bg-amber-500/10 border border-amber-500/20"}`}>
              <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <p className={`text-sm ${isLight ? "text-amber-800" : "text-amber-300"}`}>
                Save this key now, you won&apos;t see it again.
              </p>
            </div>

            {/* Full key display */}
            <div className={`relative font-mono text-sm px-4 py-3 rounded-xl border break-all ${
              isLight ? "bg-slate-100 text-slate-700 border-slate-200" : "bg-[var(--bg-secondary)] text-slate-300 border-[var(--border-tertiary)]"
            }`}>
              {createdKey.full}
            </div>

            {/* Copy + Done */}
            <div className="flex gap-3 justify-end mt-5">
              <button
                onClick={handleCopyFull}
                className={`h-10 px-5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
                  copied
                    ? "bg-emerald-500/10 text-emerald-400"
                    : `bg-gradient-to-r ${accent.gradient} text-white shadow-lg ${accent.buttonShadow}`
                }`}
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                    </svg>
                    Copy Key
                  </>
                )}
              </button>
              <button
                onClick={handleClose}
                className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${
                  isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
                }`}
              >
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════
   WEBHOOKS CARD
   ═════════════════════════════════════════════════════════════════════ */
function WebhooksCard({ webhooks, setWebhooks }: { webhooks: Webhook[]; setWebhooks: React.Dispatch<React.SetStateAction<Webhook[]>> }) {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Webhook | null>(null);

  const cardClass = `relative rounded-2xl border overflow-hidden ${isLight ? "bg-white border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"}`;
  const inputClass = `w-full h-10 px-3.5 rounded-xl border text-sm transition-all outline-none ${
    isLight ? "bg-white border-slate-300 text-slate-800 focus:border-slate-400" : "bg-[var(--bg-elevated)] border-[var(--border-primary)] text-slate-200 focus:border-[var(--border-secondary)]"
  }`;

  const handleToggleWebhook = (id: string) => {
    setWebhooks((prev) =>
      prev.map((wh) => (wh.id === id ? { ...wh, active: !wh.active } : wh))
    );
  };

  const handleToggleEvent = (event: string) => {
    setSelectedEvents((prev) => (prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]));
  };

  const handleAddWebhook = () => {
    if (!newUrl.trim() || selectedEvents.length === 0) return;
    const newWh: Webhook = {
      id: "wh" + Math.random().toString(36).slice(2, 7),
      url: newUrl.trim(),
      events: [...selectedEvents],
      active: true,
      lastTriggered: "Never",
    };
    setWebhooks((prev) => [...prev, newWh]);
    setNewUrl("");
    setSelectedEvents([]);
    setShowAddForm(false);
    showToast.success("Webhook endpoint added");
  };

  const handleDeleteWebhook = () => {
    if (!deleteTarget) return;
    setWebhooks((prev) => prev.filter((wh) => wh.id !== deleteTarget.id));
    showToast.success("Webhook deleted");
    setDeleteTarget(null);
  };

  return (
    <>
      <div className={cardClass}>
        <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${accent.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3`} />

        <div className="relative p-6">
          {/* ── Header ── */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${accent.bg} ${accent.text} ring-1 ${accent.ring} flex items-center justify-center`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                </svg>
              </div>
              <div>
                <h3 className={`text-base font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>Webhooks</h3>
                <p className="text-xs text-slate-500">Receive event notifications</p>
              </div>
            </div>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className={`bg-gradient-to-r ${accent.gradient} text-white font-semibold text-sm rounded-xl h-9 px-4 shadow-lg ${accent.buttonShadow} flex items-center gap-2 transition-opacity hover:opacity-90`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add Webhook
              </button>
            )}
          </div>

          {/* ── Webhook List ── */}
          {webhooks.length > 0 && (
            <div className="space-y-3 mb-6">
              {webhooks.map((wh) => (
                <div
                  key={wh.id}
                  className={`p-4 rounded-xl ${isLight ? "bg-slate-50" : "bg-[var(--bg-elevated)]/50"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-mono truncate ${isLight ? "text-slate-700" : "text-slate-200"}`}>{wh.url}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {wh.events.map((ev) => (
                          <span
                            key={ev}
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                              isLight ? "bg-slate-200 text-slate-600" : "bg-[var(--border-primary)] text-slate-400"
                            }`}
                          >
                            {ev}
                          </span>
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-2">Last triggered: {wh.lastTriggered}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Toggle enabled={wh.active} onChange={() => handleToggleWebhook(wh.id)} />
                      <button
                        onClick={() => setDeleteTarget(wh)}
                        className="text-slate-400 hover:text-red-400 transition-colors p-1"
                        aria-label="Delete webhook"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Add Webhook Form ── */}
          {showAddForm && (
            <div className={`p-4 rounded-xl border ${isLight ? "bg-slate-50 border-slate-200" : "bg-[var(--bg-elevated)]/50 border-[var(--border-tertiary)]"}`}>
              <label className="block text-[11px] uppercase tracking-wider text-slate-500 font-medium mb-2">Endpoint URL</label>
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://your-domain.com/webhook"
                className={inputClass}
                autoFocus
              />

              <label className="block text-[11px] uppercase tracking-wider text-slate-500 font-medium mb-2 mt-4">Events</label>
              <div className="flex flex-wrap gap-2">
                {ALL_EVENTS.map((ev) => {
                  const selected = selectedEvents.includes(ev);
                  return (
                    <button
                      key={ev}
                      onClick={() => handleToggleEvent(ev)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                        selected
                          ? `${accent.bg} ${accent.text} border-current`
                          : isLight
                          ? "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                          : "bg-[var(--bg-secondary)] text-slate-400 border-[var(--border-tertiary)] hover:border-[var(--border-primary)]"
                      }`}
                    >
                      {ev}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={handleAddWebhook}
                  disabled={!newUrl.trim() || selectedEvents.length === 0}
                  className={`bg-gradient-to-r ${accent.gradient} text-white font-semibold text-sm rounded-xl h-10 px-5 shadow-lg ${accent.buttonShadow} disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
                >
                  Save Endpoint
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewUrl("");
                    setSelectedEvents([]);
                  }}
                  className={`font-medium text-sm rounded-xl h-10 px-5 transition-colors ${
                    isLight ? "bg-slate-100 text-slate-700 hover:text-slate-900" : "bg-[var(--bg-elevated)] text-slate-300 hover:text-white"
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Empty state when no webhooks and no form */}
          {webhooks.length === 0 && !showAddForm && (
            <p className={`text-sm text-center py-8 ${isLight ? "text-slate-400" : "text-slate-500"}`}>
              No webhook endpoints configured.
            </p>
          )}
        </div>
      </div>

      {/* ── Delete Confirm ── */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteWebhook}
        title="Delete Webhook"
        message={`Are you sure you want to delete the webhook for "${deleteTarget?.url}"? You will stop receiving events at this endpoint.`}
        confirmText="Delete Webhook"
        variant="danger"
      />
    </>
  );
}
