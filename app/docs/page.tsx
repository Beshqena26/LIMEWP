"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import AppShell from "../components/AppShell";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { showToast } from "@/lib/toast";

/* ────────────────────────── Color Classes ────────────────────────── */

const colorClasses: Record<string, { bg: string; text: string; textLight: string; ring: string; dot: string }> = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-500", textLight: "text-emerald-600", ring: "ring-emerald-500/20", dot: "bg-emerald-500" },
  sky: { bg: "bg-sky-500/10", text: "text-sky-500", textLight: "text-sky-600", ring: "ring-sky-500/20", dot: "bg-sky-500" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-500", textLight: "text-violet-600", ring: "ring-violet-500/20", dot: "bg-violet-500" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-500", textLight: "text-amber-600", ring: "ring-amber-500/20", dot: "bg-amber-500" },
};

/* ────────────────────────── Data Types ────────────────────────── */

interface DocItem {
  title: string;
  readTime: string;
  updated: string;
  isNew?: boolean;
  isPopular?: boolean;
}

interface DocSection {
  label: string;
  icon: string;
  color: string;
  items: DocItem[];
}

interface ArticleContent {
  intro: string;
  sections: {
    id: string;
    title: string;
    content: string;
    items?: string[];
    code?: { label: string; lines: string[] };
    callout?: { type: "info" | "warning" | "tip"; title: string; text: string };
  }[];
  relatedArticles: string[];
}

/* ────────────────────────── Sections ────────────────────────── */

const sections: DocSection[] = [
  {
    label: "Getting Started",
    icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
    color: "emerald",
    items: [
      { title: "Quick Start Guide", readTime: "5 min", updated: "Jan 15, 2026", isNew: true },
      { title: "Creating Your First Site", readTime: "8 min", updated: "Jan 12, 2026" },
      { title: "Migrating from Another Host", readTime: "12 min", updated: "Jan 10, 2026" },
    ],
  },
  {
    label: "Site Management",
    icon: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418",
    color: "sky",
    items: [
      { title: "Managing WordPress Sites", readTime: "10 min", updated: "Jan 14, 2026" },
      { title: "Backups & Restore", readTime: "7 min", updated: "Jan 13, 2026", isPopular: true },
      { title: "Domain & DNS Settings", readTime: "6 min", updated: "Jan 11, 2026" },
      { title: "SSL Certificates", readTime: "5 min", updated: "Jan 8, 2026" },
    ],
  },
  {
    label: "Advanced",
    icon: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5",
    color: "violet",
    items: [
      { title: "WP-CLI Commands", readTime: "15 min", updated: "Jan 9, 2026" },
      { title: "SSH & SFTP Access", readTime: "8 min", updated: "Jan 7, 2026" },
      { title: "Performance Optimization", readTime: "12 min", updated: "Jan 5, 2026", isPopular: true },
    ],
  },
  {
    label: "Troubleshooting",
    icon: "M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z",
    color: "amber",
    items: [
      { title: "Common Error Messages", readTime: "10 min", updated: "Jan 6, 2026" },
      { title: "Database Issues", readTime: "8 min", updated: "Jan 4, 2026" },
      { title: "Plugin Conflicts", readTime: "6 min", updated: "Jan 3, 2026" },
    ],
  },
];

/* ────────────────────────── Article Content Map ────────────────────────── */

const ARTICLE_CONTENT: Record<string, ArticleContent> = {
  "Quick Start Guide": {
    intro: "Welcome to LimeWP! This guide walks you through everything you need to get your first WordPress site live in under 10 minutes. LimeWP provides a blazing-fast managed WordPress hosting platform with automated deployments, real-time backups, and enterprise-grade security.",
    sections: [
      {
        id: "create-account",
        title: "Create Your LimeWP Account",
        content: "Head to the LimeWP dashboard and sign up with your email or GitHub account. Once verified, you will land on your main dashboard where you can manage all your sites.",
        items: ["Visit the registration page and fill in your details", "Verify your email address via the confirmation link", "Complete your profile with billing information", "Choose a plan that fits your needs (you can upgrade later)"],
        callout: { type: "tip", title: "Free Trial", text: "All new accounts include a 14-day free trial of the Business plan. No credit card required to get started." },
      },
      {
        id: "create-site",
        title: "Create Your First Site",
        content: "From your dashboard, click the \"Create Site\" button. You will be guided through a simple wizard to configure your new WordPress installation.",
        items: ["Select a data center closest to your audience", "Choose your preferred PHP version (8.2+ recommended)", "Set your site title and admin credentials", "Pick a starter theme or start from scratch"],
        code: { label: "Terminal", lines: ["$ limewp site:create --name=\"my-first-site\"", "Creating site... done", "Site URL: https://my-first-site.limewp.app", "Admin: https://my-first-site.limewp.app/wp-admin"] },
      },
      {
        id: "configure-basics",
        title: "Configure Basic Settings",
        content: "After site creation, configure your permalink structure, timezone, and language settings from the WordPress admin panel. LimeWP automatically optimizes your server settings for peak performance.",
        items: ["Set permalinks to \"Post name\" for SEO-friendly URLs", "Configure your timezone and date format", "Install and activate recommended plugins", "Set up your site identity (logo, favicon, tagline)"],
      },
      {
        id: "go-live",
        title: "Go Live",
        content: "When you are ready to launch, point your custom domain to LimeWP and enable your free SSL certificate. Your site is now live with enterprise-grade infrastructure.",
        callout: { type: "info", title: "DNS Propagation", text: "DNS changes can take up to 48 hours to propagate globally, though most changes take effect within 1-2 hours." },
      },
    ],
    relatedArticles: ["Creating Your First Site", "Domain & DNS Settings", "SSL Certificates"],
  },
  "Creating Your First Site": {
    intro: "This detailed guide walks you through every step of the site creation process on LimeWP, from selecting your data center to configuring WordPress and launching your site to the world.",
    sections: [
      {
        id: "data-center",
        title: "Choosing a Data Center",
        content: "LimeWP offers data centers across 6 global regions. Selecting the right location minimizes latency for your visitors and improves overall page load times.",
        items: ["US East (Virginia) — Best for North American audiences", "US West (Oregon) — Pacific coast and Asia-Pacific traffic", "EU West (Frankfurt) — European audiences", "Asia Pacific (Singapore) — Southeast Asian traffic", "Australia (Sydney) — Oceania region"],
        callout: { type: "tip", title: "Pro Tip", text: "Choose the data center closest to where the majority of your visitors are located. You can check your audience location in Google Analytics." },
      },
      {
        id: "wp-installation",
        title: "WordPress Installation",
        content: "LimeWP handles the entire WordPress installation automatically. You just need to provide a few basic details and the platform takes care of the rest, including database setup and file permissions.",
        code: { label: "Terminal", lines: ["$ limewp site:install-wp \\", "    --admin-email=\"admin@example.com\" \\", "    --admin-user=\"admin\" \\", "    --title=\"My Awesome Site\"", "", "Installing WordPress 6.7.1... done", "Configuring database... done", "Setting file permissions... done"] },
      },
      {
        id: "initial-config",
        title: "Initial Configuration",
        content: "Once WordPress is installed, LimeWP automatically applies performance optimizations including object caching, GZIP compression, and browser caching headers.",
        items: ["Object caching via Redis is pre-configured", "GZIP compression enabled for all text assets", "Browser caching headers set to optimal values", "Image lazy-loading enabled by default"],
      },
      {
        id: "staging-env",
        title: "Setting Up a Staging Environment",
        content: "Before making changes to your live site, create a staging environment to test updates safely. LimeWP makes it easy to clone your production site for testing.",
        code: { label: "Terminal", lines: ["$ limewp site:stage --source=\"my-site\"", "Cloning production to staging... done", "Staging URL: https://my-site-staging.limewp.app"] },
        callout: { type: "warning", title: "Staging Limits", text: "Staging environments share your plan storage quota. Remember to delete staging sites you no longer need." },
      },
    ],
    relatedArticles: ["Quick Start Guide", "Managing WordPress Sites", "Performance Optimization"],
  },
  "Migrating from Another Host": {
    intro: "Moving your existing WordPress site to LimeWP is simple with our automated migration tool. Whether you are coming from cPanel, Plesk, or another managed host, we have got you covered with zero downtime migration.",
    sections: [
      {
        id: "migration-wizard",
        title: "Using the Migration Wizard",
        content: "The LimeWP migration wizard handles the entire process automatically. Provide your source site credentials and the wizard will transfer all files, databases, and configurations.",
        items: ["Click \"Migrate Site\" from your dashboard", "Enter your source site URL and hosting credentials", "Select what to migrate (files, database, or both)", "Review the migration summary and confirm"],
        callout: { type: "info", title: "Supported Hosts", text: "Our migration wizard supports automatic transfers from cPanel, Plesk, WP Engine, SiteGround, Bluehost, GoDaddy, and most other popular hosts." },
      },
      {
        id: "dns-setup",
        title: "DNS Configuration",
        content: "After migration, update your DNS records to point to LimeWP servers. We provide nameservers or you can use A/CNAME records if you prefer to keep your existing DNS provider.",
        code: { label: "DNS Records", lines: ["# Option 1: Nameservers", "ns1.limewp.com", "ns2.limewp.com", "", "# Option 2: A Record", "A    @    203.0.113.50", "CNAME www  your-site.limewp.app"] },
      },
      {
        id: "verification",
        title: "Verification & Testing",
        content: "Before switching DNS, preview your site on LimeWP using the temporary URL to verify everything transferred correctly. Check all pages, forms, and functionality.",
        items: ["Test all pages and navigation links", "Verify media files and images loaded correctly", "Check forms, e-commerce, and dynamic features", "Compare page load times with your previous host"],
        callout: { type: "warning", title: "Email Configuration", text: "If your old host also handled email, you will need to configure email separately. LimeWP does not include email hosting. Consider using Google Workspace or Zoho Mail." },
      },
      {
        id: "post-migration",
        title: "Post-Migration Checklist",
        content: "After DNS has propagated and your site is live on LimeWP, complete these final steps to ensure everything is running smoothly.",
        items: ["Install the free SSL certificate", "Enable automatic backups", "Set up CDN for global performance", "Update any hardcoded URLs in the database", "Test email delivery with a third-party SMTP provider"],
      },
    ],
    relatedArticles: ["Domain & DNS Settings", "SSL Certificates", "Performance Optimization"],
  },
  "Managing WordPress Sites": {
    intro: "The LimeWP dashboard gives you complete control over your WordPress installations. Manage themes, plugins, users, and server settings all from a single, intuitive interface without touching the command line.",
    sections: [
      {
        id: "dashboard-overview",
        title: "Dashboard Overview",
        content: "Your site dashboard displays real-time metrics including uptime, visitor count, storage usage, and PHP worker utilization. The sidebar provides quick access to all management features.",
        items: ["Real-time uptime monitoring with instant alerts", "Visitor analytics with geographic breakdown", "Storage and bandwidth usage meters", "One-click access to WordPress admin panel"],
      },
      {
        id: "site-settings",
        title: "Site Settings",
        content: "Configure PHP version, memory limits, max upload size, and other server-level settings directly from the dashboard without editing configuration files.",
        items: ["PHP version switching (7.4, 8.0, 8.1, 8.2, 8.3)", "Memory limit adjustment (128MB to 1GB)", "Max upload size configuration", "Error logging and debug mode toggles"],
        callout: { type: "tip", title: "Performance Tip", text: "Always use the latest stable PHP version. PHP 8.2+ offers up to 20% better performance compared to PHP 7.4." },
      },
      {
        id: "domains",
        title: "Domain Management",
        content: "Add multiple domains and subdomains to your site. LimeWP supports unlimited domains per site with automatic SSL provisioning for each one.",
        code: { label: "Terminal", lines: ["$ limewp domain:add --site=\"my-site\" --domain=\"example.com\"", "Adding domain... done", "Provisioning SSL... done", "Domain active: https://example.com"] },
      },
      {
        id: "team-access",
        title: "Team Access & Roles",
        content: "Invite team members with granular role-based permissions. Control who can deploy, manage settings, or only view site analytics.",
        items: ["Owner — Full access to billing and site management", "Developer — Deploy, manage plugins, SSH access", "Editor — WordPress admin panel access only", "Viewer — Read-only dashboard access"],
      },
    ],
    relatedArticles: ["Quick Start Guide", "Backups & Restore", "Domain & DNS Settings"],
  },
  "Backups & Restore": {
    intro: "LimeWP provides automated daily backups with one-click restore capabilities. Your data is encrypted and stored across multiple geographic regions for maximum redundancy and peace of mind.",
    sections: [
      {
        id: "backup-types",
        title: "Backup Types",
        content: "LimeWP offers three types of backups to protect your data at different levels of granularity and frequency.",
        items: ["Daily Automatic Backups — full site snapshots taken every 24 hours", "Real-time Incremental — captures changes as they happen (Business+ plans)", "Manual On-demand — create a snapshot before major changes", "Database-only — lightweight backups of just your WordPress database"],
        callout: { type: "info", title: "Retention Policy", text: "Daily backups are retained for 30 days. Real-time incremental backups are retained for 14 days. Manual backups are kept until you delete them." },
      },
      {
        id: "scheduling",
        title: "Backup Scheduling",
        content: "Configure your preferred backup window to minimize impact on site performance. LimeWP automatically selects low-traffic periods based on your analytics data.",
        items: ["Set preferred backup time (UTC)", "Choose backup frequency (hourly, daily, weekly)", "Exclude large directories from backups if needed", "Enable backup notifications via email or Slack"],
      },
      {
        id: "restore-process",
        title: "Restoring from Backup",
        content: "Restoring your site is straightforward and typically completes within minutes. You can restore to your live site or create a new site from the backup.",
        code: { label: "Terminal", lines: ["$ limewp backup:list --site=\"my-site\"", "ID          Date                 Size    Type", "bkp_a1b2    2026-01-15 03:00     1.2GB   Auto", "bkp_c3d4    2026-01-14 03:00     1.1GB   Auto", "", "$ limewp backup:restore --id=\"bkp_a1b2\"", "Restoring backup... done (2m 14s)"] },
        callout: { type: "warning", title: "Restore Warning", text: "Restoring a backup will overwrite your current site files and database. Always create a fresh backup before restoring an older one." },
      },
    ],
    relatedArticles: ["Managing WordPress Sites", "Database Issues", "SSH & SFTP Access"],
  },
  "Domain & DNS Settings": {
    intro: "Configure custom domains, manage DNS records, and set up domain redirects all from your LimeWP dashboard. Our DNS management supports all standard record types with near-instant propagation.",
    sections: [
      {
        id: "adding-domains",
        title: "Adding a Custom Domain",
        content: "Connect your own domain to your LimeWP site in just a few steps. You can add root domains, subdomains, or wildcard domains.",
        items: ["Navigate to Site Settings then Domains", "Click \"Add Domain\" and enter your domain name", "Choose between nameserver or DNS record verification", "Wait for DNS propagation and verification"],
        code: { label: "Terminal", lines: ["$ limewp domain:add --domain=\"example.com\"", "$ limewp domain:add --domain=\"www.example.com\"", "$ limewp domain:add --domain=\"*.example.com\"  # wildcard"] },
      },
      {
        id: "dns-records",
        title: "DNS Record Types",
        content: "LimeWP DNS supports all standard record types. If you use LimeWP nameservers, you can manage all records from the dashboard.",
        items: ["A Record — Points a domain to an IPv4 address", "AAAA Record — Points a domain to an IPv6 address", "CNAME — Creates an alias to another domain", "MX Record — Configures email routing", "TXT Record — Stores text data (SPF, DKIM, verification)"],
        callout: { type: "info", title: "Cloudflare Integration", text: "LimeWP works seamlessly with Cloudflare. Use a CNAME record pointed to your LimeWP subdomain and enable Cloudflare proxy for additional CDN and DDoS protection." },
      },
      {
        id: "nameservers",
        title: "Using LimeWP Nameservers",
        content: "For the simplest setup, point your domain registrar to LimeWP nameservers. This gives you full DNS management from the LimeWP dashboard.",
        code: { label: "Nameservers", lines: ["ns1.limewp.com", "ns2.limewp.com", "ns3.limewp.com  (backup)"] },
      },
    ],
    relatedArticles: ["SSL Certificates", "Migrating from Another Host", "Managing WordPress Sites"],
  },
  "SSL Certificates": {
    intro: "Every site on LimeWP gets a free SSL certificate automatically provisioned via Let's Encrypt. You can also install custom SSL certificates for specialized needs like EV or wildcard certificates.",
    sections: [
      {
        id: "free-ssl",
        title: "Free SSL (Let's Encrypt)",
        content: "LimeWP automatically provisions and renews free SSL certificates for all your domains. No configuration needed — HTTPS just works out of the box.",
        items: ["Automatic provisioning when you add a domain", "Auto-renewal 30 days before expiration", "Supports both root domains and subdomains", "HTTP to HTTPS redirect enabled by default"],
        callout: { type: "tip", title: "Zero Downtime", text: "SSL certificate renewals happen automatically with zero downtime. You never need to worry about expired certificates." },
      },
      {
        id: "custom-ssl",
        title: "Custom SSL Certificates",
        content: "If you need an EV (Extended Validation) certificate or a wildcard certificate from a specific CA, you can upload your own SSL certificate and private key.",
        code: { label: "Terminal", lines: ["$ limewp ssl:install \\", "    --site=\"my-site\" \\", "    --cert=\"/path/to/certificate.crt\" \\", "    --key=\"/path/to/private.key\" \\", "    --chain=\"/path/to/ca-bundle.crt\"", "", "SSL certificate installed successfully."] },
        callout: { type: "warning", title: "Private Key Security", text: "Never share your private key or commit it to version control. LimeWP encrypts your private key at rest using AES-256 encryption." },
      },
      {
        id: "troubleshooting-ssl",
        title: "SSL Troubleshooting",
        content: "If you encounter SSL issues, these common solutions resolve most problems quickly.",
        items: ["Mixed content warnings — Update hardcoded HTTP URLs in your database", "Certificate not trusted — Ensure the full certificate chain is installed", "ERR_SSL_VERSION — Check your PHP and server TLS configuration", "Redirect loops — Disable SSL plugins if LimeWP handles SSL at the server level"],
      },
    ],
    relatedArticles: ["Domain & DNS Settings", "Common Error Messages", "Performance Optimization"],
  },
  "WP-CLI Commands": {
    intro: "WP-CLI is pre-installed on all LimeWP sites, giving you powerful command-line access to manage WordPress. Execute updates, manage plugins, export data, and automate workflows directly from the terminal.",
    sections: [
      {
        id: "common-commands",
        title: "Common Commands",
        content: "These are the most frequently used WP-CLI commands for day-to-day WordPress management on LimeWP.",
        code: { label: "Terminal", lines: ["# Core updates", "$ wp core update", "$ wp core version", "", "# Plugin management", "$ wp plugin list", "$ wp plugin install woocommerce --activate", "$ wp plugin update --all", "", "# Theme management", "$ wp theme list", "$ wp theme activate flavor-developer"] },
      },
      {
        id: "database-commands",
        title: "Database Operations",
        content: "WP-CLI provides powerful database management commands for search-replace, exports, and optimization.",
        code: { label: "Terminal", lines: ["# Search and replace (useful after migration)", "$ wp search-replace 'old-domain.com' 'new-domain.com' --dry-run", "$ wp search-replace 'old-domain.com' 'new-domain.com'", "", "# Export and import", "$ wp db export backup.sql", "$ wp db import backup.sql", "", "# Optimize tables", "$ wp db optimize"] },
        callout: { type: "warning", title: "Always Backup First", text: "Before running search-replace or import commands, always create a backup. Use the --dry-run flag to preview changes before committing." },
      },
      {
        id: "user-management",
        title: "User Management",
        content: "Create, modify, and manage WordPress users directly from the command line without logging into the admin panel.",
        code: { label: "Terminal", lines: ["# Create a new admin user", "$ wp user create john john@example.com --role=administrator", "", "# List all users", "$ wp user list --format=table", "", "# Reset password", "$ wp user update john --user_pass=\"newSecurePassword123\""] },
      },
      {
        id: "automation",
        title: "Automating with WP-CLI",
        content: "Combine WP-CLI commands with cron jobs or deployment scripts to automate routine tasks like updates, cache clearing, and content publishing.",
        code: { label: "Bash Script", lines: ["#!/bin/bash", "# Auto-update script for LimeWP", "wp core update --quiet", "wp plugin update --all --quiet", "wp theme update --all --quiet", "wp cache flush", "echo \"Updates complete: $(date)\""] },
        callout: { type: "tip", title: "Scheduled Tasks", text: "LimeWP supports scheduled WP-CLI commands via the dashboard. Navigate to Site Settings and Scheduled Tasks to set up automated scripts." },
      },
    ],
    relatedArticles: ["SSH & SFTP Access", "Database Issues", "Performance Optimization"],
  },
  "SSH & SFTP Access": {
    intro: "Access your LimeWP site via SSH for full command-line control, or use SFTP for secure file transfers. Both methods support key-based authentication for enhanced security.",
    sections: [
      {
        id: "ssh-connection",
        title: "Connecting via SSH",
        content: "Every LimeWP site has SSH access enabled by default. Use your site credentials or an SSH key to connect.",
        code: { label: "Terminal", lines: ["# Connect via SSH", "$ ssh user@my-site.limewp.app -p 22022", "", "# Or with a specific key", "$ ssh -i ~/.ssh/limewp_key user@my-site.limewp.app -p 22022", "", "# SSH config shortcut (~/.ssh/config)", "Host my-site", "  HostName my-site.limewp.app", "  User user", "  Port 22022", "  IdentityFile ~/.ssh/limewp_key"] },
        callout: { type: "info", title: "Custom SSH Port", text: "LimeWP uses port 22022 for SSH connections instead of the standard port 22 for added security." },
      },
      {
        id: "key-auth",
        title: "Key-Based Authentication",
        content: "For enhanced security, set up SSH key authentication and disable password login. This prevents brute-force attacks on your server.",
        code: { label: "Terminal", lines: ["# Generate a new SSH key pair", "$ ssh-keygen -t ed25519 -C \"my-limewp-key\"", "", "# Add your public key via CLI", "$ limewp ssh:add-key --file=\"~/.ssh/id_ed25519.pub\"", "", "# Or paste it in the dashboard under", "# Site Settings > SSH Keys > Add Key"] },
        items: ["Generate an Ed25519 or RSA key pair", "Add the public key through the LimeWP dashboard", "Test the connection with your key", "Disable password authentication for maximum security"],
      },
      {
        id: "sftp-setup",
        title: "SFTP File Transfer",
        content: "Use any SFTP client (FileZilla, Cyberduck, Transmit) to transfer files to your LimeWP site securely.",
        items: ["Host: my-site.limewp.app", "Port: 22022", "Protocol: SFTP (not FTP)", "Username: your site username", "Authentication: Password or SSH key"],
        callout: { type: "warning", title: "FTP Not Supported", text: "LimeWP does not support unencrypted FTP connections. Always use SFTP for file transfers to keep your data secure." },
      },
    ],
    relatedArticles: ["WP-CLI Commands", "Managing WordPress Sites", "Performance Optimization"],
  },
  "Performance Optimization": {
    intro: "LimeWP is built for speed with server-level caching, global CDN, and automatic image optimization. This guide covers how to get the best possible performance from your WordPress site.",
    sections: [
      {
        id: "caching",
        title: "Caching Layers",
        content: "LimeWP provides multiple caching layers that work together to deliver sub-second page loads for your visitors.",
        items: ["Server-level full-page caching (Nginx FastCGI)", "Object caching via Redis for database queries", "Browser caching with optimized cache headers", "OPcache for compiled PHP bytecode"],
        code: { label: "Terminal", lines: ["# Clear all caches", "$ limewp cache:flush --site=\"my-site\"", "", "# Clear only page cache", "$ limewp cache:flush --type=page", "", "# Clear object cache (Redis)", "$ wp cache flush"] },
        callout: { type: "tip", title: "Cache Exclusions", text: "WooCommerce cart, checkout, and account pages are automatically excluded from full-page caching. You can add custom exclusion rules in Site Settings." },
      },
      {
        id: "cdn",
        title: "CDN Configuration",
        content: "LimeWP includes a built-in CDN powered by a global network of edge servers. Static assets are automatically served from the nearest edge location.",
        items: ["200+ global edge locations", "Automatic static asset optimization", "WebP image conversion on the fly", "HTTP/3 and QUIC protocol support", "Brotli compression for text assets"],
      },
      {
        id: "image-optimization",
        title: "Image Optimization",
        content: "Images are often the largest assets on a page. LimeWP automatically optimizes images on upload without quality loss.",
        items: ["Automatic WebP/AVIF conversion", "Lazy loading for below-the-fold images", "Responsive srcset generation", "Lossless compression for PNG and JPEG"],
        callout: { type: "info", title: "Image CDN", text: "LimeWP Image CDN resizes and converts images on the fly via URL parameters. No plugin needed." },
      },
      {
        id: "monitoring",
        title: "Performance Monitoring",
        content: "Track your Core Web Vitals and page speed scores directly from the LimeWP dashboard with automated Lighthouse audits.",
        items: ["Daily Lighthouse score tracking", "Core Web Vitals monitoring (LCP, FID, CLS)", "Slow query log analysis", "PHP worker utilization metrics"],
      },
    ],
    relatedArticles: ["Managing WordPress Sites", "WP-CLI Commands", "Common Error Messages"],
  },
  "Common Error Messages": {
    intro: "Encountering an error on your WordPress site can be stressful. This guide covers the most common error messages, what causes them, and step-by-step instructions to resolve each one quickly.",
    sections: [
      {
        id: "white-screen",
        title: "White Screen of Death (WSOD)",
        content: "The dreaded white screen usually indicates a fatal PHP error. The most common causes are plugin conflicts, theme errors, or PHP memory exhaustion.",
        items: ["Enable WP_DEBUG in wp-config.php to see the actual error", "Increase PHP memory limit to 256MB or higher", "Disable all plugins via WP-CLI and reactivate one by one", "Switch to a default theme (Twenty Twenty-Four) to test"],
        code: { label: "Terminal", lines: ["# Enable debug mode", "$ wp config set WP_DEBUG true --raw", "$ wp config set WP_DEBUG_LOG true --raw", "", "# Disable all plugins", "$ wp plugin deactivate --all", "", "# Check error log", "$ tail -50 wp-content/debug.log"] },
      },
      {
        id: "500-error",
        title: "500 Internal Server Error",
        content: "A 500 error is a generic server-side error. On LimeWP, this is typically caused by a corrupted .htaccess file, PHP fatal errors, or exceeded resource limits.",
        items: ["Regenerate the .htaccess file by resaving permalinks", "Check PHP error logs in the LimeWP dashboard", "Increase PHP memory limit and max execution time", "Verify file permissions (644 for files, 755 for directories)"],
        callout: { type: "tip", title: "Quick Fix", text: "Run 'wp rewrite flush' via SSH to regenerate your .htaccess file. This resolves 500 errors caused by corrupted permalink rules." },
      },
      {
        id: "database-error",
        title: "Error Establishing Database Connection",
        content: "This error means WordPress cannot connect to your MySQL database. On LimeWP, this is rare but can happen after database migrations or credential changes.",
        items: ["Verify database credentials in wp-config.php", "Check if the database server is running (LimeWP status page)", "Repair the database using WP-CLI or phpMyAdmin", "Contact support if the issue persists — it may be server-side"],
        callout: { type: "warning", title: "Do Not Edit wp-config.php Directly", text: "On LimeWP, database credentials are managed automatically. If you see this error, contact support before making changes to wp-config.php." },
      },
    ],
    relatedArticles: ["Database Issues", "Plugin Conflicts", "Performance Optimization"],
  },
  "Database Issues": {
    intro: "Your WordPress database stores all your content, settings, and user data. This guide covers how to diagnose, repair, optimize, and safely manage your database on LimeWP.",
    sections: [
      {
        id: "repair-db",
        title: "Repairing a Corrupted Database",
        content: "Database corruption can occur after server crashes, abrupt shutdowns, or disk errors. LimeWP provides multiple ways to repair your database tables.",
        code: { label: "Terminal", lines: ["# Check all tables for errors", "$ wp db check", "", "# Repair all tables", "$ wp db repair", "", "# Or via MySQL directly", "$ wp db query \"CHECK TABLE wp_posts\"", "$ wp db query \"REPAIR TABLE wp_posts\""] },
        callout: { type: "warning", title: "Backup First", text: "Always create a backup before running repair operations. While rare, repair commands can occasionally cause data loss on severely corrupted tables." },
      },
      {
        id: "optimize-db",
        title: "Optimizing Database Performance",
        content: "Over time, WordPress databases accumulate overhead from post revisions, transient options, and orphaned metadata. Regular optimization keeps your site fast.",
        items: ["Delete post revisions older than 30 days", "Clean up auto-draft and trashed posts", "Remove expired transients from the options table", "Optimize table overhead with OPTIMIZE TABLE"],
        code: { label: "Terminal", lines: ["# Delete old revisions", "$ wp post delete $(wp post list --post_type=revision --format=ids) --force", "", "# Clean transients", "$ wp transient delete --all", "", "# Optimize all tables", "$ wp db optimize"] },
      },
      {
        id: "export-import",
        title: "Export & Import",
        content: "Export your database for backups or migration, and import databases from other WordPress installations.",
        code: { label: "Terminal", lines: ["# Export full database", "$ wp db export my-site-backup.sql", "", "# Export specific tables", "$ wp db export --tables=wp_posts,wp_postmeta export.sql", "", "# Import a database dump", "$ wp db import my-site-backup.sql"] },
      },
      {
        id: "scaling",
        title: "Database Scaling",
        content: "For high-traffic sites, LimeWP offers database read replicas and connection pooling to handle thousands of concurrent queries.",
        items: ["Enable read replicas for SELECT query offloading", "Configure connection pooling to reduce MySQL overhead", "Use Redis object caching to minimize database queries", "Monitor slow queries via the LimeWP dashboard"],
        callout: { type: "tip", title: "Query Monitor", text: "Install the Query Monitor plugin to identify slow database queries on your site. It shows execution time, caller, and query count per page load." },
      },
    ],
    relatedArticles: ["Common Error Messages", "WP-CLI Commands", "Performance Optimization"],
  },
  "Plugin Conflicts": {
    intro: "Plugin conflicts are one of the most common causes of WordPress issues. When two or more plugins try to modify the same functionality, it can lead to errors, broken layouts, or complete site failure. Here is how to diagnose and fix them.",
    sections: [
      {
        id: "safe-mode",
        title: "Using LimeWP Safe Mode",
        content: "LimeWP Safe Mode temporarily disables all plugins and switches to a default theme, allowing you to access your site when a conflict has locked you out.",
        items: ["Navigate to Site Settings and click \"Enable Safe Mode\"", "Your site loads with all plugins disabled and a default theme", "Access wp-admin to identify and fix the problematic plugin", "Disable Safe Mode when done to restore normal operation"],
        callout: { type: "info", title: "Safe Mode is Non-Destructive", text: "Safe Mode does not delete or modify any plugin files or settings. It temporarily suspends plugin loading at the server level." },
      },
      {
        id: "disabling-plugins",
        title: "Identifying the Conflicting Plugin",
        content: "The systematic approach to finding a conflicting plugin is to disable all plugins, then reactivate them one at a time until the issue reappears.",
        code: { label: "Terminal", lines: ["# Disable all plugins", "$ wp plugin deactivate --all", "", "# Reactivate one by one", "$ wp plugin activate plugin-name", "# Test your site after each activation", "", "# Check for PHP errors", "$ tail -f wp-content/debug.log"] },
        items: ["Deactivate all plugins via WP-CLI or Safe Mode", "Reactivate plugins one at a time", "Test the site after each activation", "The last activated plugin before the error is the culprit"],
      },
      {
        id: "debugging",
        title: "Debugging Plugin Issues",
        content: "When you have identified the conflicting plugin, use WordPress debug tools to understand exactly what is going wrong.",
        code: { label: "wp-config.php", lines: ["// Enable debugging", "define( 'WP_DEBUG', true );", "define( 'WP_DEBUG_LOG', true );", "define( 'WP_DEBUG_DISPLAY', false );", "define( 'SCRIPT_DEBUG', true );"] },
        callout: { type: "warning", title: "Never Enable Debug Display on Production", text: "WP_DEBUG_DISPLAY shows errors to visitors. Always set it to false on live sites and use WP_DEBUG_LOG instead to write errors to a log file." },
      },
      {
        id: "prevention",
        title: "Preventing Plugin Conflicts",
        content: "Follow these best practices to minimize the risk of plugin conflicts on your WordPress site.",
        items: ["Always test new plugins on a staging environment first", "Keep all plugins updated to their latest versions", "Avoid using multiple plugins that serve the same purpose", "Review plugin changelogs before updating", "Use LimeWP automated compatibility checks before updates"],
        callout: { type: "tip", title: "Plugin Compatibility", text: "LimeWP automatically checks plugin compatibility before updates and warns you about known conflicts. Enable this in Site Settings and Auto-Updates." },
      },
    ],
    relatedArticles: ["Common Error Messages", "Database Issues", "WP-CLI Commands"],
  },
};

/* ────────────────────────── Video Tutorials ────────────────────────── */

const VIDEO_TUTORIALS = [
  { title: "Getting Started with LimeWP", duration: "4:32", color: "emerald" },
  { title: "Migrating Your WordPress Site", duration: "8:15", color: "sky" },
  { title: "Speed Optimization Tips", duration: "6:48", color: "violet" },
];

/* ────────────────────────── Popular Articles ────────────────────────── */

const popularArticles = [
  { title: "Backups & Restore", category: "Site Management", readTime: "7 min" },
  { title: "Performance Optimization", category: "Advanced", readTime: "12 min" },
  { title: "Quick Start Guide", category: "Getting Started", readTime: "5 min" },
  { title: "Domain & DNS Settings", category: "Site Management", readTime: "6 min" },
];

/* ────────────────────────── Flat article list helper ────────────────────────── */

function getAllArticles(): { title: string; sectionLabel: string; color: string }[] {
  const list: { title: string; sectionLabel: string; color: string }[] = [];
  for (const s of sections) {
    for (const item of s.items) {
      list.push({ title: item.title, sectionLabel: s.label, color: s.color });
    }
  }
  return list;
}

/* ────────────────────────── Component ────────────────────────── */

export default function DocsPage() {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  // ── State ──
  const [activeDoc, setActiveDoc] = useState("Quick Start Guide");
  const [search, setSearch] = useState("");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "Getting Started": true,
    "Site Management": true,
    "Advanced": false,
    "Troubleshooting": false,
  });
  const [activeSection, setActiveSection] = useState("");
  const [helpfulFeedback, setHelpfulFeedback] = useState<boolean | null>(null);
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [readingProgress, setReadingProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const articleRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  // ── Derived ──
  const allArticles = useMemo(() => getAllArticles(), []);
  const currentArticleIdx = allArticles.findIndex((a) => a.title === activeDoc);
  const prevArticle = currentArticleIdx > 0 ? allArticles[currentArticleIdx - 1] : null;
  const nextArticle = currentArticleIdx < allArticles.length - 1 ? allArticles[currentArticleIdx + 1] : null;

  const currentSection = sections.find((s) => s.items.some((i) => i.title === activeDoc));
  const currentDoc = currentSection?.items.find((i) => i.title === activeDoc);
  const articleContent = ARTICLE_CONTENT[activeDoc];

  const tableOfContents = useMemo(() => {
    if (!articleContent) return [];
    return articleContent.sections.map((s) => ({ id: s.id, label: s.title }));
  }, [articleContent]);

  // ── Filtered sidebar ──
  const filteredSections = useMemo(() => {
    if (!search) return sections;
    return sections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => item.title.toLowerCase().includes(search.toLowerCase())),
      }))
      .filter((section) => section.items.length > 0);
  }, [search]);

  // ── Toggle section ──
  const toggleSection = (label: string) => {
    setExpandedSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  // ── Navigate to article ──
  const navigateToArticle = useCallback((title: string) => {
    setActiveDoc(title);
    setHelpfulFeedback(null);
    setActiveSection("");
    setReadingProgress(0);
    // Expand the section containing this article
    const sec = sections.find((s) => s.items.some((i) => i.title === title));
    if (sec) {
      setExpandedSections((prev) => ({ ...prev, [sec.label]: true }));
    }
    // Scroll to top of article
    articleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // ── Reading progress & scroll tracking ──
  useEffect(() => {
    const handleScroll = () => {
      // Show back to top button
      setShowBackToTop(window.scrollY > 400);

      // Calculate reading progress
      if (articleRef.current) {
        const rect = articleRef.current.getBoundingClientRect();
        const totalHeight = articleRef.current.scrollHeight;
        const visibleTop = -rect.top;
        const pct = Math.min(100, Math.max(0, (visibleTop / (totalHeight - window.innerHeight)) * 100));
        setReadingProgress(Math.round(pct));
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── IntersectionObserver for TOC sync ──
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const refs = sectionRefs.current;

    refs.forEach((el, id) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [activeDoc]);

  // ── Copy code ──
  const copyCode = (lines: string[], label: string) => {
    const text = lines.join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCode(label + lines[0]);
      showToast.success("Code copied to clipboard");
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  // ── Toggle bookmark ──
  const toggleBookmark = (title: string) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
        showToast.info("Bookmark removed");
      } else {
        next.add(title);
        showToast.success("Article bookmarked");
      }
      return next;
    });
  };

  // ── Scroll to section ──
  const scrollToSection = (id: string) => {
    const el = sectionRefs.current.get(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(id);
    }
  };

  // ── Style helpers ──
  const cardClass = `rounded-2xl border transition-all ${
    isLight ? "bg-white border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"
  }`;

  const iconBtnClass = `w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
    isLight
      ? "bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700"
      : "bg-[var(--bg-elevated)] hover:bg-[var(--border-primary)] text-slate-400 hover:text-slate-200"
  }`;

  // ── Callout colors ──
  const getCalloutColors = (type: "info" | "warning" | "tip") => {
    switch (type) {
      case "info":
        return {
          border: isLight ? "border-sky-200" : "border-sky-500/30",
          bg: isLight ? "bg-sky-50" : "bg-sky-500/10",
          iconBg: isLight ? "bg-sky-100 ring-1 ring-sky-200" : "bg-sky-500/20 ring-1 ring-sky-500/30",
          iconColor: isLight ? "text-sky-600" : "text-sky-400",
          titleColor: isLight ? "text-sky-700" : "text-sky-300",
          glow: "from-sky-500/20",
          icon: "M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z",
        };
      case "warning":
        return {
          border: isLight ? "border-amber-200" : "border-amber-500/30",
          bg: isLight ? "bg-amber-50" : "bg-amber-500/10",
          iconBg: isLight ? "bg-amber-100 ring-1 ring-amber-200" : "bg-amber-500/20 ring-1 ring-amber-500/30",
          iconColor: isLight ? "text-amber-600" : "text-amber-400",
          titleColor: isLight ? "text-amber-700" : "text-amber-300",
          glow: "from-amber-500/20",
          icon: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z",
        };
      case "tip":
        return {
          border: isLight ? "border-emerald-200" : "border-emerald-500/30",
          bg: isLight ? "bg-emerald-50" : "bg-emerald-500/10",
          iconBg: isLight ? "bg-emerald-100 ring-1 ring-emerald-200" : "bg-emerald-500/20 ring-1 ring-emerald-500/30",
          iconColor: isLight ? "text-emerald-600" : "text-emerald-400",
          titleColor: isLight ? "text-emerald-700" : "text-emerald-300",
          glow: "from-emerald-500/20",
          icon: "M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18",
        };
    }
  };

  return (
    <AppShell>
      {/* Page Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className={`text-2xl font-bold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>Documentation</h1>
          <p className={`text-sm ${isLight ? "text-slate-600" : "text-slate-500"}`}>Learn how to get the most out of LimeWP hosting</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => showToast.info("Changelog page coming soon")}
            className={`flex items-center gap-2 h-9 px-4 rounded-xl font-semibold text-sm transition-all ${
              isLight
                ? "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
                : "bg-[var(--bg-elevated)] text-slate-200 hover:bg-[var(--border-primary)] hover:text-white"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Changelog
          </button>
          <button
            onClick={() => showToast.info("Thank you! Feedback submitted")}
            className={`flex items-center gap-2 h-9 px-4 rounded-xl font-semibold text-sm transition-all ${
              isLight
                ? "bg-slate-800 text-white hover:bg-slate-700"
                : "bg-slate-100 text-slate-900 hover:bg-slate-200"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
            Feedback
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Articles", value: "13", icon: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25", color: "emerald" },
          { label: "Categories", value: "4", icon: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z", color: "sky" },
          { label: "Video Tutorials", value: "12", icon: "M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z", color: "violet" },
          { label: "Last Updated", value: "Today", icon: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99", color: "amber" },
        ].map((stat) => {
          const colors = colorClasses[stat.color];
          return (
            <div key={stat.label} className={`relative group rounded-xl p-4 border transition-all overflow-hidden hover:-translate-y-px ${
              isLight
                ? "bg-white border-slate-200 hover:border-slate-300 hover:shadow-md"
                : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)] hover:border-[var(--border-primary)]"
            }`}>
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${colors.bg} to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-60`} />
              <div className="relative flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${colors.bg} ring-1 ${colors.ring} flex items-center justify-center`}>
                  <svg className={`w-5 h-5 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d={stat.icon} />
                  </svg>
                </div>
                <div>
                  <div className={`text-xl font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>{stat.value}</div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-6">
        {/* ────── Left Sidebar ────── */}
        <div className="w-72 shrink-0">
          <div className="sticky top-24">
            <div className={`relative ${cardClass} overflow-hidden`}>
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${colorClasses.emerald.bg} to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-60`} />

              <div className="relative p-4">
                {/* Search */}
                <div className="mb-4 relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search documentation..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={`w-full h-9 pl-9 pr-3 rounded-xl border text-sm transition-all outline-none ${
                      isLight
                        ? "bg-slate-100 border-slate-200 text-slate-800 placeholder:text-slate-500 focus:border-slate-400"
                        : "bg-[var(--bg-elevated)] border-[var(--border-primary)] text-slate-100 placeholder:text-slate-500 focus:border-[var(--border-secondary)]"
                    }`}
                  />
                </div>

                {/* Keyboard Shortcut Hint */}
                <div className={`flex items-center justify-center gap-2 mb-4 py-2 px-3 rounded-lg border ${
                  isLight ? "bg-slate-100/50 border-slate-200/50" : "bg-[var(--bg-elevated)]/50 border-white/[0.08]"
                }`}>
                  <span className="text-xs text-slate-500">Quick search</span>
                  <div className="flex items-center gap-1">
                    <kbd className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${isLight ? "bg-slate-200 text-slate-600" : "bg-[var(--border-primary)] text-slate-400"}`}>&#x2318;</kbd>
                    <kbd className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${isLight ? "bg-slate-200 text-slate-600" : "bg-[var(--border-primary)] text-slate-400"}`}>K</kbd>
                  </div>
                </div>

                {/* Nav Sections */}
                <div className="space-y-1">
                  {filteredSections.map((section) => {
                    const colors = colorClasses[section.color];
                    const isExpanded = expandedSections[section.label];
                    return (
                      <div key={section.label}>
                        <button
                          onClick={() => toggleSection(section.label)}
                          className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl transition-colors group ${
                            isLight ? "hover:bg-slate-100" : "hover:bg-[var(--bg-elevated)]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-7 h-7 rounded-lg ${colors.bg} ring-1 ${colors.ring} flex items-center justify-center`}>
                              <svg className={`w-3.5 h-3.5 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                                <path d={section.icon} />
                              </svg>
                            </div>
                            <span className={`text-sm font-medium transition-colors ${
                              isLight ? "text-slate-700 group-hover:text-slate-900" : "text-slate-300 group-hover:text-slate-100"
                            }`}>{section.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                              isLight ? "text-slate-500 bg-slate-100" : "text-slate-600 bg-[var(--bg-elevated)]"
                            }`}>{section.items.length}</span>
                            <svg className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isExpanded ? "rotate-0" : "-rotate-90"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </button>
                        <div className={`overflow-hidden transition-all duration-200 ${isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                          <div className={`ml-4 pl-5 border-l space-y-0.5 py-1 ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
                            {section.items.map((item) => (
                              <button
                                key={item.title}
                                onClick={() => navigateToArticle(item.title)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${
                                  activeDoc === item.title
                                    ? `${colors.bg} ${colors.text} ring-1 ${colors.ring}`
                                    : isLight
                                      ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                      : "text-slate-400 hover:bg-[var(--bg-elevated)] hover:text-slate-100"
                                }`}
                              >
                                <span className="truncate">{item.title}</span>
                                {item.isNew && (
                                  <span className={`flex-shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                    isLight
                                      ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
                                      : "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30"
                                  }`}>NEW</span>
                                )}
                                {item.isPopular && (
                                  <svg className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                                  </svg>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Popular Articles */}
            <div className={`mt-4 relative ${cardClass} p-4 overflow-hidden`}>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-amber-500/10 to-transparent rounded-full translate-y-1/2 -translate-x-1/3" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                    <path d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
                  </svg>
                  <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Popular</span>
                </div>
                <div className="space-y-2">
                  {popularArticles.map((article, i) => (
                    <button
                      key={i}
                      onClick={() => navigateToArticle(article.title)}
                      className={`w-full text-left p-2 rounded-lg transition-colors group ${
                        isLight ? "hover:bg-slate-100" : "hover:bg-[var(--bg-elevated)]"
                      }`}
                    >
                      <div className={`text-sm truncate ${isLight ? "text-slate-700 group-hover:text-slate-900" : "text-slate-300 group-hover:text-slate-100"}`}>{article.title}</div>
                      <div className="text-[11px] text-slate-500">{article.category} &bull; {article.readTime}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Video Tutorials */}
            <div className={`mt-4 relative ${cardClass} p-4 overflow-hidden`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-violet-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                  </svg>
                  <span className="text-xs font-semibold text-violet-500 uppercase tracking-wider">Video Tutorials</span>
                </div>
                <div className="space-y-2">
                  {VIDEO_TUTORIALS.map((video, i) => {
                    const vc = colorClasses[video.color];
                    return (
                      <button
                        key={i}
                        onClick={() => showToast.info("Video tutorials coming soon")}
                        className={`w-full text-left p-2.5 rounded-lg transition-all group flex items-center gap-3 ${
                          isLight ? "hover:bg-slate-100" : "hover:bg-[var(--bg-elevated)]"
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-lg ${vc.bg} ring-1 ${vc.ring} flex items-center justify-center flex-shrink-0`}>
                          <svg className={`w-4 h-4 ${vc.text}`} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <div className={`text-sm truncate ${isLight ? "text-slate-700 group-hover:text-slate-900" : "text-slate-300 group-hover:text-slate-100"}`}>{video.title}</div>
                          <div className="text-[11px] text-slate-500">{video.duration}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ────── Main Content ────── */}
        <div className="flex-1 min-w-0" ref={articleRef}>
          <div className={`relative ${cardClass} overflow-hidden`}>
            {/* Corner Glow */}
            <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl ${colorClasses[currentSection?.color || "emerald"].bg} to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-60`} />

            <div className="relative p-8">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm mb-6">
                <span className={`cursor-pointer transition-colors ${isLight ? "text-slate-500 hover:text-slate-700" : "text-slate-500 hover:text-slate-300"}`}>Docs</span>
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className={`cursor-pointer transition-colors ${isLight ? "text-slate-500 hover:text-slate-700" : "text-slate-500 hover:text-slate-300"}`}>{currentSection?.label}</span>
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className={`font-medium ${isLight ? "text-slate-800" : "text-slate-100"}`}>{activeDoc}</span>
              </div>

              {/* Title & Meta */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className={`text-3xl font-bold mb-3 ${isLight ? "text-slate-800" : "text-slate-100"}`}>{activeDoc}</h1>
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg ring-1 ${
                      isLight ? "bg-slate-100 text-slate-600 ring-slate-200" : "bg-slate-500/10 text-slate-400 ring-slate-500/20"
                    }`}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {currentDoc?.readTime || "5 min"} read
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-slate-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      Updated {currentDoc?.updated || "Jan 15, 2026"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Bookmark */}
                  <button
                    onClick={() => toggleBookmark(activeDoc)}
                    className={iconBtnClass}
                    title="Bookmark"
                  >
                    <svg className={`w-4 h-4 ${bookmarked.has(activeDoc) ? "text-amber-500" : ""}`} fill={bookmarked.has(activeDoc) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                    </svg>
                  </button>
                  {/* Edit */}
                  <button onClick={() => showToast.info("Suggest an edit on GitHub")} className={iconBtnClass} title="Edit">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </button>
                  {/* Share */}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      showToast.success("Link copied to clipboard");
                    }}
                    className={iconBtnClass}
                    title="Share"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                    </svg>
                  </button>
                  {/* Print */}
                  <button onClick={() => window.print()} className={iconBtnClass} title="Print">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Reading Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>Reading progress</span>
                  <span>{readingProgress}%</span>
                </div>
                <div className={`h-1 rounded-full overflow-hidden ${isLight ? "bg-slate-200" : "bg-[var(--bg-elevated)]"}`}>
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${accent.progress || "bg-emerald-500"}`}
                    style={{ width: `${readingProgress}%` }}
                  />
                </div>
              </div>

              {/* ── Dynamic Article Content ── */}
              {articleContent ? (
                <>
                  {/* Intro */}
                  <p className={`mb-8 leading-relaxed text-lg ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                    {articleContent.intro}
                  </p>

                  {/* Sections */}
                  {articleContent.sections.map((section, sIdx) => {
                    const sectionColor = colorClasses[currentSection?.color || "emerald"];
                    return (
                      <div
                        key={section.id}
                        id={section.id}
                        className="scroll-mt-24"
                        ref={(el) => {
                          if (el) sectionRefs.current.set(section.id, el);
                          else sectionRefs.current.delete(section.id);
                        }}
                      >
                        <div className="flex items-center gap-3 mb-4 mt-10">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            isLight
                              ? `${sectionColor.dot} text-white`
                              : `${sectionColor.bg} ${sectionColor.text} ring-1 ${sectionColor.ring}`
                          }`}>
                            {sIdx + 1}
                          </div>
                          <h2 className={`text-xl font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>{section.title}</h2>
                        </div>

                        <p className={`mb-4 leading-relaxed pl-11 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                          {section.content}
                        </p>

                        {/* Items list */}
                        {section.items && (
                          <ul className="space-y-3 mb-6 pl-11">
                            {section.items.map((item) => (
                              <li key={item} className={`flex items-start gap-3 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                  isLight
                                    ? `bg-${currentSection?.color || "emerald"}-100 ring-1 ring-${currentSection?.color || "emerald"}-200`
                                    : `${sectionColor.bg} ring-1 ${sectionColor.ring}`
                                }`}>
                                  <svg className={`w-3 h-3 ${sectionColor.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                  </svg>
                                </div>
                                <span className="text-sm">{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Code block */}
                        {section.code && (
                          <div className={`relative rounded-xl overflow-hidden mb-6 ml-11 ${isLight ? "bg-slate-900" : "bg-[#09090B]"}`}>
                            <div className={`flex items-center justify-between px-4 py-3 border-b ${isLight ? "border-slate-800" : "border-[var(--border-secondary)]"}`}>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5">
                                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                                </div>
                                <span className="text-slate-500 text-xs font-mono ml-2">{section.code.label}</span>
                              </div>
                              <button
                                onClick={() => copyCode(section.code!.lines, section.code!.label)}
                                className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded hover:bg-slate-800"
                              >
                                {copiedCode === section.code.label + section.code.lines[0] ? (
                                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                  </svg>
                                ) : (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                                  </svg>
                                )}
                              </button>
                            </div>
                            <div className="p-5 overflow-x-auto">
                              <pre className="font-mono text-sm leading-relaxed">
                                <code>
                                  {section.code.lines.map((line, li) => (
                                    <span key={li}>
                                      {line.startsWith("$") ? (
                                        <>
                                          <span className="text-emerald-400">$</span>
                                          <span className="text-slate-300">{line.slice(1)}</span>
                                        </>
                                      ) : line.startsWith("#") ? (
                                        <span className="text-slate-500">{line}</span>
                                      ) : line.startsWith("//") ? (
                                        <span className="text-slate-500">{line}</span>
                                      ) : line === "" ? (
                                        <span> </span>
                                      ) : (
                                        <span className="text-slate-300">{line}</span>
                                      )}
                                      {li < section.code!.lines.length - 1 && "\n"}
                                    </span>
                                  ))}
                                </code>
                              </pre>
                            </div>
                          </div>
                        )}

                        {/* Callout */}
                        {section.callout && (() => {
                          const cc = getCalloutColors(section.callout.type);
                          return (
                            <div className={`relative rounded-xl p-4 mb-6 ml-11 overflow-hidden border ${cc.bg} ${cc.border}`}>
                              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${cc.glow} to-transparent rounded-full -translate-y-1/2 translate-x-1/3`} />
                              <div className="relative flex gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cc.iconBg}`}>
                                  <svg className={`w-5 h-5 ${cc.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d={cc.icon} />
                                  </svg>
                                </div>
                                <div>
                                  <div className={`font-semibold mb-1 ${cc.titleColor}`}>{section.callout.title}</div>
                                  <p className={`text-sm ${isLight ? "text-slate-600" : "text-slate-400"}`}>{section.callout.text}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    );
                  })}

                  {/* Related Articles */}
                  {articleContent.relatedArticles.length > 0 && (
                    <div className={`mt-10 pt-8 border-t ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
                      <h3 className={`text-sm font-semibold mb-4 uppercase tracking-wider ${isLight ? "text-slate-500" : "text-slate-500"}`}>Related Articles</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {articleContent.relatedArticles.map((title) => {
                          const relSection = sections.find((s) => s.items.some((i) => i.title === title));
                          const rc = colorClasses[relSection?.color || "emerald"];
                          return (
                            <button
                              key={title}
                              onClick={() => navigateToArticle(title)}
                              className={`text-left p-3 rounded-xl border transition-all group hover:-translate-y-px ${
                                isLight
                                  ? "bg-slate-50 border-slate-200 hover:border-slate-300 hover:shadow-md"
                                  : "bg-[var(--bg-elevated)]/50 border-white/[0.08] hover:border-[var(--border-primary)]"
                              }`}
                            >
                              <div className={`w-7 h-7 rounded-lg ${rc.bg} ring-1 ${rc.ring} flex items-center justify-center mb-2`}>
                                <svg className={`w-3.5 h-3.5 ${rc.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                                </svg>
                              </div>
                              <div className={`text-sm font-medium ${isLight ? "text-slate-700 group-hover:text-slate-900" : "text-slate-300 group-hover:text-slate-100"}`}>{title}</div>
                              <div className="text-xs text-slate-500 mt-0.5">{relSection?.label}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className={`text-lg ${isLight ? "text-slate-600" : "text-slate-400"}`}>Article content not found.</p>
              )}

              {/* Was this helpful? */}
              <div className={`relative rounded-xl p-6 mt-8 mb-8 overflow-hidden ${isLight ? "bg-slate-100/50" : "bg-[var(--bg-elevated)]/50"}`}>
                <div className="text-center">
                  <p className={`text-sm mb-4 ${isLight ? "text-slate-600" : "text-slate-400"}`}>Was this article helpful?</p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        setHelpfulFeedback(true);
                        showToast.success("Thanks for your positive feedback!");
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                        helpfulFeedback === true
                          ? isLight
                            ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
                            : "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30"
                          : isLight
                            ? "bg-slate-200/50 text-slate-600 hover:bg-slate-200 hover:text-slate-800"
                            : "bg-[var(--border-primary)]/50 text-slate-400 hover:bg-[var(--border-primary)] hover:text-slate-200"
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                      </svg>
                      Yes
                    </button>
                    <button
                      onClick={() => {
                        setHelpfulFeedback(false);
                        showToast.info("Thanks for your feedback. We'll improve this article.");
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                        helpfulFeedback === false
                          ? isLight
                            ? "bg-amber-100 text-amber-700 ring-1 ring-amber-200"
                            : "bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30"
                          : isLight
                            ? "bg-slate-200/50 text-slate-600 hover:bg-slate-200 hover:text-slate-800"
                            : "bg-[var(--border-primary)]/50 text-slate-400 hover:bg-[var(--border-primary)] hover:text-slate-200"
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384" />
                      </svg>
                      No
                    </button>
                  </div>
                  {helpfulFeedback !== null && (
                    <p className="text-xs text-slate-500 mt-3">Thanks for your feedback!</p>
                  )}
                </div>
              </div>

              {/* Article Navigation */}
              <div className={`flex justify-between items-center pt-6 border-t ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
                {prevArticle ? (
                  <button
                    onClick={() => navigateToArticle(prevArticle.title)}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isLight ? "hover:bg-slate-100" : "hover:bg-[var(--bg-elevated)]"}`}
                  >
                    <svg className={`w-5 h-5 transition-colors ${isLight ? "text-slate-400 group-hover:text-slate-600" : "text-slate-500 group-hover:text-slate-300"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    <div className="text-left">
                      <div className="text-xs text-slate-500">Previous</div>
                      <div className={`text-sm font-medium transition-colors ${isLight ? "text-slate-700 group-hover:text-slate-900" : "text-slate-300 group-hover:text-slate-100"}`}>{prevArticle.title}</div>
                    </div>
                  </button>
                ) : (
                  <div />
                )}
                {nextArticle ? (
                  <button
                    onClick={() => navigateToArticle(nextArticle.title)}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isLight ? "hover:bg-slate-100" : "hover:bg-[var(--bg-elevated)]"}`}
                  >
                    <div className="text-right">
                      <div className="text-xs text-slate-500">Next</div>
                      <div className={`text-sm font-medium transition-colors ${isLight ? "text-slate-700 group-hover:text-slate-900" : "text-slate-300 group-hover:text-slate-100"}`}>{nextArticle.title}</div>
                    </div>
                    <svg className={`w-5 h-5 transition-colors ${isLight ? "text-slate-600 group-hover:text-slate-800" : "text-slate-400 group-hover:text-slate-200"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                ) : (
                  <div />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ────── Right Sidebar — Table of Contents ────── */}
        <div className="w-56 shrink-0 hidden xl:block">
          <div className="sticky top-24">
            <div className={`relative ${cardClass} p-4 overflow-hidden`}>
              <div className={`absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl ${colorClasses[currentSection?.color || "emerald"].bg} to-transparent rounded-full translate-y-1/3 translate-x-1/3`} />

              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">On this page</span>
                </div>
                <nav className="space-y-1">
                  {tableOfContents.map((item) => {
                    const tocColor = colorClasses[currentSection?.color || "emerald"];
                    return (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                          activeSection === item.id
                            ? `${tocColor.bg} ${tocColor.text} ring-1 ${tocColor.ring}`
                            : isLight
                              ? "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                              : "text-slate-500 hover:text-slate-300 hover:bg-[var(--bg-elevated)]"
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Help Card */}
            <div className={`mt-4 relative ${cardClass} p-4 overflow-hidden`}>
              <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-sky-500/10 to-transparent rounded-full -translate-y-1/3 -translate-x-1/3" />

              <div className="relative text-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${
                  isLight ? "bg-sky-100 ring-1 ring-sky-200" : "bg-sky-500/20 ring-1 ring-sky-500/30"
                }`}>
                  <svg className={`w-6 h-6 ${isLight ? "text-sky-600" : "text-sky-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <p className={`text-sm mb-3 ${isLight ? "text-slate-600" : "text-slate-400"}`}>Need help? Our support team is available 24/7</p>
                <button
                  onClick={() => showToast.info("Redirecting to support...")}
                  className={`w-full h-9 rounded-xl text-sm font-semibold transition-all ${
                    isLight
                      ? "bg-slate-800 text-white hover:bg-slate-700"
                      : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                  }`}
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Back to Top Floating Button ── */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all hover:-translate-y-px ${
            isLight
              ? "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:shadow-xl"
              : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border border-[var(--border-tertiary)] text-slate-400 hover:text-slate-200"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
        </button>
      )}
    </AppShell>
  );
}
