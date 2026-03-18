/**
 * Settings page mock data.
 */

export interface SettingsTab {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export interface TwoFactorOption {
  label: string;
  desc: string;
  enabled: boolean | null;
  icon: string;
}

export interface NotificationSetting {
  key: string;
  label: string;
  description: string;
}

export interface Session {
  device: string;
  location: string;
  time: string;
  current: boolean;
  icon: string;
}

export const SETTINGS_TABS: SettingsTab[] = [
  { id: "profile", label: "Profile", icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z", color: "sky" },
  { id: "security", label: "Security", icon: "M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z", color: "violet" },
  { id: "notifications", label: "Notifications", icon: "M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0", color: "amber" },
  { id: "appearance", label: "Appearance", icon: "M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z", color: "pink" },
  { id: "billing", label: "Billing", icon: "M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z", color: "emerald" },
  { id: "apikeys", label: "API Keys", icon: "M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z", color: "rose" },
];

export const TWO_FACTOR_OPTIONS: TwoFactorOption[] = [
  { label: "Authenticator App", desc: "Use Google Authenticator or similar", enabled: true, icon: "M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" },
  { label: "SMS Backup", desc: "Receive codes via text message", enabled: false, icon: "M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" },
  { label: "Recovery Codes", desc: "Generate backup codes", enabled: null, icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" },
];

export const NOTIFICATION_SETTINGS: NotificationSetting[] = [
  { key: "securityAlerts", label: "Security Alerts", description: "Get notified about security events and login attempts" },
  { key: "backupNotifications", label: "Backup Notifications", description: "Receive updates about backup status and completions" },
  { key: "updateNotifications", label: "Update Notifications", description: "Get notified when WordPress, plugins, or themes need updates" },
  { key: "performanceReports", label: "Performance Reports", description: "Weekly reports about your site's performance metrics" },
  { key: "marketingEmails", label: "Marketing Emails", description: "Receive news, tips, and special offers from LimeWP" },
  { key: "pushNotifications", label: "Push Notifications", description: "Enable browser push notifications" },
  { key: "downtimeAlerts", label: "Downtime Alerts", description: "Immediate alerts if your site goes down" },
];

export const DEFAULT_NOTIFICATION_TOGGLES: Record<string, boolean> = {
  securityAlerts: true,
  backupNotifications: true,
  updateNotifications: true,
  performanceReports: false,
  marketingEmails: false,
  pushNotifications: true,
  downtimeAlerts: true,
  compactMode: false,
  sidebarCollapsed: false,
  reduceMotion: false,
  highContrast: false,
};

export const ACTIVE_SESSIONS: Session[] = [
  { device: "MacBook Pro - Chrome", location: "San Francisco, CA", time: "Current session", current: true, icon: "M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" },
  { device: "iPhone 15 Pro - Safari", location: "San Francisco, CA", time: "2 hours ago", current: false, icon: "M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" },
  { device: "Windows PC - Firefox", location: "New York, NY", time: "Yesterday", current: false, icon: "M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" },
];

export const THEME_OPTIONS = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
  { value: "system", label: "System" },
];

export const ACCENT_COLOR_OPTIONS = [
  { value: "emerald", label: "Emerald" },
  { value: "sky", label: "Sky" },
  { value: "violet", label: "Violet" },
  { value: "rose", label: "Rose" },
  { value: "amber", label: "Amber" },
];

export const INPUT_CLASS_NAMES = {
  inputWrapper: [
    "bg-[#1E1E21]",
    "border-[#2A2A2E]",
    "hover:border-[#3F3F46]",
    "group-data-[focus=true]:border-emerald-500/40",
    "group-data-[focus=true]:ring-1",
    "group-data-[focus=true]:ring-emerald-500/20",
    "rounded-xl",
    "transition-all",
  ],
  input: ["text-zinc-100", "placeholder:text-zinc-500"],
};

export const SELECT_CLASS_NAMES = {
  trigger: [
    "bg-[#1E1E21]",
    "border-[#2A2A2E]",
    "hover:border-[#3F3F46]",
    "data-[focus=true]:border-emerald-500/40",
    "rounded-xl",
    "transition-all",
  ],
  value: ["text-zinc-100"],
  popoverContent: ["bg-[#1E1E21]", "border-[#2A2A2E]"],
};

export const SWITCH_CLASS_NAMES = {
  wrapper: "group-data-[selected=true]:bg-emerald-500",
};
