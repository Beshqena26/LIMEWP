export interface Domain {
  domain: string;
  primary: boolean;
  ssl: boolean;
  sslExpiry: string;
  status: string;
  dnsProvider: string;
}

export const DOMAINS: Domain[] = [
  { domain: "limewp.com", primary: true, ssl: true, sslExpiry: "Jan 28, 2027", status: "active", dnsProvider: "Cloudflare" },
  { domain: "www.limewp.com", primary: false, ssl: true, sslExpiry: "Jan 28, 2027", status: "active", dnsProvider: "Cloudflare" },
  { domain: "staging.limewp.com", primary: false, ssl: true, sslExpiry: "Jan 28, 2027", status: "active", dnsProvider: "Cloudflare" },
];
