"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "@/lib/context/ThemeContext";
import { showToast } from "@/lib/toast";
import { getColorClasses } from "@/lib/utils/colors";
import { Toggle } from "@/app/components/ui/Toggle";
import { ConfirmDialog } from "@/app/components/ui/ConfirmDialog";

// Connection info
const CONNECTION_INFO = {
  host: "35.198.155.162",
  port: "53366",
  username: "limewp",
  password: "secretpass123",
  protocol: "SFTP / SSH",
};

// SSH Keys
const SSH_KEYS = [
  { name: "MacBook Pro", fingerprint: "SHA256:abc123...xyz789", added: "Jan 15, 2026", lastUsed: "2h ago" },
  { name: "GitHub Actions", fingerprint: "SHA256:def456...uvw012", added: "Dec 20, 2025", lastUsed: "1d ago" },
];

// Quick commands
const QUICK_COMMANDS = [
  { label: "Connect via SSH", command: "ssh limewp@35.198.155.162 -p 53366" },
  { label: "Connect via SFTP", command: "sftp -P 53366 limewp@35.198.155.162" },
  { label: "SCP Upload", command: "scp -P 53366 file.txt limewp@35.198.155.162:~/" },
  { label: "SCP Download", command: "scp -P 53366 limewp@35.198.155.162:~/file.txt ./" },
];

// Recent connections
const RECENT_CONNECTIONS = [
  { ip: "192.168.1.100", location: "San Francisco, US", time: "2h ago", status: "success" },
  { ip: "10.0.0.55", location: "London, UK", time: "1d ago", status: "success" },
  { ip: "172.16.0.12", location: "Tokyo, JP", time: "3d ago", status: "success" },
];

const FAILED_LOGINS = [
  { ip: "185.220.101.45", location: "Russia", time: "30 min ago", attempts: 12 },
  { ip: "103.21.244.88", location: "China", time: "2 hours ago", attempts: 5 },
  { ip: "45.33.32.156", location: "United States", time: "1 day ago", attempts: 3 },
];

const TERMINAL_RESPONSES: Record<string, string> = {
  ls: "wp-admin/  wp-content/  wp-includes/  index.php  wp-config.php",
  pwd: "/home/limewp/public_html",
  whoami: "limewp",
  "php -v": "PHP 8.3.4 (cli)",
  "wp --version": "WP-CLI 2.10.0",
  "df -h": "Filesystem  Size  Used  Avail  Use%\n/dev/sda1   50G   12G   38G   24%",
};

export function SshSftpTab() {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // SSH Keys state
  const [sshKeys, setSshKeys] = useState(SSH_KEYS);
  const [showAddKeyModal, setShowAddKeyModal] = useState(false);
  const [deleteKeyTarget, setDeleteKeyTarget] = useState<(typeof SSH_KEYS)[number] | null>(null);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyValue, setNewKeyValue] = useState("");

  // Terminal state
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState<string[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Security state
  const [sshEnabled, setSshEnabled] = useState(true);
  const [ssh2fa, setSsh2fa] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [sshWhitelist, setSshWhitelist] = useState(["192.168.1.0/24"]);
  const [showWhitelistModal, setShowWhitelistModal] = useState(false);
  const [newWhitelistIp, setNewWhitelistIp] = useState("");

  const [actionLoading, setActionLoading] = useState(false);
  const [showGeneratePassModal, setShowGeneratePassModal] = useState(false);

  // Collapsible sections
  const [showActivity, setShowActivity] = useState(false);

  // Add key modal refs
  const addKeyModalRef = useRef<HTMLDivElement>(null);
  const whitelistModalRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = (text: string, field: string, toastMsg?: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
    showToast.success(toastMsg || "Credentials copied");
  };

  // Scroll terminal to bottom on new history
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalHistory]);

  // Body lock for modals
  useEffect(() => {
    if (showAddKeyModal || showWhitelistModal) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showAddKeyModal, showWhitelistModal]);

  // Escape key for modals
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showAddKeyModal) setShowAddKeyModal(false);
        if (showWhitelistModal) setShowWhitelistModal(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showAddKeyModal, showWhitelistModal]);

  const handleTerminalSubmit = useCallback(() => {
    const cmd = terminalInput.trim();
    if (!cmd) return;
    const response = TERMINAL_RESPONSES[cmd] || `${cmd}: command not found`;
    setTerminalHistory((prev) => [...prev, `$ ${cmd}`, response]);
    setTerminalInput("");
  }, [terminalInput]);

  const handleAddKey = useCallback(() => {
    if (!newKeyName.trim() || !newKeyValue.trim()) return;
    setActionLoading(true);
    setTimeout(() => {
      setSshKeys((prev) => [
        ...prev,
        {
          name: newKeyName.trim(),
          fingerprint: `SHA256:${newKeyValue.trim().slice(0, 10)}...`,
          added: "Just now",
          lastUsed: "Never",
        },
      ]);
      setNewKeyName("");
      setNewKeyValue("");
      setShowAddKeyModal(false);
      setActionLoading(false);
      showToast.success("SSH key added successfully");
    }, 800);
  }, [newKeyName, newKeyValue]);

  const handleDeleteKey = useCallback(() => {
    if (!deleteKeyTarget) return;
    setSshKeys((prev) => prev.filter((k) => k.fingerprint !== deleteKeyTarget.fingerprint));
    setDeleteKeyTarget(null);
    showToast.success("SSH key removed");
  }, [deleteKeyTarget]);

  const handleDownloadCredentials = () => {
    const text = `Host: ${CONNECTION_INFO.host}\nPort: ${CONNECTION_INFO.port}\nUsername: ${CONNECTION_INFO.username}\nPassword: ${CONNECTION_INFO.password}\nProtocol: ${CONNECTION_INFO.protocol}`;
    copyToClipboard(text, "all-credentials", "All credentials copied to clipboard");
  };

  const handleBlockIp = (ip: string) => {
    showToast.success(`IP ${ip} has been blocked`);
  };

  const handleSaveSettings = () => {
    setActionLoading(true);
    setTimeout(() => {
      setActionLoading(false);
      showToast.success("Security settings saved");
    }, 600);
  };

  // Theme classes
  const textPrimary = isLight ? "text-slate-900" : "text-slate-100";
  const textSecondary = isLight ? "text-slate-500" : "text-slate-500";
  const textTertiary = isLight ? "text-slate-400" : "text-slate-600";
  const hoverBg = isLight ? "hover:bg-slate-50" : "hover:bg-white/[0.02]";

  const cardClass = `rounded-2xl border transition-all ${isLight ? "bg-white border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"}`;
  const inputClass = `w-full h-10 rounded-xl border px-3 text-sm font-medium outline-none transition-colors ${isLight ? "bg-white border-slate-200 text-slate-800 focus:border-slate-400" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)] text-slate-200 focus:border-[var(--border-primary)]"}`;
  const labelClass = `text-xs font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`;

  const modalOverlayClass = "fixed inset-0 z-[100] flex items-center justify-center p-4";
  const modalBackdropClass = "absolute inset-0 bg-black/60 backdrop-blur-sm";
  const modalCardClass = `relative w-full max-w-md rounded-2xl shadow-2xl p-6 ${isLight ? "bg-white border border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border border-[var(--border-tertiary)]"}`;

  const dividerClass = isLight ? "border-slate-100" : "border-white/[0.06]";
  const terminalBg = isLight ? "bg-slate-900" : "bg-[#0d1117]";

  const credentials = [
    { label: "Host", value: CONNECTION_INFO.host, copyValue: CONNECTION_INFO.host },
    { label: "Port", value: CONNECTION_INFO.port, copyValue: CONNECTION_INFO.port },
    { label: "Username", value: CONNECTION_INFO.username, copyValue: CONNECTION_INFO.username },
    { label: "Password", value: showPassword ? CONNECTION_INFO.password : "••••••••", copyValue: CONNECTION_INFO.password, isPassword: true },
  ];

  // Copy icon SVG
  const CopyIcon = ({ size = 14 }: { size?: number }) => (
    <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
    </svg>
  );

  const CheckIcon = ({ size = 14 }: { size?: number }) => (
    <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );

  return (
    <div className="space-y-5">
      {/* ===== 1. Header Row ===== */}
      <div className="flex items-center justify-between">
        <h2 className={`text-lg font-semibold ${textPrimary}`}>SSH / SFTP</h2>
        <div className="flex items-center gap-3">
          <Toggle enabled={sshEnabled} onChange={setSshEnabled} />
          {sshEnabled ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Active
            </span>
          ) : (
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${isLight ? "bg-slate-100 text-slate-400" : "bg-slate-800 text-slate-500"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isLight ? "bg-slate-300" : "bg-slate-600"}`} />
              Disabled
            </span>
          )}
          <button
            onClick={handleDownloadCredentials}
            className={`h-9 px-4 rounded-xl text-xs font-semibold transition-all ${accent.button} ${accent.buttonHover} text-white ${accent.buttonShadow} shadow-lg`}
          >
            Download Credentials
          </button>
        </div>
      </div>

      {/* ===== 2. Credentials + Quick Commands (split card) ===== */}
      <div className={`${cardClass} overflow-hidden`}>
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left: Connection Details */}
          <div className={`p-5 border-b lg:border-b-0 lg:border-r ${dividerClass}`}>
            <div className="flex items-center justify-between mb-4">
              <span className={`text-sm font-medium ${textPrimary}`}>Connection Details</span>
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${isLight ? "bg-cyan-100 text-cyan-600" : "bg-cyan-500/10 text-cyan-400"}`}>
                {CONNECTION_INFO.protocol}
              </span>
            </div>

            <div className="space-y-1.5">
              {credentials.map((cred) => (
                <div
                  key={cred.label}
                  className={`flex items-center justify-between py-2.5 px-3 rounded-xl transition-colors ${isLight ? "hover:bg-slate-50" : "hover:bg-white/[0.03]"}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`text-xs font-medium w-16 flex-shrink-0 ${textSecondary}`}>{cred.label}</span>
                    <span className={`text-sm font-mono truncate ${textPrimary}`}>{cred.value}</span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                    {cred.isPassword && (
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className={`p-1.5 rounded-lg transition-colors ${isLight ? "text-slate-400 hover:text-slate-600 hover:bg-slate-100" : "text-slate-600 hover:text-slate-400 hover:bg-white/5"}`}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <svg width={14} height={14} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                          </svg>
                        ) : (
                          <svg width={14} height={14} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => copyToClipboard(cred.copyValue, cred.label)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        copiedField === cred.label
                          ? "text-emerald-500"
                          : isLight
                            ? "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                            : "text-slate-600 hover:text-slate-400 hover:bg-white/5"
                      }`}
                      aria-label={`Copy ${cred.label}`}
                    >
                      {copiedField === cred.label ? <CheckIcon /> : <CopyIcon />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Quick Commands */}
          <div className="p-5">
            <span className={`text-sm font-medium ${textPrimary} mb-4 block`}>Quick Commands</span>

            <div className="grid grid-cols-1 gap-2">
              {QUICK_COMMANDS.map((cmd) => (
                <div
                  key={cmd.label}
                  className={`group relative rounded-xl overflow-hidden ${terminalBg}`}
                >
                  <div className="flex items-center gap-3 px-3.5 py-2.5">
                    <span className="text-emerald-500 text-xs font-mono flex-shrink-0">$</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] uppercase tracking-wider mb-0.5 text-slate-500">{cmd.label}</div>
                      <code className="text-xs font-mono text-slate-400 truncate block">{cmd.command}</code>
                    </div>
                    <button
                      aria-label={`Copy ${cmd.label} command`}
                      onClick={() => copyToClipboard(cmd.command, cmd.label, "Command copied")}
                      className="flex-shrink-0 p-1.5 rounded-lg transition-colors hover:bg-white/5 text-slate-600 hover:text-slate-400"
                    >
                      {copiedField === cmd.label ? (
                        <CheckIcon size={14} />
                      ) : (
                        <CopyIcon size={14} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== 3. Web Terminal (collapsible) ===== */}
      <div className={`${cardClass} overflow-hidden`}>
        {!showTerminal ? (
          <div className="flex items-center justify-between px-5 py-3.5">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${isLight ? "bg-slate-300" : "bg-slate-600"}`} />
              <span className={`text-sm font-medium ${textSecondary}`}>Web Terminal</span>
            </div>
            <button
              onClick={() => setShowTerminal(true)}
              className={`text-xs font-semibold px-4 py-1.5 rounded-xl transition-colors ${isLight ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}
            >
              Open Terminal
            </button>
          </div>
        ) : (
          <div className={terminalBg}>
            {/* Header bar with traffic lights */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56] cursor-pointer" onClick={() => setShowTerminal(false)} />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                <span className="text-xs font-mono text-slate-500 ml-3">limewp@{CONNECTION_INFO.host}</span>
              </div>
              <button
                onClick={() => setShowTerminal(false)}
                className="text-xs font-medium text-slate-600 hover:text-slate-400 transition-colors"
              >
                Close
              </button>
            </div>

            {/* Terminal output */}
            <div className="h-56 overflow-y-auto p-4 font-mono text-sm">
              <div className="text-slate-500 text-xs mb-3">Welcome to LimeWP SSH Terminal. Type a command below.</div>
              {terminalHistory.map((line, i) => (
                <div key={i} className={`whitespace-pre-wrap ${line.startsWith("$") ? "text-emerald-400" : "text-slate-400"}`}>
                  {line}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 px-4 py-3 border-t border-white/5">
              <span className="text-emerald-500 text-sm font-mono">$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTerminalSubmit();
                }}
                placeholder="Type a command..."
                className="flex-1 bg-transparent text-sm font-mono text-slate-200 placeholder-slate-600 outline-none"
                aria-label="Terminal command input"
              />
            </div>
          </div>
        )}
      </div>

      {/* ===== 4. SSH Keys + Security (split card) ===== */}
      <div className={`${cardClass} overflow-hidden`}>
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left: SSH Keys */}
          <div className={`p-5 border-b lg:border-b-0 lg:border-r ${dividerClass}`}>
            <div className="flex items-center justify-between mb-4">
              <span className={`text-sm font-medium ${textPrimary}`}>SSH Keys</span>
              <button
                onClick={() => setShowAddKeyModal(true)}
                className={`h-7 px-3 rounded-lg text-xs font-semibold transition-all ${accent.button} ${accent.buttonHover} text-white`}
              >
                Add Key
              </button>
            </div>

            {sshKeys.length === 0 ? (
              <div className={`py-8 text-center ${textSecondary} text-sm`}>No SSH keys added yet.</div>
            ) : (
              <div className="space-y-1">
                {sshKeys.map((key) => (
                  <div
                    key={key.fingerprint}
                    className={`group flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all ${hoverBg}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isLight ? "bg-slate-100" : "bg-[var(--bg-elevated)]"
                    }`}>
                      <svg className={`w-3.5 h-3.5 ${textSecondary}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium ${textPrimary}`}>{key.name}</div>
                      <div className={`text-[11px] font-mono ${textTertiary} truncate`}>{key.fingerprint}</div>
                    </div>
                    <span className={`text-[11px] ${textTertiary} flex-shrink-0 hidden sm:block`}>{key.lastUsed}</span>
                    <button
                      aria-label={`Delete SSH key ${key.name}`}
                      onClick={() => setDeleteKeyTarget(key)}
                      className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${isLight ? "text-slate-400 hover:text-red-500 hover:bg-red-50" : "text-slate-600 hover:text-red-400 hover:bg-red-500/10"}`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Security */}
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <span className={`text-sm font-medium ${textPrimary}`}>Security</span>
              <button
                onClick={handleSaveSettings}
                disabled={actionLoading}
                className={`h-7 px-3 rounded-lg text-xs font-semibold transition-all ${accent.button} ${accent.buttonHover} text-white disabled:opacity-50 flex items-center gap-1.5`}
              >
                {actionLoading ? (
                  <>
                    <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving
                  </>
                ) : (
                  "Save"
                )}
              </button>
            </div>

            <div className="space-y-3.5">
              {/* 2FA for SSH */}
              <div className={`flex items-center justify-between py-2.5 px-3 rounded-xl ${isLight ? "bg-slate-50" : "bg-white/[0.02]"}`}>
                <div>
                  <div className={`text-sm font-medium ${textPrimary}`}>2FA for SSH</div>
                  <p className={`text-[11px] mt-0.5 ${textTertiary}`}>Require verification on login</p>
                </div>
                <Toggle enabled={ssh2fa} onChange={setSsh2fa} />
              </div>

              {/* Session Timeout */}
              <div className={`flex items-center justify-between py-2.5 px-3 rounded-xl ${isLight ? "bg-slate-50" : "bg-white/[0.02]"}`}>
                <div>
                  <div className={`text-sm font-medium ${textPrimary}`}>Session Timeout</div>
                  <p className={`text-[11px] mt-0.5 ${textTertiary}`}>Auto-disconnect idle sessions</p>
                </div>
                <select
                  id="session-timeout"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className={`h-8 rounded-lg border px-2 text-xs font-medium outline-none transition-colors cursor-pointer ${isLight ? "bg-white border-slate-200 text-slate-700" : "bg-[var(--bg-elevated)] border-[var(--border-tertiary)] text-slate-300"}`}
                >
                  <option value="15">15 min</option>
                  <option value="30">30 min</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                  <option value="never">Never</option>
                </select>
              </div>

              {/* IP Whitelist */}
              <div className={`py-2.5 px-3 rounded-xl ${isLight ? "bg-slate-50" : "bg-white/[0.02]"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-sm font-medium ${textPrimary}`}>IP Whitelist</div>
                    <p className={`text-[11px] mt-0.5 ${textTertiary}`}>{sshWhitelist.length} IP{sshWhitelist.length !== 1 ? "s" : ""} allowed</p>
                  </div>
                  <button
                    onClick={() => setShowWhitelistModal(true)}
                    className={`text-xs font-medium px-2.5 py-1 rounded-lg transition-colors ${isLight ? "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}
                  >
                    Manage
                  </button>
                </div>

                {sshWhitelist.length > 0 && (
                  <div className={`mt-2.5 pt-2.5 border-t ${dividerClass} space-y-1`}>
                    {sshWhitelist.map((ip) => (
                      <div key={ip} className="flex items-center justify-between py-1">
                        <span className={`text-xs font-mono ${textSecondary}`}>{ip}</span>
                        <button
                          aria-label={`Remove IP ${ip}`}
                          onClick={() => {
                            setSshWhitelist((prev) => prev.filter((w) => w !== ip));
                            showToast.success(`IP ${ip} removed from whitelist`);
                          }}
                          className={`p-1 rounded transition-colors ${isLight ? "text-slate-400 hover:text-red-500" : "text-slate-600 hover:text-red-400"}`}
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {sshWhitelist.length === 0 && (
                  <p className={`text-[11px] ${textTertiary} mt-1`}>No restrictions. All IPs allowed.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== 5. Connection History (collapsible) ===== */}
      <div className={`${cardClass} overflow-hidden`}>
        <button
          onClick={() => setShowActivity(!showActivity)}
          className={`w-full flex items-center justify-between px-5 py-3.5 transition-colors ${isLight ? "hover:bg-slate-50" : "hover:bg-white/[0.01]"}`}
        >
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${textPrimary}`}>Recent Activity</span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${isLight ? "bg-slate-100 text-slate-500" : "bg-white/5 text-slate-500"}`}>
              {RECENT_CONNECTIONS.length + FAILED_LOGINS.length}
            </span>
          </div>
          <svg
            className={`w-4 h-4 ${textTertiary} transition-transform duration-200 ${showActivity ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        {showActivity && (
          <div className={`border-t ${dividerClass}`}>
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Recent Connections */}
              <div className={`p-5 border-b md:border-b-0 md:border-r ${dividerClass}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-semibold uppercase tracking-wider ${textTertiary}`}>Connections</span>
                </div>

                <div className="space-y-0.5">
                  {RECENT_CONNECTIONS.map((conn, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 py-2 px-2 rounded-lg transition-all ${hoverBg}`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-emerald-500" />
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-mono ${textPrimary}`}>{conn.ip}</div>
                        <div className={`text-[10px] ${textTertiary}`}>{conn.location}</div>
                      </div>
                      <span className={`text-[10px] tabular-nums ${textTertiary} flex-shrink-0`}>{conn.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Failed Logins */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-semibold uppercase tracking-wider ${textTertiary}`}>Failed Logins</span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-500">
                    {FAILED_LOGINS.reduce((sum, f) => sum + f.attempts, 0)}
                  </span>
                </div>

                <div className="space-y-0.5">
                  {FAILED_LOGINS.map((login, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 py-2 px-2 rounded-lg transition-all ${hoverBg}`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-red-500" />
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-mono ${textPrimary}`}>{login.ip}</div>
                        <div className={`text-[10px] ${textTertiary}`}>{login.location}</div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-[10px] tabular-nums ${textTertiary}`}>{login.attempts}x</span>
                        <button
                          aria-label={`Block IP ${login.ip}`}
                          onClick={() => handleBlockIp(login.ip)}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                        >
                          Block
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===== Add SSH Key Modal ===== */}
      {showAddKeyModal && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => setShowAddKeyModal(false)} aria-hidden="true" />
          <div
            ref={addKeyModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-key-dialog-title"
            className={modalCardClass}
          >
            <h3 id="add-key-dialog-title" className={`text-lg font-semibold mb-4 ${textPrimary}`}>Add SSH Key</h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="ssh-key-name" className={labelClass}>Key Name</label>
                <input
                  id="ssh-key-name"
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g. Work Laptop"
                  className={`${inputClass} mt-1.5`}
                />
              </div>

              <div>
                <label htmlFor="ssh-key-value" className={labelClass}>Public Key</label>
                <textarea
                  id="ssh-key-value"
                  value={newKeyValue}
                  onChange={(e) => setNewKeyValue(e.target.value)}
                  placeholder="ssh-rsa AAAA..."
                  rows={4}
                  className={`w-full rounded-xl border px-3 py-2.5 text-sm font-mono outline-none transition-colors resize-none mt-1.5 ${isLight ? "bg-white border-slate-200 text-slate-800 focus:border-slate-400" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)] text-slate-200 focus:border-[var(--border-primary)]"}`}
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setShowAddKeyModal(false)}
                className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"}`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddKey}
                disabled={!newKeyName.trim() || !newKeyValue.trim() || actionLoading}
                className={`h-10 px-5 rounded-xl text-sm font-semibold transition-all ${accent.button} ${accent.buttonHover} text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
              >
                {actionLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Adding...
                  </>
                ) : (
                  "Add Key"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Whitelist IP Modal ===== */}
      {showWhitelistModal && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => setShowWhitelistModal(false)} aria-hidden="true" />
          <div
            ref={whitelistModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="whitelist-dialog-title"
            className={modalCardClass}
          >
            <h3 id="whitelist-dialog-title" className={`text-lg font-semibold mb-4 ${textPrimary}`}>Add IP to Whitelist</h3>

            <div>
              <label htmlFor="whitelist-ip" className={labelClass}>IP Address or CIDR Range</label>
              <input
                id="whitelist-ip"
                type="text"
                value={newWhitelistIp}
                onChange={(e) => setNewWhitelistIp(e.target.value)}
                placeholder="e.g. 192.168.1.0/24"
                className={`${inputClass} mt-1.5`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newWhitelistIp.trim()) {
                    setSshWhitelist((prev) => [...prev, newWhitelistIp.trim()]);
                    setNewWhitelistIp("");
                    setShowWhitelistModal(false);
                    showToast.success("IP added to whitelist");
                  }
                }}
              />
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setShowWhitelistModal(false)}
                className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"}`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newWhitelistIp.trim()) return;
                  setSshWhitelist((prev) => [...prev, newWhitelistIp.trim()]);
                  setNewWhitelistIp("");
                  setShowWhitelistModal(false);
                  showToast.success("IP added to whitelist");
                }}
                disabled={!newWhitelistIp.trim()}
                className={`h-10 px-5 rounded-xl text-sm font-semibold transition-all ${accent.button} ${accent.buttonHover} text-white disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Add IP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Delete Key Confirm Dialog ===== */}
      <ConfirmDialog
        open={!!deleteKeyTarget}
        onClose={() => setDeleteKeyTarget(null)}
        onConfirm={handleDeleteKey}
        title="Remove SSH Key"
        message={`Are you sure you want to remove the SSH key "${deleteKeyTarget?.name}"? This action cannot be undone.`}
        confirmText="Remove Key"
        variant="danger"
      />
    </div>
  );
}
