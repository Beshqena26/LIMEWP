"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Button, Switch, Chip, Select, SelectItem, Avatar,
  Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
} from "@heroui/react";
import AppShell from "../components/AppShell";
import { UpgradeModal } from "../components/dashboard";
import { OverviewTab } from "../components/site/OverviewTab";
import { SshSftpTab } from "../components/site/SshSftpTab";
import { FileManagerTab } from "../components/site/FileManagerTab";
import { useTheme } from "@/lib/context/ThemeContext";

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
];

function SitePageContent() {
  const searchParams = useSearchParams();
  const siteName = searchParams.get("name") || "limewp.com";
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
  const [cachingToggles, setCachingToggles] = useState<Record<string, boolean>>({
    edge: true,
    fullPage: true,
    object: false,
    cdn: true,
  });
  const [logType, setLogType] = useState("error");
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

  const toggleCaching = (key: string) => setCachingToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  const progressColorMap: Record<string, "success" | "primary" | "secondary" | "warning"> = {
    "bg-emerald-500": "success",
    "bg-sky-500": "primary",
    "bg-violet-500": "secondary",
    "bg-amber-500": "warning",
  };

  const renderTools = () => {
    const tools = [
      // Server - PHP restart: circular arrows suggesting process restart
      { title: "Restart PHP", desc: "Restart the PHP engine for your site", btn: "Restart", icon: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99", category: "Server" },
      // Server - PHP version: cog/gear suggesting configuration
      { title: "PHP Engine", desc: "Select PHP version for your site", select: true, icon: "M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L6.75 2.906m1.814 4.84l-1.15-.964m11.49 9.642l-1.15-.964M5.105 6.214l-1.41-.514m14.095 5.131l-1.41-.514", category: "Server" },
      // Server - IonCube: locked cube suggesting encrypted/decoded content
      { title: "IonCube Loader", desc: "Enable IonCube extension", btn: "Enable", icon: "M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9", category: "Server" },
      // Security - HTTPS: shield with lock suggesting secure connection
      { title: "Force HTTPS", desc: "Redirect all traffic to HTTPS", btn: "Enable", icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z", category: "Security" },
      // Security - Password: key suggesting authentication
      { title: "Password Protection", desc: "Protect your site with a password", btn: "Enable", icon: "M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z", category: "Security" },
      // Development - Debug: bug icon clearly indicating debugging
      { title: "WordPress Debugging", desc: "Enable WP debug mode", btn: "Enable", icon: "M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0112 12.75zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 01-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 9V6m0 0V3m0 3h3m-3 0H9", category: "Development" },
      // Development - Preview: window/browser suggesting site preview
      { title: "Site Preview", desc: "Preview before pointing DNS", btn: "Enable", icon: "M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25", category: "Development" },
      // Database - Search & Replace: document with magnifier suggesting find in content
      { title: "Search & Replace", desc: "Find and replace in database", btn: "Open Tool", icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z", category: "Database" },
      // Performance - Monitoring: chart with pulse suggesting real-time metrics
      { title: "New Relic Monitoring", desc: "Performance monitoring tool", btn: "Configure", icon: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6", category: "Performance" },
      // Performance - Early Hints: rocket suggesting speed boost
      { title: "Early Hints", desc: "Enable 103 Early Hints", btn: "Enable", icon: "M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z", category: "Performance" },
      // Features - Geolocation: map pin on globe suggesting location
      { title: "Geolocation", desc: "Enable geolocation services", btn: "Enable", icon: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z", category: "Features" },
      // Advanced - Remove Cookie: no/ban symbol suggesting removal/block
      { title: "Remove Set-Cookie", desc: "Remove Set-Cookie headers", btn: "Disable", danger: true, icon: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636", category: "Advanced" },
    ];

    // Group tools by category
    const groupedTools = tools.reduce((acc, tool) => {
      if (!acc[tool.category]) acc[tool.category] = [];
      acc[tool.category].push(tool);
      return acc;
    }, {} as Record<string, typeof tools>);

    const categoryConfig: Record<string, { icon: string; count: number }> = {
      // Server: server/computer icon
      Server: { icon: "M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7", count: 0 },
      // Security: shield with checkmark
      Security: { icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z", count: 0 },
      // Development: code brackets for coding
      Development: { icon: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5", count: 0 },
      // Database: cylinder database shape
      Database: { icon: "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375", count: 0 },
      // Performance: speedometer/gauge
      Performance: { icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z", count: 0 },
      // Features: puzzle piece for add-ons
      Features: { icon: "M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z", count: 0 },
      // Advanced: wrench/settings for advanced configuration
      Advanced: { icon: "M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z", count: 0 },
    };

    const categoryOrder = ["Server", "Security", "Development", "Database", "Performance", "Features", "Advanced"];

    return (
      <div className={`rounded-2xl border overflow-hidden ${
        isLight
          ? "bg-white border-zinc-200"
          : "bg-[#1E1E21] border-[#2A2A2E]"
      }`}>
        {/* Header */}
        <div className={`px-6 py-5 border-b ${isLight ? "border-zinc-200" : "border-[#2A2A2E]"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isLight ? "bg-zinc-100 text-zinc-500" : "bg-[#27272A] text-zinc-400"}`}>
                <svg width={18} height={18} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className={`text-sm font-semibold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>Site Tools</h3>
                <p className="text-xs text-zinc-500">{tools.length} tools available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tools by Category */}
        <div className={`divide-y ${isLight ? "divide-zinc-200" : "divide-[#2A2A2E]"}`}>
          {categoryOrder.map((category) => {
            const categoryTools = groupedTools[category];
            if (!categoryTools || categoryTools.length === 0) return null;
            const config = categoryConfig[category];

            return (
              <div key={category} className="p-6">
                {/* Category Header */}
                <div className="flex items-center gap-2.5 mb-4">
                  <div className={`w-6 h-6 rounded-md text-zinc-500 flex items-center justify-center ${isLight ? "bg-zinc-100" : "bg-[#27272A]"}`}>
                    <svg width={14} height={14} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d={config.icon} />
                    </svg>
                  </div>
                  <span className={`text-xs font-semibold uppercase tracking-wider ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>{category}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${isLight ? "text-zinc-500 bg-zinc-100" : "text-zinc-600 bg-[#27272A]"}`}>{categoryTools.length}</span>
                </div>

                {/* Tools List */}
                <div className="space-y-2">
                  {categoryTools.map((tool) => (
                    <div
                      key={tool.title}
                      className={`group flex items-center justify-between gap-4 p-3 rounded-xl border border-transparent transition-all ${
                        isLight
                          ? "bg-zinc-50 hover:bg-zinc-100 hover:border-zinc-200"
                          : "bg-[#18181B] hover:bg-[#27272A]/50 hover:border-[#3F3F46]/50"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                          isLight
                            ? "bg-zinc-100 text-zinc-500 group-hover:text-zinc-600"
                            : "bg-[#27272A] text-zinc-500 group-hover:text-zinc-400"
                        }`}>
                          <svg width={18} height={18} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                            <path d={tool.icon} />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <h4 className={`text-sm font-medium truncate ${isLight ? "text-zinc-700" : "text-zinc-200"}`}>{tool.title}</h4>
                          <p className="text-xs text-zinc-500 truncate">{tool.desc}</p>
                        </div>
                      </div>

                      {/* Action */}
                      <div className="flex-shrink-0">
                        {tool.select ? (
                          <Select
                            aria-label="PHP Version"
                            defaultSelectedKeys={["8.1.1"]}
                            classNames={{
                              trigger: `rounded-lg border-0 h-8 min-h-8 w-[110px] ${isLight ? "bg-zinc-100 text-zinc-700" : "bg-[#27272A] text-zinc-200"}`,
                              value: `text-xs ${isLight ? "text-zinc-700" : "text-zinc-200"}`,
                              popoverContent: `${isLight ? "bg-white text-zinc-700" : "bg-[#27272A] text-zinc-200"}`,
                            }}
                            size="sm"
                          >
                            <SelectItem key="8.1.1">PHP 8.1.1</SelectItem>
                            <SelectItem key="8.0.0">PHP 8.0.0</SelectItem>
                            <SelectItem key="7.4.0">PHP 7.4.0</SelectItem>
                          </Select>
                        ) : tool.danger ? (
                          <button className="h-8 px-4 rounded-lg bg-rose-500/10 text-rose-400 text-xs font-medium hover:bg-rose-500/15 transition-colors">
                            {tool.btn}
                          </button>
                        ) : (
                          <button className={`h-8 px-4 rounded-lg text-xs font-medium transition-colors ${
                            isLight
                              ? "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900"
                              : "bg-[#27272A] text-zinc-300 hover:bg-[#3F3F46] hover:text-zinc-100"
                          }`}>
                            {tool.btn}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDomains = () => {
    const domains = [
      { domain: "limewp.com", primary: true, ssl: true, sslExpiry: "Jan 28, 2027", status: "active", dnsProvider: "Cloudflare" },
      { domain: "www.limewp.com", primary: false, ssl: true, sslExpiry: "Jan 28, 2027", status: "active", dnsProvider: "Cloudflare" },
      { domain: "staging.limewp.com", primary: false, ssl: true, sslExpiry: "Jan 28, 2027", status: "active", dnsProvider: "Cloudflare" },
    ];

    return (
      <div className="space-y-4">
        {/* Domain Cards */}
        {domains.map((row) => (
          <div
            key={row.domain}
            className={`group relative rounded-2xl border overflow-hidden transition-all ${
              isLight
                ? row.primary
                  ? "bg-white border-emerald-500/30 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-zinc-200/50"
                  : "bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-200/50"
                : row.primary
                  ? "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-emerald-500/30 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-black/20"
                  : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E] hover:border-[#3F3F46] hover:shadow-lg hover:shadow-black/20"
            }`}
          >
            {/* Corner Glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${row.primary ? "from-emerald-500/[0.08]" : "from-sky-500/[0.04]"} to-transparent rounded-full -translate-y-1/2 translate-x-1/3`} />

            <div className="relative p-5">
              <div className="flex items-center justify-between gap-4">
                {/* Domain Info */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className={`w-12 h-12 rounded-xl ${row.primary ? "bg-emerald-500/10 ring-1 ring-emerald-500/20" : "bg-sky-500/10 ring-1 ring-sky-500/20"} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                    <svg className={`w-6 h-6 ${row.primary ? "text-emerald-400" : "text-sky-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-base font-semibold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>{row.domain}</span>
                      {row.primary && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
                          Primary
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7" />
                        </svg>
                        {row.dnsProvider}
                      </span>
                      <span className="text-zinc-600">•</span>
                      <span>SSL expires {row.sslExpiry}</span>
                    </div>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  {/* Active Status */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                    </span>
                    <span className="text-xs font-semibold text-emerald-400">Active</span>
                  </div>

                  {/* SSL Status */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-500/10 ring-1 ring-sky-500/20">
                    <svg className="w-3.5 h-3.5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-xs font-semibold text-sky-400">SSL</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                    <button className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      isLight
                        ? "bg-zinc-100 hover:bg-zinc-200"
                        : "bg-[#27272A]/70 hover:bg-[#3F3F46]"
                    }`}>
                        <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                        </svg>
                      </button>

                    <button className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      isLight
                        ? "bg-zinc-100 hover:bg-zinc-200"
                        : "bg-[#27272A]/70 hover:bg-[#3F3F46]"
                    }`}>
                        <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                      </button>

                    {!row.primary && (
                      <button className="w-8 h-8 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 flex items-center justify-center transition-all ring-1 ring-emerald-500/20">
                          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                          </svg>
                        </button>

                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add Domain Button */}
        <button className={`w-full group relative rounded-2xl border border-dashed p-5 transition-all overflow-hidden ${
          isLight
            ? "bg-zinc-50 border-zinc-300 hover:border-emerald-500/40"
            : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#3F3F46] hover:border-emerald-500/40"
        }`}>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/[0.02] to-sky-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div className="text-left">
              <span className={`text-sm font-semibold group-hover:text-emerald-400 transition-colors ${isLight ? "text-zinc-700" : "text-zinc-200"}`}>Add New Domain</span>
              <p className="text-xs text-zinc-500">Point a new domain to this site</p>
            </div>
          </div>
        </button>
      </div>
    );
  };

  const renderThemes = () => {
    const themes = [
      {
        name: "flavor starter theme",
        version: "2.4.1",
        active: true,
        gradient: "from-emerald-600 via-teal-600 to-cyan-600",
        author: "Limestarter",
        description: "A modern, lightweight starter theme optimized for speed",
        lastUpdated: "2 days ago",
        color: "emerald"
      },
      {
        name: "flavor starter theme Developer Edition",
        version: "6.4",
        active: false,
        gradient: "from-violet-600 via-purple-600 to-fuchsia-600",
        author: "flavor starter theme",
        description: "Premium developer theme with advanced customization options",
        lastUpdated: "1 week ago",
        color: "violet"
      },
      {
        name: "flavor starter theme starter",
        version: "3.2.0",
        active: false,
        gradient: "from-amber-600 via-orange-600 to-rose-600",
        author: "flavor starter theme Inc",
        description: "Perfect starter theme for blogs and portfolios",
        lastUpdated: "3 weeks ago",
        color: "amber"
      },
    ];

    const themeColorMap: Record<string, { bg: string; text: string; ring: string; glow: string }> = {
      emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "ring-emerald-500/20", glow: "from-emerald-500/10" },
      violet: { bg: "bg-violet-500/10", text: "text-violet-400", ring: "ring-violet-500/20", glow: "from-violet-500/10" },
      amber: { bg: "bg-amber-500/10", text: "text-amber-400", ring: "ring-amber-500/20", glow: "from-amber-500/10" },
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {themes.map((theme) => {
          const colors = themeColorMap[theme.color] || themeColorMap.emerald;
          return (
            <div
              key={theme.name}
              className={`group relative border rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                isLight
                  ? theme.active
                    ? "bg-white border-emerald-500/40 shadow-lg shadow-emerald-500/10 hover:shadow-zinc-200/50"
                    : "bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-zinc-200/50"
                  : theme.active
                    ? "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-emerald-500/40 shadow-lg shadow-emerald-500/10 hover:shadow-black/20"
                    : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E] hover:border-[#3F3F46] hover:shadow-black/20"
              }`}
            >
              {/* Theme Preview */}
              <div className={`h-36 bg-gradient-to-br ${theme.gradient} relative overflow-hidden`}>
                {/* Pattern Overlay */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-50" />

                {/* Decorative Elements */}
                <div className="absolute inset-4 border border-white/10 rounded-lg" />
                <div className="absolute top-6 left-6 right-6 h-2 bg-white/20 rounded-full" />
                <div className="absolute top-10 left-6 w-1/3 h-1.5 bg-white/15 rounded-full" />
                <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-2">
                  <div className="h-8 bg-white/10 rounded" />
                  <div className="h-8 bg-white/10 rounded" />
                  <div className="h-8 bg-white/10 rounded" />
                </div>

                {/* Active Badge */}
                {theme.active && (
                  <div className="absolute top-3 right-3">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-emerald-500/30">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                      </span>
                      Active
                    </span>
                  </div>
                )}

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
                  <button className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all backdrop-blur-sm">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  
                  <button className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all backdrop-blur-sm">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                      </svg>
                    </button>
                  
                </div>
              </div>

              {/* Theme Info */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className={`font-semibold text-[15px] capitalize leading-tight ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>{theme.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${colors.bg} ${colors.text} ring-1 ${colors.ring} flex-shrink-0`}>
                    v{theme.version}
                  </span>
                </div>

                <p className={`text-xs mb-3 line-clamp-2 ${isLight ? "text-zinc-600" : "text-zinc-500"}`}>{theme.description}</p>

                <div className={`flex items-center gap-3 mb-4 text-[11px] ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    {theme.author}
                  </div>
                  <span className={isLight ? "text-zinc-400" : "text-zinc-600"}>•</span>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {theme.lastUpdated}
                  </div>
                </div>

                {/* Actions */}
                {theme.active ? (
                  <button className="w-full h-9 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                    </svg>
                    Customize
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button className={`flex-1 h-9 rounded-xl text-sm font-medium transition-all ring-1 flex items-center justify-center gap-1.5 ${
                      isLight
                        ? "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 ring-zinc-200"
                        : "bg-[#27272A]/70 text-zinc-200 hover:bg-[#3F3F46] ring-[#3F3F46]"
                    }`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      Activate
                    </button>
                    <button className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all ring-1 ring-rose-500/20 flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>

                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderPlugins = () => {
    const plugins = [
      {
        name: "LimeWP MU-Plugin",
        version: "1.2.0",
        active: true,
        autoUpdate: true,
        icon: "LW",
        gradient: "from-emerald-500 to-teal-500",
        author: "LimeWP Team",
        description: "Essential must-use plugin for LimeWP hosting optimization and security",
        downloads: "50K+",
        lastUpdated: "1 week ago",
        color: "emerald",
        featured: true
      },
      {
        name: "Yoast SEO",
        version: "21.5",
        active: true,
        autoUpdate: true,
        icon: "YS",
        gradient: "from-sky-500 to-blue-500",
        author: "Yoast",
        description: "The #1 WordPress SEO plugin for optimizing your site's search rankings",
        downloads: "5M+",
        lastUpdated: "3 days ago",
        color: "sky",
        featured: false
      },
      {
        name: "WooCommerce",
        version: "8.4.0",
        active: false,
        autoUpdate: false,
        icon: "WC",
        gradient: "from-violet-500 to-purple-500",
        author: "Automattic",
        description: "The most popular eCommerce platform for WordPress stores",
        downloads: "10M+",
        lastUpdated: "5 days ago",
        color: "violet",
        featured: false
      },
      {
        name: "Contact Form 7",
        version: "5.8.5",
        active: true,
        autoUpdate: true,
        icon: "CF",
        gradient: "from-amber-500 to-orange-500",
        author: "Takayuki Miyoshi",
        description: "Simple but flexible contact form builder with spam protection",
        downloads: "5M+",
        lastUpdated: "2 weeks ago",
        color: "amber",
        featured: false
      },
    ];

    const pluginColorMap: Record<string, { bg: string; text: string; ring: string; glow: string }> = {
      emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "ring-emerald-500/20", glow: "from-emerald-500/10" },
      sky: { bg: "bg-sky-500/10", text: "text-sky-400", ring: "ring-sky-500/20", glow: "from-sky-500/10" },
      violet: { bg: "bg-violet-500/10", text: "text-violet-400", ring: "ring-violet-500/20", glow: "from-violet-500/10" },
      amber: { bg: "bg-amber-500/10", text: "text-amber-400", ring: "ring-amber-500/20", glow: "from-amber-500/10" },
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {plugins.map((plugin) => {
          const colors = pluginColorMap[plugin.color] || pluginColorMap.emerald;
          return (
            <div
              key={plugin.name}
              className={`group relative border rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                isLight
                  ? plugin.active
                    ? "bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-zinc-200/50"
                    : "bg-white border-zinc-200/70 hover:border-zinc-300/50 hover:shadow-zinc-200/50"
                  : plugin.active
                    ? "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E] hover:border-[#3F3F46] hover:shadow-black/20"
                    : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E]/70 hover:border-[#3F3F46]/50 hover:shadow-black/20"
              }`}
            >
              {/* Corner Glow */}
              <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${colors.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-60`} />

              <div className="relative p-5">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  {/* Plugin Icon */}
                  <div className="relative flex-shrink-0">
                    <div className={`absolute inset-0 bg-gradient-to-br ${plugin.gradient} rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity`} />
                    <Avatar
                      name={plugin.icon}
                      size="lg"
                      classNames={{
                        base: `relative w-14 h-14 bg-gradient-to-br ${plugin.gradient} ring-2 ring-white/10`,
                        name: "text-white text-sm font-bold",
                      }}
                    />
                    {plugin.active && (
                      <span className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full ring-2 flex items-center justify-center ${isLight ? "ring-white" : "ring-[#1E1E21]"}`}>
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    )}
                  </div>

                  {/* Plugin Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold text-[15px] truncate ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>{plugin.name}</h3>
                      {plugin.featured && (
                        <span className="flex-shrink-0 w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                          </span>
                        
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${colors.bg} ${colors.text} ring-1 ${colors.ring}`}>
                        v{plugin.version}
                      </span>
                      {plugin.active ? (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md ring-1 ring-emerald-500/20">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
                          </span>
                          Active
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-zinc-500 bg-zinc-500/10 px-2 py-0.5 rounded-md ring-1 ring-zinc-500/20">
                          Inactive
                        </span>
                      )}
                      {plugin.autoUpdate && (
                        <span className="flex items-center gap-1 text-[10px] font-medium text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded-md ring-1 ring-sky-500/20">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                              <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                            </svg>
                          </span>
                        
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className={`text-xs mb-4 leading-relaxed line-clamp-2 ${isLight ? "text-zinc-600" : "text-zinc-500"}`}>{plugin.description}</p>

                {/* Meta Info */}
                <div className={`flex items-center gap-4 mb-4 text-[11px] ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    <span>{plugin.author}</span>
                  </div>
                  <span className={isLight ? "text-zinc-400" : "text-zinc-600"}>•</span>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    <span>{plugin.downloads}</span>
                  </div>
                  <span className="text-zinc-600">•</span>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{plugin.lastUpdated}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className={`flex items-center gap-2 pt-4 border-t ${isLight ? "border-zinc-200" : "border-[#2A2A2E]"}`}>
                  {plugin.active ? (
                    <>
                      <button className={`flex-1 h-9 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ring-1 ${
                        isLight
                          ? "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 ring-zinc-200"
                          : "bg-gradient-to-r from-zinc-700 to-zinc-800 text-zinc-200 hover:from-zinc-600 hover:to-zinc-700 ring-white/5"
                      }`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                      </button>
                      <button className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-all ring-1 ring-amber-500/20 flex items-center justify-center">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
                          </svg>
                        </button>
                      
                      <button className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all ring-1 ring-rose-500/20 flex items-center justify-center">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      
                    </>
                  ) : (
                    <>
                      <button className="flex-1 h-9 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                        Activate
                      </button>
                      <button className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all ring-1 ring-rose-500/20 flex items-center justify-center">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderBackups = () => {
    const backupStats = [
      { label: "Total Backups", value: "14", subtext: "Last 30 days", icon: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z", color: "emerald" },
      { label: "Auto Backup", value: "Daily", subtext: "Next: 3:00 AM", icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z", color: "sky" },
      { label: "Storage Used", value: "2.4 GB", subtext: "of 10 GB", icon: "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375", color: "violet" },
      { label: "Retention", value: "30 days", subtext: "Auto-cleanup", icon: "M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3", color: "amber" },
    ];

    const backupColorMap: Record<string, { bg: string; text: string; ring: string; glow: string; iconBg: string }> = {
      emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "ring-emerald-500/20", glow: "from-emerald-500/10", iconBg: "from-emerald-500/20 to-emerald-600/20" },
      sky: { bg: "bg-sky-500/10", text: "text-sky-400", ring: "ring-sky-500/20", glow: "from-sky-500/10", iconBg: "from-sky-500/20 to-sky-600/20" },
      violet: { bg: "bg-violet-500/10", text: "text-violet-400", ring: "ring-violet-500/20", glow: "from-violet-500/10", iconBg: "from-violet-500/20 to-violet-600/20" },
      amber: { bg: "bg-amber-500/10", text: "text-amber-400", ring: "ring-amber-500/20", glow: "from-amber-500/10", iconBg: "from-amber-500/20 to-amber-600/20" },
    };

    const backups = [
      {
        id: "bkp-001",
        name: "Full Site Backup",
        date: "Jan 27, 2026",
        time: "3:00 AM",
        size: "856 MB",
        type: "automatic",
        status: "completed",
        includes: ["Files", "Database", "Media"],
        color: "emerald",
      },
      {
        id: "bkp-002",
        name: "Full Site Backup",
        date: "Jan 26, 2026",
        time: "3:00 AM",
        size: "842 MB",
        type: "automatic",
        status: "completed",
        includes: ["Files", "Database", "Media"],
        color: "emerald",
      },
      {
        id: "bkp-003",
        name: "Pre-Update Backup",
        date: "Jan 25, 2026",
        time: "2:15 PM",
        size: "838 MB",
        type: "manual",
        status: "completed",
        includes: ["Files", "Database"],
        color: "sky",
      },
      {
        id: "bkp-004",
        name: "Database Only",
        date: "Jan 24, 2026",
        time: "11:30 AM",
        size: "124 MB",
        type: "manual",
        status: "completed",
        includes: ["Database"],
        color: "violet",
      },
      {
        id: "bkp-005",
        name: "Full Site Backup",
        date: "Jan 23, 2026",
        time: "3:00 AM",
        size: "835 MB",
        type: "automatic",
        status: "completed",
        includes: ["Files", "Database", "Media"],
        color: "emerald",
      },
    ];

    return (
      <div>
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {backupStats.map((stat) => {
            const colors = backupColorMap[stat.color];
            return (
              <div key={stat.label} className={`group relative border rounded-2xl p-5 overflow-hidden transition-all duration-300 ${
                isLight
                  ? "bg-white border-zinc-200 hover:border-zinc-300"
                  : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E] hover:border-[#3F3F46]"
              }`}>
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${colors.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-60`} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colors.iconBg} ${colors.text} ring-1 ${colors.ring} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d={stat.icon} />
                      </svg>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold mb-1 ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>{stat.value}</div>
                  <div className="text-xs text-zinc-500">{stat.label}</div>
                  <div className={`text-[10px] ${colors.text} mt-1`}>{stat.subtext}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <h3 className={`text-sm font-semibold ${isLight ? "text-zinc-700" : "text-zinc-300"}`}>Backup History</h3>
            <Chip
              size="sm"
              classNames={{
                base: "bg-emerald-500/10 border-0",
                content: "text-emerald-400 font-semibold text-[10px]"
              }}
            >
              {backups.length} backups
            </Chip>
          </div>
          <div className="flex items-center gap-2">
            <Button
                variant="bordered"
                size="sm"
                className={`font-medium ${isLight ? "text-zinc-700 border-zinc-300 hover:border-zinc-400" : "text-zinc-300 border-[#3F3F46] hover:border-zinc-500"}`}
                startContent={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                  </svg>
                }
              >
                Settings
              </Button>
            
            <Button
              color="success"
              className="font-semibold text-white shadow-lg shadow-emerald-500/20"
              startContent={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 4v16m8-8H4" />
                </svg>
              }
            >
              Create Backup
            </Button>
          </div>
        </div>

        {/* Backup Cards */}
        <div className="space-y-3">
          {backups.map((backup, index) => {
            const colors = backupColorMap[backup.color];
            const isLatest = index === 0;
            return (
              <div
                key={backup.id}
                className={`group relative border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg ${
                  isLight
                    ? isLatest
                      ? "bg-white border-emerald-500/30 hover:border-emerald-500/50 hover:shadow-zinc-200/50"
                      : "bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-zinc-200/50"
                    : isLatest
                      ? "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-emerald-500/30 hover:border-emerald-500/50 hover:shadow-black/20"
                      : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E] hover:border-[#3F3F46] hover:shadow-black/20"
                }`}
              >
                {/* Corner Glow */}
                <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${colors.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-50`} />

                <div className="relative p-5">
                  <div className="flex items-start gap-4">
                    {/* Backup Icon */}
                    <div className="relative flex-shrink-0">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.iconBg} ${colors.text} ring-1 ${colors.ring} flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg`}>
                        {backup.type === "automatic" ? (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                          </svg>
                        )}
                      </div>
                      {isLatest && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className={`relative inline-flex rounded-full h-3 w-3 bg-emerald-500 ring-2 ${isLight ? "ring-white" : "ring-[#1E1E21]"}`}></span>
                        </span>
                      )}
                    </div>

                    {/* Backup Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`font-semibold text-[15px] ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>{backup.name}</span>
                        {isLatest && (
                          <Chip
                            size="sm"
                            classNames={{
                              base: "bg-emerald-500/10 border-0 h-5",
                              content: "text-emerald-400 font-bold text-[9px] px-0"
                            }}
                          >
                            LATEST
                          </Chip>
                        )}
                        <Chip
                          size="sm"
                          variant="flat"
                          classNames={{
                            base: `${backup.type === "automatic" ? "bg-sky-500/10" : "bg-violet-500/10"} border-0 h-5`,
                            content: `${backup.type === "automatic" ? "text-sky-400" : "text-violet-400"} font-semibold text-[10px] px-0 capitalize`
                          }}
                        >
                          {backup.type}
                        </Chip>
                      </div>

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                          </svg>
                          <span>{backup.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{backup.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
                          </svg>
                          <span className="font-mono">{backup.size}</span>
                        </div>
                      </div>

                      {/* Includes Tags */}
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-zinc-600">Includes:</span>
                        <div className="flex gap-1.5">
                          {backup.includes.map((item) => (
                            <span
                              key={item}
                              className={`text-[10px] font-medium px-2 py-0.5 rounded-md ring-1 ${
                                isLight
                                  ? "text-zinc-500 bg-zinc-100 ring-zinc-200"
                                  : "text-zinc-400 bg-[#27272A] ring-[#3F3F46]"
                              }`}
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                      <button className="h-9 px-3.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-all ring-1 ring-emerald-500/20 flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                          </svg>
                          Restore
                        </button>
                      
                      <button className={`h-9 w-9 rounded-lg flex items-center justify-center transition-all ring-1 ${
                        isLight
                          ? "bg-zinc-100 hover:bg-zinc-200 ring-zinc-200"
                          : "bg-[#27272A]/70 hover:bg-[#3F3F46] ring-[#3F3F46]"
                      }`}>
                          <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                        </button>

                      <button className={`h-9 w-9 rounded-lg flex items-center justify-center transition-all ring-1 ${
                        isLight
                          ? "bg-zinc-100 hover:bg-rose-500/10 ring-zinc-200 hover:ring-rose-500/30"
                          : "bg-[#27272A]/70 hover:bg-rose-500/10 ring-[#3F3F46] hover:ring-rose-500/30"
                      }`}>
                          <svg className="w-4 h-4 text-zinc-400 hover:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View More */}
        <div className="mt-4 flex justify-center">
          <button className="flex items-center gap-2 text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors group/btn">
            <span>View all backups</span>
            <svg className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  const renderAnalytics = () => {
    const analyticsStats = [
      { label: "Total Visits", value: "8,734", change: "+12.5%", positive: true, color: "emerald", icon: "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z", subtext: "Unique visitors" },
      { label: "Page Views", value: "24,521", change: "+8.2%", positive: true, color: "sky", icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z", subtext: "2.8 pages/visit" },
      { label: "Bounce Rate", value: "42.3%", change: "+2.1%", positive: false, color: "rose", icon: "M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3", subtext: "Single page visits" },
      { label: "Avg Session", value: "3m 24s", change: "+5.8%", positive: true, color: "violet", icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z", subtext: "Time on site" },
    ];

    const analyticsColorMap: Record<string, { bg: string; text: string; ring: string; glow: string; iconBg: string }> = {
      emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "ring-emerald-500/20", glow: "from-emerald-500/10", iconBg: "from-emerald-500/20 to-emerald-600/20" },
      sky: { bg: "bg-sky-500/10", text: "text-sky-400", ring: "ring-sky-500/20", glow: "from-sky-500/10", iconBg: "from-sky-500/20 to-sky-600/20" },
      rose: { bg: "bg-rose-500/10", text: "text-rose-400", ring: "ring-rose-500/20", glow: "from-rose-500/10", iconBg: "from-rose-500/20 to-rose-600/20" },
      violet: { bg: "bg-violet-500/10", text: "text-violet-400", ring: "ring-violet-500/20", glow: "from-violet-500/10", iconBg: "from-violet-500/20 to-violet-600/20" },
      amber: { bg: "bg-amber-500/10", text: "text-amber-400", ring: "ring-amber-500/20", glow: "from-amber-500/10", iconBg: "from-amber-500/20 to-amber-600/20" },
    };

    const topPages = [
      { page: "/", title: "Homepage", views: "4,521", pct: 45 },
      { page: "/blog", title: "Blog", views: "2,134", pct: 21 },
      { page: "/contact", title: "Contact", views: "1,245", pct: 13 },
      { page: "/about", title: "About Us", views: "892", pct: 9 },
      { page: "/services", title: "Services", views: "729", pct: 7 },
    ];

    const trafficSources = [
      { source: "Organic Search", visits: "4,234", pct: 48, color: "emerald", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
      { source: "Direct", visits: "2,156", pct: 25, color: "sky", icon: "M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" },
      { source: "Social Media", visits: "1,567", pct: 18, color: "violet", icon: "M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" },
      { source: "Referrals", visits: "777", pct: 9, color: "amber", icon: "M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" },
    ];

    return (
      <div>
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {analyticsStats.map((stat) => {
            const colors = analyticsColorMap[stat.color];
            return (
              <div key={stat.label} className={`group relative border rounded-2xl p-5 overflow-hidden transition-all duration-300 ${
                isLight
                  ? "bg-white border-zinc-200 hover:border-zinc-300"
                  : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E] hover:border-[#3F3F46]"
              }`}>
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${colors.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-60`} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colors.iconBg} ${colors.text} ring-1 ${colors.ring} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d={stat.icon} />
                      </svg>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 ${stat.positive ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20" : "bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20"}`}>
                      <svg className={`w-3 h-3 ${stat.positive ? "" : "rotate-180"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 15l7-7 7 7" />
                      </svg>
                      {stat.change}
                    </span>
                  </div>
                  <div className={`text-2xl font-bold mb-1 ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>{stat.value}</div>
                  <div className="text-xs text-zinc-500">{stat.label}</div>
                  <div className={`text-[10px] ${colors.text} mt-1`}>{stat.subtext}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {/* Traffic Chart Placeholder */}
          <div className={`relative border rounded-2xl overflow-hidden ${
            isLight
              ? "bg-white border-zinc-200"
              : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E]"
          }`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-500/[0.06] to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-sky-500/[0.04] to-transparent rounded-full translate-y-1/2 -translate-x-1/4" />

            <div className={`relative p-5 border-b ${isLight ? "border-zinc-200" : "border-[#2A2A2E]"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 text-emerald-400 ring-1 ring-emerald-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className={`text-sm font-semibold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>Traffic Overview</h3>
                    <p className="text-[11px] text-zinc-500">Last 30 days</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className={`text-[11px] font-medium px-2.5 py-1.5 rounded-lg transition-colors ${
                    isLight
                      ? "text-zinc-500 hover:text-zinc-700 bg-zinc-100 hover:bg-zinc-200"
                      : "text-zinc-400 hover:text-zinc-200 bg-[#27272A] hover:bg-[#3F3F46]"
                  }`}>7D</button>
                  <button className="text-[11px] font-medium text-emerald-400 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20">30D</button>
                  <button className={`text-[11px] font-medium px-2.5 py-1.5 rounded-lg transition-colors ${
                    isLight
                      ? "text-zinc-500 hover:text-zinc-700 bg-zinc-100 hover:bg-zinc-200"
                      : "text-zinc-400 hover:text-zinc-200 bg-[#27272A] hover:bg-[#3F3F46]"
                  }`}>90D</button>
                </div>
              </div>
            </div>

            <div className="relative h-52 flex flex-col items-center justify-center gap-3 p-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-sky-500/15 flex items-center justify-center ring-1 ring-emerald-500/20">
                <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <span className={`text-sm font-medium ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>Chart coming soon</span>
              <span className="text-xs text-zinc-500">Interactive traffic visualization</span>
            </div>
          </div>

          {/* Traffic Sources */}
          <div className={`relative border rounded-2xl overflow-hidden ${
            isLight
              ? "bg-white border-zinc-200"
              : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E]"
          }`}>
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-violet-500/[0.06] to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />

            <div className={`relative p-5 border-b ${isLight ? "border-zinc-200" : "border-[#2A2A2E]"}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-600/20 text-violet-400 ring-1 ring-violet-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                  </svg>
                </div>
                <div>
                  <h3 className={`text-sm font-semibold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>Traffic Sources</h3>
                  <p className="text-[11px] text-zinc-500">Where visitors come from</p>
                </div>
              </div>
            </div>

            <div className="relative p-4 space-y-3">
              {trafficSources.map((source) => {
                const colors = analyticsColorMap[source.color];
                return (
                  <div key={source.source} className={`group flex items-center gap-4 p-3 rounded-xl transition-colors ${
                    isLight ? "hover:bg-zinc-50" : "hover:bg-white/[0.02]"
                  }`}>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.iconBg} ${colors.text} ring-1 ${colors.ring} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d={source.icon} />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-sm font-medium ${isLight ? "text-zinc-700" : "text-zinc-200"}`}>{source.source}</span>
                        <span className={`text-sm font-semibold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>{source.visits}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${isLight ? "bg-zinc-200" : "bg-[#27272A]"}`}>
                          <div className={`h-full ${colors.bg} rounded-full transition-all duration-500`} style={{ width: `${source.pct}%` }} />
                        </div>
                        <span className={`text-[11px] font-semibold ${colors.text}`}>{source.pct}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Pages */}
        <div className={`relative border rounded-2xl overflow-hidden ${
          isLight
            ? "bg-white border-zinc-200"
            : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E]"
        }`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-sky-500/[0.04] to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />

          <div className={`relative p-5 border-b ${isLight ? "border-zinc-200" : "border-[#2A2A2E]"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500/20 to-sky-600/20 text-sky-400 ring-1 ring-sky-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <div>
                  <h3 className={`text-sm font-semibold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>Top Pages</h3>
                  <p className="text-[11px] text-zinc-500">Most visited pages</p>
                </div>
              </div>
              <button className="flex items-center gap-1.5 text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors">
                <span>View all</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </div>

          <div className={`relative divide-y ${isLight ? "divide-zinc-200" : "divide-[#2A2A2E]"}`}>
            {topPages.map((page, index) => (
              <div key={page.page} className={`group flex items-center gap-4 px-5 py-4 transition-colors ${
                isLight ? "hover:bg-zinc-50" : "hover:bg-white/[0.02]"
              }`}>
                <div className={`w-8 h-8 rounded-lg ring-1 flex items-center justify-center flex-shrink-0 ${
                  isLight ? "bg-zinc-100 ring-zinc-200" : "bg-[#27272A] ring-[#3F3F46]"
                }`}>
                  <span className={`text-xs font-bold ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-sm font-medium truncate ${isLight ? "text-zinc-700" : "text-zinc-200"}`}>{page.title}</span>
                    <span className="text-xs text-zinc-500 font-mono">{page.page}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`flex-1 h-1 rounded-full overflow-hidden max-w-[200px] ${isLight ? "bg-zinc-200" : "bg-[#27272A]"}`}>
                      <div className="h-full bg-sky-500/30 rounded-full transition-all duration-500" style={{ width: `${page.pct}%` }} />
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`text-sm font-semibold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>{page.views}</div>
                  <div className="text-[11px] text-zinc-500">{page.pct}% of total</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderCaching = () => {
    const cacheStats = [
      { label: "Cache Hit Rate", value: "94.7%", subtext: "Excellent", icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "emerald" },
      { label: "Cached Objects", value: "2,847", subtext: "Last 24h", icon: "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375", color: "sky" },
      { label: "Bandwidth Saved", value: "1.2 GB", subtext: "This month", icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z", color: "violet" },
      { label: "Avg Response", value: "42ms", subtext: "-68% faster", icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z", color: "amber" },
    ];

    const cacheColorMap: Record<string, { bg: string; text: string; ring: string; glow: string; iconBg: string; border: string; activeBorder: string }> = {
      emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "ring-emerald-500/20", glow: "from-emerald-500/10", iconBg: "from-emerald-500/20 to-emerald-600/20", border: "border-[#2A2A2E]", activeBorder: "border-emerald-500/40" },
      sky: { bg: "bg-sky-500/10", text: "text-sky-400", ring: "ring-sky-500/20", glow: "from-sky-500/10", iconBg: "from-sky-500/20 to-sky-600/20", border: "border-[#2A2A2E]", activeBorder: "border-sky-500/40" },
      violet: { bg: "bg-violet-500/10", text: "text-violet-400", ring: "ring-violet-500/20", glow: "from-violet-500/10", iconBg: "from-violet-500/20 to-violet-600/20", border: "border-[#2A2A2E]", activeBorder: "border-violet-500/40" },
      amber: { bg: "bg-amber-500/10", text: "text-amber-400", ring: "ring-amber-500/20", glow: "from-amber-500/10", iconBg: "from-amber-500/20 to-amber-600/20", border: "border-[#2A2A2E]", activeBorder: "border-amber-500/40" },
    };

    const cachingOptions = [
      { key: "edge", label: "Edge Caching", desc: "Cache at the network edge for fastest delivery. Reduces latency by serving content from the nearest location.", color: "emerald", icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z", hitRate: "97.2%", objects: "1,245" },
      { key: "fullPage", label: "Full Page Caching", desc: "Cache entire HTML pages for repeat visitors. Perfect for static content and logged-out users.", color: "sky", icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z", hitRate: "89.4%", objects: "892" },
      { key: "object", label: "Object Caching", desc: "Cache database queries and API responses. Speeds up dynamic content and reduces database load.", color: "violet", icon: "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375", hitRate: "94.8%", objects: "456" },
      { key: "cdn", label: "CDN Integration", desc: "Serve static assets from global CDN network. 200+ edge locations worldwide for optimal performance.", color: "amber", icon: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418", hitRate: "99.1%", objects: "254" },
    ];

    return (
      <div>
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {cacheStats.map((stat) => {
            const colors = cacheColorMap[stat.color];
            return (
              <div key={stat.label} className={`group relative border rounded-2xl p-5 overflow-hidden transition-all duration-300 ${
                isLight
                  ? "bg-white border-zinc-200 hover:border-zinc-300"
                  : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E] hover:border-[#3F3F46]"
              }`}>
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${colors.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-60`} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colors.iconBg} ${colors.text} ring-1 ${colors.ring} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d={stat.icon} />
                      </svg>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold mb-1 ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>{stat.value}</div>
                  <div className="text-xs text-zinc-500">{stat.label}</div>
                  <div className={`text-[10px] ${colors.text} mt-1`}>{stat.subtext}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <h3 className={`text-sm font-semibold ${isLight ? "text-zinc-700" : "text-zinc-300"}`}>Cache Configuration</h3>
            <Chip
              size="sm"
              classNames={{
                base: "bg-emerald-500/10 border-0",
                content: "text-emerald-400 font-semibold text-[10px]"
              }}
            >
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                All systems active
              </span>
            </Chip>
          </div>
          <div className="flex items-center gap-2">
            <Button
                variant="bordered"
                size="sm"
                className={`font-medium ${isLight ? "text-zinc-700 border-zinc-300 hover:border-zinc-400" : "text-zinc-300 border-[#3F3F46] hover:border-zinc-500"}`}
                startContent={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                }
              >
                Analytics
              </Button>
            
            <Button
              color="success"
              className="font-semibold text-white shadow-lg shadow-emerald-500/20"
              startContent={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              }
            >
              Clear All Cache
            </Button>
          </div>
        </div>

        {/* Caching Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {cachingOptions.map((item) => {
            const colors = cacheColorMap[item.color];
            const isOn = cachingToggles[item.key];
            return (
              <div
                key={item.key}
                className={`group relative border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isLight
                    ? isOn
                      ? "bg-white border-emerald-500/30 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-zinc-200/50"
                      : "bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-200/50"
                    : `bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] ${isOn ? colors.activeBorder : colors.border} hover:border-[#3F3F46] hover:shadow-lg hover:shadow-black/20`
                }`}
              >
                {/* Corner Glow */}
                {isOn && (
                  <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${colors.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-70`} />
                )}

                <div className="relative p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-4">
                      <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${colors.iconBg} ${colors.text} ring-1 ${colors.ring} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                          <path d={item.icon} />
                        </svg>
                        {isOn && (
                          <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className={`relative inline-flex rounded-full h-3 w-3 bg-emerald-500 ring-2 ${isLight ? "ring-white" : "ring-[#1E1E21]"}`}></span>
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-semibold text-[15px] ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>{item.label}</h3>
                          <Chip
                            size="sm"
                            classNames={{
                              base: `${isOn ? "bg-emerald-500/10" : "bg-zinc-500/10"} border-0 h-5`,
                              content: `${isOn ? "text-emerald-400" : "text-zinc-400"} font-semibold text-[10px] px-0`
                            }}
                          >
                            {isOn ? "Active" : "Inactive"}
                          </Chip>
                        </div>
                        <p className={`text-sm leading-relaxed ${isLight ? "text-zinc-600" : "text-zinc-500"}`}>{item.desc}</p>
                      </div>
                    </div>
                    <Switch
                      isSelected={isOn}
                      onValueChange={() => toggleCaching(item.key)}
                      classNames={{
                        wrapper: `${isOn ? "!bg-emerald-500" : isLight ? "bg-zinc-300" : "bg-zinc-600"}`,
                      }}
                    />
                  </div>

                  {/* Stats Row */}
                  {isOn && (
                    <div className={`flex items-center gap-4 pt-4 border-t ${isLight ? "border-zinc-200" : "border-[#2A2A2E]"}`}>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className={`text-xs ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>Hit rate:</span>
                        <span className={`text-xs font-semibold ${colors.text}`}>{item.hitRate}</span>
                      </div>
                      <div className={`w-px h-4 ${isLight ? "bg-zinc-300" : "bg-[#3F3F46]"}`} />
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
                        </svg>
                        <span className={`text-xs ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>Objects:</span>
                        <span className={`text-xs font-semibold ${isLight ? "text-zinc-700" : "text-zinc-300"}`}>{item.objects}</span>
                      </div>
                      <div className="ml-auto">
                        <button className={`h-7 px-2.5 rounded-lg text-xs font-medium transition-all ring-1 flex items-center gap-1.5 ${
                          isLight
                            ? "bg-zinc-100 hover:bg-rose-500/10 text-zinc-500 hover:text-rose-500 ring-zinc-200 hover:ring-rose-500/30"
                            : "bg-[#27272A]/70 hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400 ring-[#3F3F46] hover:ring-rose-500/30"
                        }`}>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                              <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                            </svg>
                            Clear
                          </button>
                        
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderUsers = () => {
    const userStats = [
      { label: "Total Users", value: "5", subtext: "WordPress users", icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z", color: "emerald" },
      { label: "Active Now", value: "2", subtext: "Online users", icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z", color: "sky" },
      { label: "Admins", value: "1", subtext: "Full access", icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z", color: "violet" },
      { label: "Pending", value: "0", subtext: "Awaiting approval", icon: "M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z", color: "amber" },
    ];

    const userColorMap: Record<string, { bg: string; text: string; ring: string; glow: string; iconBg: string }> = {
      emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "ring-emerald-500/20", glow: "from-emerald-500/10", iconBg: "from-emerald-500/20 to-emerald-600/20" },
      sky: { bg: "bg-sky-500/10", text: "text-sky-400", ring: "ring-sky-500/20", glow: "from-sky-500/10", iconBg: "from-sky-500/20 to-sky-600/20" },
      violet: { bg: "bg-violet-500/10", text: "text-violet-400", ring: "ring-violet-500/20", glow: "from-violet-500/10", iconBg: "from-violet-500/20 to-violet-600/20" },
      amber: { bg: "bg-amber-500/10", text: "text-amber-400", ring: "ring-amber-500/20", glow: "from-amber-500/10", iconBg: "from-amber-500/20 to-amber-600/20" },
      rose: { bg: "bg-rose-500/10", text: "text-rose-400", ring: "ring-rose-500/20", glow: "from-rose-500/10", iconBg: "from-rose-500/20 to-rose-600/20" },
    };

    const users = [
      {
        id: "usr-001",
        username: "limewp_admin",
        displayName: "Lime Admin",
        email: "admin@limewp.com",
        role: "Administrator",
        color: "emerald",
        gradient: "from-emerald-500 to-teal-500",
        lastLogin: "2 hours ago",
        postsCount: 24,
        isOnline: true,
        twoFactor: true,
      },
      {
        id: "usr-002",
        username: "john_editor",
        displayName: "John Smith",
        email: "john@example.com",
        role: "Editor",
        color: "sky",
        gradient: "from-sky-500 to-blue-500",
        lastLogin: "1 day ago",
        postsCount: 156,
        isOnline: true,
        twoFactor: true,
      },
      {
        id: "usr-003",
        username: "sarah_author",
        displayName: "Sarah Connor",
        email: "sarah@example.com",
        role: "Author",
        color: "violet",
        gradient: "from-violet-500 to-purple-500",
        lastLogin: "3 days ago",
        postsCount: 42,
        isOnline: false,
        twoFactor: false,
      },
      {
        id: "usr-004",
        username: "mike_contrib",
        displayName: "Mike Johnson",
        email: "mike@example.com",
        role: "Contributor",
        color: "amber",
        gradient: "from-amber-500 to-orange-500",
        lastLogin: "1 week ago",
        postsCount: 8,
        isOnline: false,
        twoFactor: false,
      },
      {
        id: "usr-005",
        username: "guest_user",
        displayName: "Guest User",
        email: "guest@example.com",
        role: "Subscriber",
        color: "rose",
        gradient: "from-rose-500 to-pink-500",
        lastLogin: "2 weeks ago",
        postsCount: 0,
        isOnline: false,
        twoFactor: false,
      },
    ];

    const rolePermissions: Record<string, string[]> = {
      Administrator: ["Full access", "Manage users", "Install plugins"],
      Editor: ["Publish posts", "Manage comments", "Moderate content"],
      Author: ["Write posts", "Upload media", "Edit own content"],
      Contributor: ["Write drafts", "Read content"],
      Subscriber: ["Read content", "Manage profile"],
    };

    return (
      <div>
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {userStats.map((stat) => {
            const colors = userColorMap[stat.color];
            return (
              <div key={stat.label} className={`group relative border rounded-2xl p-5 overflow-hidden transition-all duration-300 ${
                isLight
                  ? "bg-white border-zinc-200 hover:border-zinc-300"
                  : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E] hover:border-[#3F3F46]"
              }`}>
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${colors.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-60`} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colors.iconBg} ${colors.text} ring-1 ${colors.ring} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d={stat.icon} />
                      </svg>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold mb-1 ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>{stat.value}</div>
                  <div className="text-xs text-zinc-500">{stat.label}</div>
                  <div className={`text-[10px] ${colors.text} mt-1`}>{stat.subtext}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <h3 className={`text-sm font-semibold ${isLight ? "text-zinc-700" : "text-zinc-300"}`}>WordPress Users</h3>
            <Chip
              size="sm"
              classNames={{
                base: "bg-sky-500/10 border-0",
                content: "text-sky-400 font-semibold text-[10px]"
              }}
            >
              {users.filter(u => u.isOnline).length} online
            </Chip>
          </div>
          <Button
            color="success"
            className="font-semibold text-white shadow-lg shadow-emerald-500/20"
            startContent={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
            }
          >
            Add User
          </Button>
        </div>

        {/* User Cards */}
        <div className="space-y-3">
          {users.map((user) => {
            const colors = userColorMap[user.color];
            const permissions = rolePermissions[user.role] || [];
            return (
              <div
                key={user.id}
                className={`group relative border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg ${
                  isLight
                    ? "bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-zinc-200/50"
                    : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E] hover:border-[#3F3F46] hover:shadow-black/20"
                }`}
              >
                {/* Corner Glow */}
                <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${colors.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-50`} />

                <div className="relative p-5">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-r from-current to-current rounded-xl blur-lg opacity-30" style={{ color: user.color === "emerald" ? "#10b981" : user.color === "sky" ? "#0ea5e9" : user.color === "violet" ? "#8b5cf6" : user.color === "amber" ? "#f59e0b" : "#f43f5e" }} />
                      <Avatar
                        name={user.displayName.split(" ").map(n => n[0]).join("")}
                        size="lg"
                        classNames={{
                          base: `relative w-14 h-14 bg-gradient-to-br ${user.gradient} ring-2 ring-white/10 group-hover:scale-105 transition-transform`,
                          name: "text-white text-lg font-bold",
                        }}
                      />
                      {user.isOnline && (
                        <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className={`relative inline-flex rounded-full h-4 w-4 bg-emerald-500 ring-2 ${isLight ? "ring-white" : "ring-[#1E1E21]"}`}></span>
                        </span>
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-semibold text-[15px] ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>{user.displayName}</span>
                        {user.twoFactor && (
                          <span className="w-5 h-5 rounded-md bg-emerald-500/10 ring-1 ring-emerald-500/20 flex items-center justify-center">
                              <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                              </svg>
                            </span>
                          
                        )}
                        <Chip
                          size="sm"
                          classNames={{
                            base: `${colors.bg} border-0 h-5`,
                            content: `${colors.text} font-semibold text-[10px] px-0`
                          }}
                        >
                          {user.role}
                        </Chip>
                      </div>

                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs text-zinc-500 font-mono">@{user.username}</span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-xs text-zinc-500">{user.email}</span>
                      </div>

                      {/* Meta Info */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Last login: {user.lastLogin}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                          </svg>
                          <span>{user.postsCount} posts</span>
                        </div>
                      </div>

                      {/* Permissions */}
                      <div className="flex items-center gap-2 mt-3">
                        {permissions.slice(0, 3).map((perm) => (
                          <span
                            key={perm}
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-md ring-1 ${
                              isLight
                                ? "text-zinc-500 bg-zinc-100 ring-zinc-200"
                                : "text-zinc-400 bg-[#27272A] ring-[#3F3F46]"
                            }`}
                          >
                            {perm}
                          </span>
                        ))}
                        {permissions.length > 3 && (
                          <span className="text-[10px] font-medium text-zinc-500">+{permissions.length - 3} more</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                      <button className="h-9 px-3.5 rounded-lg bg-sky-500/10 text-sky-400 text-sm font-medium hover:bg-sky-500/20 transition-all ring-1 ring-sky-500/20 flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                          Edit
                        </button>

                      <button className={`h-9 w-9 rounded-lg flex items-center justify-center transition-all ring-1 ${
                        isLight
                          ? "bg-zinc-100 hover:bg-amber-500/10 ring-zinc-200 hover:ring-amber-500/30"
                          : "bg-[#27272A]/70 hover:bg-amber-500/10 ring-[#3F3F46] hover:ring-amber-500/30"
                      }`}>
                          <svg className="w-4 h-4 text-zinc-400 hover:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                          </svg>
                        </button>

                      <button className={`h-9 w-9 rounded-lg flex items-center justify-center transition-all ring-1 ${
                        isLight
                          ? "bg-zinc-100 hover:bg-rose-500/10 ring-zinc-200 hover:ring-rose-500/30"
                          : "bg-[#27272A]/70 hover:bg-rose-500/10 ring-[#3F3F46] hover:ring-rose-500/30"
                      }`}>
                          <svg className="w-4 h-4 text-zinc-400 hover:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderLogs = () => {
    const logStats = [
      { label: "Total Entries", value: "1,247", subtext: "Last 7 days", icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z", color: "sky" },
      { label: "Errors", value: "3", subtext: "Requires attention", icon: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z", color: "rose" },
      { label: "Warnings", value: "12", subtext: "Last 24 hours", icon: "M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z", color: "amber" },
      { label: "Info", value: "98%", subtext: "Success rate", icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "emerald" },
    ];

    const logColorMap: Record<string, { bg: string; text: string; ring: string; glow: string; iconBg: string; border: string }> = {
      emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "ring-emerald-500/20", glow: "from-emerald-500/10", iconBg: "from-emerald-500/20 to-emerald-600/20", border: "border-l-emerald-500" },
      sky: { bg: "bg-sky-500/10", text: "text-sky-400", ring: "ring-sky-500/20", glow: "from-sky-500/10", iconBg: "from-sky-500/20 to-sky-600/20", border: "border-l-sky-500" },
      amber: { bg: "bg-amber-500/10", text: "text-amber-400", ring: "ring-amber-500/20", glow: "from-amber-500/10", iconBg: "from-amber-500/20 to-amber-600/20", border: "border-l-amber-500" },
      rose: { bg: "bg-rose-500/10", text: "text-rose-400", ring: "ring-rose-500/20", glow: "from-rose-500/10", iconBg: "from-rose-500/20 to-rose-600/20", border: "border-l-rose-500" },
    };

    const logEntries = [
      {
        id: "log-001",
        level: "ERROR",
        color: "rose",
        message: "PHP Fatal error: Uncaught Error: Call to undefined function wp_get_current_user()",
        file: "/wp-includes/pluggable.php",
        line: 624,
        time: "12:34:56",
        date: "Today",
      },
      {
        id: "log-002",
        level: "WARNING",
        color: "amber",
        message: "Invalid argument supplied for foreach() in theme functions",
        file: "/wp-content/themes/flavor/functions.php",
        line: 142,
        time: "12:30:12",
        date: "Today",
      },
      {
        id: "log-003",
        level: "INFO",
        color: "sky",
        message: "WordPress auto-update: Theme 'flavor-starter' updated to version 2.4.1",
        file: "System",
        line: null,
        time: "11:45:23",
        date: "Today",
      },
      {
        id: "log-004",
        level: "SUCCESS",
        color: "emerald",
        message: "User 'limewp_admin' logged in successfully from IP 192.168.1.100",
        file: "Authentication",
        line: null,
        time: "10:22:08",
        date: "Today",
      },
      {
        id: "log-005",
        level: "WARNING",
        color: "amber",
        message: "PHP Deprecated: Function create_function() is deprecated since PHP 7.2",
        file: "/wp-content/plugins/old-plugin/main.php",
        line: 89,
        time: "09:15:44",
        date: "Today",
      },
      {
        id: "log-006",
        level: "INFO",
        color: "sky",
        message: "Scheduled backup completed successfully. Size: 856 MB",
        file: "Backup System",
        line: null,
        time: "03:00:12",
        date: "Today",
      },
      {
        id: "log-007",
        level: "ERROR",
        color: "rose",
        message: "Database connection timeout after 30 seconds. Retrying...",
        file: "/wp-includes/wp-db.php",
        line: 1892,
        time: "23:45:01",
        date: "Yesterday",
      },
    ];

    const logTypeOptions = [
      { key: "all", label: "All Logs", icon: "M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" },
      { key: "error", label: "Error Log", icon: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" },
      { key: "access", label: "Access Log", icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" },
      { key: "php", label: "PHP Log", icon: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" },
    ];

    return (
      <div>
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {logStats.map((stat) => {
            const colors = logColorMap[stat.color];
            return (
              <div key={stat.label} className={`group relative border rounded-2xl p-5 overflow-hidden transition-all duration-300 ${
                isLight
                  ? "bg-white border-zinc-200 hover:border-zinc-300"
                  : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E] hover:border-[#3F3F46]"
              }`}>
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${colors.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-60`} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colors.iconBg} ${colors.text} ring-1 ${colors.ring} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d={stat.icon} />
                      </svg>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold mb-1 ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>{stat.value}</div>
                  <div className="text-xs text-zinc-500">{stat.label}</div>
                  <div className={`text-[10px] ${colors.text} mt-1`}>{stat.subtext}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            {/* Log Type Selector */}
            <div className={`flex items-center gap-1 p-1 rounded-xl border ${
              isLight ? "bg-zinc-100 border-zinc-200" : "bg-[#1E1E21] border-[#2A2A2E]"
            }`}>
              {logTypeOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => setLogType(option.key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    logType === option.key
                      ? "bg-gradient-to-r from-violet-500/20 to-violet-600/20 text-violet-400 ring-1 ring-violet-500/30"
                      : isLight
                        ? "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-[#27272A]"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d={option.icon} />
                  </svg>
                  <span className="hidden sm:inline">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
                variant="bordered"
                size="sm"
                isIconOnly
                className={`font-medium ${isLight ? "text-zinc-700 border-zinc-300 hover:border-zinc-400" : "text-zinc-300 border-[#3F3F46] hover:border-zinc-500"}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                </svg>
              </Button>
            
            <Button
                variant="bordered"
                size="sm"
                className="font-medium text-zinc-300 border-[#3F3F46] hover:border-rose-500/50 hover:text-rose-400"
                startContent={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                }
              >
                Clear
              </Button>
            
            <Button
              variant="bordered"
              size="sm"
              className={`font-medium ${isLight ? "text-zinc-700 border-zinc-300 hover:border-zinc-400" : "text-zinc-300 border-[#3F3F46] hover:border-zinc-500"}`}
              startContent={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              }
            >
              Download
            </Button>
          </div>
        </div>

        {/* Log Entries */}
        <div className={`relative border rounded-2xl overflow-hidden ${
          isLight
            ? "bg-white border-zinc-200"
            : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E]"
        }`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-violet-500/[0.04] to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />

          {/* Header */}
          <div className={`relative px-5 py-4 border-b ${
            isLight
              ? "border-zinc-200 bg-zinc-50"
              : "border-[#2A2A2E] bg-gradient-to-r from-[#18181B] to-[#1f1f23]"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-600/20 text-violet-400 ring-1 ring-violet-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                  </svg>
                </div>
                <div>
                  <h3 className={`text-sm font-semibold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>Log Entries</h3>
                  <p className="text-[11px] text-zinc-500">Showing {logEntries.length} most recent entries</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-500">Auto-refresh: </span>
                <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md ring-1 ring-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  On
                </span>
              </div>
            </div>
          </div>

          {/* Log List */}
          <div className={`relative divide-y ${isLight ? "divide-zinc-200" : "divide-[#2A2A2E]"}`}>
            {logEntries.map((log) => {
              const colors = logColorMap[log.color];
              return (
                <div
                  key={log.id}
                  className={`group relative flex items-start gap-4 px-5 py-4 border-l-4 ${colors.border} transition-all cursor-pointer ${
                    isLight ? "hover:bg-zinc-50" : "hover:bg-white/[0.02]"
                  }`}
                >
                  {/* Level Badge */}
                  <div className={`flex-shrink-0 w-20`}>
                    <Chip
                      size="sm"
                      classNames={{
                        base: `${colors.bg} border-0`,
                        content: `${colors.text} font-bold text-[10px] font-mono px-0`
                      }}
                    >
                      {log.level}
                    </Chip>
                  </div>

                  {/* Message */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-mono text-sm break-all leading-relaxed mb-2 ${isLight ? "text-zinc-700" : "text-zinc-300"}`}>
                      {log.message}
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
                      {log.file && (
                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                          </svg>
                          <span className="font-mono truncate max-w-[200px]">{log.file}</span>
                          {log.line && <span className="text-zinc-600">:{log.line}</span>}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex-shrink-0 text-right">
                    <div className="text-xs text-zinc-500 font-mono">{log.time}</div>
                    <div className="text-[10px] text-zinc-600 mt-0.5">{log.date}</div>
                  </div>

                  {/* Hover Actions */}
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                    <button className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all ring-1 ${
                      isLight
                        ? "bg-white/90 hover:bg-zinc-100 ring-zinc-200"
                        : "bg-[#27272A]/90 hover:bg-[#3F3F46] ring-[#3F3F46]"
                    }`}>
                        <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                        </svg>
                      </button>

                    <button className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all ring-1 ${
                      isLight
                        ? "bg-white/90 hover:bg-zinc-100 ring-zinc-200"
                        : "bg-[#27272A]/90 hover:bg-[#3F3F46] ring-[#3F3F46]"
                    }`}>
                        <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                    
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className={`relative border-t bg-gradient-to-t from-violet-500/[0.02] to-transparent ${isLight ? "border-zinc-200" : "border-[#2A2A2E]"}`}>
            <button className="w-full py-3.5 flex items-center justify-center gap-2 text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors group/btn">
              <span>Load more entries</span>
              <svg className="w-4 h-4 group-hover/btn:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview": return <OverviewTab />;
      case "file manager": return <FileManagerTab />;
      case "tools": return renderTools();
      case "domains": return renderDomains();
      case "themes": return renderThemes();
      case "plugins": return renderPlugins();
      case "backups": return renderBackups();
      case "analytics": return renderAnalytics();
      case "caching": return renderCaching();
      case "users": return renderUsers();
      case "logs": return renderLogs();
      case "ssh/sftp": return <SshSftpTab />;
      default: return <OverviewTab />;
    }
  };

  return (
    <AppShell>
      {/* Site Header */}
      <div className={`relative rounded-2xl border overflow-hidden mb-6 ${
        isLight
          ? "bg-white border-zinc-200"
          : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E]"
      }`}>
        {/* Background Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-emerald-500/[0.08] to-transparent rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-violet-500/[0.05] to-transparent rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-sky-500/[0.03] to-transparent rounded-full -translate-x-1/2 -translate-y-1/2" />

        {/* Main Content */}
        <div className="relative p-6">
          <div className="flex items-start gap-5">
            {/* Site Icon */}
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-500/25">
                <svg width={32} height={32} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <circle cx={12} cy={12} r={10} />
                  <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                </svg>
              </div>
              {/* Online indicator */}
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${isLight ? "bg-white" : "bg-[#1E1E21]"}`}>
                <div className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
                </div>
              </div>
            </div>

            {/* Site Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className={`text-2xl font-bold truncate ${isLight ? "text-zinc-800" : "text-white"}`}>{siteName}</h1>
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
                <span className={`text-sm ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>Pro Plan</span>
                <span className={isLight ? "text-zinc-300" : "text-zinc-600"}>•</span>
                <button onClick={() => setIsUpgradeOpen(true)} className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors">
                  Upgrade to Business
                  <svg className="w-4 h-4 -scale-x-100" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
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
                  classNames={{
                    base: `p-1.5 rounded-2xl min-w-[180px] ${isLight ? "bg-white border border-zinc-200 shadow-xl" : "bg-[#1E1E21] border border-[#2A2A2E] shadow-xl shadow-black/20"}`,
                    list: "gap-0.5",
                  }}
                >
                  <DropdownItem
                    key="backup"
                    className={`rounded-xl px-3 py-2 ${isLight ? "data-[hover=true]:bg-zinc-100" : "data-[hover=true]:bg-[#27272A]"}`}
                    startContent={<svg className={`w-4 h-4 ${isLight ? "text-zinc-400" : "text-zinc-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>}
                    textValue="Backup Now"
                  >
                    <span className={`text-sm ${isLight ? "text-zinc-700" : "text-zinc-200"}`}>Backup Now</span>
                  </DropdownItem>
                  <DropdownItem
                    key="clear-cache"
                    className={`rounded-xl px-3 py-2 ${isLight ? "data-[hover=true]:bg-zinc-100" : "data-[hover=true]:bg-[#27272A]"}`}
                    startContent={<svg className={`w-4 h-4 ${isLight ? "text-zinc-400" : "text-zinc-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>}
                    textValue="Clear Cache"
                  >
                    <span className={`text-sm ${isLight ? "text-zinc-700" : "text-zinc-200"}`}>Clear Cache</span>
                  </DropdownItem>
                  <DropdownItem
                    key="ssl-check"
                    className={`rounded-xl px-3 py-2 ${isLight ? "data-[hover=true]:bg-zinc-100" : "data-[hover=true]:bg-[#27272A]"}`}
                    startContent={<svg className={`w-4 h-4 ${isLight ? "text-zinc-400" : "text-zinc-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>}
                    textValue="SSL Check"
                  >
                    <span className={`text-sm ${isLight ? "text-zinc-700" : "text-zinc-200"}`}>SSL Check</span>
                  </DropdownItem>
                  <DropdownItem
                    key="staging"
                    className={`rounded-xl px-3 py-2 ${isLight ? "data-[hover=true]:bg-zinc-100" : "data-[hover=true]:bg-[#27272A]"}`}
                    startContent={<svg className={`w-4 h-4 ${isLight ? "text-zinc-400" : "text-zinc-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" /></svg>}
                    textValue="Staging"
                  >
                    <span className={`text-sm ${isLight ? "text-zinc-700" : "text-zinc-200"}`}>Staging</span>
                  </DropdownItem>
                  <DropdownItem
                    key="divider"
                    isReadOnly
                    className="p-0 my-1 cursor-default data-[hover=true]:bg-transparent"
                    textValue="divider"
                  >
                    <div className={`h-px mx-2 ${isLight ? "bg-zinc-100" : "bg-[#2A2A2E]"}`} />
                  </DropdownItem>
                  <DropdownItem
                    key="restart-php"
                    className={`rounded-xl px-3 py-2 ${isLight ? "data-[hover=true]:bg-zinc-100" : "data-[hover=true]:bg-[#27272A]"}`}
                    startContent={<svg className={`w-4 h-4 ${isLight ? "text-zinc-400" : "text-zinc-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>}
                    textValue="Restart PHP"
                  >
                    <span className={`text-sm ${isLight ? "text-zinc-700" : "text-zinc-200"}`}>Restart PHP</span>
                  </DropdownItem>
                  <DropdownItem
                    key="restart-server"
                    className={`rounded-xl px-3 py-2 ${isLight ? "data-[hover=true]:bg-zinc-100" : "data-[hover=true]:bg-[#27272A]"}`}
                    startContent={<svg className={`w-4 h-4 ${isLight ? "text-zinc-400" : "text-zinc-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" /></svg>}
                    textValue="Restart Server"
                  >
                    <span className={`text-sm ${isLight ? "text-zinc-700" : "text-zinc-200"}`}>Restart Server</span>
                  </DropdownItem>
                  <DropdownItem
                    key="server-logs"
                    className={`rounded-xl px-3 py-2 ${isLight ? "data-[hover=true]:bg-zinc-100" : "data-[hover=true]:bg-[#27272A]"}`}
                    startContent={<svg className={`w-4 h-4 ${isLight ? "text-zinc-400" : "text-zinc-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>}
                    textValue="Server Logs"
                  >
                    <span className={`text-sm ${isLight ? "text-zinc-700" : "text-zinc-200"}`}>Server Logs</span>
                  </DropdownItem>
                  <DropdownItem
                    key="security-scan"
                    className={`rounded-xl px-3 py-2 ${isLight ? "data-[hover=true]:bg-zinc-100" : "data-[hover=true]:bg-[#27272A]"}`}
                    startContent={<svg className={`w-4 h-4 ${isLight ? "text-zinc-400" : "text-zinc-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>}
                    textValue="Security Scan"
                  >
                    <span className={`text-sm ${isLight ? "text-zinc-700" : "text-zinc-200"}`}>Security Scan</span>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </div>

        {/* Footer Stats Bar */}
        <div className={`relative border-t px-6 py-3 flex items-center justify-between ${
          isLight
            ? "border-zinc-200 bg-zinc-50/50"
            : "border-white/[0.04] bg-[#18181B]/50"
        }`}>
          <div className="flex items-center gap-6 text-xs">
            <span className="flex items-center gap-1.5 text-zinc-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
              </svg>
              Server: <span className={isLight ? "text-zinc-700" : "text-zinc-300"}>us-east-1</span>
            </span>
            <span className={isLight ? "text-zinc-300" : "text-zinc-700"}>•</span>
            <button className={`group flex items-center gap-1.5 text-zinc-500 transition-colors ${isLight ? "hover:text-zinc-700" : "hover:text-zinc-300"}`}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
                IP: <span className={`font-mono ${isLight ? "text-zinc-700" : "text-zinc-300"}`}>189.659.543.55</span>
              </button>
            
            <span className={isLight ? "text-zinc-300" : "text-zinc-700"}>•</span>
            <span className="flex items-center gap-1.5 text-zinc-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
              </svg>
              PHP: <span className={isLight ? "text-zinc-700" : "text-zinc-300"}>8.1</span>
            </span>
            <span className={isLight ? "text-zinc-300" : "text-zinc-700"}>•</span>
            <span className="flex items-center gap-1.5 text-zinc-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
              </svg>
              WP: <span className={isLight ? "text-zinc-700" : "text-zinc-300"}>6.6.2</span>
            </span>
            <span className={isLight ? "text-zinc-300" : "text-zinc-700"}>•</span>
            <span className="flex items-center gap-1.5 text-zinc-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              Next Payment: <span className={isLight ? "text-zinc-700" : "text-zinc-300"}>Mar 15, 2026</span>
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

      {/* Tab Navigation + Content */}
      <div className="flex gap-6">
        {/* Sidebar Navigation */}
        <div className={`relative rounded-2xl border overflow-hidden min-w-[240px] self-start shadow-xl ${
          isLight
            ? "bg-white border-zinc-200 shadow-zinc-200/50"
            : "bg-gradient-to-br from-[#1E1E21] via-[#1a1a1d] to-[#18181B] border-[#2A2A2E]/80 shadow-black/20"
        }`}>
          {/* Ambient Glow Effects */}
          <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-emerald-500/[0.06] via-emerald-500/[0.02] to-transparent rounded-full -translate-y-1/2 -translate-x-1/2 blur-2xl" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-violet-500/[0.05] via-violet-500/[0.02] to-transparent rounded-full translate-y-1/2 translate-x-1/4 blur-xl" />
          <div className="absolute top-1/2 right-0 w-24 h-24 bg-gradient-to-l from-sky-500/[0.03] to-transparent rounded-full translate-x-1/2 blur-lg" />

          {/* Menu Header */}
          <div className="relative px-5 pt-5 pb-4">
            <h3 className={`text-sm font-bold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>Site Management</h3>
            <p className="text-[10px] text-zinc-500 mt-1">Configure your site</p>
          </div>

          {/* Divider */}
          <div className={`mx-4 h-px bg-gradient-to-r from-transparent to-transparent ${isLight ? "via-zinc-200" : "via-[#2A2A2E]"}`} />

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
                        ? "hover:bg-zinc-100"
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
                        ? "bg-zinc-100 text-zinc-500 group-hover:text-zinc-700 group-hover:bg-zinc-200"
                        : "bg-[#27272A]/80 text-zinc-500 group-hover:text-zinc-300 group-hover:bg-[#2A2A2E]"
                  }`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d={tab.icon} />
                    </svg>
                  </div>
                  <span className={`text-[13px] font-medium flex-1 transition-colors duration-200 ${
                    isActive
                      ? isLight ? "text-zinc-900" : "text-white"
                      : isLight
                        ? "text-zinc-600 group-hover:text-zinc-900"
                        : "text-zinc-400 group-hover:text-zinc-200"
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
