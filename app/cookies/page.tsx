"use client";

import AppShell from "../components/AppShell";
import Link from "next/link";
import { useTheme } from "@/lib/context/ThemeContext";
import { cn } from "@/lib/utils";
import { getColorClasses } from "@/lib/utils/colors";
import { ROUTES } from "@/config/routes";

const SECTIONS = [
  { id: "what", title: "What Are Cookies", icon: "M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" },
  { id: "how", title: "How We Use Cookies", icon: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" },
  { id: "types", title: "Types of Cookies", icon: "M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" },
  { id: "third-party", title: "Third-Party Cookies", icon: "M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" },
  { id: "managing", title: "Managing Cookies", icon: "M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" },
  { id: "updates", title: "Updates to This Policy", icon: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" },
  { id: "contact", title: "Contact Us", icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" },
];

const COOKIES_DATA = [
  { name: "session_id", purpose: "Authentication", duration: "Session", type: "Essential" },
  { name: "theme", purpose: "User preferences", duration: "1 year", type: "Functionality" },
  { name: "analytics_id", purpose: "Usage analytics", duration: "2 years", type: "Analytics" },
  { name: "csrf_token", purpose: "Security", duration: "Session", type: "Essential" },
];

export default function CookiesPage() {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const colors = getColorClasses(accentColor);

  const getTypeColor = (type: string) => {
    const typeColors: Record<string, { bg: string; text: string }> = {
      Essential: {
        bg: isLight ? "bg-emerald-100" : "bg-emerald-500/20",
        text: isLight ? "text-emerald-700" : "text-emerald-400",
      },
      Functionality: {
        bg: isLight ? "bg-sky-100" : "bg-sky-500/20",
        text: isLight ? "text-sky-700" : "text-sky-400",
      },
      Analytics: {
        bg: isLight ? "bg-violet-100" : "bg-violet-500/20",
        text: isLight ? "text-violet-700" : "text-violet-400",
      },
    };
    return typeColors[type] || typeColors.Essential;
  };

  return (
    <AppShell>
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={cn(
          "absolute top-20 -right-40 w-[500px] h-[500px] rounded-full blur-3xl opacity-20",
          colors.bg
        )} />
        <div className={cn(
          "absolute -bottom-20 -left-40 w-[400px] h-[400px] rounded-full blur-3xl opacity-15",
          colors.bg
        )} />
      </div>

      <div className="relative max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className={cn(
            "text-2xl font-bold mb-1",
            isLight ? "text-zinc-800" : "text-zinc-100"
          )}>Cookie Policy</h1>
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
                  <Link href={ROUTES.TERMS} className={cn(
                    "flex items-center gap-2 text-sm transition-colors",
                    isLight ? "text-zinc-600 hover:text-zinc-900" : "text-zinc-400 hover:text-zinc-200"
                  )}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    Terms of Service
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
              <Section id="what" title="What Are Cookies" isLight={isLight}>
                <p>Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.</p>
              </Section>

              <Section id="how" title="How We Use Cookies" isLight={isLight}>
                <p>We use cookies for several purposes:</p>
                <ul>
                  <li><strong>Essential Cookies:</strong> Required for the website to function properly, including authentication and security.</li>
                  <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our website by collecting anonymous information.</li>
                  <li><strong>Functionality Cookies:</strong> Remember your preferences and settings to enhance your experience.</li>
                  <li><strong>Analytics Cookies:</strong> Allow us to measure and analyze how our website is used.</li>
                </ul>
              </Section>

              <Section id="types" title="Types of Cookies We Use" isLight={isLight}>
                <div className={cn(
                  "rounded-xl border overflow-hidden",
                  isLight ? "border-zinc-200" : "border-zinc-800"
                )}>
                  <table className="w-full text-sm">
                    <thead className={isLight ? "bg-zinc-50" : "bg-zinc-800/50"}>
                      <tr>
                        <th className={cn("px-4 py-3 text-left font-medium", isLight ? "text-zinc-700" : "text-zinc-300")}>Cookie</th>
                        <th className={cn("px-4 py-3 text-left font-medium", isLight ? "text-zinc-700" : "text-zinc-300")}>Purpose</th>
                        <th className={cn("px-4 py-3 text-left font-medium hidden sm:table-cell", isLight ? "text-zinc-700" : "text-zinc-300")}>Duration</th>
                        <th className={cn("px-4 py-3 text-left font-medium", isLight ? "text-zinc-700" : "text-zinc-300")}>Type</th>
                      </tr>
                    </thead>
                    <tbody className={cn("divide-y", isLight ? "divide-zinc-200" : "divide-zinc-800")}>
                      {COOKIES_DATA.map((cookie) => {
                        const typeColor = getTypeColor(cookie.type);
                        return (
                          <tr key={cookie.name}>
                            <td className={cn("px-4 py-3 font-mono text-xs", isLight ? "text-zinc-800" : "text-zinc-200")}>{cookie.name}</td>
                            <td className={cn("px-4 py-3", isLight ? "text-zinc-600" : "text-zinc-400")}>{cookie.purpose}</td>
                            <td className={cn("px-4 py-3 hidden sm:table-cell", isLight ? "text-zinc-600" : "text-zinc-400")}>{cookie.duration}</td>
                            <td className="px-4 py-3">
                              <span className={cn(
                                "px-2 py-0.5 rounded-md text-xs font-medium",
                                typeColor.bg, typeColor.text
                              )}>{cookie.type}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Section>

              <Section id="third-party" title="Third-Party Cookies" isLight={isLight}>
                <p>Some cookies are placed by third-party services that appear on our pages. We do not control these cookies. Third-party cookies may include:</p>
                <ul>
                  <li>Analytics providers (e.g., Google Analytics)</li>
                  <li>Payment processors</li>
                  <li>Customer support tools</li>
                </ul>
              </Section>

              <Section id="managing" title="Managing Cookies" isLight={isLight}>
                <p>You can control and manage cookies in several ways:</p>
                <ul>
                  <li><strong>Browser Settings:</strong> Most browsers allow you to refuse or accept cookies through their settings.</li>
                  <li><strong>Cookie Preferences:</strong> Use our cookie preference center to customize your choices.</li>
                  <li><strong>Opt-Out Links:</strong> Some third-party services provide direct opt-out mechanisms.</li>
                </ul>
                <div className={cn(
                  "mt-4 p-4 rounded-xl flex items-start gap-3",
                  isLight ? "bg-amber-50" : "bg-amber-500/10"
                )}>
                  <svg className={cn("w-5 h-5 mt-0.5 shrink-0", isLight ? "text-amber-600" : "text-amber-400")} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  <div>
                    <p className={cn("text-sm font-medium", isLight ? "text-amber-800" : "text-amber-300")}>Note</p>
                    <p className={cn("text-xs mt-1", isLight ? "text-amber-700" : "text-amber-400")}>Disabling certain cookies may affect the functionality of our website.</p>
                  </div>
                </div>
              </Section>

              <Section id="updates" title="Updates to This Policy" isLight={isLight}>
                <p>We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We encourage you to review this policy periodically.</p>
              </Section>

              <Section id="contact" title="Contact Us" isLight={isLight} isLast>
                <p>If you have any questions about our use of cookies, please contact us at:</p>
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
        "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_li]:pl-1",
        "[&_strong]:font-medium",
        isLight ? "[&_strong]:text-zinc-700" : "[&_strong]:text-zinc-300"
      )}>
        {children}
      </div>
    </div>
  );
}
