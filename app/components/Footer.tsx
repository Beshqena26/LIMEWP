"use client";

import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/config/routes";
import { useTheme } from "@/lib/context/ThemeContext";

const FOOTER_LINKS = [
  {
    title: "Product",
    links: [
      { label: "Dashboard", href: ROUTES.DASHBOARD },
      { label: "Services", href: ROUTES.SERVICES },
      { label: "Billing", href: ROUTES.BILLING },
      { label: "DNS Management", href: ROUTES.DNS },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: ROUTES.DOCS },
      { label: "API Reference", href: ROUTES.API_REFERENCE },
      { label: "Community", href: ROUTES.FORUM },
      { label: "Support Center", href: ROUTES.SUPPORT },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#", badge: "Hiring" },
      { label: "Contact", href: ROUTES.CONTACT },
    ],
  },
];

const SOCIAL_LINKS = [
  {
    label: "Twitter",
    href: "#",
    icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
    hoverColor: "hover:text-sky-400 hover:bg-sky-500/10 hover:ring-sky-500/20",
  },
  {
    label: "GitHub",
    href: "#",
    icon: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z",
    hoverColor: "hover:text-violet-400 hover:bg-violet-500/10 hover:ring-violet-500/20",
  },
  {
    label: "Discord",
    href: "#",
    icon: "M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z",
    hoverColor: "hover:text-indigo-400 hover:bg-indigo-500/10 hover:ring-indigo-500/20",
  },
  {
    label: "YouTube",
    href: "#",
    icon: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
    hoverColor: "hover:text-red-400 hover:bg-red-500/10 hover:ring-red-500/20",
  },
];

export default function Footer() {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute -top-24 left-1/4 w-96 h-96 rounded-full blur-3xl ${
          isLight ? "bg-emerald-500/5" : "bg-emerald-500/10"
        }`} />
        <div className={`absolute -top-24 right-1/4 w-96 h-96 rounded-full blur-3xl ${
          isLight ? "bg-sky-500/5" : "bg-sky-500/10"
        }`} />
      </div>

      {/* Main Footer Content */}
      <div className={`relative border-t transition-colors ${
        isLight
          ? "bg-white border-slate-200"
          : "bg-[var(--bg-primary)] border-white/[0.06]"
      }`}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-4">
              <Link href={ROUTES.DASHBOARD} className="inline-block mb-6 group">
                <Image
                  src="/limewp-logo.svg"
                  alt="LimeWP"
                  width={120}
                  height={32}
                  className={`group-hover:opacity-80 transition-opacity ${isLight ? "brightness-0" : ""}`}
                />
              </Link>
              <p className={`text-sm leading-relaxed mb-8 max-w-sm ${
                isLight ? "text-slate-600" : "text-slate-400"
              }`}>
                Premium managed WordPress hosting engineered for exceptional performance,
                enterprise-grade security, and delightful simplicity.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-2">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className={`group w-10 h-10 rounded-xl flex items-center justify-center transition-all ring-1 ${
                      isLight
                        ? `bg-slate-100 text-slate-500 ring-slate-200 ${social.hoverColor}`
                        : `bg-[var(--bg-elevated)] text-slate-400 ring-[var(--border-primary)] ${social.hoverColor}`
                    }`}
                    aria-label={social.label}
                  >
                    <svg
                      className="w-5 h-5 transition-transform group-hover:scale-110"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d={social.icon} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
              {FOOTER_LINKS.map((section) => (
                <div key={section.title}>
                  <h3 className={`text-sm font-semibold mb-5 ${
                    isLight ? "text-slate-900" : "text-slate-100"
                  }`}>
                    {section.title}
                  </h3>
                  <ul className="space-y-3.5">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className={`group inline-flex items-center gap-2 text-sm transition-all ${
                            isLight
                              ? "text-slate-600 hover:text-emerald-600"
                              : "text-slate-400 hover:text-emerald-400"
                          }`}
                        >
                          <span className="relative">
                            {link.label}
                            <span className={`absolute -bottom-0.5 left-0 w-0 h-px transition-all group-hover:w-full ${
                              isLight ? "bg-emerald-600" : "bg-emerald-400"
                            }`} />
                          </span>
                          {link.badge && (
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 text-white">
                              {link.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className={`py-8 border-t ${
            isLight ? "border-slate-200" : "border-white/[0.06]"
          }`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-sm">
                <span className={isLight ? "text-slate-500" : "text-slate-500"}>
                  {currentYear} LimeWP. All rights reserved.
                </span>
                <Link
                  href={ROUTES.PRIVACY}
                  className={`transition-colors ${
                    isLight ? "text-slate-500 hover:text-slate-700" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  Privacy
                </Link>
                <Link
                  href={ROUTES.TERMS}
                  className={`transition-colors ${
                    isLight ? "text-slate-500 hover:text-slate-700" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  Terms
                </Link>
                <Link
                  href={ROUTES.COOKIES}
                  className={`transition-colors ${
                    isLight ? "text-slate-500 hover:text-slate-700" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  Cookies
                </Link>
              </div>

              <div className="flex items-center gap-6">
                <Link
                  href="#"
                  className={`flex items-center gap-2 text-sm transition-colors ${
                    isLight ? "text-slate-500 hover:text-slate-700" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Status
                </Link>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                  isLight
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20"
                    : "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
                }`}>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  All systems operational
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
