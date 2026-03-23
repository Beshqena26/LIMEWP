const ROUTE_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  site: "WordPress Sites",
  "new-site": "New Site",
  services: "Services",
  billing: "Billing",
  dns: "DNS Management",
  docs: "Documentation",
  "api-reference": "API Reference",
  forum: "Community Forum",
  support: "Support",
  settings: "Settings",
  contact: "Contact",
  privacy: "Privacy Policy",
  terms: "Terms of Service",
  cookies: "Cookie Policy",
  styleguide: "Style Guide",
  landing: "Landing",
  panel: "Panel",
  database: "Database Management",
  server: "Server Management",
  ssl: "SSL / Certificates",
  email: "Email Management",
  staging: "Staging Environment",
  activity: "Activity Log",
  notifications: "Notifications",
  monitoring: "Uptime Monitoring",
  migrate: "Migration Wizard",
};

export interface BreadcrumbSegment {
  label: string;
  href: string | null;
}

export function buildBreadcrumbs(
  pathname: string,
  searchParams?: URLSearchParams
): BreadcrumbSegment[] {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return [];

  // Dashboard is the root — show as single non-clickable segment
  if (segments.length === 1 && segments[0] === "dashboard") {
    return [{ label: "Dashboard", href: null }];
  }

  const crumbs: BreadcrumbSegment[] = [
    { label: "Dashboard", href: "/dashboard" },
  ];

  let cumulativePath = "";

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    cumulativePath += `/${seg}`;
    const isLast = i === segments.length - 1;

    // Special case: /site uses ?name= for the site name
    if (seg === "site") {
      const siteName = searchParams?.get("name");
      crumbs.push({
        label: siteName || "Site",
        href: isLast ? null : cumulativePath,
      });
      continue;
    }

    const label =
      ROUTE_LABELS[seg] || seg.charAt(0).toUpperCase() + seg.slice(1);

    crumbs.push({
      label,
      href: isLast ? null : cumulativePath,
    });
  }

  return crumbs;
}
