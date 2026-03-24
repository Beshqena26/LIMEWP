export type MigrationSource = "cpanel" | "plesk" | "wpengine" | "siteground" | "bluehost" | "cloudways" | "kinsta" | "flywheel" | "godaddy" | "hostinger" | "wordpress-com" | "manual";

export interface SourceCard {
  id: MigrationSource;
  name: string;
  iconPath: string;
  description: string;
  badge?: string;
  color: string; // tailwind color name for tinting
}

export const SOURCE_CARDS: SourceCard[] = [
  {
    id: "cpanel",
    name: "cPanel",
    iconPath: "M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z",
    description: "Migrate from any cPanel hosting provider",
    badge: "Most popular",
    color: "orange",
  },
  {
    id: "siteground",
    name: "SiteGround",
    iconPath: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418",
    description: "Transfer sites from SiteGround hosting",
    color: "violet",
  },
  {
    id: "bluehost",
    name: "Bluehost",
    iconPath: "M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z",
    description: "Migrate from Bluehost WordPress hosting",
    color: "blue",
  },
  {
    id: "cloudways",
    name: "Cloudways",
    iconPath: "M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15zM12 9v3m0 0v3m0-3h3m-3 0H9",
    description: "Transfer from Cloudways managed cloud",
    color: "teal",
  },
  {
    id: "kinsta",
    name: "Kinsta",
    iconPath: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
    description: "Migrate from Kinsta managed WordPress",
    badge: "1-click",
    color: "purple",
  },
  {
    id: "wpengine",
    name: "WP Engine",
    iconPath: "M21 7.5V18M15 7.5V18M3 16.811V8.69c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 010 1.954l-7.108 4.061A1.125 1.125 0 013 16.811z",
    description: "Transfer sites from WP Engine hosting",
    color: "indigo",
  },
  {
    id: "flywheel",
    name: "Flywheel",
    iconPath: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99",
    description: "Migrate from Flywheel managed hosting",
    color: "emerald",
  },
  {
    id: "godaddy",
    name: "GoDaddy",
    iconPath: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418",
    description: "Transfer from GoDaddy WordPress hosting",
    color: "sky",
  },
  {
    id: "hostinger",
    name: "Hostinger",
    iconPath: "M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3",
    description: "Migrate from Hostinger WordPress plans",
    color: "amber",
  },
  {
    id: "wordpress-com",
    name: "WordPress.com",
    iconPath: "M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18",
    description: "Import from WordPress.com hosted sites",
    color: "cyan",
  },
  {
    id: "plesk",
    name: "Plesk",
    iconPath: "M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3",
    description: "Migrate from Plesk-managed servers",
    color: "rose",
  },
  {
    id: "manual",
    name: "Manual (SSH/SFTP)",
    iconPath: "M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z",
    description: "Connect via SSH or SFTP credentials",
    color: "slate",
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
  siteground: [
    { name: "host", label: "Site Tools URL", placeholder: "https://tools.siteground.com", type: "text" },
    { name: "username", label: "Email / Username", placeholder: "you@example.com", type: "text" },
    { name: "password", label: "Password", placeholder: "Enter your SiteGround password", type: "password" },
  ],
  bluehost: [
    { name: "host", label: "Bluehost Domain", placeholder: "example.com", type: "text" },
    { name: "username", label: "cPanel Username", placeholder: "blueuser", type: "text" },
    { name: "password", label: "cPanel Password", placeholder: "Enter cPanel password", type: "password" },
  ],
  cloudways: [
    { name: "host", label: "Server IP", placeholder: "203.0.113.50", type: "text" },
    { name: "username", label: "SSH Username", placeholder: "master_user", type: "text" },
    { name: "password", label: "SSH Password", placeholder: "Enter SSH password", type: "password" },
    { name: "appname", label: "Application Name", placeholder: "wordpress_app", type: "text" },
  ],
  kinsta: [
    { name: "site", label: "Site Name", placeholder: "mysite", type: "text" },
    { name: "username", label: "SFTP Username", placeholder: "kinsta_user", type: "text" },
    { name: "password", label: "SFTP Password", placeholder: "Enter SFTP password", type: "password" },
  ],
  wpengine: [
    { name: "install", label: "Install Name", placeholder: "mysite", type: "text" },
    { name: "username", label: "SFTP Username", placeholder: "mysite-sftp", type: "text" },
    { name: "password", label: "SFTP Password", placeholder: "Enter SFTP password", type: "password" },
  ],
  flywheel: [
    { name: "site", label: "Site Name", placeholder: "mysite", type: "text" },
    { name: "username", label: "SFTP Username", placeholder: "flywheel_user", type: "text" },
    { name: "password", label: "SFTP Password", placeholder: "Enter SFTP password", type: "password" },
  ],
  godaddy: [
    { name: "host", label: "Domain", placeholder: "example.com", type: "text" },
    { name: "username", label: "FTP/SSH Username", placeholder: "godaddy_user", type: "text" },
    { name: "password", label: "FTP/SSH Password", placeholder: "Enter password", type: "password" },
  ],
  hostinger: [
    { name: "host", label: "Domain / hPanel URL", placeholder: "example.com", type: "text" },
    { name: "username", label: "Username", placeholder: "hostinger_user", type: "text" },
    { name: "password", label: "Password", placeholder: "Enter password", type: "password" },
  ],
  "wordpress-com": [
    { name: "site", label: "WordPress.com Site URL", placeholder: "mysite.wordpress.com", type: "text" },
    { name: "username", label: "WordPress.com Email", placeholder: "you@example.com", type: "text" },
    { name: "password", label: "Application Password", placeholder: "Enter application password", type: "password" },
  ],
  plesk: [
    { name: "host", label: "Plesk URL", placeholder: "https://server.example.com:8443", type: "text" },
    { name: "username", label: "Username", placeholder: "admin", type: "text" },
    { name: "password", label: "Password", placeholder: "Enter password", type: "password" },
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
  siteground: [
    { id: "ds-sg1", name: "Business Site", url: "business.example.com", size: "2.3 GB", wpVersion: "6.7.1" },
    { id: "ds-sg2", name: "E-commerce", url: "store.example.com", size: "5.1 GB", wpVersion: "6.7.0" },
    { id: "ds-sg3", name: "Blog", url: "blog.example.com", size: "890 MB", wpVersion: "6.6.2" },
  ],
  bluehost: [
    { id: "ds-bh1", name: "Main Website", url: "example.com", size: "1.8 GB", wpVersion: "6.7.1" },
    { id: "ds-bh2", name: "Blog", url: "blog.example.com", size: "720 MB", wpVersion: "6.6.0" },
  ],
  cloudways: [
    { id: "ds-cw1", name: "Production App", url: "app.example.com", size: "3.2 GB", wpVersion: "6.7.1" },
    { id: "ds-cw2", name: "Staging App", url: "staging.example.com", size: "3.0 GB", wpVersion: "6.7.1" },
    { id: "ds-cw3", name: "Client Site", url: "client.example.com", size: "1.6 GB", wpVersion: "6.6.2" },
  ],
  kinsta: [
    { id: "ds-ks1", name: "Live Site", url: "mysite.kinsta.cloud", size: "4.5 GB", wpVersion: "6.7.1" },
    { id: "ds-ks2", name: "Staging", url: "stg-mysite.kinsta.cloud", size: "4.3 GB", wpVersion: "6.7.1" },
  ],
  wpengine: [
    { id: "ds10", name: "Production", url: "mysite.wpengine.com", size: "4.2 GB", wpVersion: "6.7.1" },
    { id: "ds11", name: "Staging", url: "mysitestg.wpengine.com", size: "4.0 GB", wpVersion: "6.7.1" },
    { id: "ds12", name: "Development", url: "mysitedev.wpengine.com", size: "3.9 GB", wpVersion: "6.7.0" },
  ],
  flywheel: [
    { id: "ds-fw1", name: "Client Site", url: "client.flywheelsites.com", size: "1.9 GB", wpVersion: "6.7.0" },
    { id: "ds-fw2", name: "Agency Portfolio", url: "agency.flywheelsites.com", size: "2.4 GB", wpVersion: "6.7.1" },
  ],
  godaddy: [
    { id: "ds-gd1", name: "Main Website", url: "example.com", size: "1.4 GB", wpVersion: "6.6.2" },
    { id: "ds-gd2", name: "Landing Page", url: "promo.example.com", size: "380 MB", wpVersion: "6.7.1" },
    { id: "ds-gd3", name: "Blog", url: "blog.example.com", size: "920 MB", wpVersion: "6.7.0" },
  ],
  hostinger: [
    { id: "ds-hg1", name: "Personal Blog", url: "myblog.example.com", size: "650 MB", wpVersion: "6.7.1" },
    { id: "ds-hg2", name: "Portfolio", url: "portfolio.example.com", size: "1.1 GB", wpVersion: "6.6.2" },
  ],
  "wordpress-com": [
    { id: "ds-wpc1", name: "WordPress.com Blog", url: "mysite.wordpress.com", size: "2.8 GB", wpVersion: "6.7.1" },
    { id: "ds-wpc2", name: "Business Site", url: "mybiz.wordpress.com", size: "1.5 GB", wpVersion: "6.7.0" },
  ],
  plesk: [
    { id: "ds6", name: "Corporate Site", url: "corp.example.com", size: "2.1 GB", wpVersion: "6.7.1" },
    { id: "ds7", name: "Intranet", url: "internal.example.com", size: "890 MB", wpVersion: "6.6.2" },
    { id: "ds8", name: "Knowledge Base", url: "kb.example.com", size: "1.4 GB", wpVersion: "6.7.0" },
    { id: "ds9", name: "Support Portal", url: "support.example.com", size: "560 MB", wpVersion: "6.6.1" },
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
