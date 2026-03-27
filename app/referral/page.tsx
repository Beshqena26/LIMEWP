"use client";

import { useState } from "react";
import AppShell from "../components/AppShell";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { showToast } from "@/lib/toast";

/* ────────────────────────── Data ────────────────────────── */

const REFERRAL_LINK = "https://limewp.com/ref/LIME2024";

const STEPS = [
  {
    number: 1,
    title: "Share your unique link",
    description:
      "Copy your referral link and share it with friends, colleagues, or your audience. Post it on social media, in emails, or wherever you connect.",
    icon: "M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z",
  },
  {
    number: 2,
    title: "Friend signs up for free",
    description:
      "Your friend creates an account using your link and gets 2 extra months free — 8 months of premium hosting instead of the standard 6.",
    icon: "M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.766z",
  },
  {
    number: 3,
    title: "You earn $50 credit",
    description:
      "When your referral converts to a paid plan, you receive a $50 credit applied to your account. Use it toward your subscription or add-ons.",
    icon: "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z",
  },
];

const STATS = [
  { label: "Total Referrals", value: "12", icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" },
  { label: "Converted", value: "8", icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { label: "Pending", value: "4", icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" },
  { label: "Credits Earned", value: "$400", icon: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { label: "Available Balance", value: "$150", icon: "M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" },
];

const REFERRAL_HISTORY = [
  { email: "j***@gmail.com", status: "Converted", date: "Mar 15, 2026", credit: "$50" },
  { email: "s***@outlook.com", status: "Converted", date: "Mar 02, 2026", credit: "$50" },
  { email: "m***@yahoo.com", status: "Signed Up", date: "Feb 28, 2026", credit: "--" },
  { email: "a***@company.io", status: "Expired", date: "Feb 10, 2026", credit: "--" },
  { email: "r***@proton.me", status: "Converted", date: "Jan 22, 2026", credit: "$50" },
];

const FAQ_ITEMS = [
  {
    question: "How does the referral program work?",
    answer:
      "Share your unique referral link with friends. When they sign up using your link, they receive 2 extra months of free hosting (8 months total instead of the standard 6). Once they convert to a paid plan, you earn a $50 account credit.",
  },
  {
    question: "When do I get my credit?",
    answer:
      "Your $50 credit is applied to your account as soon as your referred friend converts to a paid plan. Credits are typically available within 24 hours of the conversion and can be used toward your next billing cycle.",
  },
  {
    question: "Is there a limit to how many people I can refer?",
    answer:
      "There is no limit. You can refer as many people as you like and earn $50 for each one that converts to a paid plan. The more you share, the more you earn.",
  },
  {
    question: "Can I use credits to pay for add-ons?",
    answer:
      "Yes. Referral credits can be applied to any charge on your account, including monthly subscriptions, add-on services like CDN or priority support, and one-time purchases such as extra storage or migrations.",
  },
];

/* ────────────────────────── Page ────────────────────────── */

export default function ReferralPage() {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const cardClass = `rounded-2xl border transition-all ${
    isLight
      ? "bg-white border-slate-200"
      : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"
  }`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(REFERRAL_LINK);
      setCopied(true);
      showToast.success("Referral link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast.error("Failed to copy link. Please copy it manually.");
    }
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent("Try LimeWP — Premium WordPress Hosting, Free for 8 Months");
    const body = encodeURIComponent(
      `Hey! I've been using LimeWP for WordPress hosting and it's been great. Use my referral link and you'll get 8 months free instead of 6:\n\n${REFERRAL_LINK}\n\nEnjoy!`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(
      `I've been using @LimeWP for WordPress hosting — fast, reliable, and free for 6 months. Use my link to get 8 months free: ${REFERRAL_LINK}`
    );
    window.open(`https://x.com/intent/tweet?text=${text}`, "_blank");
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "Converted":
        return "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10";
      case "Signed Up":
        return "text-sky-600 dark:text-sky-400 bg-sky-500/10";
      case "Expired":
        return "text-slate-500 dark:text-slate-400 bg-slate-500/10";
      default:
        return "text-slate-500 dark:text-slate-400 bg-slate-500/10";
    }
  };

  return (
    <AppShell>
      <div className="space-y-8">
        {/* ── Hero Banner ── */}
        <div
          className={`relative overflow-hidden rounded-2xl p-8 sm:p-10 bg-gradient-to-r ${accent.gradient}`}
        >
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 400 200" fill="none">
              <circle cx="350" cy="30" r="80" fill="white" opacity="0.15" />
              <circle cx="50" cy="180" r="60" fill="white" opacity="0.1" />
              <circle cx="200" cy="100" r="120" fill="white" opacity="0.05" />
            </svg>
          </div>
          <div className="relative z-10 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Earn credits by referring friends
            </h1>
            <p className="text-white/80 text-lg mb-6">
              Give 2 months free, Get $50 credit
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div
                className={`flex-1 max-w-md w-full flex items-center rounded-xl px-4 py-3 text-sm font-mono ${
                  isLight ? "bg-white/20 text-white" : "bg-black/20 text-white"
                }`}
              >
                <span className="truncate flex-1">{REFERRAL_LINK}</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-900 font-semibold text-sm hover:bg-white/90 transition-all shadow-lg cursor-pointer"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  {copied ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                    />
                  )}
                </svg>
                {copied ? "Copied!" : "Copy Referral Link"}
              </button>
            </div>
          </div>
        </div>

        {/* ── How It Works ── */}
        <div>
          <h2
            className={`text-xl font-bold mb-6 ${
              isLight ? "text-slate-900" : "text-white"
            }`}
          >
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {STEPS.map((step) => (
              <div key={step.number} className={`${cardClass} p-6`}>
                <div className="flex items-start gap-4">
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${accent.bg}`}
                  >
                    <svg
                      className={`w-5 h-5 ${accent.text}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${accent.bg} ${accent.text}`}
                      >
                        Step {step.number}
                      </span>
                    </div>
                    <h3
                      className={`font-semibold mb-1 ${
                        isLight ? "text-slate-900" : "text-white"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={`text-sm leading-relaxed ${
                        isLight ? "text-slate-600" : "text-slate-400"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Your Stats ── */}
        <div>
          <h2
            className={`text-xl font-bold mb-6 ${
              isLight ? "text-slate-900" : "text-white"
            }`}
          >
            Your Stats
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {STATS.map((stat) => (
              <div key={stat.label} className={`${cardClass} p-5 text-center`}>
                <div
                  className={`w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center ${accent.bg}`}
                >
                  <svg
                    className={`w-5 h-5 ${accent.text}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                  </svg>
                </div>
                <p
                  className={`text-2xl font-bold mb-1 ${
                    isLight ? "text-slate-900" : "text-white"
                  }`}
                >
                  {stat.value}
                </p>
                <p
                  className={`text-xs ${
                    isLight ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Referral History ── */}
        <div>
          <h2
            className={`text-xl font-bold mb-6 ${
              isLight ? "text-slate-900" : "text-white"
            }`}
          >
            Referral History
          </h2>
          <div className={`${cardClass} overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr
                    className={
                      isLight
                        ? "bg-slate-50 border-b border-slate-200"
                        : "bg-white/5 border-b border-white/10"
                    }
                  >
                    <th
                      className={`text-left px-6 py-3 font-semibold ${
                        isLight ? "text-slate-600" : "text-slate-300"
                      }`}
                    >
                      Email
                    </th>
                    <th
                      className={`text-left px-6 py-3 font-semibold ${
                        isLight ? "text-slate-600" : "text-slate-300"
                      }`}
                    >
                      Status
                    </th>
                    <th
                      className={`text-left px-6 py-3 font-semibold ${
                        isLight ? "text-slate-600" : "text-slate-300"
                      }`}
                    >
                      Date
                    </th>
                    <th
                      className={`text-right px-6 py-3 font-semibold ${
                        isLight ? "text-slate-600" : "text-slate-300"
                      }`}
                    >
                      Credit
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {REFERRAL_HISTORY.map((row, i) => (
                    <tr
                      key={i}
                      className={`transition-colors ${
                        isLight
                          ? "border-b border-slate-100 hover:bg-slate-50/50"
                          : "border-b border-white/5 hover:bg-white/[0.02]"
                      }`}
                    >
                      <td
                        className={`px-6 py-4 font-mono ${
                          isLight ? "text-slate-700" : "text-slate-300"
                        }`}
                      >
                        {row.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(
                            row.status
                          )}`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td
                        className={`px-6 py-4 ${
                          isLight ? "text-slate-500" : "text-slate-400"
                        }`}
                      >
                        {row.date}
                      </td>
                      <td
                        className={`px-6 py-4 text-right font-semibold ${
                          row.credit !== "--"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : isLight
                            ? "text-slate-400"
                            : "text-slate-500"
                        }`}
                      >
                        {row.credit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── Share Options ── */}
        <div>
          <h2
            className={`text-xl font-bold mb-6 ${
              isLight ? "text-slate-900" : "text-white"
            }`}
          >
            Share Your Link
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Copy Link */}
            <button
              onClick={handleCopy}
              className={`${cardClass} p-5 flex items-center gap-4 hover:scale-[1.02] transition-transform cursor-pointer text-left`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${accent.bg}`}
              >
                <svg
                  className={`w-6 h-6 ${accent.text}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                  />
                </svg>
              </div>
              <div>
                <p
                  className={`font-semibold ${
                    isLight ? "text-slate-900" : "text-white"
                  }`}
                >
                  Copy Link
                </p>
                <p
                  className={`text-sm ${
                    isLight ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Copy to clipboard
                </p>
              </div>
            </button>

            {/* Email */}
            <button
              onClick={handleEmailShare}
              className={`${cardClass} p-5 flex items-center gap-4 hover:scale-[1.02] transition-transform cursor-pointer text-left`}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-sky-500/10">
                <svg
                  className="w-6 h-6 text-sky-600 dark:text-sky-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              </div>
              <div>
                <p
                  className={`font-semibold ${
                    isLight ? "text-slate-900" : "text-white"
                  }`}
                >
                  Email
                </p>
                <p
                  className={`text-sm ${
                    isLight ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Send via email
                </p>
              </div>
            </button>

            {/* Twitter/X */}
            <button
              onClick={handleTwitterShare}
              className={`${cardClass} p-5 flex items-center gap-4 hover:scale-[1.02] transition-transform cursor-pointer text-left`}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-500/10">
                <svg
                  className={`w-6 h-6 ${
                    isLight ? "text-slate-700" : "text-slate-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <div>
                <p
                  className={`font-semibold ${
                    isLight ? "text-slate-900" : "text-white"
                  }`}
                >
                  Twitter / X
                </p>
                <p
                  className={`text-sm ${
                    isLight ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Share on X
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* ── FAQ ── */}
        <div>
          <h2
            className={`text-xl font-bold mb-6 ${
              isLight ? "text-slate-900" : "text-white"
            }`}
          >
            Frequently Asked Questions
          </h2>
          <div className={`${cardClass} divide-y ${isLight ? "divide-slate-200" : "divide-white/10"}`}>
            {FAQ_ITEMS.map((item, index) => (
              <div key={index}>
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className={`w-full flex items-center justify-between px-6 py-5 text-left transition-colors cursor-pointer ${
                    isLight ? "hover:bg-slate-50" : "hover:bg-white/[0.02]"
                  } ${index === 0 ? "rounded-t-2xl" : ""} ${
                    index === FAQ_ITEMS.length - 1 && openFaq !== index ? "rounded-b-2xl" : ""
                  }`}
                >
                  <span
                    className={`font-semibold pr-4 ${
                      isLight ? "text-slate-900" : "text-white"
                    }`}
                  >
                    {item.question}
                  </span>
                  <svg
                    className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
                      openFaq === index ? "rotate-180" : ""
                    } ${isLight ? "text-slate-400" : "text-slate-500"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    openFaq === index ? "max-h-48" : "max-h-0"
                  }`}
                >
                  <p
                    className={`px-6 pb-5 text-sm leading-relaxed ${
                      isLight ? "text-slate-600" : "text-slate-400"
                    }`}
                  >
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
