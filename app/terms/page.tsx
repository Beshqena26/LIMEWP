"use client";

import AppShell from "../components/AppShell";
import Link from "next/link";
import { useTheme } from "@/lib/context/ThemeContext";
import { cn } from "@/lib/utils";
import { getColorClasses } from "@/lib/utils/colors";
import { ROUTES } from "@/config/routes";

const SECTIONS = [
  { id: "acceptance", title: "Acceptance of Terms", icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { id: "license", title: "Use License", icon: "M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" },
  { id: "account", title: "Account Responsibilities", icon: "M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" },
  { id: "availability", title: "Service Availability", icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" },
  { id: "payment", title: "Payment Terms", icon: "M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" },
  { id: "liability", title: "Limitation of Liability", icon: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" },
  { id: "law", title: "Governing Law", icon: "M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" },
  { id: "contact", title: "Contact Information", icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" },
];

export default function TermsPage() {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const colors = getColorClasses(accentColor);

  return (
    <AppShell>
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={cn(
          "absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-3xl opacity-20",
          colors.bg
        )} />
        <div className={cn(
          "absolute bottom-0 -right-40 w-[400px] h-[400px] rounded-full blur-3xl opacity-15",
          colors.bg
        )} />
      </div>

      <div className="relative max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className={cn(
            "text-2xl font-bold mb-1",
            isLight ? "text-zinc-800" : "text-zinc-100"
          )}>Terms of Service</h1>
          <p className={cn(
            "text-sm",
            isLight ? "text-zinc-500" : "text-zinc-400"
          )}>Last updated: February 4, 2026</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Table of Contents - Sidebar */}
          <div className="lg:col-span-1">
            <div className={cn(
              "sticky top-24 rounded-2xl border p-5",
              isLight
                ? "bg-white border-zinc-200 shadow-sm"
                : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E]"
            )}>
              <h3 className={cn(
                "text-sm font-semibold mb-4",
                isLight ? "text-zinc-800" : "text-zinc-100"
              )}>On this page</h3>
              <nav className="space-y-2">
                {SECTIONS.map((section, index) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={cn(
                      "flex items-center gap-2 text-sm py-1.5 px-2 rounded-lg transition-colors",
                      isLight
                        ? "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                    )}
                  >
                    <span className={cn(
                      "w-5 h-5 rounded-md flex items-center justify-center text-xs font-medium",
                      isLight ? "bg-zinc-100 text-zinc-500" : "bg-zinc-800 text-zinc-400"
                    )}>{index + 1}</span>
                    <span className="truncate">{section.title}</span>
                  </a>
                ))}
              </nav>
              <div className={cn(
                "mt-5 pt-5 border-t",
                isLight ? "border-zinc-200" : "border-zinc-800"
              )}>
                <p className={cn(
                  "text-xs mb-3",
                  isLight ? "text-zinc-500" : "text-zinc-500"
                )}>Related policies</p>
                <div className="space-y-2">
                  <Link href={ROUTES.PRIVACY} className={cn(
                    "flex items-center gap-2 text-sm transition-colors",
                    isLight ? "text-zinc-600 hover:text-zinc-900" : "text-zinc-400 hover:text-zinc-200"
                  )}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                    Privacy Policy
                  </Link>
                  <Link href={ROUTES.COOKIES} className={cn(
                    "flex items-center gap-2 text-sm transition-colors",
                    isLight ? "text-zinc-600 hover:text-zinc-900" : "text-zinc-400 hover:text-zinc-200"
                  )}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                    </svg>
                    Cookie Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className={cn(
              "rounded-2xl border p-8",
              isLight
                ? "bg-white border-zinc-200 shadow-sm"
                : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E]"
            )}>
              {/* Important Notice */}
              <div className={cn(
                "mb-8 p-4 rounded-xl border",
                isLight
                  ? "bg-amber-50 border-amber-200"
                  : "bg-amber-500/10 border-amber-500/20"
              )}>
                <div className="flex items-start gap-3">
                  <svg className={cn("w-5 h-5 mt-0.5 shrink-0", isLight ? "text-amber-600" : "text-amber-400")} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  <div>
                    <p className={cn("text-sm font-medium", isLight ? "text-amber-800" : "text-amber-300")}>Important Notice</p>
                    <p className={cn("text-xs mt-1", isLight ? "text-amber-700" : "text-amber-400")}>By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</p>
                  </div>
                </div>
              </div>

              <Section id="acceptance" title="Acceptance of Terms" isLight={isLight}>
                <p>By accessing or using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our services.</p>
              </Section>

              <Section id="license" title="Use License" isLight={isLight}>
                <p>Permission is granted to temporarily access and use our services for personal, non-commercial transitory viewing only. This license does not include:</p>
                <ul>
                  <li>Modifying or copying our materials</li>
                  <li>Using materials for commercial purposes</li>
                  <li>Attempting to reverse engineer any software</li>
                  <li>Removing any copyright or proprietary notations</li>
                  <li>Transferring materials to another person</li>
                </ul>
              </Section>

              <Section id="account" title="Account Responsibilities" isLight={isLight}>
                <p>When you create an account with us, you must provide accurate and complete information. You are responsible for:</p>
                <ul>
                  <li>Maintaining the confidentiality of your account</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                  <li>Ensuring your account information is current</li>
                </ul>
              </Section>

              <Section id="availability" title="Service Availability" isLight={isLight}>
                <p>We strive to maintain high availability of our services but do not guarantee uninterrupted access. We reserve the right to modify, suspend, or discontinue any part of our services at any time without prior notice.</p>
                <div className={cn(
                  "mt-4 p-4 rounded-xl flex items-start gap-3",
                  isLight ? "bg-sky-50" : "bg-sky-500/10"
                )}>
                  <svg className={cn("w-5 h-5 mt-0.5 shrink-0", isLight ? "text-sky-600" : "text-sky-400")} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className={cn("text-sm font-medium", isLight ? "text-sky-800" : "text-sky-300")}>99.9% Uptime SLA</p>
                    <p className={cn("text-xs mt-1", isLight ? "text-sky-700" : "text-sky-400")}>We maintain a 99.9% uptime guarantee for all paid plans.</p>
                  </div>
                </div>
              </Section>

              <Section id="payment" title="Payment Terms" isLight={isLight}>
                <p>Certain services may require payment. By subscribing to paid services, you agree to:</p>
                <ul>
                  <li>Pay all applicable fees and charges</li>
                  <li>Provide valid payment information</li>
                  <li>Authorize us to charge your payment method</li>
                  <li>Accept our refund and cancellation policies</li>
                </ul>
              </Section>

              <Section id="liability" title="Limitation of Liability" isLight={isLight}>
                <p>In no event shall we be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses resulting from your access to or use of our services.</p>
              </Section>

              <Section id="law" title="Governing Law" isLight={isLight}>
                <p>These terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles. Any disputes arising from these terms will be resolved through binding arbitration.</p>
              </Section>

              <Section id="contact" title="Contact Information" isLight={isLight} isLast>
                <p>For any questions regarding these Terms of Service, please contact us at:</p>
                <div className={cn(
                  "mt-4 p-4 rounded-xl",
                  isLight ? "bg-zinc-50" : "bg-zinc-800/50"
                )}>
                  <p className={cn("text-sm font-medium", isLight ? "text-zinc-800" : "text-zinc-200")}>legal@example.com</p>
                  <p className={cn("text-xs mt-1", isLight ? "text-zinc-500" : "text-zinc-400")}>We typically respond within 2-3 business days.</p>
                </div>
              </Section>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  isLight: boolean;
  isLast?: boolean;
}

function Section({ id, title, children, isLight, isLast }: SectionProps) {
  return (
    <div id={id} className={cn(
      "scroll-mt-24",
      !isLast && "mb-8 pb-8 border-b",
      !isLast && (isLight ? "border-zinc-200" : "border-zinc-800")
    )}>
      <h2 className={cn(
        "text-lg font-semibold mb-4",
        isLight ? "text-zinc-800" : "text-zinc-100"
      )}>{title}</h2>
      <div className={cn(
        "space-y-3 text-sm leading-relaxed",
        isLight ? "text-zinc-600" : "text-zinc-400",
        "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_li]:pl-1"
      )}>
        {children}
      </div>
    </div>
  );
}
