/**
 * Support page mock data.
 */

export interface SupportTicket {
  id: string;
  subject: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  updated: string;
}

export const SUPPORT_TICKETS: SupportTicket[] = [
  { id: "#1234", subject: "SSL certificate not working", status: "Resolved", updated: "2 days ago" },
  { id: "#1233", subject: "Need help with DNS setup", status: "Resolved", updated: "1 week ago" },
  { id: "#1230", subject: "Migration assistance request", status: "Resolved", updated: "2 weeks ago" },
];

export const SUPPORT_CHANNELS = [
  {
    title: "Live Chat",
    description: "Chat with our support team in real-time",
    icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
    color: "emerald",
    status: "Online Now",
    action: "Start Chat",
    actionVariant: "primary" as const,
  },
  {
    title: "Email Support",
    description: "Send us an email and we'll respond within 24h",
    icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    color: "sky",
    status: "support@limewp.com",
    action: "Send Email",
    actionVariant: "flat" as const,
  },
  {
    title: "Documentation",
    description: "Browse our knowledge base and tutorials",
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    color: "violet",
    status: "200+ Articles",
    action: "Browse Docs",
    actionVariant: "flat" as const,
  },
];
