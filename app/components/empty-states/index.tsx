"use client";

import { useRouter } from "next/navigation";
import { EmptyState } from "../ui/EmptyState";

// --- Icons (24px stroke-based SVGs) ---

const FolderIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
  </svg>
);

const ShieldIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const GlobeIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </svg>
);

const FileTextIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const SearchIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const ClockIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const PackageIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const ReceiptIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z" />
    <line x1="8" y1="10" x2="16" y2="10" />
    <line x1="8" y1="14" x2="13" y2="14" />
  </svg>
);

const KeyIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
);

// --- Empty State Instances ---

export function NoSites() {
  const router = useRouter();
  return (
    <EmptyState
      icon={FolderIcon}
      title="No sites yet"
      description="Create your first WordPress site to get started"
      action={{ label: "New Site", onClick: () => router.push("/new-site") }}
    />
  );
}

export function NoBackups({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={ShieldIcon}
      title="No backups found"
      description="Create your first backup to protect your data"
      action={onAction ? { label: "Create Backup", onClick: onAction } : undefined}
    />
  );
}

export function NoDomains({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={GlobeIcon}
      title="No domains connected"
      description="Connect a custom domain to your site"
      action={onAction ? { label: "Add Domain", onClick: onAction } : undefined}
    />
  );
}

export function NoLogs() {
  return (
    <EmptyState
      icon={FileTextIcon}
      title="No logs available"
      description="Logs will appear when your site has activity"
    />
  );
}

export function NoResults() {
  return (
    <EmptyState
      icon={SearchIcon}
      title="No results found"
      description="Try adjusting your search or filter criteria"
    />
  );
}

export function NoActivity() {
  return (
    <EmptyState
      icon={ClockIcon}
      title="No recent activity"
      description="Your activity history will appear here"
    />
  );
}

export function NoServices() {
  return (
    <EmptyState
      icon={PackageIcon}
      title="No active services"
      description="Browse suggested services to get started"
    />
  );
}

export function NoInvoices() {
  return (
    <EmptyState
      icon={ReceiptIcon}
      title="No invoices yet"
      description="Your billing history will appear here"
    />
  );
}

export function NoApiKeys({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={KeyIcon}
      title="No API keys created"
      description="Generate an API key to access the API"
      action={onAction ? { label: "Generate Key", onClick: onAction } : undefined}
    />
  );
}
