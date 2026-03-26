"use client";

import { useState, useMemo, useCallback } from "react";
import AppShell from "../components/AppShell";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { showToast } from "@/lib/toast";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";

/* ────────────────────────── Constants ────────────────────────── */

const BASE_URL = "https://api.limewp.com/v1";
const MOCK_API_KEY = "lwp_sk_live_7f3a9b2c1d4e5f6a8b9c0d1e2f3a4b5c";

const METHOD_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  GET: { bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/20" },
  POST: { bg: "bg-sky-500/10", text: "text-sky-500", border: "border-sky-500/20" },
  PUT: { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20" },
  DEL: { bg: "bg-rose-500/10", text: "text-rose-500", border: "border-rose-500/20" },
  DELETE: { bg: "bg-rose-500/10", text: "text-rose-500", border: "border-rose-500/20" },
};

const STATUS_COLORS: Record<number, { bg: string; text: string; label: string }> = {
  200: { bg: "bg-emerald-500/10", text: "text-emerald-500", label: "OK" },
  201: { bg: "bg-emerald-500/10", text: "text-emerald-500", label: "Created" },
  400: { bg: "bg-amber-500/10", text: "text-amber-500", label: "Bad Request" },
  401: { bg: "bg-rose-500/10", text: "text-rose-500", label: "Unauthorized" },
  403: { bg: "bg-rose-500/10", text: "text-rose-500", label: "Forbidden" },
  404: { bg: "bg-slate-500/10", text: "text-slate-500", label: "Not Found" },
  409: { bg: "bg-amber-500/10", text: "text-amber-500", label: "Conflict" },
  422: { bg: "bg-amber-500/10", text: "text-amber-500", label: "Unprocessable" },
  429: { bg: "bg-orange-500/10", text: "text-orange-500", label: "Too Many Requests" },
  500: { bg: "bg-red-500/10", text: "text-red-500", label: "Server Error" },
};

const SECTION_COLORS: Record<string, { bg: string; text: string; activeBg: string; icon: string }> = {
  "Getting Started": { bg: "bg-emerald-500/10", text: "text-emerald-500", activeBg: "bg-emerald-500/15", icon: "text-emerald-500" },
  Sites: { bg: "bg-sky-500/10", text: "text-sky-500", activeBg: "bg-sky-500/15", icon: "text-sky-500" },
  Backups: { bg: "bg-violet-500/10", text: "text-violet-500", activeBg: "bg-violet-500/15", icon: "text-violet-500" },
  Domains: { bg: "bg-amber-500/10", text: "text-amber-500", activeBg: "bg-amber-500/15", icon: "text-amber-500" },
  SSL: { bg: "bg-rose-500/10", text: "text-rose-500", activeBg: "bg-rose-500/15", icon: "text-rose-500" },
  DNS: { bg: "bg-teal-500/10", text: "text-teal-500", activeBg: "bg-teal-500/15", icon: "text-teal-500" },
};

const SECTION_ICONS: Record<string, string> = {
  "Getting Started": "M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5",
  Sites: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418",
  Backups: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z",
  Domains: "M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-3.061a4.5 4.5 0 010 6.364L10.68 20.17a4.5 4.5 0 01-6.364-6.364l4.5-4.5a4.5 4.5 0 017.244 1.242z",
  SSL: "M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z",
  DNS: "M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z",
};

/* ────────────────────────── Types ────────────────────────── */

interface Param {
  name: string;
  type: string;
  desc: string;
  required?: boolean;
}

interface Endpoint {
  id: string;
  section: string;
  name: string;
  method: string | null;
  path: string | null;
  description: string;
  paramLabel?: string;
  params?: Param[];
  successCode?: number;
  responseJson?: string;
  curl?: string;
  javascript?: string;
  python?: string;
  php?: string;
  icon?: string;
  isInfo?: boolean;
}

/* ────────────────────────── Nav sections ────────────────────────── */

interface NavItem { name: string; method: string | null; icon?: string }
interface NavSection { label: string; items: NavItem[] }

const navSections: NavSection[] = [
  {
    label: "Getting Started",
    items: [
      { name: "Overview", method: null, icon: "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" },
      { name: "Authentication", method: null, icon: "M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" },
      { name: "Rate Limits", method: null, icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" },
      { name: "Errors", method: null, icon: "M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" },
    ],
  },
  {
    label: "Sites",
    items: [
      { name: "List Sites", method: "GET" },
      { name: "Get Site", method: "GET" },
      { name: "Create Site", method: "POST" },
      { name: "Update Site", method: "PUT" },
      { name: "Delete Site", method: "DEL" },
    ],
  },
  {
    label: "Backups",
    items: [
      { name: "List Backups", method: "GET" },
      { name: "Create Backup", method: "POST" },
      { name: "Restore Backup", method: "POST" },
    ],
  },
  {
    label: "Domains",
    items: [
      { name: "List Domains", method: "GET" },
      { name: "Add Domain", method: "POST" },
      { name: "Remove Domain", method: "DEL" },
    ],
  },
  {
    label: "SSL",
    items: [
      { name: "List Certificates", method: "GET" },
      { name: "Install Certificate", method: "POST" },
    ],
  },
  {
    label: "DNS",
    items: [
      { name: "List Records", method: "GET" },
      { name: "Create Record", method: "POST" },
      { name: "Delete Record", method: "DEL" },
    ],
  },
];

/* ────────────────────────── Endpoint Data ────────────────────────── */

const ENDPOINTS: Endpoint[] = [
  // ── Getting Started ──
  {
    id: "overview", section: "Getting Started", name: "Overview", method: null, path: null, isInfo: true,
    description: "The LimeWP REST API allows you to manage your WordPress sites, domains, backups, SSL certificates, and DNS records programmatically. All API requests use HTTPS and return JSON responses.",
    icon: "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25",
  },
  {
    id: "authentication", section: "Getting Started", name: "Authentication", method: null, path: null, isInfo: true,
    description: "All API requests must include your API key in the Authorization header as a Bearer token. API keys can be generated and managed from your dashboard settings.",
    icon: "M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z",
  },
  {
    id: "rate-limits", section: "Getting Started", name: "Rate Limits", method: null, path: null, isInfo: true,
    description: "API requests are rate limited to ensure fair usage and protect the platform. Rate limit information is included in response headers.",
    icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    id: "errors", section: "Getting Started", name: "Errors", method: null, path: null, isInfo: true,
    description: "The API uses standard HTTP status codes and returns structured JSON error responses to help you diagnose issues.",
    icon: "M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z",
  },
  // ── Sites ──
  {
    id: "list-sites", section: "Sites", name: "List Sites", method: "GET", path: "/sites",
    description: "Retrieve a paginated list of all WordPress sites in your account.",
    paramLabel: "Query Parameters",
    params: [
      { name: "page", type: "integer", desc: "Page number for pagination", required: false },
      { name: "limit", type: "integer", desc: "Items per page (max 100)", required: false },
      { name: "status", type: "string", desc: "Filter by status: active, suspended", required: false },
    ],
    successCode: 200,
    responseJson: `{
  "data": [
    {
      "id": "site_abc123",
      "name": "my-wordpress-site",
      "domain": "mysite.com",
      "status": "active",
      "php_version": "8.2",
      "wp_version": "6.6.2",
      "region": "us-east-1",
      "created_at": "2025-01-15T10:30:00Z"
    }
  ],
  "meta": { "total": 3, "page": 1, "limit": 20 }
}`,
    curl: `curl -X GET "${BASE_URL}/sites?page=1&limit=20" \\
  -H "Authorization: Bearer lwp_sk_your_api_key"`,
    javascript: `const res = await fetch("${BASE_URL}/sites?page=1&limit=20", {
  headers: {
    "Authorization": "Bearer lwp_sk_your_api_key"
  }
});
const data = await res.json();
console.log(data);`,
    python: `import requests

res = requests.get(
    "${BASE_URL}/sites",
    params={"page": 1, "limit": 20},
    headers={"Authorization": "Bearer lwp_sk_your_api_key"}
)
print(res.json())`,
    php: `$ch = curl_init("${BASE_URL}/sites?page=1&limit=20");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer lwp_sk_your_api_key"
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
echo $response;`,
  },
  {
    id: "get-site", section: "Sites", name: "Get Site", method: "GET", path: "/sites/{site_id}",
    description: "Retrieve detailed information about a specific WordPress site.",
    paramLabel: "Path Parameters",
    params: [
      { name: "site_id", type: "string", desc: "Unique site identifier", required: true },
    ],
    successCode: 200,
    responseJson: `{
  "id": "site_abc123",
  "name": "my-wordpress-site",
  "domain": "mysite.com",
  "status": "active",
  "php_version": "8.2",
  "wp_version": "6.6.2",
  "region": "us-east-1",
  "storage_used": 2147483648,
  "bandwidth_used": 5368709120,
  "ssl_enabled": true,
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2026-03-20T14:22:00Z"
}`,
    curl: `curl -X GET "${BASE_URL}/sites/site_abc123" \\
  -H "Authorization: Bearer lwp_sk_your_api_key"`,
    javascript: `const res = await fetch("${BASE_URL}/sites/site_abc123", {
  headers: {
    "Authorization": "Bearer lwp_sk_your_api_key"
  }
});
const site = await res.json();
console.log(site);`,
    python: `import requests

res = requests.get(
    "${BASE_URL}/sites/site_abc123",
    headers={"Authorization": "Bearer lwp_sk_your_api_key"}
)
print(res.json())`,
    php: `$ch = curl_init("${BASE_URL}/sites/site_abc123");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer lwp_sk_your_api_key"
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
echo $response;`,
  },
  {
    id: "create-site", section: "Sites", name: "Create Site", method: "POST", path: "/sites",
    description: "Create a new WordPress site with automatic provisioning.",
    paramLabel: "Request Body",
    params: [
      { name: "name", type: "string", desc: "Site name (lowercase, alphanumeric, hyphens)", required: true },
      { name: "php_version", type: "string", desc: "PHP version: 8.1, 8.2, 8.3", required: false },
      { name: "wp_version", type: "string", desc: "WordPress version", required: false },
      { name: "admin_email", type: "string", desc: "Administrator email address", required: true },
      { name: "region", type: "string", desc: "Server region: us-east-1, eu-west-1, ap-southeast-1", required: false },
    ],
    successCode: 201,
    responseJson: `{
  "id": "site_def456",
  "name": "my-new-site",
  "domain": "my-new-site.limewp.dev",
  "status": "provisioning",
  "php_version": "8.2",
  "wp_version": "6.6.2",
  "region": "us-east-1",
  "admin_email": "admin@example.com",
  "created_at": "2026-03-24T12:00:00Z"
}`,
    curl: `curl -X POST "${BASE_URL}/sites" \\
  -H "Authorization: Bearer lwp_sk_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "my-new-site",
    "php_version": "8.2",
    "admin_email": "admin@example.com",
    "region": "us-east-1"
  }'`,
    javascript: `const res = await fetch("${BASE_URL}/sites", {
  method: "POST",
  headers: {
    "Authorization": "Bearer lwp_sk_your_api_key",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: "my-new-site",
    php_version: "8.2",
    admin_email: "admin@example.com",
    region: "us-east-1"
  })
});
const site = await res.json();
console.log(site);`,
    python: `import requests

res = requests.post(
    "${BASE_URL}/sites",
    headers={
        "Authorization": "Bearer lwp_sk_your_api_key",
        "Content-Type": "application/json"
    },
    json={
        "name": "my-new-site",
        "php_version": "8.2",
        "admin_email": "admin@example.com",
        "region": "us-east-1"
    }
)
print(res.json())`,
    php: `$ch = curl_init("${BASE_URL}/sites");
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer lwp_sk_your_api_key",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "name" => "my-new-site",
    "php_version" => "8.2",
    "admin_email" => "admin@example.com",
    "region" => "us-east-1"
]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
echo $response;`,
  },
  {
    id: "update-site", section: "Sites", name: "Update Site", method: "PUT", path: "/sites/{site_id}",
    description: "Update configuration for an existing WordPress site.",
    paramLabel: "Request Body",
    params: [
      { name: "site_id", type: "string", desc: "Unique site identifier (path)", required: true },
      { name: "name", type: "string", desc: "New site name", required: false },
      { name: "php_version", type: "string", desc: "PHP version: 8.1, 8.2, 8.3", required: false },
    ],
    successCode: 200,
    responseJson: `{
  "id": "site_abc123",
  "name": "updated-site-name",
  "php_version": "8.3",
  "status": "active",
  "updated_at": "2026-03-24T12:30:00Z"
}`,
    curl: `curl -X PUT "${BASE_URL}/sites/site_abc123" \\
  -H "Authorization: Bearer lwp_sk_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{ "php_version": "8.3" }'`,
    javascript: `const res = await fetch("${BASE_URL}/sites/site_abc123", {
  method: "PUT",
  headers: {
    "Authorization": "Bearer lwp_sk_your_api_key",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ php_version: "8.3" })
});
const site = await res.json();
console.log(site);`,
    python: `import requests

res = requests.put(
    "${BASE_URL}/sites/site_abc123",
    headers={
        "Authorization": "Bearer lwp_sk_your_api_key",
        "Content-Type": "application/json"
    },
    json={"php_version": "8.3"}
)
print(res.json())`,
    php: `$ch = curl_init("${BASE_URL}/sites/site_abc123");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer lwp_sk_your_api_key",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "php_version" => "8.3"
]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
echo $response;`,
  },
  {
    id: "delete-site", section: "Sites", name: "Delete Site", method: "DEL", path: "/sites/{site_id}",
    description: "Permanently delete a WordPress site and all associated data.",
    paramLabel: "Path Parameters",
    params: [
      { name: "site_id", type: "string", desc: "Unique site identifier", required: true },
    ],
    successCode: 200,
    responseJson: `{
  "message": "Site site_abc123 has been permanently deleted.",
  "deleted_at": "2026-03-24T13:00:00Z"
}`,
    curl: `curl -X DELETE "${BASE_URL}/sites/site_abc123" \\
  -H "Authorization: Bearer lwp_sk_your_api_key"`,
    javascript: `const res = await fetch("${BASE_URL}/sites/site_abc123", {
  method: "DELETE",
  headers: {
    "Authorization": "Bearer lwp_sk_your_api_key"
  }
});
const data = await res.json();
console.log(data);`,
    python: `import requests

res = requests.delete(
    "${BASE_URL}/sites/site_abc123",
    headers={"Authorization": "Bearer lwp_sk_your_api_key"}
)
print(res.json())`,
    php: `$ch = curl_init("${BASE_URL}/sites/site_abc123");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer lwp_sk_your_api_key"
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
echo $response;`,
  },
  // ── Backups ──
  {
    id: "list-backups", section: "Backups", name: "List Backups", method: "GET", path: "/sites/{site_id}/backups",
    description: "Retrieve a list of all backups for a specific site.",
    paramLabel: "Path Parameters",
    params: [
      { name: "site_id", type: "string", desc: "Unique site identifier", required: true },
    ],
    successCode: 200,
    responseJson: `{
  "data": [
    {
      "id": "bkp_xyz789",
      "site_id": "site_abc123",
      "type": "automatic",
      "status": "completed",
      "size": 524288000,
      "created_at": "2026-03-24T02:00:00Z"
    }
  ],
  "meta": { "total": 14, "page": 1, "limit": 20 }
}`,
    curl: `curl -X GET "${BASE_URL}/sites/site_abc123/backups" \\
  -H "Authorization: Bearer lwp_sk_your_api_key"`,
    javascript: `const res = await fetch("${BASE_URL}/sites/site_abc123/backups", {
  headers: {
    "Authorization": "Bearer lwp_sk_your_api_key"
  }
});
const data = await res.json();
console.log(data);`,
    python: `import requests

res = requests.get(
    "${BASE_URL}/sites/site_abc123/backups",
    headers={"Authorization": "Bearer lwp_sk_your_api_key"}
)
print(res.json())`,
    php: `$ch = curl_init("${BASE_URL}/sites/site_abc123/backups");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer lwp_sk_your_api_key"
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
echo $response;`,
  },
  {
    id: "create-backup", section: "Backups", name: "Create Backup", method: "POST", path: "/sites/{site_id}/backups",
    description: "Create a manual on-demand backup for a site.",
    paramLabel: "Request Body",
    params: [
      { name: "site_id", type: "string", desc: "Unique site identifier (path)", required: true },
      { name: "label", type: "string", desc: "Optional label for the backup", required: false },
    ],
    successCode: 201,
    responseJson: `{
  "id": "bkp_new001",
  "site_id": "site_abc123",
  "type": "manual",
  "status": "in_progress",
  "label": "Pre-update backup",
  "created_at": "2026-03-24T12:00:00Z"
}`,
    curl: `curl -X POST "${BASE_URL}/sites/site_abc123/backups" \\
  -H "Authorization: Bearer lwp_sk_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{ "label": "Pre-update backup" }'`,
    javascript: `const res = await fetch("${BASE_URL}/sites/site_abc123/backups", {
  method: "POST",
  headers: {
    "Authorization": "Bearer lwp_sk_your_api_key",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ label: "Pre-update backup" })
});
const backup = await res.json();
console.log(backup);`,
    python: `import requests

res = requests.post(
    "${BASE_URL}/sites/site_abc123/backups",
    headers={
        "Authorization": "Bearer lwp_sk_your_api_key",
        "Content-Type": "application/json"
    },
    json={"label": "Pre-update backup"}
)
print(res.json())`,
    php: `$ch = curl_init("${BASE_URL}/sites/site_abc123/backups");
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer lwp_sk_your_api_key",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "label" => "Pre-update backup"
]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
echo $response;`,
  },
  {
    id: "restore-backup", section: "Backups", name: "Restore Backup", method: "POST", path: "/sites/{site_id}/backups/{backup_id}/restore",
    description: "Restore a site from a specific backup point.",
    paramLabel: "Path Parameters",
    params: [
      { name: "site_id", type: "string", desc: "Unique site identifier", required: true },
      { name: "backup_id", type: "string", desc: "Backup identifier to restore from", required: true },
    ],
    successCode: 200,
    responseJson: `{
  "message": "Restore initiated for site_abc123 from backup bkp_xyz789",
  "status": "restoring",
  "estimated_time": 120
}`,
    curl: `curl -X POST "${BASE_URL}/sites/site_abc123/backups/bkp_xyz789/restore" \\
  -H "Authorization: Bearer lwp_sk_your_api_key"`,
    javascript: `const res = await fetch(
  "${BASE_URL}/sites/site_abc123/backups/bkp_xyz789/restore",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer lwp_sk_your_api_key"
    }
  }
);
const data = await res.json();
console.log(data);`,
    python: `import requests

res = requests.post(
    "${BASE_URL}/sites/site_abc123/backups/bkp_xyz789/restore",
    headers={"Authorization": "Bearer lwp_sk_your_api_key"}
)
print(res.json())`,
    php: `$ch = curl_init("${BASE_URL}/sites/site_abc123/backups/bkp_xyz789/restore");
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer lwp_sk_your_api_key"
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
echo $response;`,
  },
  // ── Domains ──
  {
    id: "list-domains", section: "Domains", name: "List Domains", method: "GET", path: "/sites/{site_id}/domains",
    description: "List all custom domains attached to a site.",
    paramLabel: "Path Parameters",
    params: [
      { name: "site_id", type: "string", desc: "Unique site identifier", required: true },
    ],
    successCode: 200,
    responseJson: `{
  "data": [
    {
      "id": "dom_abc123",
      "domain": "mysite.com",
      "is_primary": true,
      "ssl_status": "active",
      "dns_status": "verified",
      "created_at": "2025-06-01T08:00:00Z"
    },
    {
      "id": "dom_def456",
      "domain": "www.mysite.com",
      "is_primary": false,
      "ssl_status": "active",
      "dns_status": "verified",
      "created_at": "2025-06-01T08:05:00Z"
    }
  ]
}`,
    curl: `curl -X GET "${BASE_URL}/sites/site_abc123/domains" \\
  -H "Authorization: Bearer lwp_sk_your_api_key"`,
    javascript: `const res = await fetch("${BASE_URL}/sites/site_abc123/domains", {
  headers: {
    "Authorization": "Bearer lwp_sk_your_api_key"
  }
});
const data = await res.json();
console.log(data);`,
    python: `import requests

res = requests.get(
    "${BASE_URL}/sites/site_abc123/domains",
    headers={"Authorization": "Bearer lwp_sk_your_api_key"}
)
print(res.json())`,
    php: `$ch = curl_init("${BASE_URL}/sites/site_abc123/domains");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer lwp_sk_your_api_key"
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
echo $response;`,
  },
  {
    id: "add-domain", section: "Domains", name: "Add Domain", method: "POST", path: "/sites/{site_id}/domains",
    description: "Attach a custom domain to a WordPress site.",
    paramLabel: "Request Body",
    params: [
      { name: "site_id", type: "string", desc: "Unique site identifier (path)", required: true },
      { name: "domain", type: "string", desc: "Domain name to add", required: true },
      { name: "is_primary", type: "boolean", desc: "Set as primary domain", required: false },
    ],
    successCode: 201,
    responseJson: `{
  "id": "dom_ghi789",
  "domain": "blog.mysite.com",
  "is_primary": false,
  "ssl_status": "pending",
  "dns_status": "pending",
  "verification_record": "limewp-verify=abc123def456",
  "created_at": "2026-03-24T12:00:00Z"
}`,
    curl: `curl -X POST "${BASE_URL}/sites/site_abc123/domains" \\
  -H "Authorization: Bearer lwp_sk_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{ "domain": "blog.mysite.com", "is_primary": false }'`,
    javascript: `const res = await fetch("${BASE_URL}/sites/site_abc123/domains", {
  method: "POST",
  headers: {
    "Authorization": "Bearer lwp_sk_your_api_key",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    domain: "blog.mysite.com",
    is_primary: false
  })
});
const data = await res.json();
console.log(data);`,
    python: `import requests

res = requests.post(
    "${BASE_URL}/sites/site_abc123/domains",
    headers={
        "Authorization": "Bearer lwp_sk_your_api_key",
        "Content-Type": "application/json"
    },
    json={"domain": "blog.mysite.com", "is_primary": False}
)
print(res.json())`,
    php: `$ch = curl_init("${BASE_URL}/sites/site_abc123/domains");
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer lwp_sk_your_api_key",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "domain" => "blog.mysite.com",
    "is_primary" => false
]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
echo $response;`,
  },
  {
    id: "remove-domain", section: "Domains", name: "Remove Domain", method: "DEL", path: "/sites/{site_id}/domains/{domain_id}",
    description: "Detach and remove a custom domain from a site.",
    paramLabel: "Path Parameters",
    params: [
      { name: "site_id", type: "string", desc: "Unique site identifier", required: true },
      { name: "domain_id", type: "string", desc: "Domain identifier to remove", required: true },
    ],
    successCode: 200,
    responseJson: `{
  "message": "Domain dom_ghi789 has been removed.",
  "deleted_at": "2026-03-24T13:00:00Z"
}`,
    curl: `curl -X DELETE "${BASE_URL}/sites/site_abc123/domains/dom_ghi789" \\
  -H "Authorization: Bearer lwp_sk_your_api_key"`,
    javascript: `const res = await fetch(
  "${BASE_URL}/sites/site_abc123/domains/dom_ghi789",
  {
    method: "DELETE",
    headers: {
      "Authorization": "Bearer lwp_sk_your_api_key"
    }
  }
);
const data = await res.json();
console.log(data);`,
    python: `import requests

res = requests.delete(
    "${BASE_URL}/sites/site_abc123/domains/dom_ghi789",
    headers={"Authorization": "Bearer lwp_sk_your_api_key"}
)
print(res.json())`,
    php: `$ch = curl_init("${BASE_URL}/sites/site_abc123/domains/dom_ghi789");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer lwp_sk_your_api_key"
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
echo $response;`,
  },
  // ── SSL ──
  {
    id: "list-certificates", section: "SSL", name: "List Certificates", method: "GET", path: "/sites/{site_id}/ssl",
    description: "List all SSL certificates for a site.",
    paramLabel: "Path Parameters",
    params: [
      { name: "site_id", type: "string", desc: "Unique site identifier", required: true },
    ],
    successCode: 200,
    responseJson: `{
  "data": [
    {
      "id": "ssl_abc123",
      "domain": "mysite.com",
      "issuer": "Let's Encrypt",
      "status": "active",
      "auto_renew": true,
      "expires_at": "2026-06-24T00:00:00Z",
      "created_at": "2026-03-24T00:00:00Z"
    }
  ]
}`,
    curl: `curl -X GET "${BASE_URL}/sites/site_abc123/ssl" \\
  -H "Authorization: Bearer lwp_sk_your_api_key"`,
    javascript: `const res = await fetch("${BASE_URL}/sites/site_abc123/ssl", {
  headers: {
    "Authorization": "Bearer lwp_sk_your_api_key"
  }
});
const data = await res.json();
console.log(data);`,
    python: `import requests

res = requests.get(
    "${BASE_URL}/sites/site_abc123/ssl",
    headers={"Authorization": "Bearer lwp_sk_your_api_key"}
)
print(res.json())`,
    php: `$ch = curl_init("${BASE_URL}/sites/site_abc123/ssl");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer lwp_sk_your_api_key"
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
echo $response;`,
  },
  {
    id: "install-certificate", section: "SSL", name: "Install Certificate", method: "POST", path: "/sites/{site_id}/ssl",
    description: "Provision and install a new SSL certificate for a domain.",
    paramLabel: "Request Body",
    params: [
      { name: "site_id", type: "string", desc: "Unique site identifier (path)", required: true },
      { name: "domain", type: "string", desc: "Domain to issue certificate for", required: true },
      { name: "auto_renew", type: "boolean", desc: "Enable automatic renewal", required: false },
    ],
    successCode: 201,
    responseJson: `{
  "id": "ssl_def456",
  "domain": "blog.mysite.com",
  "issuer": "Let's Encrypt",
  "status": "provisioning",
  "auto_renew": true,
  "created_at": "2026-03-24T12:00:00Z"
}`,
    curl: `curl -X POST "${BASE_URL}/sites/site_abc123/ssl" \\
  -H "Authorization: Bearer lwp_sk_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{ "domain": "blog.mysite.com", "auto_renew": true }'`,
    javascript: `const res = await fetch("${BASE_URL}/sites/site_abc123/ssl", {
  method: "POST",
  headers: {
    "Authorization": "Bearer lwp_sk_your_api_key",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    domain: "blog.mysite.com",
    auto_renew: true
  })
});
const data = await res.json();
console.log(data);`,
    python: `import requests

res = requests.post(
    "${BASE_URL}/sites/site_abc123/ssl",
    headers={
        "Authorization": "Bearer lwp_sk_your_api_key",
        "Content-Type": "application/json"
    },
    json={"domain": "blog.mysite.com", "auto_renew": True}
)
print(res.json())`,
    php: `$ch = curl_init("${BASE_URL}/sites/site_abc123/ssl");
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer lwp_sk_your_api_key",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "domain" => "blog.mysite.com",
    "auto_renew" => true
]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
echo $response;`,
  },
  // ── DNS ──
  {
    id: "list-records", section: "DNS", name: "List Records", method: "GET", path: "/sites/{site_id}/dns",
    description: "List all DNS records configured for a site.",
    paramLabel: "Path Parameters",
    params: [
      { name: "site_id", type: "string", desc: "Unique site identifier", required: true },
    ],
    successCode: 200,
    responseJson: `{
  "data": [
    {
      "id": "dns_abc123",
      "type": "A",
      "name": "@",
      "value": "203.0.113.50",
      "ttl": 3600,
      "created_at": "2025-06-01T08:00:00Z"
    },
    {
      "id": "dns_def456",
      "type": "CNAME",
      "name": "www",
      "value": "mysite.com",
      "ttl": 3600,
      "created_at": "2025-06-01T08:05:00Z"
    }
  ]
}`,
    curl: `curl -X GET "${BASE_URL}/sites/site_abc123/dns" \\
  -H "Authorization: Bearer lwp_sk_your_api_key"`,
    javascript: `const res = await fetch("${BASE_URL}/sites/site_abc123/dns", {
  headers: {
    "Authorization": "Bearer lwp_sk_your_api_key"
  }
});
const data = await res.json();
console.log(data);`,
    python: `import requests

res = requests.get(
    "${BASE_URL}/sites/site_abc123/dns",
    headers={"Authorization": "Bearer lwp_sk_your_api_key"}
)
print(res.json())`,
    php: `$ch = curl_init("${BASE_URL}/sites/site_abc123/dns");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer lwp_sk_your_api_key"
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
echo $response;`,
  },
  {
    id: "create-record", section: "DNS", name: "Create Record", method: "POST", path: "/sites/{site_id}/dns",
    description: "Create a new DNS record for a site.",
    paramLabel: "Request Body",
    params: [
      { name: "site_id", type: "string", desc: "Unique site identifier (path)", required: true },
      { name: "type", type: "string", desc: "Record type: A, AAAA, CNAME, MX, TXT", required: true },
      { name: "name", type: "string", desc: "Record name (@ for root)", required: true },
      { name: "value", type: "string", desc: "Record value", required: true },
      { name: "ttl", type: "integer", desc: "Time to live in seconds (default 3600)", required: false },
    ],
    successCode: 201,
    responseJson: `{
  "id": "dns_ghi789",
  "type": "A",
  "name": "staging",
  "value": "203.0.113.51",
  "ttl": 3600,
  "created_at": "2026-03-24T12:00:00Z"
}`,
    curl: `curl -X POST "${BASE_URL}/sites/site_abc123/dns" \\
  -H "Authorization: Bearer lwp_sk_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "A",
    "name": "staging",
    "value": "203.0.113.51",
    "ttl": 3600
  }'`,
    javascript: `const res = await fetch("${BASE_URL}/sites/site_abc123/dns", {
  method: "POST",
  headers: {
    "Authorization": "Bearer lwp_sk_your_api_key",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    type: "A",
    name: "staging",
    value: "203.0.113.51",
    ttl: 3600
  })
});
const record = await res.json();
console.log(record);`,
    python: `import requests

res = requests.post(
    "${BASE_URL}/sites/site_abc123/dns",
    headers={
        "Authorization": "Bearer lwp_sk_your_api_key",
        "Content-Type": "application/json"
    },
    json={
        "type": "A",
        "name": "staging",
        "value": "203.0.113.51",
        "ttl": 3600
    }
)
print(res.json())`,
    php: `$ch = curl_init("${BASE_URL}/sites/site_abc123/dns");
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer lwp_sk_your_api_key",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "type" => "A",
    "name" => "staging",
    "value" => "203.0.113.51",
    "ttl" => 3600
]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
echo $response;`,
  },
  {
    id: "delete-record", section: "DNS", name: "Delete Record", method: "DEL", path: "/sites/{site_id}/dns/{record_id}",
    description: "Delete a DNS record from a site.",
    paramLabel: "Path Parameters",
    params: [
      { name: "site_id", type: "string", desc: "Unique site identifier", required: true },
      { name: "record_id", type: "string", desc: "DNS record identifier", required: true },
    ],
    successCode: 200,
    responseJson: `{
  "message": "DNS record dns_ghi789 has been deleted.",
  "deleted_at": "2026-03-24T13:00:00Z"
}`,
    curl: `curl -X DELETE "${BASE_URL}/sites/site_abc123/dns/dns_ghi789" \\
  -H "Authorization: Bearer lwp_sk_your_api_key"`,
    javascript: `const res = await fetch(
  "${BASE_URL}/sites/site_abc123/dns/dns_ghi789",
  {
    method: "DELETE",
    headers: {
      "Authorization": "Bearer lwp_sk_your_api_key"
    }
  }
);
const data = await res.json();
console.log(data);`,
    python: `import requests

res = requests.delete(
    "${BASE_URL}/sites/site_abc123/dns/dns_ghi789",
    headers={"Authorization": "Bearer lwp_sk_your_api_key"}
)
print(res.json())`,
    php: `$ch = curl_init("${BASE_URL}/sites/site_abc123/dns/dns_ghi789");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer lwp_sk_your_api_key"
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
echo $response;`,
  },
];

const codeTabs = ["cURL", "JavaScript", "Python", "PHP"] as const;

const ERROR_CODES = [
  { code: 400, description: "The request was malformed or missing required parameters." },
  { code: 401, description: "Authentication failed. Check your API key." },
  { code: 403, description: "You don't have permission to access this resource." },
  { code: 404, description: "The requested resource was not found." },
  { code: 409, description: "The request conflicts with the current state of the resource." },
  { code: 422, description: "The request body failed validation." },
  { code: 429, description: "Rate limit exceeded. Wait before retrying." },
  { code: 500, description: "An internal server error occurred. Contact support if it persists." },
];

/* ────────────────────────── Helpers ────────────────────────── */

function copyToClipboard(text: string, label: string) {
  navigator.clipboard.writeText(text).then(() => {
    showToast.success(`${label} copied to clipboard`);
  });
}

function getEndpointStatusCodes(ep: Endpoint): number[] {
  const codes: number[] = [];
  if (ep.successCode) codes.push(ep.successCode);
  codes.push(400, 401, 404, 500);
  return codes;
}

function getSectionForName(name: string): string {
  for (const sec of navSections) {
    for (const item of sec.items) {
      if (item.name === name) return sec.label;
    }
  }
  return "Getting Started";
}

/* ────────────────────────── Component ────────────────────────── */

export default function ApiReferencePage() {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  const [activeSection, setActiveSection] = useState("Overview");
  const [activeCodeTab, setActiveCodeTab] = useState<string>("cURL");
  const [searchQuery, setSearchQuery] = useState("");
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [showRegenConfirm, setShowRegenConfirm] = useState(false);
  const [rateLimitUsed] = useState(37);

  // Find current endpoint
  const currentEndpoint = useMemo(
    () => ENDPOINTS.find((ep) => ep.name === activeSection) || ENDPOINTS[0],
    [activeSection]
  );

  const currentSectionLabel = getSectionForName(activeSection);
  const sectionColor = SECTION_COLORS[currentSectionLabel] || SECTION_COLORS["Getting Started"];

  // Filtered nav
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return navSections;
    const q = searchQuery.toLowerCase();
    return navSections
      .map((sec) => ({
        ...sec,
        items: sec.items.filter(
          (item) =>
            item.name.toLowerCase().includes(q) ||
            (item.method && item.method.toLowerCase().includes(q)) ||
            sec.label.toLowerCase().includes(q)
        ),
      }))
      .filter((sec) => sec.items.length > 0);
  }, [searchQuery]);

  const getCodeForTab = useCallback(
    (tab: string): string => {
      if (!currentEndpoint) return "";
      switch (tab) {
        case "cURL": return currentEndpoint.curl || "";
        case "JavaScript": return currentEndpoint.javascript || "";
        case "Python": return currentEndpoint.python || "";
        case "PHP": return currentEndpoint.php || "";
        default: return "";
      }
    },
    [currentEndpoint]
  );

  // ── Style classes ──
  const cardClass = `rounded-2xl border transition-all ${
    isLight ? "bg-white border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"
  }`;

  const codeBlockClass = `rounded-xl p-4 border overflow-x-auto font-mono text-sm ${
    isLight ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-[#0d1117] border-[var(--border-secondary)] text-slate-300"
  }`;

  /* ────────────────────────── Render helpers ────────────────────────── */

  const renderMethodBadge = (method: string, size: "sm" | "md" = "sm") => {
    const mc = METHOD_COLORS[method] || METHOD_COLORS.GET;
    const sizeClasses = size === "sm"
      ? "text-[9px] px-1.5 py-0.5"
      : "text-[11px] px-2.5 py-1";
    return (
      <span className={`${mc.bg} ${mc.text} border ${mc.border} font-mono font-bold rounded ${sizeClasses}`}>
        {method === "DEL" ? "DELETE" : method}
      </span>
    );
  };

  const renderStatusBadge = (code: number) => {
    const sc = STATUS_COLORS[code] || STATUS_COLORS[500];
    return (
      <span className={`${sc.bg} ${sc.text} text-[11px] font-bold font-mono px-2 py-0.5 rounded`}>
        {code} {sc.label}
      </span>
    );
  };

  const renderCopyButton = (text: string, label: string) => (
    <button
      onClick={() => copyToClipboard(text, label)}
      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
        isLight
          ? "bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700"
          : "bg-white/5 hover:bg-white/10 text-slate-500 hover:text-slate-300"
      }`}
      title={`Copy ${label}`}
    >
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
      </svg>
    </button>
  );

  /* ────────────────────────── Info page renderers ────────────────────────── */

  const renderOverview = () => (
    <div className="space-y-6">
      <div>
        <h2 className={`text-xl font-bold mb-3 ${isLight ? "text-slate-800" : "text-slate-100"}`}>API Overview</h2>
        <p className={`text-sm leading-relaxed ${isLight ? "text-slate-600" : "text-slate-400"}`}>
          The LimeWP REST API allows you to manage your WordPress sites, domains, backups, SSL certificates, and DNS records programmatically. All API requests use HTTPS and return JSON responses.
        </p>
      </div>

      {/* Base URL */}
      <div className={`rounded-xl p-4 flex items-center justify-between border ${isLight ? "bg-slate-50 border-slate-200" : "bg-[var(--bg-primary)] border-[var(--border-secondary)]"}`}>
        <div>
          <div className={`text-[10px] uppercase tracking-wider font-medium mb-1 ${isLight ? "text-slate-500" : "text-slate-600"}`}>Base URL</div>
          <code className={`font-mono text-sm font-semibold ${isLight ? "text-slate-800" : "text-emerald-400"}`}>
            {BASE_URL}
          </code>
        </div>
        {renderCopyButton(BASE_URL, "Base URL")}
      </div>

      {/* Key features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { label: "RESTful", desc: "Standard HTTP methods and status codes", color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "JSON", desc: "All requests and responses use JSON", color: "text-sky-500", bg: "bg-sky-500/10" },
          { label: "Versioned", desc: "API is versioned via URL path (/v1)", color: "text-violet-500", bg: "bg-violet-500/10" },
          { label: "Secure", desc: "HTTPS required, Bearer token auth", color: "text-amber-500", bg: "bg-amber-500/10" },
        ].map((f) => (
          <div key={f.label} className={`rounded-xl p-4 border ${isLight ? "bg-slate-50 border-slate-200" : "bg-[var(--bg-primary)] border-[var(--border-secondary)]"}`}>
            <div className={`text-sm font-bold mb-1 ${f.color}`}>{f.label}</div>
            <div className={`text-xs ${isLight ? "text-slate-600" : "text-slate-400"}`}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Available resources */}
      <div>
        <h3 className={`text-sm font-semibold mb-3 ${isLight ? "text-slate-700" : "text-slate-200"}`}>Available Resources</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.entries(SECTION_COLORS).filter(([k]) => k !== "Getting Started").map(([name, col]) => (
            <div key={name} className={`rounded-lg p-3 border flex items-center gap-2.5 ${isLight ? "bg-slate-50 border-slate-200" : "bg-[var(--bg-primary)] border-[var(--border-secondary)]"}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${col.bg}`}>
                <svg className={`w-4 h-4 ${col.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={SECTION_ICONS[name] || ""} />
                </svg>
              </div>
              <span className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-300"}`}>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAuthentication = () => (
    <div className="space-y-6">
      <div>
        <h2 className={`text-xl font-bold mb-3 ${isLight ? "text-slate-800" : "text-slate-100"}`}>Authentication</h2>
        <p className={`text-sm leading-relaxed ${isLight ? "text-slate-600" : "text-slate-400"}`}>
          All API requests must include your API key in the Authorization header as a Bearer token. API keys can be generated and managed from your dashboard settings.
        </p>
      </div>

      {/* Warning */}
      <div className={`rounded-xl p-4 flex items-start gap-3 border ${isLight ? "bg-amber-50 border-amber-200" : "bg-amber-900/10 border-amber-500/20"}`}>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <p className={`text-sm ${isLight ? "text-amber-800" : "text-amber-400"}`}>
          Keep your API key secure. Never expose it in client-side code, public repositories, or browser requests.
        </p>
      </div>

      {/* API Key Card */}
      <div className={`rounded-xl p-4 border ${isLight ? "bg-slate-50 border-slate-200" : "bg-[var(--bg-primary)] border-[var(--border-secondary)]"}`}>
        <div className={`text-[10px] uppercase tracking-wider font-medium mb-2 ${isLight ? "text-slate-500" : "text-slate-600"}`}>Your API Key</div>
        <div className="flex items-center justify-between gap-3">
          <code className={`font-mono text-sm flex-1 break-all ${isLight ? "text-slate-700" : "text-slate-300"}`}>
            {apiKeyVisible ? MOCK_API_KEY : "lwp_sk_live_••••••••••••••••••••••••"}
          </code>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setApiKeyVisible(!apiKeyVisible)}
              className={`h-8 px-3 rounded-lg text-xs font-medium transition-colors ${isLight ? "bg-slate-100 hover:bg-slate-200 text-slate-600" : "bg-white/5 hover:bg-white/10 text-slate-400"}`}
            >
              {apiKeyVisible ? "Hide" : "Reveal"}
            </button>
            <button
              onClick={() => copyToClipboard(MOCK_API_KEY, "API key")}
              className={`h-8 px-3 rounded-lg text-xs font-medium transition-colors ${isLight ? "bg-slate-100 hover:bg-slate-200 text-slate-600" : "bg-white/5 hover:bg-white/10 text-slate-400"}`}
            >
              Copy
            </button>
            <button
              onClick={() => setShowRegenConfirm(true)}
              className="h-8 px-3 rounded-lg text-xs font-medium transition-colors bg-rose-500/10 hover:bg-rose-500/20 text-rose-500"
            >
              Regenerate
            </button>
          </div>
        </div>
      </div>

      {/* Header Example */}
      <div>
        <div className={`text-[11px] uppercase tracking-wider font-medium mb-2 ${isLight ? "text-slate-500" : "text-slate-600"}`}>Request Header</div>
        <div className="relative">
          <div className={codeBlockClass}>
            <pre>
              <span className="text-violet-400">Authorization</span><span className="text-slate-600">:</span>{" "}
              <span className="text-emerald-400">Bearer lwp_sk_your_api_key</span>
            </pre>
          </div>
          <div className="absolute top-2 right-2">
            {renderCopyButton("Authorization: Bearer lwp_sk_your_api_key", "header")}
          </div>
        </div>
      </div>

      {/* Example request */}
      <div>
        <div className={`text-[11px] uppercase tracking-wider font-medium mb-2 ${isLight ? "text-slate-500" : "text-slate-600"}`}>Example Authenticated Request</div>
        <div className="relative">
          <div className={codeBlockClass}>
            <pre>{`curl -X GET "${BASE_URL}/sites" \\
  -H "Authorization: Bearer lwp_sk_your_api_key"`}</pre>
          </div>
          <div className="absolute top-2 right-2">
            {renderCopyButton(`curl -X GET "${BASE_URL}/sites" \\\n  -H "Authorization: Bearer lwp_sk_your_api_key"`, "example")}
          </div>
        </div>
      </div>
    </div>
  );

  const renderRateLimits = () => (
    <div className="space-y-6">
      <div>
        <h2 className={`text-xl font-bold mb-3 ${isLight ? "text-slate-800" : "text-slate-100"}`}>Rate Limits</h2>
        <p className={`text-sm leading-relaxed ${isLight ? "text-slate-600" : "text-slate-400"}`}>
          API requests are rate limited to 100 requests per minute per API key. Rate limit information is included in every API response via headers.
        </p>
      </div>

      {/* Usage visual */}
      <div className={`rounded-xl p-5 border ${isLight ? "bg-slate-50 border-slate-200" : "bg-[var(--bg-primary)] border-[var(--border-secondary)]"}`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-300"}`}>Current Usage</span>
          <span className={`text-sm font-mono font-bold ${rateLimitUsed > 80 ? "text-rose-500" : rateLimitUsed > 50 ? "text-amber-500" : "text-emerald-500"}`}>
            {rateLimitUsed}/100 requests
          </span>
        </div>
        <div className={`w-full h-3 rounded-full overflow-hidden ${isLight ? "bg-slate-200" : "bg-slate-700"}`}>
          <div
            className={`h-full rounded-full transition-all duration-500 ${rateLimitUsed > 80 ? "bg-rose-500" : rateLimitUsed > 50 ? "bg-amber-500" : "bg-emerald-500"}`}
            style={{ width: `${rateLimitUsed}%` }}
          />
        </div>
        <div className={`flex justify-between mt-2 text-xs ${isLight ? "text-slate-500" : "text-slate-600"}`}>
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>

      {/* Response Headers */}
      <div>
        <h3 className={`text-sm font-semibold mb-3 ${isLight ? "text-slate-700" : "text-slate-200"}`}>Rate Limit Headers</h3>
        <div className={`rounded-xl border overflow-hidden ${isLight ? "border-slate-200" : "border-[var(--border-secondary)]"}`}>
          {[
            { header: "X-RateLimit-Limit", desc: "Maximum requests allowed per minute", example: "100" },
            { header: "X-RateLimit-Remaining", desc: "Requests remaining in current window", example: "63" },
            { header: "X-RateLimit-Reset", desc: "Unix timestamp when the limit resets", example: "1711296000" },
          ].map((h, i) => (
            <div key={h.header} className={`flex items-start gap-4 px-4 py-3 ${i > 0 ? `border-t ${isLight ? "border-slate-200" : "border-[var(--border-secondary)]"}` : ""} ${isLight ? "bg-white" : "bg-transparent"}`}>
              <code className={`font-mono text-xs font-bold w-52 flex-shrink-0 ${isLight ? "text-violet-600" : "text-violet-400"}`}>{h.header}</code>
              <span className={`text-sm flex-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{h.desc}</span>
              <code className={`font-mono text-xs px-2 py-0.5 rounded ${isLight ? "bg-slate-100 text-slate-600" : "bg-white/5 text-slate-500"}`}>{h.example}</code>
            </div>
          ))}
        </div>
      </div>

      {/* 429 response example */}
      <div>
        <h3 className={`text-sm font-semibold mb-3 ${isLight ? "text-slate-700" : "text-slate-200"}`}>Rate Limit Exceeded Response</h3>
        <div className="relative">
          <div className={codeBlockClass}>
            <pre className="text-slate-400">{`{
  "error": {
    "code": 429,
    "type": "rate_limit_exceeded",
    "message": "Too many requests. Please wait 23 seconds before retrying.",
    "retry_after": 23
  }
}`}</pre>
          </div>
        </div>
      </div>

      {/* Best practices */}
      <div className={`rounded-xl p-4 flex items-start gap-3 border ${isLight ? "bg-sky-50 border-sky-200" : "bg-sky-900/10 border-sky-500/20"}`}>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} className="w-5 h-5 flex-shrink-0 mt-0.5 text-sky-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <div>
          <p className={`text-sm font-medium mb-1 ${isLight ? "text-sky-800" : "text-sky-400"}`}>Best Practices</p>
          <ul className={`text-xs space-y-1 ${isLight ? "text-sky-700" : "text-sky-400/80"}`}>
            <li>Implement exponential backoff when receiving 429 responses</li>
            <li>Cache responses when possible to reduce API calls</li>
            <li>Use webhooks instead of polling for real-time updates</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderErrors = () => (
    <div className="space-y-6">
      <div>
        <h2 className={`text-xl font-bold mb-3 ${isLight ? "text-slate-800" : "text-slate-100"}`}>Error Handling</h2>
        <p className={`text-sm leading-relaxed ${isLight ? "text-slate-600" : "text-slate-400"}`}>
          The API returns structured JSON error responses with consistent formatting. Use the error code and type fields to programmatically handle different error scenarios.
        </p>
      </div>

      {/* Error response format */}
      <div>
        <h3 className={`text-sm font-semibold mb-3 ${isLight ? "text-slate-700" : "text-slate-200"}`}>Error Response Format</h3>
        <div className="relative">
          <div className={codeBlockClass}>
            <pre className="text-slate-400">{`{
  "error": {
    "code": 422,
    "type": "validation_error",
    "message": "The given data was invalid.",
    "errors": {
      "name": ["The name field is required."],
      "admin_email": ["Must be a valid email address."]
    }
  }
}`}</pre>
          </div>
          <div className="absolute top-2 right-2">
            {renderCopyButton(`{\n  "error": {\n    "code": 422,\n    "type": "validation_error",\n    "message": "The given data was invalid."\n  }\n}`, "error format")}
          </div>
        </div>
      </div>

      {/* Error codes table */}
      <div>
        <h3 className={`text-sm font-semibold mb-3 ${isLight ? "text-slate-700" : "text-slate-200"}`}>Common Error Codes</h3>
        <div className={`rounded-xl border overflow-hidden ${isLight ? "border-slate-200" : "border-[var(--border-secondary)]"}`}>
          <div className={`grid grid-cols-[80px_1fr] text-xs font-semibold uppercase tracking-wider px-4 py-2.5 ${isLight ? "bg-slate-100 text-slate-500 border-b border-slate-200" : "bg-white/5 text-slate-500 border-b border-[var(--border-secondary)]"}`}>
            <span>Code</span>
            <span>Description</span>
          </div>
          {ERROR_CODES.map((err, i) => (
            <div key={err.code} className={`grid grid-cols-[80px_1fr] items-center px-4 py-3 ${i > 0 ? `border-t ${isLight ? "border-slate-100" : "border-white/[0.06]"}` : ""}`}>
              {renderStatusBadge(err.code)}
              <span className={`text-sm ${isLight ? "text-slate-600" : "text-slate-400"}`}>{err.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ────────────────────────── Endpoint renderer ────────────────────────── */

  const renderEndpoint = (ep: Endpoint) => {
    const code = getCodeForTab(activeCodeTab);
    const statusCodes = getEndpointStatusCodes(ep);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {ep.method && renderMethodBadge(ep.method, "md")}
            {ep.path && (
              <code className={`font-mono text-base font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                {ep.path}
              </code>
            )}
          </div>
          <button
            onClick={() => showToast.info("API playground coming soon")}
            className={`h-8 px-4 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${accent.button} ${accent.buttonHover} text-white shadow-lg ${accent.buttonShadow}`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
            </svg>
            Try it
          </button>
        </div>

        <p className={`text-sm leading-relaxed ${isLight ? "text-slate-600" : "text-slate-400"}`}>
          {ep.description}
        </p>

        {/* Parameters */}
        {ep.params && ep.params.length > 0 && (
          <div>
            <h3 className={`text-[11px] uppercase tracking-wider font-semibold mb-3 ${isLight ? "text-slate-500" : "text-slate-500"}`}>
              {ep.paramLabel || "Parameters"}
            </h3>
            <div className={`rounded-xl border overflow-hidden ${isLight ? "border-slate-200" : "border-[var(--border-secondary)]"}`}>
              {ep.params.map((param, i) => (
                <div
                  key={param.name}
                  className={`flex items-start gap-4 px-4 py-3 ${i > 0 ? `border-t ${isLight ? "border-slate-100" : "border-white/[0.06]"}` : ""} ${isLight ? "bg-white" : "bg-transparent"}`}
                >
                  <div className="w-32 flex-shrink-0 flex items-center gap-1.5">
                    <code className={`font-mono text-sm ${isLight ? "text-slate-700" : "text-slate-300"}`}>{param.name}</code>
                    {param.required && <span className="text-rose-500 text-xs font-bold">*</span>}
                  </div>
                  <span className={`text-xs w-16 flex-shrink-0 font-mono px-1.5 py-0.5 rounded ${isLight ? "bg-slate-100 text-slate-500" : "bg-white/5 text-slate-500"}`}>{param.type}</span>
                  <span className={`text-sm ${isLight ? "text-slate-600" : "text-slate-400"}`}>{param.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Code Examples */}
        {code && (
          <div>
            <h3 className={`text-[11px] uppercase tracking-wider font-semibold mb-3 ${isLight ? "text-slate-500" : "text-slate-500"}`}>
              Example Request
            </h3>
            {/* Tab bar */}
            <div className={`flex items-center gap-1 mb-2 p-1 rounded-lg w-fit ${isLight ? "bg-slate-100" : "bg-white/5"}`}>
              {codeTabs.map((tab) => {
                const isActive = activeCodeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveCodeTab(tab)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      isActive
                        ? isLight
                          ? "bg-white text-slate-800 shadow-sm"
                          : "bg-white/10 text-slate-200"
                        : isLight
                          ? "text-slate-500 hover:text-slate-700"
                          : "text-slate-500 hover:text-slate-400"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
            {/* Code block */}
            <div className="relative group">
              <div className={codeBlockClass}>
                <pre className="whitespace-pre-wrap">{code}</pre>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {renderCopyButton(code, "code")}
              </div>
            </div>
          </div>
        )}

        {/* Response */}
        {ep.responseJson && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className={`text-[11px] uppercase tracking-wider font-semibold ${isLight ? "text-slate-500" : "text-slate-500"}`}>
                Response
              </h3>
              {ep.successCode && renderStatusBadge(ep.successCode)}
            </div>
            <div className="relative group">
              <div className={codeBlockClass}>
                <pre className="whitespace-pre-wrap text-slate-400">{ep.responseJson}</pre>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {renderCopyButton(ep.responseJson, "response")}
              </div>
            </div>
          </div>
        )}

        {/* Status codes table */}
        {!ep.isInfo && (
          <div>
            <h3 className={`text-[11px] uppercase tracking-wider font-semibold mb-3 ${isLight ? "text-slate-500" : "text-slate-500"}`}>
              Status Codes
            </h3>
            <div className={`rounded-xl border overflow-hidden ${isLight ? "border-slate-200" : "border-[var(--border-secondary)]"}`}>
              {statusCodes.map((code, i) => {
                const sc = STATUS_COLORS[code] || STATUS_COLORS[500];
                return (
                  <div
                    key={code}
                    className={`flex items-center gap-4 px-4 py-2.5 ${i > 0 ? `border-t ${isLight ? "border-slate-100" : "border-white/[0.06]"}` : ""}`}
                  >
                    {renderStatusBadge(code)}
                    <span className={`text-sm ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                      {code === ep.successCode ? "Successful response" : sc.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  /* ────────────────────────── Content switcher ────────────────────────── */

  const renderContent = () => {
    switch (activeSection) {
      case "Overview": return renderOverview();
      case "Authentication": return renderAuthentication();
      case "Rate Limits": return renderRateLimits();
      case "Errors": return renderErrors();
      default: return renderEndpoint(currentEndpoint);
    }
  };

  /* ────────────────────────── Main render ────────────────────────── */

  return (
    <AppShell>
      {/* Regenerate API key confirm dialog */}
      <ConfirmDialog
        open={showRegenConfirm}
        onClose={() => setShowRegenConfirm(false)}
        onConfirm={() => {
          setShowRegenConfirm(false);
          showToast.success("API key regenerated successfully");
        }}
        title="Regenerate API Key"
        message="This will invalidate your current API key. All existing integrations using this key will stop working immediately. Are you sure?"
        confirmText="Regenerate"
        variant="danger"
      />

      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent.bg} ${accent.text} ring-1 ${accent.ring}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
            </svg>
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>API Reference</h1>
            <p className={`text-sm ${isLight ? "text-slate-600" : "text-slate-500"}`}>Build integrations with the LimeWP REST API</p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className={`${cardClass} overflow-hidden`}>
        <div className="flex min-h-[700px]">
          {/* Left Sidebar - sticky */}
          <div className={`w-64 flex-shrink-0 border-r ${isLight ? "border-slate-200 bg-slate-50/50" : "border-[var(--border-secondary)] bg-[var(--gradient-card-to)]"}`}>
            <div className="sticky top-0 p-4 max-h-screen overflow-y-auto">
              {/* Search */}
              <div className="relative mb-4">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search endpoints..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full h-9 pl-9 pr-3 rounded-lg text-sm focus:outline-none transition-colors ${
                    isLight
                      ? "bg-white border border-slate-200 text-slate-800 placeholder:text-slate-500 focus:border-slate-400"
                      : "bg-[var(--bg-elevated)]/50 border border-white/[0.08] text-slate-300 placeholder:text-slate-600 focus:border-[var(--border-secondary)]"
                  }`}
                />
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {filteredSections.map((section) => {
                  const secColor = SECTION_COLORS[section.label] || SECTION_COLORS["Getting Started"];
                  return (
                    <div key={section.label} className="mb-4">
                      <div className="flex items-center gap-2 px-2 py-2">
                        <svg className={`w-3.5 h-3.5 ${secColor.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={SECTION_ICONS[section.label] || ""} />
                        </svg>
                        <span className={`text-[10px] uppercase font-semibold tracking-wider ${secColor.text}`}>
                          {section.label}
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        {section.items.map((item) => {
                          const isActive = activeSection === item.name;
                          const mc = item.method ? (METHOD_COLORS[item.method] || METHOD_COLORS.GET) : null;

                          return (
                            <button
                              key={item.name}
                              onClick={() => setActiveSection(item.name)}
                              className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-[13px] font-medium transition-all ${
                                isActive
                                  ? `${secColor.activeBg} ${secColor.text}`
                                  : isLight
                                    ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                    : "text-slate-400 hover:bg-white/5 hover:text-slate-300"
                              }`}
                            >
                              {item.icon && (
                                <svg className={`w-4 h-4 flex-shrink-0 ${isActive ? secColor.icon : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                </svg>
                              )}
                              <span className="flex-1 text-left truncate">{item.name}</span>
                              {item.method && mc && (
                                <span className={`${mc.bg} ${mc.text} border ${mc.border} text-[9px] font-mono font-bold px-1.5 py-0.5 rounded`}>
                                  {item.method}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </nav>

              {/* No results */}
              {filteredSections.length === 0 && (
                <div className={`text-center py-8 ${isLight ? "text-slate-400" : "text-slate-600"}`}>
                  <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-xs">No endpoints found</p>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 p-6 lg:p-8">
            {/* Breadcrumb */}
            <div className={`flex items-center gap-2 mb-6 text-xs ${isLight ? "text-slate-500" : "text-slate-500"}`}>
              <span>API Reference</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
              <span className={sectionColor.text}>{currentSectionLabel}</span>
              {currentSectionLabel !== activeSection && (
                <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                  <span className={isLight ? "text-slate-700" : "text-slate-300"}>{activeSection}</span>
                </>
              )}
            </div>

            {renderContent()}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
