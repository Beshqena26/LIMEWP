"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "@/lib/context/ThemeContext";
import { showToast } from "@/lib/toast";
import { getColorClasses } from "@/lib/utils/colors";
import { profileSchema, type ProfileFormData } from "@/lib/validations";
import { ConfirmDialog } from "@/app/components/ui/ConfirmDialog";

interface ProfileTabProps {
  onSave?: () => void;
}

export function ProfileTab({ onSave }: ProfileTabProps) {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "Lime Admin",
      email: "admin@limewp.com",
      username: "limeadmin",
      phone: "+1 (555) 123-4567",
      company: "",
      timezone: "EST",
      language: "en-us",
    },
  });

  const onSubmit = async (_data: ProfileFormData) => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    showToast.success("Profile updated");
    if (onSave) onSave();
  };

  const onError = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsDeleting(false);
    setDeleteDialogOpen(false);
    showToast.success("Account deleted");
  };

  const cardClass = `rounded-2xl border ${
    isLight
      ? "bg-white border-slate-200"
      : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"
  }`;

  const inputClass = `w-full h-10 px-3.5 rounded-xl border text-sm transition-all outline-none ${
    isLight
      ? "bg-white border-slate-300 text-slate-800 focus:border-slate-400"
      : "bg-[var(--bg-elevated)] border-[var(--border-primary)] text-slate-200 focus:border-[var(--border-secondary)]"
  }`;

  const errorInputClass = `w-full h-10 px-3.5 rounded-xl border text-sm transition-all outline-none border-red-400 ${
    isLight ? "bg-white text-slate-800" : "bg-[var(--bg-elevated)] text-slate-200"
  }`;

  const selectClass = `w-full h-10 px-3 rounded-xl border text-sm appearance-none cursor-pointer transition-all outline-none ${
    isLight
      ? "bg-white border-slate-300 text-slate-800"
      : "bg-[var(--bg-elevated)] border-[var(--border-primary)] text-slate-200"
  }`;

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className={`space-y-6 ${shake ? "animate-shake" : ""}`}
      >
        {/* Profile Photo Card */}
        <ProfilePhotoCard cardClass={cardClass} />

        {/* Personal Info Card */}
        <PersonalInfoCard
          register={register}
          errors={errors}
          cardClass={cardClass}
          inputClass={inputClass}
          errorInputClass={errorInputClass}
        />

        {/* Preferences Card */}
        <PreferencesCard
          register={register}
          errors={errors}
          cardClass={cardClass}
          selectClass={selectClass}
        />

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-gradient-to-r ${accent.gradient} text-white font-semibold text-sm rounded-xl h-11 px-6 shadow-lg ${accent.buttonShadow} hover:opacity-90 transition-all disabled:opacity-60 flex items-center gap-2`}
          >
            {isSubmitting && (
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Delete Account Card */}
        <DeleteAccountCard
          cardClass={cardClass}
          onDelete={() => setDeleteDialogOpen(true)}
        />
      </form>

      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message="This will permanently delete your account, all sites, and all associated data. This action cannot be undone."
        confirmText="Delete Account"
        cancelText="Cancel"
        variant="danger"
        requireTypedConfirmation="DELETE"
        isLoading={isDeleting}
      />
    </>
  );
}

// ─── Profile Photo Card ────────────────────────────────────────────────────────

function ProfilePhotoCard({ cardClass }: { cardClass: string }) {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      showToast.success(`Photo uploaded: ${file.name}`);
    }
    // Reset so the same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemove = () => {
    showToast.info("Photo removed");
  };

  return (
    <div className={`relative overflow-hidden ${cardClass}`}>
      <div
        className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl ${accent.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3`}
      />

      <div className="relative p-6">
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`w-10 h-10 rounded-xl ${accent.bg} ${accent.text} ring-1 ${accent.ring} flex items-center justify-center`}
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
              <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <div>
            <h3
              className={`text-base font-semibold ${
                isLight ? "text-slate-800" : "text-slate-100"
              }`}
            >
              Profile Photo
            </h3>
            <p className="text-xs text-slate-500">Update your profile picture</p>
          </div>
        </div>

        <div
          className={`flex items-center gap-6 pb-6 border-b ${
            isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"
          }`}
        >
          <div className="relative group">
            <div
              className={`absolute inset-0 bg-gradient-to-r ${accent.gradient} rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity`}
            />
            <div
              className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${accent.gradient} flex items-center justify-center text-white text-2xl font-bold ring-4 ring-white/10`}
            >
              LK
            </div>
          </div>
          <div className="flex gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={handleUploadClick}
              className={`bg-gradient-to-r ${accent.gradient} text-white font-semibold text-sm rounded-xl h-10 px-4 shadow-lg ${accent.buttonShadow} hover:opacity-90 transition-all`}
            >
              Upload Photo
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className={`font-medium text-sm rounded-xl h-10 px-4 transition-colors ${
                isLight
                  ? "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800"
                  : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
              }`}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Personal Info Card ────────────────────────────────────────────────────────

interface FormCardProps {
  register: ReturnType<typeof useForm<ProfileFormData>>["register"];
  errors: ReturnType<typeof useForm<ProfileFormData>>["formState"]["errors"];
  cardClass: string;
  inputClass?: string;
  errorInputClass?: string;
  selectClass?: string;
}

function PersonalInfoCard({
  register,
  errors,
  cardClass,
  inputClass,
  errorInputClass,
}: FormCardProps) {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);
  const [emailVerified] = useState(true);
  const [resending, setResending] = useState(false);

  const handleResendVerification = async () => {
    setResending(true);
    await new Promise((r) => setTimeout(r, 1000));
    setResending(false);
    showToast.success("Verification email sent");
  };

  return (
    <div className={`relative overflow-hidden ${cardClass}`}>
      <div
        className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${accent.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3`}
      />

      <div className="relative p-6">
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`w-10 h-10 rounded-xl ${accent.bg} ${accent.text} ring-1 ${accent.ring} flex items-center justify-center`}
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
              <path d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
            </svg>
          </div>
          <div>
            <h3
              className={`text-base font-semibold ${
                isLight ? "text-slate-800" : "text-slate-100"
              }`}
            >
              Personal Information
            </h3>
            <p className="text-xs text-slate-500">Manage your account details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-slate-500 font-medium mb-2">
              Full Name
            </label>
            <input
              className={errors.fullName ? errorInputClass : inputClass}
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-red-400 text-[13px] mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email Address + Verification Badge */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">
                Email Address
              </label>
              {emailVerified ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/20">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                    />
                  </svg>
                  Unverified
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <input
                className={`${errors.email ? errorInputClass : inputClass} ${!emailVerified ? "flex-1" : ""}`}
                {...register("email")}
              />
              {!emailVerified && (
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resending}
                  className="shrink-0 h-10 px-3 rounded-xl text-xs font-medium bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-colors disabled:opacity-50"
                >
                  {resending ? "Sending..." : "Resend"}
                </button>
              )}
            </div>
            {errors.email && (
              <p className="text-red-400 text-[13px] mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-slate-500 font-medium mb-2">
              Username
            </label>
            <input
              className={errors.username ? errorInputClass : inputClass}
              {...register("username")}
            />
            {errors.username && (
              <p className="text-red-400 text-[13px] mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-slate-500 font-medium mb-2">
              Phone Number
            </label>
            <input className={inputClass} {...register("phone")} />
          </div>

          {/* Company / Organization */}
          <div className="sm:col-span-2">
            <label className="block text-[11px] uppercase tracking-wider text-slate-500 font-medium mb-2">
              Company / Organization
            </label>
            <input
              className={inputClass}
              placeholder="Your company or organization name"
              {...register("company")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Preferences Card ──────────────────────────────────────────────────────────

function PreferencesCard({
  register,
  errors,
  cardClass,
  selectClass,
}: FormCardProps) {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  return (
    <div className={`relative overflow-hidden ${cardClass}`}>
      <div
        className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${accent.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3`}
      />

      <div className="relative p-6">
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`w-10 h-10 rounded-xl ${accent.bg} ${accent.text} ring-1 ${accent.ring} flex items-center justify-center`}
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
              <path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
          </div>
          <div>
            <h3
              className={`text-base font-semibold ${
                isLight ? "text-slate-800" : "text-slate-100"
              }`}
            >
              Regional Preferences
            </h3>
            <p className="text-xs text-slate-500">
              Set your timezone and language
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Timezone */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-slate-500 font-medium mb-2">
              Timezone
            </label>
            <div className="relative">
              <select
                className={selectClass}
                defaultValue="EST"
                {...register("timezone")}
              >
                <option value="UTC">UTC</option>
                <option value="EST">EST (Eastern)</option>
                <option value="PST">PST (Pacific)</option>
                <option value="CET">CET (Central Europe)</option>
                <option value="JST">JST (Japan)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className={`w-4 h-4 ${isLight ? "text-slate-400" : "text-slate-500"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </div>
            </div>
            {errors.timezone && (
              <p className="text-red-400 text-[13px] mt-1">
                {errors.timezone.message}
              </p>
            )}
          </div>

          {/* Language */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-slate-500 font-medium mb-2">
              Language
            </label>
            <div className="relative">
              <select
                className={selectClass}
                defaultValue="en-us"
                {...register("language")}
              >
                <option value="en-us">English (US)</option>
                <option value="en-uk">English (UK)</option>
                <option value="es">Espanol</option>
                <option value="fr">Francais</option>
                <option value="de">Deutsch</option>
                <option value="ja">Japanese</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className={`w-4 h-4 ${isLight ? "text-slate-400" : "text-slate-500"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </div>
            </div>
            {errors.language && (
              <p className="text-red-400 text-[13px] mt-1">
                {errors.language.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Account Card ───────────────────────────────────────────────────────

function DeleteAccountCard({
  cardClass,
  onDelete,
}: {
  cardClass: string;
  onDelete: () => void;
}) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${
        isLight
          ? "bg-white border-red-200"
          : "bg-gradient-to-br from-red-950/20 to-[var(--gradient-card-to)] border-red-500/20"
      }`}
    >
      <div className="relative p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 ring-1 ring-red-500/20 flex items-center justify-center">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <h3
              className={`text-base font-semibold ${
                isLight ? "text-slate-800" : "text-slate-100"
              }`}
            >
              Delete Account
            </h3>
            <p className="text-xs text-slate-500">
              Permanently delete your account and all associated data. This action
              cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onDelete}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl h-10 px-5 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
