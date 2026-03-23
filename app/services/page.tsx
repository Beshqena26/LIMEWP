"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import AppShell from "../components/AppShell";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { showToast } from "@/lib/toast";
import { Toggle } from "@/app/components/ui/Toggle";
import { ConfirmDialog } from "@/app/components/ui/ConfirmDialog";
import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { Progress } from "@heroui/react";
import {
  CURRENT_SERVICES,
  SUGGESTED_SERVICES,
  SERVICE_BADGE_STYLES,
  type CurrentService,
  type SuggestedService,
} from "@/data/services";
import { ServicesSkeleton } from "../components/skeletons";
import { useSimulatedLoading } from "@/hooks";

/* ── upgrade tiers ── */
const UPGRADE_TIERS: Record<string, { name: string; price: number }[]> = {
  "Managed WordPress Hosting": [
    { name: "Starter", price: 19 },
    { name: "Business", price: 49 },
    { name: "Enterprise", price: 99 },
    { name: "Agency", price: 199 },
  ],
  "Email Hosting": [
    { name: "Basic", price: 9 },
    { name: "Professional", price: 29 },
    { name: "Business", price: 59 },
  ],
};

/* ── fake sites ── */
const SITES_USING_SERVICE = ["limewp.com", "supernova.guru"];

/* ── saved cards ── */
const SAVED_CARDS = [
  { id: "card-1", brand: "Visa", last4: "4242", expiry: "12/28", color: "bg-blue-600" },
  { id: "card-2", brand: "Mastercard", last4: "8888", expiry: "06/27", color: "bg-orange-500" },
  { id: "card-3", brand: "Amex", last4: "1234", expiry: "03/29", color: "bg-sky-500" },
];

const CRYPTO_OPTIONS = [
  { key: "btc", name: "Bitcoin (BTC)", icon: "\u20BF", color: "bg-orange-500" },
  { key: "eth", name: "Ethereum (ETH)", icon: "\u039E", color: "bg-violet-500" },
  { key: "usdt", name: "USDT (TRC-20)", icon: "\u20AE", color: "bg-emerald-500" },
];

export default function ServicesPage() {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  const { data, isLoading } = useSimulatedLoading(() => ({
    current: CURRENT_SERVICES,
    suggested: SUGGESTED_SERVICES,
  }));

  /* ── state ── */
  const [activeServices, setActiveServices] = useState<CurrentService[]>([]);
  const [suggestedServices, setSuggestedServices] = useState<SuggestedService[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [detailService, setDetailService] = useState<CurrentService | SuggestedService | null>(null);
  const [purchaseTarget, setPurchaseTarget] = useState<SuggestedService | null>(null);
  const [cancelTarget, setCancelTarget] = useState<CurrentService | null>(null);
  const [upgradeTarget, setUpgradeTarget] = useState<CurrentService | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "balance" | "crypto">("card");
  const [selectedCard, setSelectedCard] = useState(SAVED_CARDS[0].id);
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");
  const [actionLoading, setActionLoading] = useState(false);
  const [autoRenew, setAutoRenew] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);

  /* sync data when loaded */
  useEffect(() => {
    if (data) {
      setActiveServices(data.current);
      setSuggestedServices(data.suggested);
    }
  }, [data]);

  /* ── filtered lists ── */
  const q = searchQuery.toLowerCase().trim();
  const filteredActive = useMemo(
    () => (q ? activeServices.filter((s) => s.name.toLowerCase().includes(q)) : activeServices),
    [activeServices, q],
  );
  const filteredSuggested = useMemo(
    () => (q ? suggestedServices.filter((s) => s.name.toLowerCase().includes(q)) : suggestedServices),
    [suggestedServices, q],
  );

  /* ── helpers: is current or suggested ── */
  const isCurrentService = (s: CurrentService | SuggestedService): s is CurrentService =>
    "plan" in s;

  /* ── modal refs ── */
  const detailRef = useRef<HTMLDivElement>(null);
  const purchaseRef = useRef<HTMLDivElement>(null);
  const upgradeRef = useRef<HTMLDivElement>(null);

  /* ── escape key + body scroll lock for custom modals ── */
  useEffect(() => {
    const anyOpen = !!detailService || !!purchaseTarget || !!upgradeTarget;
    if (!anyOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (purchaseTarget) setPurchaseTarget(null);
        else if (upgradeTarget) setUpgradeTarget(null);
        else if (detailService) setDetailService(null);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [detailService, purchaseTarget, upgradeTarget]);

  /* ── actions ── */
  const handleCancelConfirm = useCallback(() => {
    if (!cancelTarget) return;
    setActionLoading(true);
    setTimeout(() => {
      setActiveServices((prev) => prev.filter((s) => s.name !== cancelTarget.name));
      showToast.success(`${cancelTarget.name} cancelled. Billing will stop at end of current cycle.`);
      setCancelTarget(null);
      setDetailService(null);
      setActionLoading(false);
    }, 1500);
  }, [cancelTarget]);

  const handlePurchase = useCallback(() => {
    if (!purchaseTarget) return;
    setActionLoading(true);
    setTimeout(() => {
      const newActive: CurrentService = {
        name: purchaseTarget.name,
        plan: "Starter",
        icon: purchaseTarget.icon,
        color: purchaseTarget.color,
        nextBilling: "Apr 23, 2026",
        price: purchaseTarget.price,
        stats: [
          { label: "Usage", value: "0%", progress: 0 },
        ],
      };
      setActiveServices((prev) => [...prev, newActive]);
      setSuggestedServices((prev) => prev.filter((s) => s.name !== purchaseTarget.name));
      showToast.success(`${purchaseTarget.name} added to your account!`);
      setPurchaseTarget(null);
      setDetailService(null);
      setActionLoading(false);
    }, 2000);
  }, [purchaseTarget]);

  const handleUpgrade = useCallback(
    (tierName: string, tierPrice: number) => {
      if (!upgradeTarget) return;
      setActionLoading(true);
      setTimeout(() => {
        setActiveServices((prev) =>
          prev.map((s) =>
            s.name === upgradeTarget.name ? { ...s, plan: tierName, price: tierPrice } : s,
          ),
        );
        showToast.success(`${upgradeTarget.name} upgraded to ${tierName}!`);
        setUpgradeTarget(null);
        setActionLoading(false);
      }, 2000);
    },
    [upgradeTarget],
  );

  /* ── style tokens ── */
  const cardClass = `group relative rounded-2xl border transition-all overflow-hidden ${
    isLight
      ? "bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50"
      : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)] hover:border-[var(--border-primary)]"
  }`;
  const inputClass = `w-full h-10 rounded-xl border px-3 text-sm font-medium outline-none transition-colors ${
    isLight
      ? "bg-white border-slate-200 text-slate-800 focus:border-slate-400"
      : "bg-[var(--bg-primary)] border-[var(--border-tertiary)] text-slate-200 focus:border-[var(--border-primary)]"
  }`;
  const labelClass = `text-xs font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`;
  const modalOverlayClass = "fixed inset-0 z-[100] flex items-center justify-center p-4";
  const modalBackdropClass = "absolute inset-0 bg-black/60 backdrop-blur-sm";
  const modalCardClass = `relative w-full max-w-lg rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden ${
    isLight ? "bg-white border border-slate-200" : "bg-[var(--bg-primary)] border border-[var(--border-tertiary)]"
  }`;

  const spinner = (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );

  /* ── color map for gradient strips ── */
  const colorGradient = (color: string) => {
    const map: Record<string, string> = {
      emerald: "from-emerald-500 to-emerald-600",
      sky: "from-sky-500 to-sky-600",
      violet: "from-violet-500 to-violet-600",
      amber: "from-amber-500 to-amber-600",
      zinc: "from-zinc-500 to-zinc-600",
      rose: "from-rose-500 to-rose-600",
    };
    return map[color] || "from-slate-500 to-slate-600";
  };

  return (
    <AppShell>
      {/* ═══════ Header ═══════ */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              Services
            </h1>
            <p className={`text-sm mt-1 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              Manage your active services and discover new ones
            </p>
          </div>
          <button
            onClick={() => {
              const el = document.getElementById("suggested-section");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className={`h-10 px-5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 text-white ${accent.button} ${accent.buttonHover}`}
            style={{ boxShadow: accent.buttonShadow }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 4v16m8-8H4" />
            </svg>
            Add Service
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <svg
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? "text-slate-400" : "text-slate-500"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            id="service-search"
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${inputClass} pl-10`}
          />
          <label htmlFor="service-search" className="sr-only">
            Search services
          </label>
        </div>
      </div>

      {isLoading ? (
        <ServicesSkeleton />
      ) : (
        <>
          {/* ═══════ Active Services ═══════ */}
          <section className="mb-10">
            <h2 className={`text-lg font-semibold mb-4 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              Active Services
              <span className={`ml-2 text-sm font-normal ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                ({filteredActive.length})
              </span>
            </h2>

            {filteredActive.length === 0 ? (
              <div className={`rounded-2xl border p-8 text-center ${isLight ? "bg-white border-slate-200" : "bg-[var(--bg-secondary)] border-[var(--border-tertiary)]"}`}>
                <p className={`text-sm ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                  {q ? "No active services match your search." : "No active services yet."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {filteredActive.map((service) => (
                  <div key={service.name} className={cardClass}>
                    <div className="relative p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4 mb-5">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isLight ? "bg-slate-200" : "bg-slate-800"}`}>
                            <svg className={`w-6 h-6 ${isLight ? "text-slate-600" : "text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d={service.icon} />
                            </svg>
                          </div>
                          <div>
                            <div className={`font-semibold text-base ${isLight ? "text-slate-800" : "text-slate-100"}`}>{service.name}</div>
                            <div className={`text-xs flex items-center gap-2 mt-0.5 ${isLight ? "text-slate-500" : "text-slate-500"}`}>
                              <span>{service.plan} Plan</span>
                              <span className={isLight ? "text-slate-400" : "text-slate-600"}>&#8226;</span>
                              <span>${service.price}/mo</span>
                            </div>
                          </div>
                        </div>
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${isLight ? "bg-emerald-50 ring-1 ring-emerald-200" : "bg-emerald-500/10 ring-1 ring-emerald-500/20"}`}>
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          <span className={`text-xs font-semibold ${isLight ? "text-emerald-700" : "text-emerald-400"}`}>Active</span>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className={`grid gap-4 mb-5 ${service.stats.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
                        {service.stats.map((stat) => (
                          <div key={stat.label} className={`rounded-xl p-3 ${isLight ? "bg-slate-50" : "bg-[var(--bg-primary)]"}`}>
                            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">{stat.label}</div>
                            <div className={`text-sm font-semibold mb-2 ${isLight ? "text-slate-700" : "text-slate-200"}`}>{stat.value}</div>
                            <Progress
                              value={stat.progress}
                              size="sm"
                              classNames={{
                                track: `h-1 ${isLight ? "bg-slate-200" : "bg-[var(--bg-elevated)]"}`,
                                indicator: `${isLight ? "bg-slate-500" : "bg-slate-400"} rounded-full`,
                              }}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className={`flex items-center justify-between pt-4 border-t ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
                        <div className="text-xs text-slate-500">
                          Next billing: <span className={`font-medium ${isLight ? "text-slate-700" : "text-slate-300"}`}>{service.nextBilling}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setDetailService(service)}
                            aria-label={`Manage ${service.name}`}
                            className={`h-9 px-4 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                              isLight
                                ? "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
                                : "bg-[var(--bg-elevated)] text-slate-300 hover:bg-[var(--border-primary)] hover:text-white"
                            }`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Manage
                          </button>
                          <button
                            onClick={() => setUpgradeTarget(service)}
                            aria-label={`Upgrade ${service.name}`}
                            className={`h-9 px-4 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 text-white ${accent.button} ${accent.buttonHover}`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                            </svg>
                            Upgrade
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ═══════ Suggested Services ═══════ */}
          <section id="suggested-section" className="mb-10">
            <h2 className={`text-lg font-semibold mb-4 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              Suggested Services
              <span className={`ml-2 text-sm font-normal ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                ({filteredSuggested.length})
              </span>
            </h2>

            {filteredSuggested.length === 0 ? (
              <div className={`rounded-2xl border p-8 text-center ${isLight ? "bg-white border-slate-200" : "bg-[var(--bg-secondary)] border-[var(--border-tertiary)]"}`}>
                <p className={`text-sm ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                  {q ? "No suggested services match your search." : "No more services to suggest."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredSuggested.map((service) => (
                  <div
                    key={service.name}
                    className={`${cardClass} cursor-pointer`}
                    onClick={() => setDetailService(service)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setDetailService(service); } }}
                    aria-label={`View details for ${service.name}`}
                  >
                    <div className="relative p-5">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${isLight ? "bg-slate-100 text-slate-600 ring-1 ring-slate-200" : "bg-slate-800 text-slate-400 ring-1 ring-slate-700"}`}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d={service.icon} />
                          </svg>
                        </div>
                        {service.badge && (
                          <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md ring-1 ${SERVICE_BADGE_STYLES[service.badge.type] || (isLight ? "bg-slate-100 text-slate-600 ring-slate-200" : "bg-slate-800 text-slate-400 ring-slate-700")}`}>
                            {service.badge.label}
                          </span>
                        )}
                      </div>

                      {/* Title & Description */}
                      <h3 className={`font-semibold text-[15px] mb-1.5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>{service.name}</h3>
                      <p className={`text-sm leading-relaxed mb-4 line-clamp-2 ${isLight ? "text-slate-600" : "text-slate-500"}`}>{service.description}</p>

                      {/* Features */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {service.features.map((feature) => (
                          <span key={feature} className={`text-[10px] font-medium px-2 py-1 rounded-md ${isLight ? "text-slate-600 bg-slate-100" : "text-slate-400 bg-[var(--bg-elevated)]"}`}>
                            {feature}
                          </span>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className={`flex justify-between items-center pt-4 border-t ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
                        <div className="flex items-baseline gap-1">
                          <span className={`text-xl font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>${service.price}</span>
                          <span className="text-xs text-slate-500">/month</span>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); setPurchaseTarget(service); }}
                          aria-label={`Add ${service.name}`}
                          className={`h-9 px-4 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 text-white ${accent.button} ${accent.buttonHover}`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M12 4v16m8-8H4" />
                          </svg>
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ═══════ Cross-links ═══════ */}
          <div className={`flex flex-wrap gap-6 pt-6 border-t ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
            <Link
              href={ROUTES.SITE}
              className={`text-sm font-medium flex items-center gap-1.5 transition-colors ${isLight ? "text-slate-600 hover:text-slate-900" : "text-slate-400 hover:text-slate-200"}`}
            >
              Manage site add-ons
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href={ROUTES.BILLING}
              className={`text-sm font-medium flex items-center gap-1.5 transition-colors ${isLight ? "text-slate-600 hover:text-slate-900" : "text-slate-400 hover:text-slate-200"}`}
            >
              View billing
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          MODAL: Service Detail (active OR suggested)
         ══════════════════════════════════════════════════════════════════ */}
      {detailService && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => setDetailService(null)} aria-hidden="true" />
          <div
            ref={detailRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="detail-modal-title"
            className={modalCardClass}
          >
            {/* Gradient strip */}
            <div className={`h-2 bg-gradient-to-r ${colorGradient(detailService.color)}`} />

            <div className="p-6">
              {/* Close button */}
              <button
                onClick={() => setDetailService(null)}
                aria-label="Close detail modal"
                className={`absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isLight ? "hover:bg-slate-100 text-slate-500" : "hover:bg-slate-800 text-slate-400"}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Icon + Name */}
              <div className="flex items-center gap-4 mb-5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isLight ? "bg-slate-200" : "bg-slate-800"}`}>
                  <svg className={`w-6 h-6 ${isLight ? "text-slate-600" : "text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={detailService.icon} />
                  </svg>
                </div>
                <div>
                  <h3 id="detail-modal-title" className={`text-lg font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                    {detailService.name}
                  </h3>
                  <p className={`text-sm ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                    {isCurrentService(detailService)
                      ? `${detailService.plan} Plan`
                      : detailService.description}
                  </p>
                </div>
              </div>

              <div className={`text-xl font-bold mb-5 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                ${detailService.price}<span className="text-sm font-normal text-slate-500">/month</span>
              </div>

              {/* ── Active service details ── */}
              {isCurrentService(detailService) && (
                <>
                  {/* Usage stats */}
                  <div className="mb-5">
                    <h4 className={`text-sm font-semibold mb-3 ${isLight ? "text-slate-700" : "text-slate-200"}`}>Usage</h4>
                    <div className="space-y-3">
                      {detailService.stats.map((stat) => (
                        <div key={stat.label}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className={isLight ? "text-slate-600" : "text-slate-400"}>{stat.label}</span>
                            <span className={`font-medium ${isLight ? "text-slate-700" : "text-slate-300"}`}>{stat.value}</span>
                          </div>
                          <Progress
                            value={stat.progress}
                            size="sm"
                            classNames={{
                              track: `h-1.5 ${isLight ? "bg-slate-200" : "bg-[var(--bg-elevated)]"}`,
                              indicator: `${isLight ? "bg-slate-500" : "bg-slate-400"} rounded-full`,
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sites using this */}
                  <div className="mb-5">
                    <h4 className={`text-sm font-semibold mb-3 ${isLight ? "text-slate-700" : "text-slate-200"}`}>Sites using this service</h4>
                    <div className="space-y-2">
                      {SITES_USING_SERVICE.map((site) => (
                        <div key={site} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${isLight ? "bg-slate-50" : "bg-[var(--bg-elevated)]"}`}>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${isLight ? "bg-slate-200 text-slate-600" : "bg-slate-700 text-slate-300"}`}>
                            {site.charAt(0).toUpperCase()}
                          </div>
                          <span className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-300"}`}>{site}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Settings */}
                  <div className={`mb-5 p-4 rounded-xl ${isLight ? "bg-slate-50" : "bg-[var(--bg-elevated)]"}`}>
                    <h4 className={`text-sm font-semibold mb-3 ${isLight ? "text-slate-700" : "text-slate-200"}`}>Settings</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${isLight ? "text-slate-600" : "text-slate-400"}`}>Auto-renew</span>
                        <Toggle enabled={autoRenew} onChange={setAutoRenew} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${isLight ? "text-slate-600" : "text-slate-400"}`}>Email notifications</span>
                        <Toggle enabled={emailNotifs} onChange={setEmailNotifs} />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3">
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); showToast.info("Redirecting to service dashboard..."); }}
                      className={`text-sm font-medium flex items-center gap-1.5 transition-colors ${isLight ? "text-slate-600 hover:text-slate-900" : "text-slate-400 hover:text-slate-200"}`}
                    >
                      Manage on site
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </a>
                    <button
                      onClick={() => setCancelTarget(detailService)}
                      className="h-10 px-5 rounded-xl text-sm font-semibold transition-colors bg-red-500/10 text-red-500 hover:bg-red-500/20 w-full"
                    >
                      Cancel Service
                    </button>
                  </div>
                </>
              )}

              {/* ── Suggested service details ── */}
              {!isCurrentService(detailService) && (
                <>
                  {/* Features */}
                  <div className="mb-5">
                    <h4 className={`text-sm font-semibold mb-3 ${isLight ? "text-slate-700" : "text-slate-200"}`}>Features</h4>
                    <ul className="space-y-2">
                      {(detailService as SuggestedService).features.map((f) => (
                        <li key={f} className="flex items-center gap-2.5">
                          <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          <span className={`text-sm ${isLight ? "text-slate-600" : "text-slate-400"}`}>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => { setPurchaseTarget(detailService as SuggestedService); }}
                    className={`w-full h-11 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 text-white ${accent.button} ${accent.buttonHover}`}
                    style={{ boxShadow: accent.buttonShadow }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 4v16m8-8H4" />
                    </svg>
                    Add to Account
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          MODAL: Purchase
         ══════════════════════════════════════════════════════════════════ */}
      {purchaseTarget && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => { if (!actionLoading) setPurchaseTarget(null); }} aria-hidden="true" />
          <div
            ref={purchaseRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="purchase-modal-title"
            className={modalCardClass}
          >
            {/* Gradient strip */}
            <div className={`h-2 bg-gradient-to-r ${colorGradient(purchaseTarget.color)}`} />

            <div className="p-6">
              {/* Close */}
              <button
                onClick={() => { if (!actionLoading) setPurchaseTarget(null); }}
                aria-label="Close purchase modal"
                className={`absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isLight ? "hover:bg-slate-100 text-slate-500" : "hover:bg-slate-800 text-slate-400"}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h3 id="purchase-modal-title" className={`text-lg font-semibold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                Subscribe to {purchaseTarget.name}
              </h3>
              <p className={`text-sm mb-5 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                Choose a payment method to start your subscription.
              </p>

              {/* Payment method tabs */}
              <div className={`flex rounded-xl p-1 mb-5 ${isLight ? "bg-slate-100" : "bg-[var(--bg-elevated)]"}`}>
                {(["card", "balance", "crypto"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setPaymentMethod(m)}
                    className={`flex-1 h-9 rounded-lg text-sm font-medium transition-all capitalize ${
                      paymentMethod === m
                        ? isLight
                          ? "bg-white text-slate-800 shadow-sm"
                          : "bg-[var(--bg-primary)] text-slate-100 shadow-sm"
                        : isLight
                          ? "text-slate-500 hover:text-slate-700"
                          : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {m === "card" ? "Card" : m === "balance" ? "Balance" : "Crypto"}
                  </button>
                ))}
              </div>

              {/* Card payment — matching Add-ons style */}
              {paymentMethod === "card" && (
                <div className="space-y-2 mb-5">
                  {SAVED_CARDS.map((card) => (
                    <button key={card.id} onClick={() => setSelectedCard(card.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-left ${
                      selectedCard === card.id
                        ? isLight ? "border-emerald-500/50 bg-emerald-50" : "border-emerald-500/30 bg-emerald-500/5"
                        : isLight ? "border-slate-200 hover:border-slate-300" : "border-[var(--border-tertiary)] hover:border-[var(--border-primary)]"
                    }`}>
                      <div className={`w-10 h-7 rounded-md flex items-center justify-center text-xs font-bold text-white ${card.color}`}>{card.brand[0]}</div>
                      <div className="flex-1">
                        <span className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>{card.brand} •••• {card.last4}</span>
                        <span className={`text-xs ml-2 ${isLight ? "text-slate-400" : "text-slate-500"}`}>exp {card.expiry}</span>
                      </div>
                      {selectedCard === card.id && (
                        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Balance payment — matching Add-ons style */}
              {paymentMethod === "balance" && (
                <div className={`rounded-xl p-4 mb-5 ${isLight ? "bg-slate-50 border border-slate-200" : "bg-[var(--bg-elevated)] border border-[var(--border-tertiary)]"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>Account Balance</span>
                    <span className={`text-lg font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>$142.50</span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${isLight ? "bg-slate-200" : "bg-slate-700"}`}>
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: "71%" }} />
                  </div>
                  <p className={`text-[10px] mt-1.5 ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                    Sufficient for {Math.floor(142.50 / purchaseTarget.price)} months
                  </p>
                </div>
              )}

              {/* Crypto payment — matching Add-ons style */}
              {paymentMethod === "crypto" && (
                <div className="space-y-2 mb-5">
                  {CRYPTO_OPTIONS.map((coin) => (
                    <button key={coin.key} onClick={() => setSelectedCrypto(coin.key)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-left ${
                      selectedCrypto === coin.key
                        ? isLight ? "border-emerald-500/50 bg-emerald-50" : "border-emerald-500/30 bg-emerald-500/5"
                        : isLight ? "border-slate-200 hover:border-slate-300" : "border-[var(--border-tertiary)] hover:border-[var(--border-primary)]"
                    }`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold ${coin.color}`}>{coin.icon}</div>
                      <span className={`text-sm font-medium flex-1 ${isLight ? "text-slate-700" : "text-slate-200"}`}>{coin.name}</span>
                      {selectedCrypto === coin.key && (
                        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      )}
                    </button>
                  ))}
                  <p className={`text-[10px] ${isLight ? "text-slate-400" : "text-slate-500"}`}>You will receive a wallet address after confirming</p>
                </div>
              )}

              {/* Order summary */}
              <div className={`p-4 rounded-xl mb-5 ${isLight ? "bg-slate-50 border border-slate-200" : "bg-[var(--bg-elevated)] border border-[var(--border-tertiary)]"}`}>
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${isLight ? "text-slate-600" : "text-slate-400"}`}>{purchaseTarget.name}</span>
                  <span className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>${purchaseTarget.price}/mo</span>
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handlePurchase}
                disabled={actionLoading}
                className={`w-full h-11 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 text-white disabled:opacity-60 disabled:cursor-not-allowed ${accent.button} ${accent.buttonHover}`}
                style={{ boxShadow: accent.buttonShadow }}
              >
                {actionLoading ? (
                  <>
                    {spinner}
                    Processing...
                  </>
                ) : (
                  `Subscribe — $${purchaseTarget.price}/mo`
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          MODAL: Upgrade
         ══════════════════════════════════════════════════════════════════ */}
      {upgradeTarget && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => { if (!actionLoading) setUpgradeTarget(null); }} aria-hidden="true" />
          <div
            ref={upgradeRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="upgrade-modal-title"
            className={modalCardClass}
          >
            {/* Gradient strip */}
            <div className={`h-2 bg-gradient-to-r ${colorGradient(upgradeTarget.color)}`} />

            <div className="p-6">
              {/* Close */}
              <button
                onClick={() => { if (!actionLoading) setUpgradeTarget(null); }}
                aria-label="Close upgrade modal"
                className={`absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isLight ? "hover:bg-slate-100 text-slate-500" : "hover:bg-slate-800 text-slate-400"}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h3 id="upgrade-modal-title" className={`text-lg font-semibold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                Upgrade {upgradeTarget.name}
              </h3>
              <p className={`text-sm mb-5 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                Currently on <span className="font-medium">{upgradeTarget.plan}</span> plan at ${upgradeTarget.price}/mo
              </p>

              {/* Tiers */}
              <div className="space-y-3">
                {(UPGRADE_TIERS[upgradeTarget.name] || []).map((tier) => {
                  const isCurrent = tier.name === upgradeTarget.plan;
                  const isDowngrade = tier.price < upgradeTarget.price;
                  return (
                    <div
                      key={tier.name}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all ${
                        isCurrent
                          ? isLight
                            ? "border-slate-400 bg-slate-50"
                            : "border-[var(--border-primary)] bg-[var(--bg-elevated)]"
                          : isLight
                            ? "border-slate-200 hover:border-slate-300"
                            : "border-[var(--border-tertiary)] hover:border-[var(--border-primary)]"
                      }`}
                    >
                      <div>
                        <div className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                          {tier.name}
                          {isCurrent && (
                            <span className={`ml-2 text-xs font-medium px-2 py-0.5 rounded-md ${isLight ? "bg-slate-200 text-slate-600" : "bg-slate-700 text-slate-400"}`}>
                              Current
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">${tier.price}/mo</div>
                      </div>
                      {!isCurrent && !isDowngrade && (
                        <button
                          onClick={() => handleUpgrade(tier.name, tier.price)}
                          disabled={actionLoading}
                          className={`h-9 px-4 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 text-white disabled:opacity-60 disabled:cursor-not-allowed ${accent.button} ${accent.buttonHover}`}
                        >
                          {actionLoading ? spinner : "Upgrade"}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          MODAL: Cancel Confirmation
         ══════════════════════════════════════════════════════════════════ */}
      <ConfirmDialog
        open={!!cancelTarget}
        onClose={() => { if (!actionLoading) setCancelTarget(null); }}
        onConfirm={handleCancelConfirm}
        title={`Cancel ${cancelTarget?.name ?? ""}?`}
        message="Billing will stop at the end of your current cycle. You will retain access until then."
        confirmText="Cancel Service"
        cancelText="Keep Service"
        variant="danger"
        isLoading={actionLoading}
      />
    </AppShell>
  );
}
