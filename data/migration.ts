export type MigrationSource = "cpanel" | "plesk" | "wpengine" | "manual";

export interface SourceCard {
  id: MigrationSource;
  name: string;
  iconPath: string;
  description: string;
  badge?: string;
}

export const SOURCE_CARDS: SourceCard[] = [
  {
    id: "cpanel",
    name: "cPanel",
    iconPath: "M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z",
    description: "Migrate from any cPanel hosting provider",
    badge: "Most popular",
  },
  {
    id: "plesk",
    name: "Plesk",
    iconPath: "M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3",
    description: "Migrate from Plesk-managed servers",
  },
  {
    id: "wpengine",
    name: "WP Engine",
    iconPath: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
    description: "Transfer sites from WP Engine hosting",
  },
  {
    id: "manual",
    name: "Manual (SSH/SFTP)",
    iconPath: "M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z",
    description: "Connect via SSH or SFTP credentials",
  },
];

export interface ConnectionField {
  name: string;
  label: string;
  placeholder: string;
  type: "text" | "password" | "number" | "textarea";
}

export const CONNECTION_FIELDS: Record<MigrationSource, ConnectionField[]> = {
  cpanel: [
    { name: "host", label: "cPanel URL", placeholder: "https://server.example.com:2083", type: "text" },
    { name: "username", label: "Username", placeholder: "cpanel_user", type: "text" },
    { name: "password", label: "Password / API Token", placeholder: "Enter password or API token", type: "password" },
  ],
  plesk: [
    { name: "host", label: "Plesk URL", placeholder: "https://server.example.com:8443", type: "text" },
    { name: "username", label: "Username", placeholder: "admin", type: "text" },
    { name: "password", label: "Password", placeholder: "Enter password", type: "password" },
  ],
  wpengine: [
    { name: "install", label: "Install Name", placeholder: "mysite", type: "text" },
    { name: "username", label: "SFTP Username", placeholder: "mysite-sftp", type: "text" },
    { name: "password", label: "SFTP Password", placeholder: "Enter SFTP password", type: "password" },
  ],
  manual: [
    { name: "host", label: "Host", placeholder: "203.0.113.50", type: "text" },
    { name: "port", label: "SSH Port", placeholder: "22", type: "number" },
    { name: "username", label: "Username", placeholder: "root", type: "text" },
    { name: "password", label: "Password or SSH Key", placeholder: "Paste password or private key", type: "textarea" },
  ],
};

export interface DiscoveredSite {
  id: string;
  name: string;
  url: string;
  size: string;
  wpVersion: string;
}

export const MOCK_DISCOVERED_SITES: Record<MigrationSource, DiscoveredSite[]> = {
  cpanel: [
    { id: "ds1", name: "Main Blog", url: "blog.example.com", size: "1.2 GB", wpVersion: "6.6.2" },
    { id: "ds2", name: "Online Store", url: "shop.example.com", size: "3.8 GB", wpVersion: "6.7.0" },
    { id: "ds3", name: "Portfolio", url: "portfolio.example.com", size: "680 MB", wpVersion: "6.5.5" },
    { id: "ds4", name: "Landing Page", url: "promo.example.com", size: "240 MB", wpVersion: "6.7.1" },
    { id: "ds5", name: "Client Portal", url: "clients.example.com", size: "1.5 GB", wpVersion: "6.6.0" },
  ],
  plesk: [
    { id: "ds6", name: "Corporate Site", url: "corp.example.com", size: "2.1 GB", wpVersion: "6.7.1" },
    { id: "ds7", name: "Intranet", url: "internal.example.com", size: "890 MB", wpVersion: "6.6.2" },
    { id: "ds8", name: "Knowledge Base", url: "kb.example.com", size: "1.4 GB", wpVersion: "6.7.0" },
    { id: "ds9", name: "Support Portal", url: "support.example.com", size: "560 MB", wpVersion: "6.6.1" },
  ],
  wpengine: [
    { id: "ds10", name: "Production", url: "mysite.wpengine.com", size: "4.2 GB", wpVersion: "6.7.1" },
    { id: "ds11", name: "Staging", url: "mysitestg.wpengine.com", size: "4.0 GB", wpVersion: "6.7.1" },
    { id: "ds12", name: "Development", url: "mysitedev.wpengine.com", size: "3.9 GB", wpVersion: "6.7.0" },
  ],
  manual: [
    { id: "ds13", name: "WordPress Site", url: "example.com", size: "2.5 GB", wpVersion: "6.7.1" },
    { id: "ds14", name: "Multisite Network", url: "network.example.com", size: "8.1 GB", wpVersion: "6.6.2" },
    { id: "ds15", name: "Staging Copy", url: "staging.example.com", size: "2.3 GB", wpVersion: "6.7.1" },
    { id: "ds16", name: "Archive Site", url: "old.example.com", size: "1.1 GB", wpVersion: "6.4.3" },
  ],
};

export type MigrationStatus = "pending" | "copying" | "importing" | "configuring" | "complete" | "failed";

export const MIGRATION_STEPS = ["Source", "Connection", "Sites", "Migration"] as const;

export const MIGRATION_STATUS_LABELS: Record<MigrationStatus, string> = {
  pending: "Waiting...",
  copying: "Copying files...",
  importing: "Importing database...",
  configuring: "Configuring...",
  complete: "Complete",
  failed: "Failed",
};
