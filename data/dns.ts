/**
 * DNS Management page mock data.
 */

export interface DnsRecord {
  type: string;
  name: string;
  content: string;
  ttl: string;
  proxy: boolean;
  modified: string;
  priority?: number;
}

export interface Domain {
  name: string;
  records: number;
  status: string;
  ssl: string;
  nameservers: string;
}

export interface PropagationServer {
  location: string;
  status: string;
  latency: string;
}

export const DNS_RECORDS: DnsRecord[] = [
  { type: "A", name: "@", content: "185.199.108.153", ttl: "3600", proxy: true, modified: "2 hours ago" },
  { type: "CNAME", name: "www", content: "limewp.com", ttl: "3600", proxy: true, modified: "1 day ago" },
  { type: "MX", name: "@", content: "mail.limewp.com", ttl: "3600", proxy: false, modified: "3 days ago", priority: 10 },
  { type: "TXT", name: "@", content: "v=spf1 include:_spf.google.com ~all", ttl: "3600", proxy: false, modified: "1 week ago" },
  { type: "AAAA", name: "@", content: "2606:50c0:8000::153", ttl: "3600", proxy: true, modified: "2 hours ago" },
  { type: "A", name: "api", content: "185.199.109.153", ttl: "3600", proxy: true, modified: "5 days ago" },
  { type: "CNAME", name: "mail", content: "ghs.google.com", ttl: "3600", proxy: false, modified: "2 weeks ago" },
  { type: "TXT", name: "_dmarc", content: "v=DMARC1; p=quarantine; rua=mailto:dmarc@limewp.com", ttl: "3600", proxy: false, modified: "1 week ago" },
  { type: "NS", name: "@", content: "ns1.limewp.com", ttl: "86400", proxy: false, modified: "1 month ago" },
  { type: "NS", name: "@", content: "ns2.limewp.com", ttl: "86400", proxy: false, modified: "1 month ago" },
];

export const DNS_TYPE_OPTIONS = ["All", "A", "CNAME", "MX", "TXT", "AAAA", "NS"];

export const DNS_TYPE_COLOR_MAP: Record<string, string> = {
  A: "emerald",
  CNAME: "sky",
  MX: "violet",
  TXT: "amber",
  AAAA: "rose",
  NS: "cyan",
};

export const DOMAINS: Domain[] = [
  { name: "limewp.com", records: 10, status: "Active", ssl: "Active", nameservers: "LimeWP" },
  { name: "supernova.guru", records: 4, status: "Active", ssl: "Pending", nameservers: "LimeWP" },
];

export const PROPAGATION_SERVERS: PropagationServer[] = [
  { location: "US East", status: "propagated", latency: "12ms" },
  { location: "US West", status: "propagated", latency: "18ms" },
  { location: "Europe", status: "propagated", latency: "45ms" },
  { location: "Asia", status: "propagated", latency: "89ms" },
];
