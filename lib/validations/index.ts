import { z } from "zod";

// ─── Auth Schemas ───

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z
  .object({
    name: z.string().min(1, "Full name is required").min(2, "Name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[0-9]/, "Must contain a number")
      .regex(/[^a-zA-Z0-9]/, "Must contain a special character")
      .regex(/[A-Z]/, "Must contain an uppercase letter"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    terms: z.literal(true, { message: "You must agree to the terms" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[0-9]/, "Must contain a number")
      .regex(/[^a-zA-Z0-9]/, "Must contain a special character")
      .regex(/[A-Z]/, "Must contain an uppercase letter"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const twoFactorSchema = z.object({
  code: z.string().length(6, "Code must be 6 digits").regex(/^\d+$/, "Code must only contain digits"),
});

// ─── Site Schemas ───

export const createSiteSchema = z.object({
  siteName: z.string().min(1, "Site name is required").min(2, "Site name must be at least 2 characters"),
  adminEmail: z.string().min(1, "Admin email is required").email("Invalid email format"),
  adminUsername: z.string().min(1, "Admin username is required").min(3, "Username must be at least 3 characters"),
  adminPassword: z.string().min(1, "Admin password is required").min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  domain: z.string().min(1, "Domain is required"),
  phpVersion: z.string().min(1, "PHP version is required"),
  wpVersion: z.string().min(1, "WordPress version is required"),
}).refine((data) => data.adminPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const editSiteSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  description: z.string().optional(),
});

export const cloneSiteSchema = z.object({
  targetName: z.string().min(1, "Target site name is required"),
  targetDomain: z.string().min(1, "Target domain is required"),
});

// ─── Domain Schemas ───

export const addDomainSchema = z.object({
  domain: z
    .string()
    .min(1, "Domain is required")
    .regex(/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/, "Invalid domain format"),
});

export const editDomainSchema = z.object({
  domain: z
    .string()
    .min(1, "Domain is required")
    .regex(/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/, "Invalid domain format"),
  isPrimary: z.boolean().optional(),
});

export const redirectSchema = z.object({
  source: z.string().min(1, "Source path is required"),
  target: z.string().min(1, "Target URL is required").url("Invalid URL format"),
  type: z.enum(["301", "302"]),
});

// ─── Backup Schemas ───

export const createBackupSchema = z.object({
  label: z.string().optional(),
  includeDatabase: z.boolean().default(true),
  includeFiles: z.boolean().default(true),
});

export const restoreBackupSchema = z.object({
  backupId: z.string().min(1, "Backup selection is required"),
  confirmRestore: z.literal(true, { message: "You must confirm the restore" }),
});

// ─── User Schemas ───

export const inviteUserSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  role: z.enum(["admin", "editor", "viewer"], { message: "Role is required" }),
});

export const editUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  role: z.enum(["admin", "editor", "viewer"]),
});

// ─── Settings Schemas ───

export const profileSchema = z.object({
  fullName: z.string().min(1, "Full name is required").min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  username: z.string().min(1, "Username is required").min(3, "Username must be at least 3 characters"),
  phone: z.string().optional(),
  timezone: z.string().min(1, "Timezone is required"),
  language: z.string().min(1, "Language is required"),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(1, "New password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[0-9]/, "Must contain a number")
      .regex(/[^a-zA-Z0-9]/, "Must contain a special character")
      .regex(/[A-Z]/, "Must contain an uppercase letter"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const notificationSchema = z.object({
  securityAlerts: z.boolean(),
  backupNotifications: z.boolean(),
  updateNotifications: z.boolean(),
  performanceReports: z.boolean(),
  marketingEmails: z.boolean(),
  pushNotifications: z.boolean(),
  downtimeAlerts: z.boolean(),
});

export const webhookSchema = z.object({
  endpoint: z.string().min(1, "Endpoint URL is required").url("Invalid URL format"),
});

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required").min(10, "Message must be at least 10 characters"),
});

export const dnsRecordSchema = z.object({
  type: z.enum(["A", "AAAA", "CNAME", "MX", "TXT", "NS"]),
  name: z.string().min(1, "Name is required"),
  value: z.string().min(1, "Value is required"),
  ttl: z.number().min(60, "TTL must be at least 60").default(3600),
  priority: z.number().optional(),
});

// ─── Type Exports ───

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type TwoFactorFormData = z.infer<typeof twoFactorSchema>;
export type CreateSiteFormData = z.infer<typeof createSiteSchema>;
export type EditSiteFormData = z.infer<typeof editSiteSchema>;
export type CloneSiteFormData = z.infer<typeof cloneSiteSchema>;
export type AddDomainFormData = z.infer<typeof addDomainSchema>;
export type EditDomainFormData = z.infer<typeof editDomainSchema>;
export type RedirectFormData = z.infer<typeof redirectSchema>;
export type CreateBackupFormData = z.infer<typeof createBackupSchema>;
export type RestoreBackupFormData = z.infer<typeof restoreBackupSchema>;
export type InviteUserFormData = z.infer<typeof inviteUserSchema>;
export type EditUserFormData = z.infer<typeof editUserSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;
export type NotificationFormData = z.infer<typeof notificationSchema>;
export type WebhookFormData = z.infer<typeof webhookSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type DnsRecordFormData = z.infer<typeof dnsRecordSchema>;
