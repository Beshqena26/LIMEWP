"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { showToast } from "@/lib/toast";
import { SUGGESTED_SERVICES, CURRENT_SERVICES } from "@/data/services";
import { ROUTES } from "@/config/routes";
import { Toggle } from "@/app/components/ui/Toggle";
import { ConfirmDialog } from "@/app/components/ui/ConfirmDialog";

interface AddonsTabProps {
  siteId: string;
}

interface SiteService {
  name: string;
  icon: string;
  color: string;
  description: string;
  price: number;
  enabled: boolean;
  usage?: string;
}

const COLOR_MAP: Record<string, { bg: string; text: string; ring: string; gradient: string }> = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "ring-emerald-500/20", gradient: "from-emerald-500 to-teal-600" },
  sky: { bg: "bg-sky-500/10", text: "text-sky-400", ring: "ring-sky-500/20", gradient: "from-sky-500 to-blue-600" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-400", ring: "ring-violet-500/20", gradient: "from-violet-500 to-purple-600" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", ring: "ring-amber-500/20", gradient: "from-amber-500 to-orange-600" },
  rose: { bg: "bg-rose-500/10", text: "text-rose-400", ring: "ring-rose-500/20", gradient: "from-rose-500 to-red-600" },
  cyan: { bg: "bg-cyan-500/10", text: "text-cyan-400", ring: "ring-cyan-500/20", gradient: "from-cyan-500 to-teal-600" },
  zinc: { bg: "bg-slate-500/10", text: "text-slate-400", ring: "ring-slate-500/20", gradient: "from-slate-500 to-slate-700" },
};

const ADDON_COLORS: Record<string, string> = {
  "Global CDN": "sky",
  "Premium SSL": "emerald",
  "Priority Backup": "violet",
  "Uptime Monitoring": "amber",
  "Staging Environment": "cyan",
  "Web App Firewall": "rose",
};

const USAGE_PROGRESS: Record<string, number> = {
  "Global CDN": 9,
  "Premium SSL": 40,
  "Priority Backup": 47,
  "Uptime Monitoring": 100,
  "Staging Environment": 36,
  "Web App Firewall": 46,
};

const SAVED_CARDS = [
  { id: "card-1", brand: "Visa", last4: "4242", expiry: "12/28", icon: "V" },
  { id: "card-2", brand: "Mastercard", last4: "8888", expiry: "06/27", icon: "M" },
  { id: "card-3", brand: "Amex", last4: "1234", expiry: "03/29", icon: "A" },
];

const USAGE_MAP: Record<string, string> = {
  "Global CDN": "45 GB / 500 GB bandwidth used",
  "Premium SSL": "2 certificates active, expires Jan 2027",
  "Priority Backup": "14 backups, 2.4 GB storage used",
  "Uptime Monitoring": "99.97% uptime, 185ms avg response",
  "Staging Environment": "1 environment, 1.8 GB disk used",
  "Web App Firewall": "2.3K blocked today, 45 rules active",
};

export function AddonsTab({ siteId }: AddonsTabProps) {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  const [services, setServices] = useState<SiteService[]>(() => {
    const currentNames = new Set(CURRENT_SERVICES.map((s) => s.name));
    return SUGGESTED_SERVICES.map((s) => ({
      name: s.name,
      icon: s.icon,
      color: s.color,
      description: s.description,
      price: s.price,
      enabled: currentNames.has(s.name),
      usage: USAGE_MAP[s.name],
    }));
  });

  const [purchaseTarget, setPurchaseTarget] = useState<SiteService | null>(null);
  const [disableTarget, setDisableTarget] = useState<SiteService | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "balance" | "crypto">("card");
  const [selectedCard, setSelectedCard] = useState("card-1");
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);
  const [cryptoStep, setCryptoStep] = useState<"select" | "paying" | "confirming" | "done">("select");
  const [cryptoTimer, setCryptoTimer] = useState(1800); // 30 min in seconds
  const [cryptoConfirmations, setCryptoConfirmations] = useState(0);

  const enabledCount = services.filter((s) => s.enabled).length;
  const monthlyCost = services.filter((s) => s.enabled).reduce((sum, s) => sum + s.price, 0);

  const handleToggle = useCallback((name: string, newValue: boolean) => {
    const service = services.find((s) => s.name === name);
    if (!service) return;
    if (newValue) {
      setPurchaseTarget(service);
    } else {
      setDisableTarget(service);
    }
  }, [services]);

  const handlePurchase = useCallback(async () => {
    if (!purchaseTarget) return;

    if (paymentMethod === "crypto") {
      if (!selectedCrypto) { showToast.error("Select a cryptocurrency"); return; }
      // Start crypto payment flow
      setActionLoading(true);
      await new Promise((r) => setTimeout(r, 1500));
      setActionLoading(false);
      setCryptoStep("paying");
      setCryptoTimer(1800);
      setCryptoConfirmations(0);

      // Simulate payment detection after 8 seconds
      setTimeout(() => {
        setCryptoStep("confirming");
        setCryptoConfirmations(1);
        setTimeout(() => setCryptoConfirmations(2), 2000);
        setTimeout(() => {
          setCryptoConfirmations(3);
          setCryptoStep("done");
        }, 4000);
      }, 8000);
      return;
    }

    // Card or balance payment
    setActionLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setServices((prev) => prev.map((s) => s.name === purchaseTarget.name ? { ...s, enabled: true } : s));
    setActionLoading(false);
    setPurchaseTarget(null);
    showToast.success(`${purchaseTarget.name} activated! Billed $${purchaseTarget.price}/mo.`);
  }, [purchaseTarget, paymentMethod, selectedCrypto]);

  // Crypto timer countdown
  useEffect(() => {
    if (cryptoStep !== "paying" || cryptoTimer <= 0) return;
    const interval = setInterval(() => setCryptoTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [cryptoStep, cryptoTimer]);

  // Crypto done → activate service
  useEffect(() => {
    if (cryptoStep !== "done" || !purchaseTarget) return;
    const timeout = setTimeout(() => {
      setServices((prev) => prev.map((s) => s.name === purchaseTarget.name ? { ...s, enabled: true } : s));
      setPurchaseTarget(null);
      setCryptoStep("select");
      setSelectedCrypto(null);
      showToast.success(`${purchaseTarget.name} activated! Crypto payment confirmed.`);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [cryptoStep, purchaseTarget]);

  const closePurchaseModal = useCallback(() => {
    if (cryptoStep === "paying" || cryptoStep === "confirming") return; // can't close during payment
    setPurchaseTarget(null);
    setCryptoStep("select");
    setSelectedCrypto(null);
  }, [cryptoStep]);

  const handleDisable = useCallback(async () => {
    if (!disableTarget) return;
    setActionLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setServices((prev) => prev.map((s) => s.name === disableTarget.name ? { ...s, enabled: false } : s));
    setActionLoading(false);
    setDisableTarget(null);
    showToast.success(`${disableTarget.name} disabled`);
  }, [disableTarget]);

  const cardClass = `rounded-2xl border transition-all ${isLight ? "bg-white border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"}`;

  return (
    <>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className={`text-base font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>Site Add-ons</h2>
            <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              {enabledCount} enabled on this site &bull; ${monthlyCost}/mo total
            </p>
          </div>
          <Link href={ROUTES.SERVICES} className={`h-9 px-4 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 border ${isLight ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50" : "bg-[var(--bg-secondary)] border-[var(--border-tertiary)] text-slate-300 hover:bg-[var(--bg-elevated)]"}`}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
            Browse Services
          </Link>
        </div>

        {/* Cost Summary */}
        <div className={`${cardClass} p-5 mb-5`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ring-1 ${accent.bg} ${accent.ring}`}>
                <svg className={`w-5 h-5 ${accent.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>
              </div>
              <div>
                <p className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>Monthly add-on cost for this site</p>
                <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>{enabledCount} services enabled</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${accent.text}`}>${monthlyCost}</p>
              <p className={`text-xs ${isLight ? "text-slate-400" : "text-slate-500"}`}>/month</p>
            </div>
          </div>
        </div>

        {/* Service toggles */}
        <div className="space-y-3">
          {services.map((service) => {
            const colors = COLOR_MAP[service.color] || COLOR_MAP.emerald;
            const addonColorKey = ADDON_COLORS[service.name] || service.color;
            const addonColors = COLOR_MAP[addonColorKey] || colors;
            const progress = USAGE_PROGRESS[service.name] ?? 0;
            return (
              <div key={service.name} className={`${cardClass} overflow-hidden transition-all duration-200 hover:-translate-y-px hover:shadow-md ${service.enabled ? `ring-1 ${addonColors.ring} ${isLight ? "shadow-sm" : ""}` : ""}`}>
                {service.enabled && <div className={`h-1 bg-gradient-to-r ${addonColors.gradient}`} />}
                <div className="p-5">
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${service.enabled ? `bg-gradient-to-br ${addonColors.gradient} shadow-lg ring-1 ring-white/10` : `${addonColors.bg} ring-1 ${addonColors.ring}`}`}>
                      <svg className={`w-6 h-6 ${service.enabled ? "text-white" : addonColors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={service.icon} /></svg>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className={`font-semibold text-sm ${isLight ? "text-slate-800" : "text-slate-100"}`}>{service.name}</h4>
                        {service.enabled ? (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md inline-flex items-center gap-1 ${addonColors.bg} ${addonColors.text} ring-1 ${addonColors.ring}`}>
                            <span className="relative flex h-1.5 w-1.5"><span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${addonColors.text.replace("text-", "bg-")}`} /><span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${addonColors.text.replace("text-", "bg-")}`} /></span>
                            Active
                          </span>
                        ) : (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${isLight ? "bg-slate-100 text-slate-400" : "bg-slate-800 text-slate-500"}`}>
                            Off
                          </span>
                        )}
                        <span className={`text-xs font-semibold ${isLight ? "text-slate-700" : "text-slate-200"}`}>${service.price}/mo</span>
                      </div>
                      <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>{service.description}</p>
                      {service.enabled && service.usage && (
                        <div className="mt-2">
                          <p className={`text-[11px] mb-1.5 ${addonColors.text}`}>{service.usage}</p>
                          <div className={`h-1.5 rounded-full overflow-hidden ${isLight ? "bg-slate-100" : "bg-slate-800"}`}>
                            <div className={`h-full rounded-full bg-gradient-to-r ${addonColors.gradient} transition-all duration-500`} style={{ width: `${progress}%` }} />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Toggle */}
                    <div className="flex-shrink-0">
                      <Toggle enabled={service.enabled} onChange={(val) => handleToggle(service.name, val)} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cross-links */}
        <div className={`${cardClass} p-5 mt-5`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>Need more services?</p>
              <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>Browse the full catalog or manage your billing</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href={ROUTES.SERVICES} className={`h-9 px-4 rounded-xl text-white text-xs font-semibold transition-all shadow-lg flex items-center gap-1.5 ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z" /></svg>
                Browse Services
              </Link>
              <Link href={ROUTES.BILLING} className={`h-9 px-4 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 border ${isLight ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50" : "bg-[var(--bg-secondary)] border-[var(--border-tertiary)] text-slate-300 hover:bg-[var(--bg-elevated)]"}`}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                Manage Billing
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {purchaseTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !actionLoading && closePurchaseModal()} aria-hidden="true" />
          <div className={`relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${isLight ? "bg-white border border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border border-[var(--border-tertiary)]"}`} role="dialog" aria-modal="true" aria-labelledby="purchase-title">
            {/* Gradient header */}
            <div className={`h-16 bg-gradient-to-r ${(COLOR_MAP[purchaseTarget.color] || COLOR_MAP.emerald).gradient} flex items-center px-6`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={purchaseTarget.icon} /></svg>
                </div>
                <h3 id="purchase-title" className="text-white font-bold">{purchaseTarget.name}</h3>
              </div>
            </div>

            <div className="p-6">
              <p className={`text-sm mb-5 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{purchaseTarget.description}</p>

              {/* Payment Method */}
              <div className="mb-4">
                <h4 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isLight ? "text-slate-500" : "text-slate-400"}`}>Payment Method</h4>
                <div className="flex gap-2 mb-3">
                  {([
                    { key: "card" as const, label: "Card", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
                    { key: "balance" as const, label: "Balance", icon: "M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 013 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 013 6v3" },
                    { key: "crypto" as const, label: "Crypto", icon: "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" },
                  ]).map((m) => (
                    <button key={m.key} onClick={() => setPaymentMethod(m.key)} className={`flex-1 h-10 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 border ${
                      paymentMethod === m.key
                        ? `${accent.activeBg} ${accent.text} ring-1 ${accent.ring} border-transparent`
                        : isLight ? "border-slate-200 text-slate-600 hover:bg-slate-50" : "border-[var(--border-tertiary)] text-slate-400 hover:bg-[var(--bg-elevated)]"
                    }`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d={m.icon} /></svg>
                      {m.label}
                    </button>
                  ))}
                </div>

                {/* Card Selection */}
                {paymentMethod === "card" && (
                  <div className="space-y-2">
                    {SAVED_CARDS.map((card) => (
                      <button key={card.id} onClick={() => setSelectedCard(card.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-left ${
                        selectedCard === card.id
                          ? isLight ? "border-emerald-500/50 bg-emerald-50" : "border-emerald-500/30 bg-emerald-500/5"
                          : isLight ? "border-slate-200 hover:border-slate-300" : "border-[var(--border-tertiary)] hover:border-[var(--border-primary)]"
                      }`}>
                        <div className={`w-10 h-7 rounded-md flex items-center justify-center text-xs font-bold ${
                          card.brand === "Visa" ? "bg-blue-600 text-white" : card.brand === "Mastercard" ? "bg-orange-500 text-white" : "bg-sky-500 text-white"
                        }`}>{card.icon}</div>
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

                {paymentMethod === "balance" && (
                  <div className={`rounded-xl p-4 ${isLight ? "bg-slate-50 border border-slate-200" : "bg-[var(--bg-elevated)] border border-[var(--border-tertiary)]"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>Account Balance</span>
                      <span className={`text-lg font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>$142.50</span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${isLight ? "bg-slate-200" : "bg-slate-700"}`}>
                      <div className="h-full rounded-full bg-emerald-500" style={{ width: "71%" }} />
                    </div>
                    <p className={`text-[10px] mt-1.5 ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                      {purchaseTarget && purchaseTarget.price <= 142.50
                        ? `Sufficient for ${Math.floor(142.50 / purchaseTarget.price)} months`
                        : "Insufficient balance — please top up"}
                    </p>
                  </div>
                )}

                {paymentMethod === "crypto" && cryptoStep === "select" && (
                  <div className="space-y-2">
                    {([
                      { key: "btc", name: "Bitcoin (BTC)", icon: "₿", color: "bg-orange-500", amount: purchaseTarget ? (purchaseTarget.price / 65000).toFixed(6) : "0", address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" },
                      { key: "eth", name: "Ethereum (ETH)", icon: "Ξ", color: "bg-violet-500", amount: purchaseTarget ? (purchaseTarget.price / 3200).toFixed(5) : "0", address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F" },
                      { key: "usdt", name: "USDT (TRC-20)", icon: "₮", color: "bg-emerald-500", amount: purchaseTarget ? purchaseTarget.price.toFixed(2) : "0", address: "TN2Yv5jGdP2RVbGMEBfaWEed7JE6mczZ3p" },
                    ]).map((coin) => (
                      <button key={coin.key} onClick={() => setSelectedCrypto(coin.key)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-left ${
                        selectedCrypto === coin.key
                          ? isLight ? "border-emerald-500/50 bg-emerald-50" : "border-emerald-500/30 bg-emerald-500/5"
                          : isLight ? "border-slate-200 hover:border-slate-300" : "border-[var(--border-tertiary)] hover:border-[var(--border-primary)]"
                      }`}>
                        <div className={`w-8 h-8 rounded-lg ${coin.color} flex items-center justify-center text-white text-sm font-bold`}>{coin.icon}</div>
                        <div className="flex-1">
                          <span className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>{coin.name}</span>
                          <span className={`text-xs ml-2 ${isLight ? "text-slate-400" : "text-slate-500"}`}>{coin.amount} {coin.key.toUpperCase()}</span>
                        </div>
                        {selectedCrypto === coin.key && (
                          <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {paymentMethod === "crypto" && (cryptoStep === "paying" || cryptoStep === "confirming" || cryptoStep === "done") && (() => {
                  const coins: Record<string, { name: string; icon: string; color: string; amount: string; address: string }> = {
                    btc: { name: "Bitcoin", icon: "₿", color: "bg-orange-500", amount: purchaseTarget ? (purchaseTarget.price / 65000).toFixed(6) : "0", address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" },
                    eth: { name: "Ethereum", icon: "Ξ", color: "bg-violet-500", amount: purchaseTarget ? (purchaseTarget.price / 3200).toFixed(5) : "0", address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F" },
                    usdt: { name: "USDT", icon: "₮", color: "bg-emerald-500", amount: purchaseTarget ? purchaseTarget.price.toFixed(2) : "0", address: "TN2Yv5jGdP2RVbGMEBfaWEed7JE6mczZ3p" },
                  };
                  const coin = coins[selectedCrypto || "btc"];
                  const minutes = Math.floor(cryptoTimer / 60);
                  const seconds = cryptoTimer % 60;

                  return (
                    <div className={`rounded-xl p-5 ${isLight ? "bg-slate-50 border border-slate-200" : "bg-[var(--bg-elevated)] border border-[var(--border-tertiary)]"}`}>
                      {/* Status */}
                      <div className="flex items-center justify-center gap-2 mb-4">
                        {cryptoStep === "paying" && (
                          <>
                            <svg className="w-5 h-5 animate-spin text-amber-400" fill="none" viewBox="0 0 24 24" aria-hidden="true"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                            <span className={`text-sm font-semibold text-amber-400`}>Waiting for payment...</span>
                          </>
                        )}
                        {cryptoStep === "confirming" && (
                          <>
                            <svg className="w-5 h-5 animate-spin text-sky-400" fill="none" viewBox="0 0 24 24" aria-hidden="true"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                            <span className="text-sm font-semibold text-sky-400">Confirming... ({cryptoConfirmations}/3)</span>
                          </>
                        )}
                        {cryptoStep === "done" && (
                          <>
                            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span className="text-sm font-semibold text-emerald-400">Payment confirmed!</span>
                          </>
                        )}
                      </div>

                      {/* Amount */}
                      <div className="text-center mb-4">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <div className={`w-6 h-6 rounded-md ${coin.color} flex items-center justify-center text-white text-xs font-bold`}>{coin.icon}</div>
                          <span className={`text-xl font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>{coin.amount} {(selectedCrypto || "btc").toUpperCase()}</span>
                        </div>
                        <span className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>≈ ${purchaseTarget?.price}.00 USD</span>
                      </div>

                      {/* Wallet address */}
                      {cryptoStep === "paying" && (
                        <>
                          <div className={`rounded-lg p-3 mb-3 ${isLight ? "bg-white border border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border border-[var(--border-tertiary)]"}`}>
                            <p className={`text-[10px] mb-1.5 ${isLight ? "text-slate-500" : "text-slate-400"}`}>Send exactly to this address:</p>
                            <div className="flex items-center gap-2">
                              <p className={`text-xs font-mono break-all flex-1 ${isLight ? "text-slate-700" : "text-slate-200"}`}>{coin.address}</p>
                              <button onClick={() => { navigator.clipboard.writeText(coin.address); showToast.success("Address copied"); }} aria-label="Copy address" className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center transition-colors ${isLight ? "bg-slate-100 hover:bg-slate-200 text-slate-500" : "bg-[var(--bg-elevated)] hover:bg-[var(--border-primary)] text-slate-400"}`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg>
                              </button>
                            </div>
                          </div>

                          {/* QR code placeholder */}
                          <div className={`w-32 h-32 mx-auto rounded-xl mb-3 flex items-center justify-center ${isLight ? "bg-white border border-slate-200" : "bg-white"}`}>
                            <div className="w-28 h-28 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MSA0MSI+PHBhdGggZD0iTTAgMGg3djdIMHptMSAxaDV2NUgxem0yIDJoMXYxSDN6bTEwLTJoMXYxaC0xem0yIDBoMXYzaC0xem0yIDBoMXYxaC0xem0zIDBoMXYxaC0xem0xIDBoMXYxaC0xem0yIDBoMXYxaC0xem0yIDBoMXYxaC0xem0yIDBoMXYxaC0xem0xIDBoN3Y3aC03em0xIDFoNXY1aC01em0yIDJoMXYxaC0xeiIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==')] bg-contain bg-center bg-no-repeat" />
                          </div>

                          {/* Timer */}
                          <div className="text-center">
                            <span className={`text-xs ${cryptoTimer < 300 ? "text-rose-400" : isLight ? "text-slate-500" : "text-slate-400"}`}>
                              Expires in {minutes}:{seconds.toString().padStart(2, "0")}
                            </span>
                          </div>
                        </>
                      )}

                      {/* Confirmations progress */}
                      {cryptoStep === "confirming" && (
                        <div className="space-y-2">
                          {[1, 2, 3].map((n) => (
                            <div key={n} className="flex items-center gap-2">
                              {cryptoConfirmations >= n ? (
                                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                              ) : (
                                <div className={`w-4 h-4 rounded-full border-2 ${isLight ? "border-slate-300" : "border-slate-600"}`} />
                              )}
                              <span className={`text-xs ${cryptoConfirmations >= n ? (isLight ? "text-slate-700" : "text-slate-200") : (isLight ? "text-slate-400" : "text-slate-500")}`}>
                                Confirmation {n}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {cryptoStep === "done" && (
                        <p className={`text-xs text-center ${isLight ? "text-slate-500" : "text-slate-400"}`}>Service activating...</p>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Order summary */}
              <div className={`rounded-xl p-4 mb-5 ${isLight ? "bg-slate-50 border border-slate-200" : "bg-[var(--bg-elevated)] border border-[var(--border-tertiary)]"}`}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isLight ? "text-slate-700" : "text-slate-200"}`}>{purchaseTarget.name}</span>
                    <span className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>${purchaseTarget.price}/mo</span>
                  </div>
                  <div className={`flex items-center justify-between pt-2 border-t ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
                    <span className={`text-sm ${isLight ? "text-slate-500" : "text-slate-400"}`}>Billing cycle</span>
                    <span className={`text-sm ${isLight ? "text-slate-700" : "text-slate-200"}`}>Monthly</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isLight ? "text-slate-500" : "text-slate-400"}`}>Next charge</span>
                    <span className={`text-sm ${isLight ? "text-slate-700" : "text-slate-200"}`}>Apr 25, 2026</span>
                  </div>
                </div>
              </div>

              {/* New total */}
              <div className={`rounded-xl p-4 mb-5 ${isLight ? "bg-emerald-50 border border-emerald-200" : "bg-emerald-500/10 border border-emerald-500/20"}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${isLight ? "text-emerald-700" : "text-emerald-400"}`}>New monthly total</span>
                  <span className={`text-lg font-bold ${isLight ? "text-emerald-700" : "text-emerald-400"}`}>${monthlyCost + purchaseTarget.price}/mo</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={closePurchaseModal} disabled={actionLoading || cryptoStep === "paying" || cryptoStep === "confirming"} className={`flex-1 h-10 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 ${isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"}`}>
                  Cancel
                </button>
                <button onClick={handlePurchase} disabled={actionLoading} className={`flex-1 h-10 rounded-xl text-white text-sm font-semibold transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}>
                  {actionLoading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                      Processing…
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
                      Buy — ${purchaseTarget.price}/mo
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Disable Confirm */}
      <ConfirmDialog
        open={!!disableTarget}
        onClose={() => setDisableTarget(null)}
        onConfirm={handleDisable}
        title={`Disable ${disableTarget?.name}?`}
        message={`This will deactivate ${disableTarget?.name} on this site. Billing will stop at the end of the current cycle. You can re-enable anytime.`}
        confirmText="Disable Service"
        variant="warning"
        isLoading={actionLoading}
      />
    </>
  );
}
