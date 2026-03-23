"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { createRoute } from "@/config/routes";
import {
  Button, Chip,
  Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
} from "@heroui/react";
import AppShell from "../components/AppShell";
import { UpgradeModal } from "../components/dashboard";
import { OverviewTab } from "../components/site/OverviewTab";
import { SshSftpTab } from "../components/site/SshSftpTab";
import { FileManagerTab } from "../components/site/FileManagerTab";
import { ToolsTab } from "../components/site/ToolsTab";
import { DomainsTab } from "../components/site/DomainsTab";
import { ThemesTab } from "../components/site/ThemesTab";
import { PluginsTab } from "../components/site/PluginsTab";
import { BackupsTab } from "../components/site/BackupsTab";
import { AnalyticsTab } from "../components/site/AnalyticsTab";
import { CachingTab } from "../components/site/CachingTab";
import { UsersTab } from "../components/site/UsersTab";
import { LogsTab } from "../components/site/LogsTab";
import { useTheme } from "@/lib/context/ThemeContext";
import { SiteDetailSkeleton } from "../components/skeletons";
import { useSimulatedLoading } from "@/hooks";
import { showToast } from "@/lib/toast";

const tabList = [
  { name: "Overview", icon: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z", color: "emerald" },
  { name: "File Manager", icon: "M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z", color: "orange" },
  { name: "SSH/SFTP", icon: "M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z", color: "cyan" },
  { name: "Tools", icon: "M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z", color: "sky" },
  { name: "Domains", icon: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418", color: "violet" },
  { name: "Themes", icon: "M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42", color: "pink" },
  { name: "Plugins", icon: "M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.491 48.491 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 00.657-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z", color: "amber", badge: "3" },
  { name: "Backups", icon: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z", color: "teal" },
  { name: "Analytics", icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z", color: "indigo" },
  { name: "Caching", icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z", color: "yellow" },
  { name: "Users", icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z", color: "cyan" },
  { name: "Logs", icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z", color: "rose" },
  { name: "Redirects", icon: "M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5", color: "orange" },
  { name: "IP Deny", icon: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636", color: "red" },
  { name: "Add-ons", icon: "M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z", color: "purple" },
];

function ComingSoonTab({ title, description, icon }: { title: string; description: string; icon: string }) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  return (
    <div className={`rounded-2xl border p-12 flex flex-col items-center justify-center text-center ${
      isLight ? "bg-white border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"
    }`}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${isLight ? "bg-slate-100" : "bg-[var(--bg-elevated)]"}`}>
        <svg className={`w-7 h-7 ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
      </div>
      <h2 className={`text-lg font-semibold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>{title}</h2>
      <p className={`text-sm ${isLight ? "text-slate-500" : "text-slate-400"}`}>{description}</p>
      <span className={`mt-4 text-xs font-medium px-3 py-1 rounded-full ${isLight ? "bg-slate-100 text-slate-500" : "bg-[var(--bg-elevated)] text-slate-400"}`}>Coming soon</span>
    </div>
  );
}

function SitePageContent() {
  const searchParams = useSearchParams();
  const siteName = searchParams.get("name") || "limewp.com";
  const router = useRouter();
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";

  // Accent color styles for active tabs and content
  const accentStyles = {
    emerald: { bg: "bg-emerald-500/10", text: "text-emerald-500", textLight: "text-emerald-600", ring: "ring-emerald-500/20", ring30: "ring-emerald-500/30", indicator: "bg-emerald-500", glow: "from-emerald-500/[0.06] via-emerald-500/[0.02]", hoverBg: "hover:bg-emerald-500/10", hoverText: "hover:text-emerald-500", hoverTextLight: "hover:text-emerald-600", hoverRing: "hover:ring-emerald-500/30", focusBorder: "focus:border-emerald-500/30", focusRing: "focus:ring-emerald-500/20", gradient: "from-emerald-500/20 to-emerald-500/10", gradientHover: "hover:from-emerald-500/20 hover:to-emerald-500/15" },
    sky: { bg: "bg-sky-500/10", text: "text-sky-500", textLight: "text-sky-600", ring: "ring-sky-500/20", ring30: "ring-sky-500/30", indicator: "bg-sky-500", glow: "from-sky-500/[0.06] via-sky-500/[0.02]", hoverBg: "hover:bg-sky-500/10", hoverText: "hover:text-sky-500", hoverTextLight: "hover:text-sky-600", hoverRing: "hover:ring-sky-500/30", focusBorder: "focus:border-sky-500/30", focusRing: "focus:ring-sky-500/20", gradient: "from-sky-500/20 to-sky-500/10", gradientHover: "hover:from-sky-500/20 hover:to-sky-500/15" },
    violet: { bg: "bg-violet-500/10", text: "text-violet-500", textLight: "text-violet-600", ring: "ring-violet-500/20", ring30: "ring-violet-500/30", indicator: "bg-violet-500", glow: "from-violet-500/[0.06] via-violet-500/[0.02]", hoverBg: "hover:bg-violet-500/10", hoverText: "hover:text-violet-500", hoverTextLight: "hover:text-violet-600", hoverRing: "hover:ring-violet-500/30", focusBorder: "focus:border-violet-500/30", focusRing: "focus:ring-violet-500/20", gradient: "from-violet-500/20 to-violet-500/10", gradientHover: "hover:from-violet-500/20 hover:to-violet-500/15" },
    amber: { bg: "bg-amber-500/10", text: "text-amber-500", textLight: "text-amber-600", ring: "ring-amber-500/20", ring30: "ring-amber-500/30", indicator: "bg-amber-500", glow: "from-amber-500/[0.06] via-amber-500/[0.02]", hoverBg: "hover:bg-amber-500/10", hoverText: "hover:text-amber-500", hoverTextLight: "hover:text-amber-600", hoverRing: "hover:ring-amber-500/30", focusBorder: "focus:border-amber-500/30", focusRing: "focus:ring-amber-500/20", gradient: "from-amber-500/20 to-amber-500/10", gradientHover: "hover:from-amber-500/20 hover:to-amber-500/15" },
    pink: { bg: "bg-pink-500/10", text: "text-pink-500", textLight: "text-pink-600", ring: "ring-pink-500/20", ring30: "ring-pink-500/30", indicator: "bg-pink-500", glow: "from-pink-500/[0.06] via-pink-500/[0.02]", hoverBg: "hover:bg-pink-500/10", hoverText: "hover:text-pink-500", hoverTextLight: "hover:text-pink-600", hoverRing: "hover:ring-pink-500/30", focusBorder: "focus:border-pink-500/30", focusRing: "focus:ring-pink-500/20", gradient: "from-pink-500/20 to-pink-500/10", gradientHover: "hover:from-pink-500/20 hover:to-pink-500/15" },
  };
  const activeAccent = accentStyles[accentColor];
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const { isLoading } = useSimulatedLoading(() => true);

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview": return <OverviewTab />;
      case "file manager": return <FileManagerTab />;
      case "tools": return <ToolsTab siteId={siteName} />;
      case "domains": return <DomainsTab siteId={siteName} />;
      case "themes": return <ThemesTab siteId={siteName} />;
      case "plugins": return <PluginsTab siteId={siteName} />;
      case "backups": return <BackupsTab siteId={siteName} />;
      case "analytics": return <AnalyticsTab siteId={siteName} />;
      case "caching": return <CachingTab siteId={siteName} />;
      case "users": return <UsersTab siteId={siteName} />;
      case "logs": return <LogsTab siteId={siteName} />;
      case "ssh/sftp": return <SshSftpTab />;
      case "redirects": return <ComingSoonTab title="Redirects" description="Manage URL redirects for your site" icon="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />;
      case "ip deny": return <ComingSoonTab title="IP Deny" description="Block specific IP addresses from accessing your site" icon="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />;
      case "add-ons": return <ComingSoonTab title="Add-ons" description="Extend your site with additional features and integrations" icon="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z" />;
      default: return <OverviewTab />;
    }
  };

  if (isLoading) {
    return (
      <AppShell>
        <SiteDetailSkeleton />
      </AppShell>
    );
  }

  return (
    <AppShell>
      {/* Site Header */}
      <div className={`relative rounded-2xl border overflow-hidden mb-6 ${
        isLight
          ? "bg-white border-slate-200"
          : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"
      }`}>
        {/* Background Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-emerald-500/[0.08] to-transparent rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-violet-500/[0.05] to-transparent rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-sky-500/[0.03] to-transparent rounded-full -translate-x-1/2 -translate-y-1/2" />

        {/* Main Content */}
        <div className="relative p-6">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
            {/* Site Icon */}
            <div className="relative">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-500/25">
                <svg width={32} height={32} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <circle cx={12} cy={12} r={10} />
                  <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                </svg>
              </div>
              {/* Online indicator */}
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${isLight ? "bg-white" : "bg-[var(--bg-secondary)]"}`}>
                <div className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
                </div>
              </div>
            </div>

            {/* Site Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className={`text-2xl font-bold truncate ${isLight ? "text-slate-800" : "text-white"}`}>{siteName}</h1>
                <Chip size="sm" classNames={{ base: "bg-emerald-500/10 border-0", content: "text-emerald-400 font-semibold text-[11px] px-2" }}>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                    Active
                  </span>
                </Chip>
                <Chip size="sm" classNames={{ base: "bg-sky-500/10 border-0", content: "text-sky-400 font-semibold text-[11px] px-2" }}>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    SSL Secured
                  </span>
                </Chip>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm ${isLight ? "text-slate-600" : "text-slate-400"}`}>Pro Plan</span>
                <span className={isLight ? "text-slate-300" : "text-slate-600"}>•</span>
                <button onClick={() => setIsUpgradeOpen(true)} className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors">
                  Upgrade to Business
                  <svg className="w-4 h-4 -scale-x-100" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto sm:flex-shrink-0">
              <Button size="sm" className="font-semibold text-sm text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 hover:border-sky-500/30 rounded-xl px-4 h-10 gap-2 transition-all" startContent={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
              }>Visit Site</Button>
              <Button size="sm" className="font-semibold text-sm text-violet-400 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 hover:border-violet-500/30 rounded-xl px-4 h-10 gap-2 transition-all" startContent={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" /></svg>
              }>WP Admin</Button>
              <Dropdown>
                <DropdownTrigger>
                  <Button size="sm" className="font-semibold text-sm text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/25 rounded-xl px-4 h-10 gap-2 transition-all" startContent={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
                  } endContent={
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M19 9l-7 7-7-7" /></svg>
                  }>Quick Actions</Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Quick Actions"
                  onAction={(key) => {
                    if (key === "server-management") {
                      router.push(createRoute.siteServer(siteName));
                      return;
                    }
                    if (key === "database-management") {
                      router.push(createRoute.siteDatabase(siteName));
                      return;
                    }
                    if (key === "ssl-certificates") {
                      router.push(createRoute.siteSSL(siteName));
                      return;
                    }
                    if (key === "email-management") {
                      router.push(createRoute.siteEmail(siteName));
                      return;
                    }
                    if (key === "staging") {
                      router.push(createRoute.siteStaging(siteName));
                      return;
                    }
                    const messages: Record<string, string> = {
                      backup: "Backup started...",
                      "clear-cache": "Cache cleared successfully",
                      "ssl-check": "SSL check in progress...",
                      "restart-php": "PHP restarted successfully",
                      "restart-server": "Server restart initiated...",
                      "server-logs": "Loading server logs...",
                      "security-scan": "Security scan started...",
                    };
                    const msg = messages[key as string];
                    if (msg) {
                      if (key === "clear-cache" || key === "restart-php") showToast.success(msg);
                      else showToast.info(msg);
                    }
                  }}
                  classNames={{
                    base: `p-1.5 rounded-2xl min-w-[180px] ${isLight ? "bg-white border border-slate-200 shadow-xl" : "bg-[var(--bg-secondary)] border border-[var(--border-tertiary)] shadow-xl shadow-black/20"}`,
                    list: "gap-0.5",
                  }}
                >
                  <DropdownItem key="backup" className={`rounded-xl px-3 py-2 ${isLight ? "data-[hover=true]:bg-slate-100" : "data-[hover=true]:bg-[var(--bg-elevated)]"}`} startContent={<svg className={`w-4 h-4 ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>} textValue="Backup Now"><span className={`text-sm ${isLight ? "text-slate-700" : "text-slate-200"}`}>Backup Now</span></DropdownItem>
                  <DropdownItem key="clear-cache" className={`rounded-xl px-3 py-2 ${isLight ? "data-[hover=true]:bg-slate-100" : "data-[hover=true]:bg-[var(--bg-elevated)]"}`} startContent={<svg className={`w-4 h-4 ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>} textValue="Clear Cache"><span className={`text-sm ${isLight ? "text-slate-700" : "text-slate-200"}`}>Clear Cache</span></DropdownItem>
                  <DropdownItem key="ssl-check" className={`rounded-xl px-3 py-2 ${isLight ? "data-[hover=true]:bg-slate-100" : "data-[hover=true]:bg-[var(--bg-elevated)]"}`} startContent={<svg className={`w-4 h-4 ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>} textValue="SSL Check"><span className={`text-sm ${isLight ? "text-slate-700" : "text-slate-200"}`}>SSL Check</span></DropdownItem>
                  <DropdownItem key="staging" className={`rounded-xl px-3 py-2 ${isLight ? "data-[hover=true]:bg-slate-100" : "data-[hover=true]:bg-[var(--bg-elevated)]"}`} startContent={<svg className={`w-4 h-4 ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" /></svg>} textValue="Staging"><span className={`text-sm ${isLight ? "text-slate-700" : "text-slate-200"}`}>Staging</span></DropdownItem>
                  <DropdownItem key="divider" isReadOnly className="p-0 my-1 cursor-default data-[hover=true]:bg-transparent" textValue="divider"><div className={`h-px mx-2 ${isLight ? "bg-slate-100" : "bg-[var(--bg-overlay)]"}`} /></DropdownItem>
                  <DropdownItem key="server-management" className={`rounded-xl px-3 py-2 ${isLight ? "data-[hover=true]:bg-slate-100" : "data-[hover=true]:bg-[var(--bg-elevated)]"}`} startContent={<svg className={`w-4 h-4 ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" /></svg>} textValue="Server Management"><span className={`text-sm ${isLight ? "text-slate-700" : "text-slate-200"}`}>Server Management</span></DropdownItem>
                  <DropdownItem key="database-management" className={`rounded-xl px-3 py-2 ${isLight ? "data-[hover=true]:bg-slate-100" : "data-[hover=true]:bg-[var(--bg-elevated)]"}`} startContent={<svg className={`w-4 h-4 ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" /></svg>} textValue="Database Management"><span className={`text-sm ${isLight ? "text-slate-700" : "text-slate-200"}`}>Database Management</span></DropdownItem>
                  <DropdownItem key="ssl-certificates" className={`rounded-xl px-3 py-2 ${isLight ? "data-[hover=true]:bg-slate-100" : "data-[hover=true]:bg-[var(--bg-elevated)]"}`} startContent={<svg className={`w-4 h-4 ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>} textValue="SSL / Certificates"><span className={`text-sm ${isLight ? "text-slate-700" : "text-slate-200"}`}>SSL / Certificates</span></DropdownItem>
                  <DropdownItem key="email-management" className={`rounded-xl px-3 py-2 ${isLight ? "data-[hover=true]:bg-slate-100" : "data-[hover=true]:bg-[var(--bg-elevated)]"}`} startContent={<svg className={`w-4 h-4 ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>} textValue="Email Management"><span className={`text-sm ${isLight ? "text-slate-700" : "text-slate-200"}`}>Email Management</span></DropdownItem>
                  <DropdownItem key="restart-php" className={`rounded-xl px-3 py-2 ${isLight ? "data-[hover=true]:bg-slate-100" : "data-[hover=true]:bg-[var(--bg-elevated)]"}`} startContent={<svg className={`w-4 h-4 ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>} textValue="Restart PHP"><span className={`text-sm ${isLight ? "text-slate-700" : "text-slate-200"}`}>Restart PHP</span></DropdownItem>
                  <DropdownItem key="restart-server" className={`rounded-xl px-3 py-2 ${isLight ? "data-[hover=true]:bg-slate-100" : "data-[hover=true]:bg-[var(--bg-elevated)]"}`} startContent={<svg className={`w-4 h-4 ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" /></svg>} textValue="Restart Server"><span className={`text-sm ${isLight ? "text-slate-700" : "text-slate-200"}`}>Restart Server</span></DropdownItem>
                  <DropdownItem key="server-logs" className={`rounded-xl px-3 py-2 ${isLight ? "data-[hover=true]:bg-slate-100" : "data-[hover=true]:bg-[var(--bg-elevated)]"}`} startContent={<svg className={`w-4 h-4 ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>} textValue="Server Logs"><span className={`text-sm ${isLight ? "text-slate-700" : "text-slate-200"}`}>Server Logs</span></DropdownItem>
                  <DropdownItem key="security-scan" className={`rounded-xl px-3 py-2 ${isLight ? "data-[hover=true]:bg-slate-100" : "data-[hover=true]:bg-[var(--bg-elevated)]"}`} startContent={<svg className={`w-4 h-4 ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>} textValue="Security Scan"><span className={`text-sm ${isLight ? "text-slate-700" : "text-slate-200"}`}>Security Scan</span></DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </div>

        {/* Footer Stats Bar */}
        <div className={`relative border-t px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 ${
          isLight
            ? "border-slate-200 bg-slate-50/50"
            : "border-white/[0.04] bg-[var(--bg-primary)]/50"
        }`}>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 md:gap-6 text-xs">
            <span className="flex items-center gap-1.5 text-slate-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
              </svg>
              Server: <span className={isLight ? "text-slate-700" : "text-slate-300"}>us-east-1</span>
            </span>
            <span className={`hidden md:inline ${isLight ? "text-slate-300" : "text-slate-700"}`}>•</span>
            <button onClick={() => { navigator.clipboard.writeText("189.659.543.55"); showToast.success("IP address copied"); }} className={`group flex items-center gap-1.5 text-slate-500 transition-colors ${isLight ? "hover:text-slate-700" : "hover:text-slate-300"}`}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
                IP: <span className={`font-mono ${isLight ? "text-slate-700" : "text-slate-300"}`}>189.659.543.55</span>
              </button>

            <span className={`hidden md:inline ${isLight ? "text-slate-300" : "text-slate-700"}`}>•</span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
              </svg>
              PHP: <span className={isLight ? "text-slate-700" : "text-slate-300"}>8.1</span>
            </span>
            <span className={`hidden md:inline ${isLight ? "text-slate-300" : "text-slate-700"}`}>•</span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
              </svg>
              WP: <span className={isLight ? "text-slate-700" : "text-slate-300"}>6.6.2</span>
            </span>
            <span className={`hidden md:inline ${isLight ? "text-slate-300" : "text-slate-700"}`}>•</span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              Next Payment: <span className={isLight ? "text-slate-700" : "text-slate-300"}>Mar 15, 2026</span>
            </span>
          </div>
          <button className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
            View Site Analytics
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Tab Navigation - Horizontal Scrolling Pills */}
      <div className="lg:hidden mb-6 -mx-2">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 px-2 pb-2">
            {tabList.map((tab) => {
              const isActive = activeTab === tab.name.toLowerCase();
              return (
                <button
                  key={tab.name.toLowerCase()}
                  onClick={() => setActiveTab(tab.name.toLowerCase())}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap text-sm font-medium transition-all shrink-0 ${
                    isActive
                      ? `${activeAccent.bg} ${activeAccent.text} ring-1 ${activeAccent.ring}`
                      : isLight
                        ? "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                        : "bg-[var(--bg-secondary)] border border-[var(--border-tertiary)] text-slate-400 hover:bg-[var(--bg-elevated)] hover:border-[var(--border-primary)]"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d={tab.icon} />
                  </svg>
                  {tab.name}
                  {tab.badge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      isActive ? `${activeAccent.bg} ${activeAccent.text}` : "bg-amber-500/15 text-amber-400"
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Navigation + Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation - Desktop Only */}
        <div className={`hidden lg:block relative rounded-2xl border overflow-hidden min-w-[240px] self-start shadow-xl ${
          isLight
            ? "bg-white border-slate-200 shadow-slate-200/50"
            : "bg-gradient-to-br from-[var(--gradient-card-from)] via-[var(--gradient-card-to)] to-[var(--bg-primary)] border-[var(--border-tertiary)]/80 shadow-black/20"
        }`}>
          {/* Ambient Glow Effects */}
          <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-emerald-500/[0.06] via-emerald-500/[0.02] to-transparent rounded-full -translate-y-1/2 -translate-x-1/2 blur-2xl" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-violet-500/[0.05] via-violet-500/[0.02] to-transparent rounded-full translate-y-1/2 translate-x-1/4 blur-xl" />
          <div className="absolute top-1/2 right-0 w-24 h-24 bg-gradient-to-l from-sky-500/[0.03] to-transparent rounded-full translate-x-1/2 blur-lg" />

          {/* Menu Header */}
          <div className="relative px-5 pt-5 pb-4">
            <h3 className={`text-sm font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>Site Management</h3>
            <p className="text-[10px] text-slate-500 mt-1">Configure your site</p>
          </div>

          {/* Divider */}
          <div className={`mx-4 h-px bg-gradient-to-r from-transparent to-transparent ${isLight ? "via-slate-200" : "via-[var(--bg-overlay)]"}`} />

          {/* Custom Tab List */}
          <div className="relative flex flex-col gap-1 p-3">
            {tabList.map((tab) => {
              const isActive = activeTab === tab.name.toLowerCase();
              return (
                <button
                  key={tab.name.toLowerCase()}
                  onClick={() => setActiveTab(tab.name.toLowerCase())}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-300 group ${
                    isActive
                      ? `${activeAccent.bg} ring-1 ${activeAccent.ring} shadow-lg`
                      : isLight
                        ? "hover:bg-slate-100"
                        : "hover:bg-white/[0.04]"
                  }`}
                >
                  {isActive && (
                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full ${activeAccent.indicator} shadow-lg`} />
                  )}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    isActive
                      ? `${activeAccent.bg} ${activeAccent.text} ring-1 ${activeAccent.ring} shadow-md`
                      : isLight
                        ? "bg-slate-100 text-slate-500 group-hover:text-slate-700 group-hover:bg-slate-200"
                        : "bg-[var(--bg-elevated)]/80 text-slate-500 group-hover:text-slate-300 group-hover:bg-[var(--bg-overlay)]"
                  }`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d={tab.icon} />
                    </svg>
                  </div>
                  <span className={`text-[13px] font-medium flex-1 transition-colors duration-200 ${
                    isActive
                      ? isLight ? "text-slate-900" : "text-white"
                      : isLight
                        ? "text-slate-600 group-hover:text-slate-900"
                        : "text-slate-400 group-hover:text-slate-200"
                  }`}>
                    {tab.name}
                  </span>
                  {tab.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all ${
                      isActive ? `${activeAccent.bg} ${activeAccent.text} ring-1 ${activeAccent.ring}` : "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/20"
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                  {isActive && (
                    <svg className={`w-4 h-4 ${activeAccent.text} transition-transform duration-200`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {renderTabContent()}
        </div>
      </div>

      <UpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
      />
    </AppShell>
  );
}

export default function SitePage() {
  return (
    <Suspense>
      <SitePageContent />
    </Suspense>
  );
}
