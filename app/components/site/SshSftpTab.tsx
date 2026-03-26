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
  const inputClass = `w-full h-10 rounded-xl border px-3 text-sm font-medium outline-none transition-colors ${isLight ? "bg-white border-slate-200 text-slate-800 focus:border-slate-400" : "bg-[var(--bg-primary)] border-[var(--border-tertiary)] text-slate-200 focus:border-[var(--border-primary)]"}`;
  const labelClass = `text-xs font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`;

  const modalOverlayClass = "fixed inset-0 z-[100] flex items-center justify-center p-4";
  const modalBackdropClass = "absolute inset-0 bg-black/60 backdrop-blur-sm";
  const modalCardClass = `relative w-full max-w-md rounded-2xl shadow-2xl p-6 ${isLight ? "bg-white border border-slate-200" : "bg-[var(--bg-primary)] border border-[var(--border-tertiary)]"}`;

  const credentials = [
    { label: "Host", value: CONNECTION_INFO.host, copyValue: CONNECTION_INFO.host },
    { label: "Port", value: CONNECTION_INFO.port, copyValue: CONNECTION_INFO.port },
    { label: "Username", value: CONNECTION_INFO.username, copyValue: CONNECTION_INFO.username },
    { label: "Password", value: showPassword ? CONNECTION_INFO.password : "••••••••", copyValue: CONNECTION_INFO.password, isPassword: true },
  ];

  return (
    <div className="space-y-5">
      {/* 1. Connection Status Card */}
      <div className={`${cardClass} p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Toggle enabled={sshEnabled} onChange={setSshEnabled} />
            <div>
              <h3 className={`text-sm font-semibold ${textPrimary}`}>SSH/SFTP Access</h3>
              <p className={`text-xs mt-0.5 ${textSecondary}`}>Secure shell and file transfer access to your server</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {sshEnabled ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Connected
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
      </div>

      {/* 2. Connection Credentials Card */}
      <div className={`${cardClass} p-6`}>
        <div className="flex items-center justify-between mb-5">
          <span className={`text-sm font-medium ${textPrimary}`}>Connection Credentials</span>
          <span className={`text-xs px-2 py-1 rounded-full ${isLight ? "bg-cyan-100 text-cyan-600" : "bg-cyan-500/10 text-cyan-400"}`}>
            {CONNECTION_INFO.protocol}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {credentials.map((cred) => (
            <div
              key={cred.label}
              onClick={() => {
                if (cred.isPassword) {
                  setShowPassword(!showPassword);
                } else {
                  copyToClipboard(cred.copyValue, cred.label);
                }
              }}
              className={`group p-3 rounded-xl cursor-pointer transition-all ${
                isLight ? "bg-slate-50 hover:bg-slate-100" : "bg-[var(--bg-elevated)]/30 hover:bg-[var(--bg-elevated)]/50"
              }`}
            >
              <div className={`text-[10px] uppercase tracking-wider ${textTertiary} mb-1.5`}>{cred.label}</div>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-mono ${textPrimary}`}>{cred.value}</span>
                <span className={`text-[10px] transition-colors ${
                  copiedField === cred.label
                    ? "text-emerald-500"
                    : `${textTertiary} group-hover:text-slate-500`
                }`}>
                  {copiedField === cred.label ? "Copied!" : cred.isPassword ? (showPassword ? "Hide" : "Show") : "Copy"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Quick Commands Card */}
      <div className={`${cardClass} p-6`}>
        <span className={`text-sm font-medium ${textPrimary} mb-4 block`}>Quick Commands</span>

        <div className="space-y-2">
          {QUICK_COMMANDS.map((cmd) => (
            <div
              key={cmd.label}
              className={`group flex items-center gap-3 p-3 rounded-xl transition-all ${
                isLight ? "bg-slate-900" : "bg-black/30"
              }`}
            >
              <span className="text-emerald-500 text-xs font-mono">$</span>
              <div className="flex-1 min-w-0">
                <div className={`text-[10px] uppercase tracking-wider mb-1 ${isLight ? "text-slate-500" : "text-slate-600"}`}>
                  {cmd.label}
                </div>
                <code className={`text-xs font-mono truncate block ${isLight ? "text-slate-300" : "text-slate-400"}`}>
                  {cmd.command}
                </code>
              </div>
              <button
                aria-label={`Copy ${cmd.label} command`}
                onClick={() => copyToClipboard(cmd.command, cmd.label, "Command copied")}
                className={`flex-shrink-0 p-1.5 rounded-lg transition-colors ${
                  isLight ? "hover:bg-slate-800 text-slate-500 hover:text-slate-300" : "hover:bg-slate-800 text-slate-600 hover:text-slate-400"
                }`}
              >
                {copiedField === cmd.label ? (
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                  </svg>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Web Terminal Card */}
      <div className={`${cardClass} overflow-hidden`}>
        <div className={`flex items-center justify-between p-4 border-b ${isLight ? "border-slate-200" : "border-white/[0.06]"}`}>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${textPrimary}`}>Web Terminal</span>
          </div>
          <button
            onClick={() => setShowTerminal(!showTerminal)}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}
          >
            {showTerminal ? "Close" : "Open Terminal"}
          </button>
        </div>

        {showTerminal && (
          <div className="bg-[#0d1117]">
            {/* macOS traffic lights */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              <span className="text-xs font-mono text-slate-500 ml-3">limewp@{CONNECTION_INFO.host}</span>
            </div>

            {/* Terminal output */}
            <div className="h-64 overflow-y-auto p-4 font-mono text-sm">
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

      {/* 5. SSH Keys Card */}
      <div className={`${cardClass} p-6`}>
        <div className="flex items-center justify-between mb-4">
          <span className={`text-sm font-medium ${textPrimary}`}>SSH Keys</span>
          <button
            onClick={() => setShowAddKeyModal(true)}
            className={`h-8 px-3 rounded-xl text-xs font-semibold transition-all ${accent.button} ${accent.buttonHover} text-white`}
          >
            Add Key
          </button>
        </div>

        <div className={`rounded-xl overflow-hidden ${isLight ? "bg-slate-50" : "bg-slate-800"}`}>
          {sshKeys.length === 0 ? (
            <div className={`p-8 text-center ${textSecondary} text-sm`}>No SSH keys added yet.</div>
          ) : (
            sshKeys.map((key, index) => (
              <div
                key={key.fingerprint}
                className={`flex items-center gap-4 p-4 ${
                  index !== sshKeys.length - 1 ? `border-b ${isLight ? "border-slate-200" : "border-white/[0.06]"}` : ""
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  isLight ? "bg-white" : "bg-[var(--bg-elevated)]"
                }`}>
                  <svg className={`w-4 h-4 ${textSecondary}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${textPrimary}`}>{key.name}</div>
                  <div className={`text-xs font-mono ${textTertiary} truncate`}>{key.fingerprint}</div>
                </div>
                <div className="text-right mr-2">
                  <div className={`text-xs ${textSecondary}`}>Last used {key.lastUsed}</div>
                  <div className={`text-[10px] ${textTertiary}`}>Added {key.added}</div>
                </div>
                <button
                  aria-label={`Delete SSH key ${key.name}`}
                  onClick={() => setDeleteKeyTarget(key)}
                  className={`p-2 rounded-lg transition-colors ${isLight ? "text-slate-400 hover:text-red-500 hover:bg-red-50" : "text-slate-600 hover:text-red-400 hover:bg-red-500/10"}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 6. Security Settings Card */}
      <div className={`${cardClass} p-6`}>
        <h3 className={`text-sm font-medium ${textPrimary} mb-5`}>Security Settings</h3>

        <div className="space-y-5">
          {/* 2FA for SSH */}
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-sm font-medium ${textPrimary}`}>Two-Factor Authentication</div>
              <p className={`text-xs mt-0.5 ${textSecondary}`}>Require 2FA verification for SSH logins</p>
            </div>
            <Toggle enabled={ssh2fa} onChange={setSsh2fa} />
          </div>

          {/* Session Timeout */}
          <div className={`border-t pt-5 ${isLight ? "border-slate-100" : "border-[var(--border-tertiary)]"}`}>
            <label htmlFor="session-timeout" className={labelClass}>Session Timeout</label>
            <select
              id="session-timeout"
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
              className={`${inputClass} mt-1.5 cursor-pointer`}
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
              <option value="never">Never</option>
            </select>
          </div>

          {/* IP Whitelist */}
          <div className={`border-t pt-5 ${isLight ? "border-slate-100" : "border-[var(--border-tertiary)]"}`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className={`text-sm font-medium ${textPrimary}`}>IP Whitelist</div>
                <p className={`text-xs mt-0.5 ${textSecondary}`}>Only allow SSH connections from these IPs</p>
              </div>
              <button
                onClick={() => setShowWhitelistModal(true)}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}
              >
                Add IP
              </button>
            </div>

            <div className="space-y-2">
              {sshWhitelist.map((ip) => (
                <div
                  key={ip}
                  className={`flex items-center justify-between py-2 px-3 rounded-xl ${isLight ? "bg-slate-50" : "bg-[var(--bg-elevated)]/30"}`}
                >
                  <span className={`text-sm font-mono ${textPrimary}`}>{ip}</span>
                  <button
                    aria-label={`Remove IP ${ip}`}
                    onClick={() => {
                      setSshWhitelist((prev) => prev.filter((w) => w !== ip));
                      showToast.success(`IP ${ip} removed from whitelist`);
                    }}
                    className={`p-1 rounded-lg transition-colors ${isLight ? "text-slate-400 hover:text-red-500" : "text-slate-600 hover:text-red-400"}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              {sshWhitelist.length === 0 && (
                <p className={`text-xs ${textSecondary} py-2`}>No IPs whitelisted. All IPs can connect.</p>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className={`border-t pt-5 ${isLight ? "border-slate-100" : "border-[var(--border-tertiary)]"}`}>
            <button
              onClick={handleSaveSettings}
              disabled={actionLoading}
              className={`h-10 px-6 rounded-xl text-sm font-semibold transition-all ${accent.button} ${accent.buttonHover} text-white ${accent.buttonShadow} shadow-lg disabled:opacity-50 flex items-center gap-2`}
            >
              {actionLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Settings"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 7. Two-column: Recent Connections + Failed Logins */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Recent Connections */}
        <div className={`${cardClass} p-6`}>
          <div className="flex items-center justify-between mb-4">
            <span className={`text-sm font-medium ${textPrimary}`}>Recent Connections</span>
            <button className={`text-xs ${textTertiary} hover:${textSecondary} transition-colors`}>
              View all
            </button>
          </div>

          <div className="space-y-1">
            {RECENT_CONNECTIONS.map((conn, index) => (
              <div
                key={index}
                className={`group flex items-center gap-3 py-3 px-3 -mx-3 rounded-xl transition-all ${hoverBg}`}
              >
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-emerald-500" />
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-mono ${textPrimary}`}>{conn.ip}</div>
                  <div className={`text-xs ${textTertiary}`}>{conn.location}</div>
                </div>
                <span className={`text-xs tabular-nums ${textTertiary}`}>{conn.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Failed Logins */}
        <div className={`${cardClass} p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${textPrimary}`}>Failed Logins</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-500">
                {FAILED_LOGINS.reduce((sum, f) => sum + f.attempts, 0)}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            {FAILED_LOGINS.map((login, index) => (
              <div
                key={index}
                className={`group flex items-center gap-3 py-3 px-3 -mx-3 rounded-xl transition-all ${hoverBg}`}
              >
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-red-500" />
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-mono ${textPrimary}`}>{login.ip}</div>
                  <div className={`text-xs ${textTertiary}`}>{login.location}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className={`text-xs ${textSecondary}`}>{login.attempts} attempts</div>
                    <div className={`text-[10px] ${textTertiary}`}>{login.time}</div>
                  </div>
                  <button
                    aria-label={`Block IP ${login.ip}`}
                    onClick={() => handleBlockIp(login.ip)}
                    className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                  >
                    Block IP
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add SSH Key Modal */}
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
                  className={`w-full rounded-xl border px-3 py-2.5 text-sm font-mono outline-none transition-colors resize-none mt-1.5 ${isLight ? "bg-white border-slate-200 text-slate-800 focus:border-slate-400" : "bg-[var(--bg-primary)] border-[var(--border-tertiary)] text-slate-200 focus:border-[var(--border-primary)]"}`}
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

      {/* Whitelist IP Modal */}
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

      {/* Delete Key Confirm Dialog */}
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
