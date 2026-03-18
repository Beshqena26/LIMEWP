"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AppShell from "../components/AppShell";
import {
  SettingsHeader,
  SettingsTabNav,
  ProfileTab,
  SecurityTab,
  NotificationsTab,
  AppearanceTab,
  BillingSettingsTab,
  ApiKeysTab,
} from "../components/settings";
import { SETTINGS_TABS, DEFAULT_NOTIFICATION_TOGGLES } from "@/data/settings";
import { useTheme } from "@/lib/context/ThemeContext";
import { cn } from "@/lib/utils";
import { getColorClasses } from "@/lib/utils/colors";

const VALID_TABS = ["profile", "security", "notifications", "appearance", "billing", "apikeys"];

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<string>(
    tabFromUrl && VALID_TABS.includes(tabFromUrl) ? tabFromUrl : "profile"
  );

  // Sync tab state with URL (only when URL changes externally)
  useEffect(() => {
    if (tabFromUrl && VALID_TABS.includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  // Update URL when tab changes
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    router.push(`/settings?tab=${tabId}`, { scroll: false });
  };
  const [toggles, setToggles] = useState<Record<string, boolean>>(DEFAULT_NOTIFICATION_TOGGLES);
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const colors = getColorClasses(accentColor);

  const handleToggle = (key: string) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveProfile = () => {
    console.log("Saving profile changes...");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab onSave={handleSaveProfile} />;
      case "security":
        return <SecurityTab />;
      case "notifications":
        return <NotificationsTab toggles={toggles} onToggle={handleToggle} />;
      case "appearance":
        return (
          <AppearanceTab
            toggles={toggles}
            onToggle={handleToggle}
          />
        );
      case "billing":
        return <BillingSettingsTab />;
      case "apikeys":
        return <ApiKeysTab />;
      default:
        return <ProfileTab onSave={handleSaveProfile} />;
    }
  };

  return (
    <AppShell>
      <SettingsHeader />

      {/* Mobile Tab Navigation - Horizontal Scrolling Pills */}
      <div className="lg:hidden mb-6 -mx-2">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 px-2 pb-2">
            {SETTINGS_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap text-sm font-medium transition-all shrink-0",
                    isActive
                      ? cn(colors.bg, colors.text, "ring-1", colors.ring)
                      : isLight
                        ? "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300"
                        : "bg-[#1E1E21] border border-[#2A2A2E] text-zinc-400 hover:bg-[#27272A] hover:border-[#3F3F46]"
                  )}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d={tab.icon} />
                  </svg>
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Tab Navigation - Sidebar */}
        <div className="hidden lg:block">
          <SettingsTabNav
            tabs={SETTINGS_TABS}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>

        {/* Tab Content with Animation */}
        <div className="flex-1 min-w-0">
          <div
            key={activeTab}
            className="animate-in fade-in slide-in-from-right-2 duration-300"
          >
            {renderTabContent()}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
