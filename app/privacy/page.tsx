"use client";

import AppShell from "../components/AppShell";
import Link from "next/link";
import { useTheme } from "@/lib/context/ThemeContext";
import { cn } from "@/lib/utils";
import { getColorClasses } from "@/lib/utils/colors";
import { ROUTES } from "@/config/routes";

const SECTIONS = [
  { id: "collect", title: "Information We Collect", icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" },
  { id: "use", title: "How We Use Your Information", icon: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" },
  { id: "share", title: "Information Sharing", icon: "M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" },
  { id: "security", title: "Data Security", icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" },
  { id: "rights", title: "Your Rights", icon: "M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" },
  { id: "contact", title: "Contact Us", icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" },
];

export default function PrivacyPage() {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const colors = getColorClasses(accentColor);

  return (
    <AppShell>
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={cn(
          "absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full blur-3xl opacity-20",
          colors.bg
        )} />
        <div className={cn(
          "absolute top-1/2 -left-40 w-[400px] h-[400px] rounded-full blur-3xl opacity-15",
          colors.bg
        )} />
      </div>

      <div className="relative max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className={cn(
            "text-2xl font-bold mb-1",
            isLight ? "text-zinc-800" : "text-zinc-100"
          )}>Privacy Policy</h1>
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
                  <Link href={ROUTES.TERMS} className={cn(
                    "flex items-center gap-2 text-sm transition-colors",
                    isLight ? "text-zinc-600 hover:text-zinc-900" : "text-zinc-400 hover:text-zinc-200"
                  )}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    Terms of Service
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
              <Section id="collect" title="Information We Collect" isLight={isLight}>
                <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This may include:</p>
                <ul>
                  <li>Name and email address</li>
                  <li>Billing information and payment details</li>
                  <li>Account credentials</li>
                  <li>Communication preferences</li>
                </ul>
              </Section>

              <Section id="use" title="How We Use Your Information" isLight={isLight}>
                <p>We use the information we collect to:</p>
                <ul>
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send technical notices, updates, and security alerts</li>
                  <li>Respond to your comments, questions, and support requests</li>
                  <li>Monitor and analyze trends, usage, and activities</li>
                </ul>
              </Section>

              <Section id="share" title="Information Sharing" isLight={isLight}>
                <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share information with:</p>
                <ul>
                  <li>Service providers who assist in our operations</li>
                  <li>Professional advisors such as lawyers and accountants</li>
                  <li>Authorities when required by law</li>
                </ul>
              </Section>

              <Section id="security" title="Data Security" isLight={isLight}>
                <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include encryption, secure servers, and regular security assessments.</p>
                <div className={cn(
                  "mt-4 p-4 rounded-xl flex items-start gap-3",
                  isLight ? "bg-emerald-50" : "bg-emerald-500/10"
                )}>
                  <svg className={cn("w-5 h-5 mt-0.5 shrink-0", isLight ? "text-emerald-600" : "text-emerald-400")} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  <div>
                    <p className={cn("text-sm font-medium", isLight ? "text-emerald-800" : "text-emerald-300")}>Enterprise-grade security</p>
                    <p className={cn("text-xs mt-1", isLight ? "text-emerald-700" : "text-emerald-400")}>Your data is encrypted at rest and in transit using industry-standard protocols.</p>
                  </div>
                </div>
              </Section>

              <Section id="rights" title="Your Rights" isLight={isLight}>
                <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
                <ul>
                  <li>Access to your personal data</li>
                  <li>Correction of inaccurate data</li>
                  <li>Deletion of your data</li>
                  <li>Data portability</li>
                  <li>Withdrawal of consent</li>
                </ul>
              </Section>

              <Section id="contact" title="Contact Us" isLight={isLight} isLast>
                <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                <div className={cn(
                  "mt-4 p-4 rounded-xl",
                  isLight ? "bg-zinc-50" : "bg-zinc-800/50"
                )}>
                  <p className={cn("text-sm font-medium", isLight ? "text-zinc-800" : "text-zinc-200")}>privacy@example.com</p>
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
