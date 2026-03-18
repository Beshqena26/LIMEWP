"use client";

import { useState } from "react";
import { useTheme } from "@/lib/context/ThemeContext";

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

export function SshSftpTab() {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Theme classes
  const cardBg = isLight ? "bg-white" : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d]";
  const cardBorder = isLight ? "border-zinc-200" : "border-[#2A2A2E]";
  const dividerBorder = isLight ? "border-zinc-100" : "border-[#2A2A2E]";
  const textPrimary = isLight ? "text-zinc-900" : "text-zinc-100";
  const textSecondary = isLight ? "text-zinc-500" : "text-zinc-500";
  const textTertiary = isLight ? "text-zinc-400" : "text-zinc-600";
  const subtleBg = isLight ? "bg-zinc-100" : "bg-zinc-800";
  const hoverBg = isLight ? "hover:bg-zinc-50" : "hover:bg-white/[0.02]";

  const credentials = [
    { label: "Host", value: CONNECTION_INFO.host, copyValue: CONNECTION_INFO.host },
    { label: "Port", value: CONNECTION_INFO.port, copyValue: CONNECTION_INFO.port },
    { label: "Username", value: CONNECTION_INFO.username, copyValue: CONNECTION_INFO.username },
    { label: "Password", value: showPassword ? CONNECTION_INFO.password : "••••••••", copyValue: CONNECTION_INFO.password, isPassword: true },
  ];

  return (
    <div className={`relative rounded-2xl border overflow-hidden ${cardBg} ${cardBorder}`}>
      {/* Subtle corner glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-cyan-500/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />

      {/* Section 1: Connection Credentials */}
      <div className="relative p-6">
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
                isLight ? "bg-zinc-50 hover:bg-zinc-100" : "bg-[#27272A]/30 hover:bg-[#27272A]/50"
              }`}
            >
              <div className={`text-[10px] uppercase tracking-wider ${textTertiary} mb-1.5`}>{cred.label}</div>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-mono ${textPrimary}`}>{cred.value}</span>
                <span className={`text-[10px] transition-colors ${
                  copiedField === cred.label
                    ? "text-emerald-500"
                    : `${textTertiary} group-hover:text-zinc-500`
                }`}>
                  {copiedField === cred.label ? "Copied!" : cred.isPassword ? (showPassword ? "Hide" : "Show") : "Copy"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className={`border-t ${dividerBorder}`} />

      {/* Section 2: Quick Commands */}
      <div className="relative p-6">
        <span className={`text-sm font-medium ${textPrimary} mb-4 block`}>Quick Commands</span>

        <div className="space-y-2">
          {QUICK_COMMANDS.map((cmd) => (
            <div
              key={cmd.label}
              className={`group flex items-center gap-3 p-3 rounded-xl transition-all ${
                isLight ? "bg-zinc-900" : "bg-black/30"
              }`}
            >
              <span className="text-emerald-500 text-xs font-mono">$</span>
              <div className="flex-1 min-w-0">
                <div className={`text-[10px] uppercase tracking-wider mb-1 ${isLight ? "text-zinc-500" : "text-zinc-600"}`}>
                  {cmd.label}
                </div>
                <code className={`text-xs font-mono truncate block ${isLight ? "text-zinc-300" : "text-zinc-400"}`}>
                  {cmd.command}
                </code>
              </div>
              <button
                onClick={() => copyToClipboard(cmd.command, cmd.label)}
                className={`flex-shrink-0 p-1.5 rounded-lg transition-colors ${
                  isLight ? "hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300" : "hover:bg-zinc-800 text-zinc-600 hover:text-zinc-400"
                }`}
              >
                {copiedField === cmd.label ? (
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                  </svg>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className={`border-t ${dividerBorder}`} />

      {/* Section 3: SSH Keys */}
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <span className={`text-sm font-medium ${textPrimary}`}>SSH Keys</span>
          <button className={`text-xs ${textTertiary} hover:${textSecondary} transition-colors`}>
            Add key
          </button>
        </div>

        <div className={`rounded-xl overflow-hidden ${subtleBg}`}>
          {SSH_KEYS.map((key, index) => (
            <div
              key={key.name}
              className={`flex items-center gap-4 p-4 ${
                index !== SSH_KEYS.length - 1 ? `border-b ${dividerBorder}` : ""
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                isLight ? "bg-white" : "bg-[#27272A]"
              }`}>
                <svg className={`w-4 h-4 ${textSecondary}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${textPrimary}`}>{key.name}</div>
                <div className={`text-xs font-mono ${textTertiary} truncate`}>{key.fingerprint}</div>
              </div>
              <div className="text-right">
                <div className={`text-xs ${textSecondary}`}>Last used {key.lastUsed}</div>
                <div className={`text-[10px] ${textTertiary}`}>Added {key.added}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className={`border-t ${dividerBorder}`} />

      {/* Section 4: Recent Connections */}
      <div className="relative p-6">
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
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                conn.status === "success" ? "bg-emerald-500" : "bg-red-500"
              }`} />
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-mono ${textPrimary}`}>{conn.ip}</div>
                <div className={`text-xs ${textTertiary}`}>{conn.location}</div>
              </div>
              <span className={`text-xs tabular-nums ${textTertiary}`}>{conn.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
