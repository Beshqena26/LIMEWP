"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Avatar,
} from "@heroui/react";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import type { DashboardActivity } from "@/data/dashboard";

interface ActivityDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: DashboardActivity | null;
  onGoToSite?: () => void;
}

export function ActivityDetailModal({
  isOpen,
  onClose,
  activity,
  onGoToSite,
}: ActivityDetailModalProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  if (!activity) return null;

  const colors = getColorClasses(activity.color);

  const getActivityDescription = (activity: DashboardActivity): string => {
    switch (activity.type) {
      case "backup":
        return "A complete backup of your site has been created and stored securely. This includes all files, database, and media uploads.";
      case "update":
        return "The update has been applied successfully. All compatibility checks passed and no issues were detected during the update process.";
      case "security":
        return "Your SSL certificate has been renewed automatically. This ensures all traffic to your site remains encrypted and secure.";
      case "system":
        return "The system upgrade has been completed successfully. Performance improvements and security patches have been applied.";
      default:
        return "This activity has been completed successfully.";
    }
  };

  const getActivityMetadata = (activity: DashboardActivity) => {
    switch (activity.type) {
      case "backup":
        return [
          { label: "Backup Type", value: "Full Site" },
          { label: "Size", value: "148 MB" },
          { label: "Duration", value: "2m 34s" },
          { label: "Storage Location", value: "Cloud (AWS S3)" },
        ];
      case "update":
        return [
          { label: "Update Type", value: activity.typeLabel },
          { label: "Previous Version", value: activity.details.split(" → ")[0]?.replace(/^.+ /, "") || "N/A" },
          { label: "New Version", value: activity.details.split(" → ")[1] || "N/A" },
          { label: "Rollback Available", value: "Yes (7 days)" },
        ];
      case "security":
        return [
          { label: "Certificate Type", value: "Let's Encrypt" },
          { label: "Encryption", value: "TLS 1.3" },
          { label: "Validity", value: activity.details.split("Valid until ")[1] || "N/A" },
          { label: "Auto-Renewal", value: "Enabled" },
        ];
      case "system":
        return [
          { label: "Upgrade Type", value: activity.action },
          { label: "Previous Version", value: activity.details.split(" → ")[0] || "N/A" },
          { label: "New Version", value: activity.details.split(" → ")[1] || "N/A" },
          { label: "Downtime", value: "None" },
        ];
      default:
        return [
          { label: "Status", value: "Completed" },
          { label: "Details", value: activity.details },
        ];
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      backdrop="opaque"
      placement="center"
      hideCloseButton
      classNames={{
        backdrop: "bg-black/70",
        base: isLight
          ? "bg-white border border-zinc-200 shadow-2xl max-w-[500px] rounded-2xl"
          : "bg-[#18181B] border border-[#27272A] shadow-2xl max-w-[500px] rounded-2xl",
        header: isLight ? "border-b border-zinc-200" : "border-b border-[#27272A]",
        body: "py-6",
        footer: isLight ? "border-t border-zinc-200" : "border-t border-[#27272A]",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl ${colors.bg} ${colors.text} ring-1 ${colors.ring} flex items-center justify-center`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={activity.icon} />
              </svg>
            </div>
            <div>
              <h2
                className={`text-lg font-semibold ${
                  isLight ? "text-zinc-800" : "text-zinc-100"
                }`}
              >
                {activity.action}
              </h2>
              <p className="text-xs text-zinc-500 font-normal">
                {activity.time}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              isLight
                ? "hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600"
                : "hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </ModalHeader>

        <ModalBody>
          <div className="space-y-5">
            {/* Site Info */}
            <div
              className={`rounded-xl p-4 flex items-center gap-3 ${
                isLight
                  ? "bg-zinc-50 border border-zinc-200"
                  : "bg-[#1E1E21] border border-[#2A2A2E]"
              }`}
            >
              <Avatar
                name={activity.siteInitials}
                classNames={{
                  base: `w-10 h-10 ${activity.siteGradient} ring-1 ring-white/10`,
                  name: "text-sm font-bold",
                }}
              />
              <div>
                <p
                  className={`text-sm font-medium ${
                    isLight ? "text-zinc-800" : "text-zinc-100"
                  }`}
                >
                  {activity.site}
                </p>
                <p className="text-xs text-zinc-500">Affected site</p>
              </div>
              <span
                className={`ml-auto text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${colors.bg} ${colors.text}`}
              >
                {activity.typeLabel}
              </span>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-zinc-500 font-medium mb-2">
                Description
              </label>
              <p
                className={`text-sm leading-relaxed ${
                  isLight ? "text-zinc-600" : "text-zinc-400"
                }`}
              >
                {getActivityDescription(activity)}
              </p>
            </div>

            {/* Metadata */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-zinc-500 font-medium mb-2">
                Details
              </label>
              <div
                className={`rounded-xl overflow-hidden border ${
                  isLight ? "border-zinc-200" : "border-[#2A2A2E]"
                }`}
              >
                {getActivityMetadata(activity).map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between px-4 py-3 ${
                      index !== getActivityMetadata(activity).length - 1
                        ? isLight
                          ? "border-b border-zinc-100"
                          : "border-b border-[#2A2A2E]"
                        : ""
                    } ${isLight ? "bg-white" : "bg-[#1E1E21]"}`}
                  >
                    <span className="text-sm text-zinc-500">{item.label}</span>
                    <span
                      className={`text-sm font-medium ${
                        isLight ? "text-zinc-800" : "text-zinc-100"
                      }`}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Badge */}
            <div
              className={`rounded-xl p-4 flex items-center gap-3 ${
                isLight
                  ? "bg-zinc-100 border border-zinc-200"
                  : "bg-zinc-800/50 border border-zinc-700"
              }`}
            >
              <svg
                className={`w-5 h-5 flex-shrink-0 ${isLight ? "text-zinc-600" : "text-zinc-400"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p
                  className={`text-sm font-medium ${
                    isLight ? "text-zinc-800" : "text-zinc-200"
                  }`}
                >
                  Completed Successfully
                </p>
                <p
                  className={`text-xs ${
                    isLight ? "text-zinc-600" : "text-zinc-400"
                  }`}
                >
                  No action required
                </p>
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="flat"
            onPress={onClose}
            className={`font-medium text-sm rounded-xl h-10 px-5 ${
              isLight
                ? "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-800"
                : "bg-[#27272A] text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Close
          </Button>
          <Button
            onPress={() => {
              onGoToSite?.();
              onClose();
            }}
            className="bg-gradient-to-r from-violet-500 to-violet-600 text-white font-semibold text-sm rounded-xl h-10 px-5 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-all"
          >
            Go to Site
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
