"use client";

import { Switch } from "@heroui/react";
import { getColorClasses } from "@/lib/utils/colors";
import { useTheme, type AccentColor } from "@/lib/context/ThemeContext";

// Accent color styles
const ACCENT_STYLES = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-500", ring: "ring-emerald-500/20", glow: "from-emerald-500/10", switchOn: "bg-emerald-500" },
  sky: { bg: "bg-sky-500/10", text: "text-sky-500", ring: "ring-sky-500/20", glow: "from-sky-500/10", switchOn: "bg-sky-500" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-500", ring: "ring-violet-500/20", glow: "from-violet-500/10", switchOn: "bg-violet-500" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-500", ring: "ring-amber-500/20", glow: "from-amber-500/10", switchOn: "bg-amber-500" },
  pink: { bg: "bg-pink-500/10", text: "text-pink-500", ring: "ring-pink-500/20", glow: "from-pink-500/10", switchOn: "bg-pink-500" },
};

interface NotificationItem {
  key: string;
  label: string;
  desc: string;
  icon: string;
  color: string;
}

const EMAIL_NOTIFICATION_ITEMS: NotificationItem[] = [
  { key: "securityAlerts", label: "Security Alerts", desc: "Get notified about security events", icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z", color: "emerald" },
  { key: "backupNotifications", label: "Backup Notifications", desc: "Receive backup status updates", icon: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z", color: "sky" },
  { key: "updateNotifications", label: "Update Notifications", desc: "WordPress and plugin updates", icon: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99", color: "violet" },
  { key: "performanceReports", label: "Performance Reports", desc: "Weekly performance summaries", icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z", color: "amber" },
  { key: "marketingEmails", label: "Marketing Emails", desc: "Product news and offers", icon: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z", color: "pink" },
];

const PUSH_NOTIFICATION_ITEMS = [
  { key: "pushNotifications", label: "Enable Push Notifications", desc: "Receive browser notifications" },
  { key: "downtimeAlerts", label: "Site Downtime Alerts", desc: "Instant alerts when sites go down" },
];

interface NotificationsTabProps {
  toggles: Record<string, boolean>;
  onToggle: (key: string) => void;
}

export function NotificationsTab({ toggles, onToggle }: NotificationsTabProps) {
  return (
    <div className="space-y-6">
      <EmailNotificationsCard toggles={toggles} onToggle={onToggle} />
      <PushNotificationsCard toggles={toggles} onToggle={onToggle} />
    </div>
  );
}

interface NotificationCardProps {
  toggles: Record<string, boolean>;
  onToggle: (key: string) => void;
}

function EmailNotificationsCard({ toggles, onToggle }: NotificationCardProps) {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = ACCENT_STYLES[accentColor];

  const getSwitchClassNames = (isSelected: boolean) => ({
    wrapper: `transition-colors duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
      isSelected
        ? accent.switchOn
        : isLight
          ? "bg-zinc-300"
          : "bg-zinc-600"
    }`,
    thumb: `bg-white shadow-md transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
      isSelected ? "!ml-[calc(100%-20px)]" : "!ml-0"
    }`,
    thumbIcon: "hidden",
  });

  return (
    <div className={`relative rounded-2xl border overflow-hidden ${
      isLight
        ? "bg-white border-zinc-200"
        : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E]"
    }`}>
      <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl ${accent.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3`} />

      <div className="relative p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-xl ${accent.bg} ${accent.text} ring-1 ${accent.ring} flex items-center justify-center`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <div>
            <h3 className={`text-base font-semibold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>Email Notifications</h3>
            <p className="text-xs text-zinc-500">Choose what emails you receive</p>
          </div>
        </div>

        <div className="space-y-3">
          {EMAIL_NOTIFICATION_ITEMS.map((item) => {
            const colors = getColorClasses(item.color);
            return (
              <div key={item.key} className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
                isLight
                  ? "bg-zinc-50 hover:bg-zinc-100"
                  : "bg-[#27272A]/50 hover:bg-[#27272A]"
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg ${colors.bg} ${colors.text} ring-1 ${colors.ring} flex items-center justify-center`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d={item.icon} />
                    </svg>
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isLight ? "text-zinc-700" : "text-zinc-200"}`}>{item.label}</p>
                    <p className="text-[11px] text-zinc-500">{item.desc}</p>
                  </div>
                </div>
                <Switch isSelected={toggles[item.key]} onValueChange={() => onToggle(item.key)} classNames={getSwitchClassNames(toggles[item.key])} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PushNotificationsCard({ toggles, onToggle }: NotificationCardProps) {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = ACCENT_STYLES[accentColor];

  const getSwitchClassNames = (isSelected: boolean) => ({
    wrapper: `transition-colors duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
      isSelected
        ? accent.switchOn
        : isLight
          ? "bg-zinc-300"
          : "bg-zinc-600"
    }`,
    thumb: `bg-white shadow-md transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
      isSelected ? "!ml-[calc(100%-20px)]" : "!ml-0"
    }`,
    thumbIcon: "hidden",
  });

  return (
    <div className={`relative rounded-2xl border overflow-hidden ${
      isLight
        ? "bg-white border-zinc-200"
        : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E]"
    }`}>
      <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${accent.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3`} />

      <div className="relative p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-xl ${accent.bg} ${accent.text} ring-1 ${accent.ring} flex items-center justify-center`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
          </div>
          <div>
            <h3 className={`text-base font-semibold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>Push Notifications</h3>
            <p className="text-xs text-zinc-500">Real-time alerts on your devices</p>
          </div>
        </div>

        <div className="space-y-3">
          {PUSH_NOTIFICATION_ITEMS.map((item) => (
            <div key={item.key} className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
              isLight
                ? "bg-zinc-50 hover:bg-zinc-100"
                : "bg-[#27272A]/50 hover:bg-[#27272A]"
            }`}>
              <div>
                <p className={`text-sm font-medium ${isLight ? "text-zinc-700" : "text-zinc-200"}`}>{item.label}</p>
                <p className="text-[11px] text-zinc-500">{item.desc}</p>
              </div>
              <Switch isSelected={toggles[item.key]} onValueChange={() => onToggle(item.key)} classNames={getSwitchClassNames(toggles[item.key])} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
