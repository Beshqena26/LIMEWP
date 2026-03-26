"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import AppShell from "../components/AppShell";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { BillingSkeleton } from "../components/skeletons";
import { useSimulatedLoading } from "@/hooks";
import { NoInvoices } from "../components/empty-states";
import { showToast } from "@/lib/toast";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { Toggle } from "../components/ui/Toggle";

/* ────────────────────────── Data ────────────────────────── */

const PLANS = [
  {
    name: "Starter",
    price: 29,
    description: "Perfect for personal sites and blogs",
    features: ["1 WordPress Site", "10 GB Storage", "50 GB Bandwidth", "Free SSL", "Daily Backups", "Email Support"],
    sites: 1, storage: 10, bandwidth: 50,
  },
  {
    name: "Business",
    price: 79,
    description: "For growing businesses with multiple sites",
    features: ["5 WordPress Sites", "50 GB Storage", "500 GB Bandwidth", "Free SSL & CDN", "Real-time Backups", "Priority Support", "Staging Environment"],
    sites: 5, storage: 50, bandwidth: 500,
  },
  {
    name: "Enterprise",
    price: 199,
    description: "For agencies and high-traffic websites",
    features: ["Unlimited Sites", "200 GB Storage", "Unlimited Bandwidth", "Free SSL & CDN", "Real-time Backups", "24/7 Dedicated Support", "Staging & Dev Environments", "Custom Caching Rules"],
    sites: -1, storage: 200, bandwidth: -1,
  },
];

const invoices = [
  { id: "INV-2026-003", date: "Mar 25, 2026", amount: "$79.00", status: "Upcoming", description: "Business Plan - Monthly", method: "Visa ****4242", txId: "txn_3f8a2b1c", subtotal: "$79.00", tax: "$0.00", discount: "$0.00", total: "$79.00", period: "Mar 25 - Apr 24, 2026" },
  { id: "INV-2026-002", date: "Feb 25, 2026", amount: "$79.00", status: "Paid", description: "Business Plan - Monthly", method: "Visa ****4242", txId: "txn_2e7b4a9d", subtotal: "$79.00", tax: "$0.00", discount: "$0.00", total: "$79.00", period: "Feb 25 - Mar 24, 2026" },
  { id: "INV-2026-001", date: "Jan 25, 2026", amount: "$79.00", status: "Paid", description: "Business Plan - Monthly", method: "Visa ****4242", txId: "txn_1d6c3e8f", subtotal: "$79.00", tax: "$0.00", discount: "$0.00", total: "$79.00", period: "Jan 25 - Feb 24, 2026" },
  { id: "INV-2025-012", date: "Dec 25, 2025", amount: "$79.00", status: "Paid", description: "Business Plan - Monthly", method: "Mastercard ****8888", txId: "txn_0c5d2f7a", subtotal: "$79.00", tax: "$0.00", discount: "$0.00", total: "$79.00", period: "Dec 25, 2025 - Jan 24, 2026" },
  { id: "INV-2025-011", date: "Nov 25, 2025", amount: "$79.00", status: "Paid", description: "Business Plan - Monthly", method: "Visa ****4242", txId: "txn_9b4e1c6d", subtotal: "$79.00", tax: "$0.00", discount: "$0.00", total: "$79.00", period: "Nov 25 - Dec 24, 2025" },
  { id: "INV-2025-010", date: "Oct 25, 2025", amount: "$9.00", status: "Paid", description: "Global CDN Add-on", method: "Visa ****4242", txId: "txn_8a3d0b5c", subtotal: "$9.00", tax: "$0.00", discount: "$0.00", total: "$9.00", period: "Oct 25 - Nov 24, 2025" },
  { id: "INV-2025-009", date: "Oct 25, 2025", amount: "$79.00", status: "Paid", description: "Business Plan - Monthly", method: "Visa ****4242", txId: "txn_7c2b9a4e", subtotal: "$79.00", tax: "$0.00", discount: "$0.00", total: "$79.00", period: "Oct 25 - Nov 24, 2025" },
  { id: "INV-2025-008", date: "Sep 25, 2025", amount: "$79.00", status: "Refunded", description: "Business Plan - Monthly", method: "Visa ****4242", txId: "txn_6b1a8d3c", subtotal: "$79.00", tax: "$0.00", discount: "-$79.00", total: "$0.00", period: "Sep 25 - Oct 24, 2025" },
  { id: "INV-2025-007", date: "Aug 25, 2025", amount: "$79.00", status: "Paid", description: "Business Plan - Monthly", method: "Visa ****4242", txId: "txn_5a0c7b2d", subtotal: "$79.00", tax: "$0.00", discount: "$0.00", total: "$79.00", period: "Aug 25 - Sep 24, 2025" },
  { id: "INV-2025-006", date: "Jul 25, 2025", amount: "$29.00", status: "Failed", description: "Starter Plan - Monthly", method: "Mastercard ****8888", txId: "txn_4d9b6a1c", subtotal: "$29.00", tax: "$0.00", discount: "$0.00", total: "$29.00", period: "Jul 25 - Aug 24, 2025" },
  { id: "INV-2025-005", date: "Jun 25, 2025", amount: "$29.00", status: "Paid", description: "Starter Plan - Monthly", method: "Visa ****4242", txId: "txn_3c8a5d0b", subtotal: "$29.00", tax: "$0.00", discount: "$0.00", total: "$29.00", period: "Jun 25 - Jul 24, 2025" },
  { id: "INV-2025-004", date: "May 25, 2025", amount: "$29.00", status: "Paid", description: "Starter Plan - Monthly", method: "Visa ****4242", txId: "txn_2b7c4e9a", subtotal: "$29.00", tax: "$0.00", discount: "$0.00", total: "$29.00", period: "May 25 - Jun 24, 2025" },
  { id: "INV-2025-003", date: "Apr 25, 2025", amount: "$29.00", status: "Paid", description: "Starter Plan - Monthly", method: "Visa ****4242", txId: "txn_1a6b3d8c", subtotal: "$29.00", tax: "$0.00", discount: "$0.00", total: "$29.00", period: "Apr 25 - May 24, 2025" },
  { id: "INV-2025-002", date: "Mar 25, 2025", amount: "$29.00", status: "Paid", description: "Starter Plan - Monthly", method: "Visa ****4242", txId: "txn_0c5a2b7d", subtotal: "$29.00", tax: "$0.00", discount: "$0.00", total: "$29.00", period: "Mar 25 - Apr 24, 2025" },
];

const usageItems = [
  { label: "Sites", current: 3, max: 5, icon: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" },
  { label: "Storage", current: 18.7, max: 50, unit: "GB", icon: "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" },
  { label: "Bandwidth", current: 312, max: 500, unit: "GB", icon: "M3 8l4-4m0 0l4 4m-4-4v12m14-4l-4 4m0 0l-4-4m4 4V4" },
  { label: "Backups", current: 14, max: 30, unit: "days", icon: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" },
];

interface PaymentMethod {
  id: string;
  type: string;
  brand: string;
  last4: string;
  expiry: string;
  name: string;
  isDefault: boolean;
}

const CANCEL_REASONS = [
  { value: "", label: "Select a reason..." },
  { value: "too-expensive", label: "Too expensive" },
  { value: "switching", label: "Switching to another provider" },
  { value: "not-needed", label: "No longer needed" },
  { value: "other", label: "Other" },
];

const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Netherlands", "Japan", "Singapore", "India",
];

const FUND_AMOUNTS = [25, 50, 100, 250];

const INVOICES_PER_PAGE = 5;

const CRYPTO_OPTIONS = [
  { key: "btc", name: "Bitcoin", icon: "\u20BF", color: "bg-orange-500" },
  { key: "eth", name: "Ethereum", icon: "\u039E", color: "bg-violet-500" },
  { key: "usdt", name: "USDT", icon: "\u20AE", color: "bg-emerald-500" },
];

/* ────────────────────────── Helpers ────────────────────────── */

function getProgressColor(pct: number): { bar: string; bg: string } {
  if (pct >= 80) return { bar: "bg-rose-500", bg: "bg-rose-500/10" };
  if (pct >= 50) return { bar: "bg-amber-500", bg: "bg-amber-500/10" };
  return { bar: "bg-emerald-500", bg: "bg-emerald-500/10" };
}

function getStatusBadge(status: string, isLight: boolean): { dot: string; text: string; bg: string; ring: string } {
  switch (status) {
    case "Paid": return {
      dot: "bg-emerald-500",
      text: isLight ? "text-emerald-700" : "text-emerald-400",
      bg: isLight ? "bg-emerald-50" : "bg-emerald-900/20",
      ring: isLight ? "ring-emerald-200" : "ring-emerald-700",
    };
    case "Upcoming": return {
      dot: "bg-amber-500",
      text: isLight ? "text-amber-700" : "text-amber-400",
      bg: isLight ? "bg-amber-50" : "bg-amber-900/20",
      ring: isLight ? "ring-amber-200" : "ring-amber-700",
    };
    case "Refunded": return {
      dot: "bg-rose-500",
      text: isLight ? "text-rose-700" : "text-rose-400",
      bg: isLight ? "bg-rose-50" : "bg-rose-900/20",
      ring: isLight ? "ring-rose-200" : "ring-rose-700",
    };
    case "Failed": return {
      dot: "bg-red-500",
      text: isLight ? "text-red-700" : "text-red-400",
      bg: isLight ? "bg-red-50" : "bg-red-900/20",
      ring: isLight ? "ring-red-200" : "ring-red-700",
    };
    default: return {
      dot: isLight ? "bg-slate-400" : "bg-slate-500",
      text: isLight ? "text-slate-600" : "text-slate-400",
      bg: isLight ? "bg-slate-100" : "bg-slate-800",
      ring: isLight ? "ring-slate-200" : "ring-slate-700",
    };
  }
}

function formatCard(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits;
}

function detectBrand(num: string): string {
  const d = num.replace(/\D/g, "");
  if (d.startsWith("4")) return "visa";
  if (d.startsWith("5") || d.startsWith("2")) return "mastercard";
  return "unknown";
}

/* ────────────────────────── Component ────────────────────────── */

export function BillingContent() {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);
  const { isLoading } = useSimulatedLoading(() => true);

  // ── State ──
  const [showPlans, setShowPlans] = useState(false);
  const [invoicePage, setInvoicePage] = useState(1);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: "pm1", type: "card", brand: "visa", last4: "4242", expiry: "12/27", name: "John Doe", isDefault: true },
    { id: "pm2", type: "card", brand: "mastercard", last4: "8888", expiry: "06/26", name: "John Doe", isDefault: false },
  ]);
  const [accountBalance, setAccountBalance] = useState(247.50);

  // Modals
  const [showAddCard, setShowAddCard] = useState(false);
  const [editingCard, setEditingCard] = useState<PaymentMethod | null>(null);
  const [deletingCard, setDeletingCard] = useState<PaymentMethod | null>(null);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showEditAddress, setShowEditAddress] = useState(false);
  const [showInvoiceDetail, setShowInvoiceDetail] = useState<typeof invoices[0] | null>(null);
  const [showCancelPlan, setShowCancelPlan] = useState(false);
  const [upgradeTarget, setUpgradeTarget] = useState<typeof PLANS[0] | null>(null);
  const [upgradePaymentMethod, setUpgradePaymentMethod] = useState<"card" | "balance" | "crypto">("card");
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);
  const [cryptoStep, setCryptoStep] = useState<"idle" | "paying" | "confirming" | "done">("idle");
  const [cryptoTimer, setCryptoTimer] = useState(1800);
  const [cryptoConfirmations, setCryptoConfirmations] = useState(0);

  // Cancel plan state
  const [cancelReason, setCancelReason] = useState("");
  const [cancelFeedback, setCancelFeedback] = useState("");
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);

  // Card form state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardDefault, setCardDefault] = useState(false);
  const [cardSaving, setCardSaving] = useState(false);

  // Address form state
  const [addrName, setAddrName] = useState("John Doe");
  const [addrLine1, setAddrLine1] = useState("123 Main St");
  const [addrLine2, setAddrLine2] = useState("");
  const [addrCity, setAddrCity] = useState("San Francisco");
  const [addrState, setAddrState] = useState("CA");
  const [addrPostal, setAddrPostal] = useState("94102");
  const [addrCountry, setAddrCountry] = useState("United States");
  const [addrTaxId, setAddrTaxId] = useState("");
  const [addrSaving, setAddrSaving] = useState(false);

  // Add funds state
  const [fundAmount, setFundAmount] = useState(50);
  const [customFundAmount, setCustomFundAmount] = useState("");
  const [fundCard, setFundCard] = useState("pm1");
  const [fundLoading, setFundLoading] = useState(false);

  // Settings state
  const [autoPay, setAutoPay] = useState(true);
  const [emailReceipts, setEmailReceipts] = useState(true);
  const [spendingAlert, setSpendingAlert] = useState("500");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplying, setPromoApplying] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);

  // Pagination
  const totalInvoicePages = Math.ceil(invoices.length / INVOICES_PER_PAGE);
  const paginatedInvoices = invoices.slice(
    (invoicePage - 1) * INVOICES_PER_PAGE,
    invoicePage * INVOICES_PER_PAGE
  );

  // Current plan (mock: Business)
  const currentPlan = PLANS[1];

  // ── Style classes ──
  const cardClass = `rounded-2xl border transition-all ${
    isLight ? "bg-white border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"
  }`;

  const inputClass = `w-full h-10 px-3.5 rounded-xl border text-sm transition-all outline-none ${
    isLight ? "bg-white border-slate-300 text-slate-800 focus:border-slate-400" : "bg-[var(--bg-elevated)] border-[var(--border-primary)] text-slate-200 focus:border-[var(--border-secondary)]"
  }`;

  const modalOverlayClass = "fixed inset-0 z-[100] flex items-center justify-center p-4";
  const modalBackdropClass = "absolute inset-0 bg-black/60 backdrop-blur-sm";
  const modalCardClass = `relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden ${
    isLight ? "bg-white border border-slate-200" : "bg-[var(--bg-primary)] border border-[var(--border-tertiary)]"
  }`;

  const labelClass = `block text-sm font-semibold mb-1.5 ${isLight ? "text-slate-700" : "text-slate-300"}`;
  const subText = isLight ? "text-slate-500" : "text-slate-500";
  const headingText = isLight ? "text-slate-800" : "text-slate-100";

  // ── Escape key + body scroll for custom modals ──
  const anyModalOpen = showAddCard || !!editingCard || showAddFunds || showEditAddress || !!showInvoiceDetail || showCancelPlan || !!upgradeTarget;

  useEffect(() => {
    if (!anyModalOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowAddCard(false);
        setEditingCard(null);
        setShowAddFunds(false);
        setShowEditAddress(false);
        setShowInvoiceDetail(null);
        setShowCancelPlan(false);
        setUpgradeTarget(null);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [anyModalOpen]);

  // ── Crypto timer countdown ──
  useEffect(() => {
    if (cryptoStep !== "paying" || cryptoTimer <= 0) return;
    const t = setInterval(() => setCryptoTimer((prev) => prev - 1), 1000);
    return () => clearInterval(t);
  }, [cryptoStep, cryptoTimer]);

  // ── Crypto auto-activate after 3 confirmations ──
  useEffect(() => {
    if (cryptoStep !== "done" || !upgradeTarget) return;
    const t = setTimeout(() => {
      showToast.success(`Successfully ${upgradeTarget.price > currentPlan.price ? "upgraded" : "switched"} to ${upgradeTarget.name} plan!`);
      setUpgradeTarget(null);
      setCryptoStep("idle");
      setSelectedCrypto(null);
      setCryptoTimer(1800);
      setCryptoConfirmations(0);
    }, 1500);
    return () => clearTimeout(t);
  }, [cryptoStep, upgradeTarget, currentPlan.price]);

  // ── Handlers ──
  const resetCardForm = useCallback(() => {
    setCardNumber(""); setCardName(""); setCardExpiry(""); setCardCvv(""); setCardDefault(false);
  }, []);

  const handleSaveCard = useCallback(() => {
    if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
      showToast.error("Please fill in all card fields");
      return;
    }
    setCardSaving(true);
    setTimeout(() => {
      const digits = cardNumber.replace(/\D/g, "");
      const last4 = digits.slice(-4);
      const brand = detectBrand(digits);
      if (editingCard) {
        setPaymentMethods(prev => prev.map(pm =>
          pm.id === editingCard.id ? { ...pm, last4, brand, expiry: cardExpiry, name: cardName, isDefault: cardDefault ? true : pm.isDefault } : cardDefault ? { ...pm, isDefault: false } : pm
        ));
        showToast.success("Payment method updated");
        setEditingCard(null);
      } else {
        const newCard: PaymentMethod = { id: `pm${Date.now()}`, type: "card", brand, last4, expiry: cardExpiry, name: cardName, isDefault: cardDefault };
        if (cardDefault) {
          setPaymentMethods(prev => [...prev.map(pm => ({ ...pm, isDefault: false })), newCard]);
        } else {
          setPaymentMethods(prev => [...prev, newCard]);
        }
        showToast.success("Payment method added");
        setShowAddCard(false);
      }
      resetCardForm();
      setCardSaving(false);
    }, 1200);
  }, [cardNumber, cardName, cardExpiry, cardCvv, cardDefault, editingCard, resetCardForm]);

  const handleDeleteCard = useCallback(() => {
    if (!deletingCard) return;
    setActionLoading(true);
    setTimeout(() => {
      setPaymentMethods(prev => prev.filter(pm => pm.id !== deletingCard.id));
      showToast.success("Payment method removed");
      setDeletingCard(null);
      setActionLoading(false);
    }, 800);
  }, [deletingCard]);

  const handleSetDefault = useCallback((id: string) => {
    setPaymentMethods(prev => prev.map(pm => ({ ...pm, isDefault: pm.id === id })));
    showToast.success("Default payment method updated");
  }, []);

  const handleAddFunds = useCallback(() => {
    const amount = customFundAmount ? parseFloat(customFundAmount) : fundAmount;
    if (!amount || amount <= 0) { showToast.error("Enter a valid amount"); return; }
    setFundLoading(true);
    setTimeout(() => {
      setAccountBalance(prev => prev + amount);
      showToast.success(`$${amount.toFixed(2)} added to your balance`);
      setShowAddFunds(false);
      setCustomFundAmount("");
      setFundLoading(false);
    }, 1200);
  }, [fundAmount, customFundAmount]);

  const handleSaveAddress = useCallback(() => {
    setAddrSaving(true);
    setTimeout(() => {
      showToast.success("Billing address updated");
      setShowEditAddress(false);
      setAddrSaving(false);
    }, 800);
  }, []);

  const handleCancelPlan = useCallback(() => {
    if (!cancelReason) { showToast.error("Please select a reason"); return; }
    setCancelConfirmOpen(true);
  }, [cancelReason]);

  const handleCancelConfirm = useCallback(() => {
    setActionLoading(true);
    setTimeout(() => {
      showToast.warning("Your plan will be cancelled at the end of the current billing cycle");
      setCancelConfirmOpen(false);
      setShowCancelPlan(false);
      setCancelReason("");
      setCancelFeedback("");
      setActionLoading(false);
    }, 1500);
  }, []);

  const handleUpgrade = useCallback(() => {
    if (!upgradeTarget) return;

    // Crypto flow
    if (upgradePaymentMethod === "crypto" && upgradeTarget.price > currentPlan.price) {
      if (!selectedCrypto) { showToast.error("Select a cryptocurrency"); return; }
      if (cryptoStep === "idle") {
        setCryptoStep("paying");
        setCryptoTimer(1800);
        // Simulate payment detection after 4s
        setTimeout(() => {
          setCryptoStep("confirming");
          setCryptoConfirmations(0);
          // Simulate 3 confirmations
          setTimeout(() => setCryptoConfirmations(1), 1500);
          setTimeout(() => setCryptoConfirmations(2), 3000);
          setTimeout(() => { setCryptoConfirmations(3); setCryptoStep("done"); }, 4500);
        }, 4000);
        return;
      }
      return;
    }

    setActionLoading(true);
    setTimeout(() => {
      const isDowngrade = upgradeTarget.price < currentPlan.price;
      if (isDowngrade) {
        showToast.info(`Downgrade to ${upgradeTarget.name} will take effect at the end of your billing cycle`);
      } else {
        showToast.success(`Upgraded to ${upgradeTarget.name}! You'll be charged the pro-rated difference.`);
      }
      setUpgradeTarget(null);
      setUpgradePaymentMethod("card");
      setActionLoading(false);
    }, 1500);
  }, [upgradeTarget, currentPlan, upgradePaymentMethod, selectedCrypto, cryptoStep]);

  const handleApplyPromo = useCallback(() => {
    if (!promoCode.trim()) { showToast.error("Enter a promo code"); return; }
    setPromoApplying(true);
    setTimeout(() => {
      showToast.success("Promo code applied! You saved $15.80 on your next invoice.");
      setPromoCode("");
      setPromoApplying(false);
    }, 1000);
  }, [promoCode]);

  const openEditCard = useCallback((pm: PaymentMethod) => {
    setCardNumber(`•••• •••• •••• ${pm.last4}`);
    setCardName(pm.name);
    setCardExpiry(pm.expiry);
    setCardCvv("");
    setCardDefault(pm.isDefault);
    setEditingCard(pm);
  }, []);

  // ── Brand icons ──
  const brandIcon = (brand: string, size = "w-8 h-5") => {
    if (brand === "visa") {
      return (
        <div className={`${size} rounded bg-blue-600 flex items-center justify-center`}>
          <span className="text-white text-[9px] font-extrabold tracking-wider">VISA</span>
        </div>
      );
    }
    if (brand === "mastercard") {
      return (
        <div className={`${size} rounded bg-slate-900 flex items-center justify-center gap-px`}>
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 opacity-90" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 opacity-90 -ml-1" />
        </div>
      );
    }
    return (
      <div className={`${size} rounded bg-slate-600 flex items-center justify-center`}>
        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>
      </div>
    );
  };

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0 mb-8">
        <div>
          <h1 className={`text-2xl font-bold mb-1 ${headingText}`}>Billing</h1>
          <p className={`text-sm ${subText}`}>Manage your subscription, payment methods, and invoices</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => showToast.success("Invoices exported as CSV")}
            className={`h-10 px-4 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              isLight ? "bg-slate-100 text-slate-700 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-200 hover:bg-[var(--border-primary)]"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export
          </button>
        </div>
      </div>

      {isLoading ? (
        <BillingSkeleton />
      ) : (
      <>
      {/* ═══════════════ 1. CURRENT PLAN CARD ═══════════════ */}
      <div className={`mb-8 group relative overflow-hidden ${cardClass} hover:-translate-y-px hover:shadow-lg`}>
        {/* Accent gradient stripe */}
        <div className={`h-1 bg-gradient-to-r ${accent.gradient}`} />

        <div className="relative p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className={`text-xl font-bold ${headingText}`}>{currentPlan.name} Plan</h2>
                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ring-1 ${accent.bg} ${accent.ring}`}>
                  <span className="relative flex h-2 w-2">
                    <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${accent.progress}`} />
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${accent.progress}`} />
                  </span>
                  <span className={`text-[11px] font-semibold ${accent.text}`}>Active</span>
                </span>
              </div>
              <p className={`text-sm ${subText}`}>{currentPlan.description}</p>
            </div>
            <div className="text-right">
              <div className="flex items-baseline gap-1 mb-1">
                <span className={`text-3xl font-bold ${headingText}`}>${currentPlan.price}</span>
                <span className={`text-sm ${subText}`}>/month</span>
              </div>
              <p className={`text-xs ${subText}`}>Billed monthly</p>
            </div>
          </div>

          {/* Usage Stats with colored progress bars */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {usageItems.map((item) => {
              const percentage = (item.current / item.max) * 100;
              const colors = getProgressColor(percentage);
              return (
                <div key={item.label} className={`rounded-xl p-4 border ${
                  isLight ? "bg-slate-50 border-slate-200" : "bg-[var(--bg-primary)]/50 border-[var(--border-tertiary)]"
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-8 h-8 rounded-lg ring-1 flex items-center justify-center ${colors.bg} ${
                      isLight ? "ring-slate-200" : "ring-[var(--border-tertiary)]"
                    }`}>
                      <svg className={`w-4 h-4 ${percentage >= 80 ? "text-rose-500" : percentage >= 50 ? "text-amber-500" : "text-emerald-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d={item.icon} />
                      </svg>
                    </div>
                    <span className={`text-xs font-medium ${isLight ? "text-slate-600" : "text-slate-400"}`}>{item.label}</span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className={`text-lg font-bold ${headingText}`}>{item.current}</span>
                    <span className={`text-xs ${subText}`}>/ {item.max} {item.unit || ""}</span>
                  </div>
                  <div className={`h-1.5 rounded-full overflow-hidden ${isLight ? "bg-slate-200" : "bg-[var(--bg-elevated)]"}`}>
                    <div className={`h-full rounded-full transition-all ${colors.bar}`} style={{ width: `${Math.min(percentage, 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Next Billing */}
          <div className={`mt-5 pt-5 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ring-1 flex items-center justify-center ${
                isLight ? "bg-slate-100 text-slate-600 ring-slate-200" : "bg-slate-800 text-slate-400 ring-slate-700"
              }`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <div>
                <p className={`text-xs ${subText}`}>Next billing date</p>
                <p className={`text-sm font-semibold ${isLight ? "text-slate-700" : "text-slate-200"}`}>April 25, 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowCancelPlan(true)} className={`text-sm font-medium transition-colors px-4 py-2 rounded-xl ${
                isLight ? "text-slate-500 hover:text-red-600 hover:bg-red-50" : "text-slate-400 hover:text-red-400 hover:bg-red-500/10"
              }`}>
                Cancel Plan
              </button>
              <button onClick={() => setShowPlans(!showPlans)} className={`h-10 px-5 rounded-xl text-white text-sm font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-px flex items-center gap-2 ${accent.button} ${accent.buttonHover} ${accent.buttonShadow}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                </svg>
                {showPlans ? "Hide Plans" : "Upgrade Plan"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════ 2. PLAN COMPARISON ═══════════════ */}
      {showPlans && (
        <div className="mb-8">
          <h2 className={`text-base font-semibold mb-5 ${headingText}`}>Compare Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLANS.map((plan) => {
              const isCurrent = plan.name === currentPlan.name;
              return (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl border p-6 transition-all hover:-translate-y-px ${
                    isCurrent
                      ? `ring-2 shadow-lg ${isLight ? "bg-white border-transparent" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-transparent"}`
                      : isLight
                        ? "bg-white border-slate-200 hover:border-slate-300 hover:shadow-md"
                        : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)] hover:border-[var(--border-primary)] hover:shadow-md"
                  }`}
                  style={isCurrent ? { borderImage: `linear-gradient(135deg, var(--accent-start, ${accentColor === "emerald" ? "#10b981" : accentColor === "sky" ? "#0ea5e9" : accentColor === "violet" ? "#8b5cf6" : accentColor === "amber" ? "#f59e0b" : accentColor === "pink" ? "#f43f5e" : "#10b981"}), var(--accent-end, ${accentColor === "emerald" ? "#059669" : accentColor === "sky" ? "#0284c7" : accentColor === "violet" ? "#7c3aed" : accentColor === "amber" ? "#d97706" : accentColor === "pink" ? "#e11d48" : "#059669"})) 1` } : undefined}
                >
                  {isCurrent && (
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white ${accent.button}`}>
                      Current Plan
                    </div>
                  )}
                  <div className="text-center mb-5">
                    <h3 className={`text-lg font-bold mb-1 ${headingText}`}>{plan.name}</h3>
                    <p className={`text-xs mb-4 ${subText}`}>{plan.description}</p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className={`text-4xl font-bold ${headingText}`}>${plan.price}</span>
                      <span className={`text-sm ${subText}`}>/month</span>
                    </div>
                  </div>
                  <ul className="space-y-2.5 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5">
                        <svg className={`w-4 h-4 flex-shrink-0 ${isCurrent ? accent.text : "text-emerald-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        <span className={`text-sm ${isLight ? "text-slate-600" : "text-slate-400"}`}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => { if (!isCurrent) setUpgradeTarget(plan); }}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isCurrent
                        ? isLight ? "bg-slate-100 text-slate-400 cursor-default" : "bg-slate-800 text-slate-500 cursor-default"
                        : `text-white shadow-lg hover:shadow-xl hover:-translate-y-px ${accent.button} ${accent.buttonHover}`
                    }`}
                  >
                    {isCurrent ? "Current Plan" : plan.price > currentPlan.price ? "Upgrade" : "Downgrade"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════════════ 3. PAYMENT METHODS ═══════════════ */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-5">
          <h2 className={`text-base font-semibold ${headingText}`}>Payment Methods</h2>
          <button
            onClick={() => { resetCardForm(); setShowAddCard(true); }}
            className={`h-9 px-4 rounded-xl text-white text-sm font-semibold transition-all flex items-center gap-2 ${accent.button} ${accent.buttonHover}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Add Method
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Credit Cards */}
          {paymentMethods.map((pm) => (
            <div key={pm.id} className={`group relative rounded-2xl p-5 transition-all hover:-translate-y-px ${cardClass}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {brandIcon(pm.brand)}
                  <div>
                    <span className={`font-semibold block text-sm capitalize ${headingText}`}>{pm.brand}</span>
                    <span className={`text-xs ${subText}`}>Expires {pm.expiry}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {pm.isDefault && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${accent.bg} ${accent.text} ring-1 ${accent.ring}`}>
                      Default
                    </span>
                  )}
                </div>
              </div>
              <p className={`text-sm font-mono mb-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; {pm.last4}
              </p>
              <p className={`text-xs ${subText}`}>{pm.name}</p>

              {/* Hover actions */}
              <div className={`absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
                {!pm.isDefault && (
                  <button
                    onClick={() => handleSetDefault(pm.id)}
                    aria-label="Set as default"
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                      isLight ? "hover:bg-slate-100 text-slate-400 hover:text-slate-700" : "hover:bg-[var(--bg-elevated)] text-slate-500 hover:text-slate-200"
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
                  </button>
                )}
                <button
                  onClick={() => openEditCard(pm)}
                  aria-label="Edit card"
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                    isLight ? "hover:bg-slate-100 text-slate-400 hover:text-slate-700" : "hover:bg-[var(--bg-elevated)] text-slate-500 hover:text-slate-200"
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" /></svg>
                </button>
                <button
                  onClick={() => setDeletingCard(pm)}
                  aria-label="Delete card"
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                    isLight ? "hover:bg-red-50 text-slate-400 hover:text-red-600" : "hover:bg-red-500/10 text-slate-500 hover:text-red-400"
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                </button>
              </div>
            </div>
          ))}

          {/* Account Balance */}
          <div className={`rounded-2xl p-5 transition-all hover:-translate-y-px ${cardClass}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-500/10`}>
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" /></svg>
                </div>
                <span className={`font-semibold text-sm ${headingText}`}>Account Balance</span>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <span className={`text-2xl font-bold ${headingText}`}>${accountBalance.toFixed(2)}</span>
                <p className={`text-xs mt-0.5 ${subText}`}>Available credits</p>
              </div>
              <button
                onClick={() => setShowAddFunds(true)}
                className={`h-9 px-4 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  isLight ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Add Funds
              </button>
            </div>
          </div>

          {/* Cryptocurrency */}
          <div className={`rounded-2xl p-5 transition-all hover:-translate-y-px ${cardClass}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-violet-500/10`}>
                  <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" /></svg>
                </div>
                <span className={`font-semibold text-sm ${headingText}`}>Cryptocurrency</span>
              </div>
            </div>
            <p className={`text-xs mb-3 ${subText}`}>Pay with crypto during plan changes</p>
            <div className="flex gap-2">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-orange-500/10 text-orange-500 ring-1 ring-orange-500/20">BTC</span>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20">ETH</span>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20">USDT</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════ 4. BILLING ADDRESS ═══════════════ */}
      <div className={`mb-8 ${cardClass} p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-base font-semibold ${headingText}`}>Billing Address</h2>
          <button
            onClick={() => setShowEditAddress(true)}
            className={`h-9 px-4 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              isLight ? "bg-slate-100 text-slate-700 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-200 hover:bg-[var(--border-primary)]"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" /></svg>
            Edit
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
          <div>
            <p className={`text-xs ${subText}`}>Name</p>
            <p className={`text-sm font-medium ${headingText}`}>{addrName}</p>
          </div>
          <div>
            <p className={`text-xs ${subText}`}>Address</p>
            <p className={`text-sm font-medium ${headingText}`}>{addrLine1}{addrLine2 ? `, ${addrLine2}` : ""}</p>
          </div>
          <div>
            <p className={`text-xs ${subText}`}>City / State</p>
            <p className={`text-sm font-medium ${headingText}`}>{addrCity}, {addrState} {addrPostal}</p>
          </div>
          <div>
            <p className={`text-xs ${subText}`}>Country</p>
            <p className={`text-sm font-medium ${headingText}`}>{addrCountry}</p>
          </div>
          {addrTaxId && (
            <div>
              <p className={`text-xs ${subText}`}>Tax ID / VAT</p>
              <p className={`text-sm font-medium ${headingText}`}>{addrTaxId}</p>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════ 5. INVOICE TABLE ═══════════════ */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-5">
          <h2 className={`text-base font-semibold ${headingText}`}>Invoices</h2>
        </div>

        <div className={`rounded-2xl border overflow-hidden ${
          isLight ? "bg-white border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"
        }`}>
          {invoices.length === 0 ? (
            <NoInvoices />
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isLight ? "bg-slate-50 border-slate-200" : "bg-[var(--bg-primary)]/80 border-[var(--border-tertiary)]"}`}>
                  {["Invoice", "Description", "Date", "Amount", "Status", "Actions"].map((h) => (
                    <th key={h} className={`text-[11px] font-semibold uppercase tracking-wider py-4 px-5 text-left ${subText}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedInvoices.map((inv) => {
                  const badge = getStatusBadge(inv.status, isLight);
                  return (
                    <tr key={inv.id} className={`border-b last:border-b-0 transition-colors ${
                      isLight ? "hover:bg-slate-50 border-slate-100" : "hover:bg-[var(--bg-elevated)]/30 border-[var(--border-tertiary)]"
                    }`}>
                      <td className="py-4 px-5">
                        <span className={`font-mono font-medium text-xs ${isLight ? "text-slate-700" : "text-slate-200"}`}>{inv.id}</span>
                      </td>
                      <td className={`py-4 px-5 text-sm ${isLight ? "text-slate-600" : "text-slate-400"}`}>{inv.description}</td>
                      <td className={`py-4 px-5 text-sm ${subText}`}>{inv.date}</td>
                      <td className={`py-4 px-5 text-sm font-semibold ${headingText}`}>{inv.amount}</td>
                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ring-1 ring-inset ${badge.bg} ${badge.ring}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          <span className={`text-[11px] font-semibold ${badge.text}`}>{inv.status}</span>
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setShowInvoiceDetail(inv)}
                            aria-label="View invoice"
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                              isLight ? "bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700" : "bg-[var(--bg-elevated)]/50 hover:bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          </button>
                          <button
                            onClick={() => showToast.success(`Downloaded ${inv.id}.pdf`)}
                            aria-label="Download invoice"
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                              isLight ? "bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700" : "bg-[var(--bg-elevated)]/50 hover:bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          )}

          {/* Pagination */}
          {invoices.length > INVOICES_PER_PAGE && (
            <div className={`flex items-center justify-between px-6 py-4 border-t ${
              isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"
            }`}>
              <p className={`text-xs ${subText}`}>
                Showing {(invoicePage - 1) * INVOICES_PER_PAGE + 1}&ndash;{Math.min(invoicePage * INVOICES_PER_PAGE, invoices.length)} of {invoices.length} invoices
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setInvoicePage(Math.max(1, invoicePage - 1))}
                  disabled={invoicePage === 1}
                  aria-label="Previous page"
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                    isLight ? "hover:bg-slate-100 text-slate-500" : "hover:bg-[var(--bg-elevated)] text-slate-400"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                </button>
                {Array.from({ length: totalInvoicePages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setInvoicePage(page)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                      page === invoicePage
                        ? `text-white ${accent.button}`
                        : isLight ? "text-slate-600 hover:bg-slate-100" : "text-slate-400 hover:bg-[var(--bg-elevated)]"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setInvoicePage(Math.min(totalInvoicePages, invoicePage + 1))}
                  disabled={invoicePage === totalInvoicePages}
                  aria-label="Next page"
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                    isLight ? "hover:bg-slate-100 text-slate-500" : "hover:bg-[var(--bg-elevated)] text-slate-400"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════ 6. SETTINGS ROW ═══════════════ */}
      <div className={`mb-8 ${cardClass} p-6`}>
        <h2 className={`text-base font-semibold mb-5 ${headingText}`}>Billing Settings</h2>
        <div className="space-y-5">
          {/* Auto-pay */}
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${headingText}`}>Auto-pay</p>
              <p className={`text-xs ${subText}`}>Automatically charge your default payment method when invoices are due</p>
            </div>
            <Toggle enabled={autoPay} onChange={(v) => { setAutoPay(v); showToast.success(v ? "Auto-pay enabled" : "Auto-pay disabled"); }} />
          </div>

          <div className={`border-t ${isLight ? "border-slate-100" : "border-[var(--border-tertiary)]"}`} />

          {/* Email receipts */}
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${headingText}`}>Email receipts</p>
              <p className={`text-xs ${subText}`}>Receive invoices and payment receipts via email</p>
            </div>
            <Toggle enabled={emailReceipts} onChange={(v) => { setEmailReceipts(v); showToast.success(v ? "Email receipts enabled" : "Email receipts disabled"); }} />
          </div>

          <div className={`border-t ${isLight ? "border-slate-100" : "border-[var(--border-tertiary)]"}`} />

          {/* Spending alert */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className={`text-sm font-medium ${headingText}`}>Spending alert threshold</p>
              <p className={`text-xs ${subText}`}>Get notified when monthly spend exceeds this amount</p>
            </div>
            <div className="relative w-28 flex-shrink-0">
              <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium ${subText}`}>$</span>
              <input
                type="number"
                value={spendingAlert}
                onChange={(e) => setSpendingAlert(e.target.value)}
                onBlur={() => showToast.success(`Spending alert set to $${spendingAlert}`)}
                className={`${inputClass} pl-7 text-right`}
              />
            </div>
          </div>

          <div className={`border-t ${isLight ? "border-slate-100" : "border-[var(--border-tertiary)]"}`} />

          {/* Promo code */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className={`text-sm font-medium ${headingText}`}>Promo code</p>
              <p className={`text-xs ${subText}`}>Have a discount code? Apply it here</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <input
                type="text"
                placeholder="Enter code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                className={`${inputClass} w-32`}
              />
              <button
                onClick={handleApplyPromo}
                disabled={promoApplying}
                className={`h-10 px-4 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60 ${accent.button} ${accent.buttonHover}`}
              >
                {promoApplying ? "..." : "Apply"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════ 7. BILLING SUPPORT BANNER ═══════════════ */}
      <div className={`group relative overflow-hidden ${cardClass} hover:-translate-y-px hover:shadow-md`}>
        {/* Subtle accent gradient at bottom */}
        <div className="relative px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${accent.bg}`}>
              <svg className={`w-6 h-6 ${accent.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <h3 className={`text-sm font-semibold mb-0.5 ${headingText}`}>Need help with billing?</h3>
              <p className={`text-xs ${subText}`}>Our support team is available 24/7 to assist with any billing questions or issues.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button onClick={() => showToast.info("Opening FAQ...")} className={`text-sm font-medium transition-colors px-4 py-2 ${
              isLight ? "text-slate-500 hover:text-slate-700" : "text-slate-400 hover:text-slate-200"
            }`}>
              View FAQ
            </button>
            <button onClick={() => showToast.info("Opening support chat...")} className={`h-10 px-5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 border ${
              isLight ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200" : "bg-[var(--bg-elevated)] hover:bg-[var(--border-primary)] text-slate-200 border-[var(--border-primary)]"
            }`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>
              Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/*                        MODALS                             */}
      {/* ═══════════════════════════════════════════════════════════ */}

      {/* ── Add / Edit Card Modal ── */}
      {(showAddCard || editingCard) && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => { setShowAddCard(false); setEditingCard(null); resetCardForm(); }} aria-hidden="true" />
          <div className={modalCardClass}>
            <div className={`p-6 border-b ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
              <h3 className={`text-lg font-semibold ${headingText}`}>{editingCard ? "Edit Payment Method" : "Add Payment Method"}</h3>
              <p className={`text-sm mt-1 ${subText}`}>Enter your credit or debit card details</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={labelClass}>Card number</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCard(e.target.value))}
                    maxLength={19}
                    className={inputClass}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {brandIcon(detectBrand(cardNumber), "w-7 h-4")}
                  </div>
                </div>
              </div>
              <div>
                <label className={labelClass}>Cardholder name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                    maxLength={5}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>CVV</label>
                  <input
                    type="password"
                    placeholder="•••"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    maxLength={4}
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id="card-default"
                  checked={cardDefault}
                  onChange={(e) => setCardDefault(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500/20"
                />
                <label htmlFor="card-default" className={`text-sm ${isLight ? "text-slate-600" : "text-slate-400"}`}>Set as default payment method</label>
              </div>
            </div>
            <div className={`p-6 border-t flex justify-end gap-3 ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
              <button
                onClick={() => { setShowAddCard(false); setEditingCard(null); resetCardForm(); }}
                className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${
                  isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
                }`}
              >Cancel</button>
              <button
                onClick={handleSaveCard}
                disabled={cardSaving}
                className={`h-10 px-5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60 flex items-center gap-2 ${accent.button} ${accent.buttonHover}`}
              >
                {cardSaving && (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                )}
                {cardSaving ? "Saving..." : editingCard ? "Update Card" : "Add Card"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Card ConfirmDialog ── */}
      <ConfirmDialog
        open={!!deletingCard}
        onClose={() => setDeletingCard(null)}
        onConfirm={handleDeleteCard}
        title="Remove Payment Method"
        message={`Are you sure you want to remove the ${deletingCard?.brand} card ending in ${deletingCard?.last4}? This action cannot be undone.`}
        confirmText="Remove Card"
        variant="danger"
        isLoading={actionLoading}
      />

      {/* ── Add Funds Modal ── */}
      {showAddFunds && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => setShowAddFunds(false)} aria-hidden="true" />
          <div className={modalCardClass}>
            <div className={`p-6 border-b ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
              <h3 className={`text-lg font-semibold ${headingText}`}>Add Funds</h3>
              <p className={`text-sm mt-1 ${subText}`}>Add credits to your account balance</p>
            </div>
            <div className="p-6 space-y-5">
              {/* Preset amounts */}
              <div>
                <label className={labelClass}>Select amount</label>
                <div className="grid grid-cols-4 gap-3">
                  {FUND_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => { setFundAmount(amt); setCustomFundAmount(""); }}
                      className={`h-11 rounded-xl text-sm font-semibold transition-all ${
                        fundAmount === amt && !customFundAmount
                          ? `text-white ${accent.button}`
                          : isLight
                            ? "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                            : "bg-[var(--bg-elevated)] text-slate-300 hover:bg-[var(--border-primary)] border border-[var(--border-tertiary)]"
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>
              {/* Custom amount */}
              <div>
                <label className={labelClass}>Or enter custom amount</label>
                <div className="relative">
                  <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium ${subText}`}>$</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={customFundAmount}
                    onChange={(e) => setCustomFundAmount(e.target.value)}
                    className={`${inputClass} pl-7`}
                  />
                </div>
              </div>
              {/* Select card */}
              <div>
                <label className={labelClass}>Pay with</label>
                <div className="space-y-2">
                  {paymentMethods.map((pm) => (
                    <button
                      key={pm.id}
                      onClick={() => setFundCard(pm.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        fundCard === pm.id
                          ? isLight ? "border-slate-400 bg-slate-50" : "border-slate-500 bg-[var(--bg-elevated)]"
                          : isLight ? "border-slate-200 hover:border-slate-300" : "border-[var(--border-tertiary)] hover:border-[var(--border-primary)]"
                      }`}
                    >
                      {brandIcon(pm.brand)}
                      <span className={`text-sm font-medium ${headingText}`}>{pm.brand.charAt(0).toUpperCase() + pm.brand.slice(1)} ending in {pm.last4}</span>
                      {fundCard === pm.id && (
                        <svg className={`w-4 h-4 ml-auto ${accent.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className={`p-6 border-t flex justify-end gap-3 ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
              <button onClick={() => setShowAddFunds(false)} className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${
                isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
              }`}>Cancel</button>
              <button onClick={handleAddFunds} disabled={fundLoading} className={`h-10 px-5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60 flex items-center gap-2 ${accent.button} ${accent.buttonHover}`}>
                {fundLoading && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>}
                {fundLoading ? "Processing..." : `Add $${customFundAmount || fundAmount}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Billing Address Modal ── */}
      {showEditAddress && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => setShowEditAddress(false)} aria-hidden="true" />
          <div className={`${modalCardClass} max-w-xl`}>
            <div className={`p-6 border-b ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
              <h3 className={`text-lg font-semibold ${headingText}`}>Edit Billing Address</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={labelClass}>Full name</label>
                <input type="text" value={addrName} onChange={(e) => setAddrName(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Address line 1</label>
                <input type="text" value={addrLine1} onChange={(e) => setAddrLine1(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Address line 2 (optional)</label>
                <input type="text" value={addrLine2} onChange={(e) => setAddrLine2(e.target.value)} placeholder="Apt, suite, etc." className={inputClass} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>City</label>
                  <input type="text" value={addrCity} onChange={(e) => setAddrCity(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>State / Region</label>
                  <input type="text" value={addrState} onChange={(e) => setAddrState(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Postal code</label>
                  <input type="text" value={addrPostal} onChange={(e) => setAddrPostal(e.target.value)} className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Country</label>
                <select value={addrCountry} onChange={(e) => setAddrCountry(e.target.value)} className={inputClass}>
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Tax ID / VAT number (optional)</label>
                <input type="text" value={addrTaxId} onChange={(e) => setAddrTaxId(e.target.value)} placeholder="e.g. EU123456789" className={inputClass} />
              </div>
            </div>
            <div className={`p-6 border-t flex justify-end gap-3 ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
              <button onClick={() => setShowEditAddress(false)} className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${
                isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
              }`}>Cancel</button>
              <button onClick={handleSaveAddress} disabled={addrSaving} className={`h-10 px-5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60 flex items-center gap-2 ${accent.button} ${accent.buttonHover}`}>
                {addrSaving && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>}
                {addrSaving ? "Saving..." : "Save Address"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Invoice Detail Modal ── */}
      {showInvoiceDetail && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => setShowInvoiceDetail(null)} aria-hidden="true" />
          <div className={modalCardClass}>
            <div className={`p-6 border-b ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-lg font-semibold ${headingText}`}>Invoice {showInvoiceDetail.id}</h3>
                  <p className={`text-sm mt-0.5 ${subText}`}>{showInvoiceDetail.date}</p>
                </div>
                {(() => {
                  const badge = getStatusBadge(showInvoiceDetail.status, isLight);
                  return (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ring-1 ring-inset ${badge.bg} ${badge.ring}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                      <span className={`text-xs font-semibold ${badge.text}`}>{showInvoiceDetail.status}</span>
                    </span>
                  );
                })()}
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className={`rounded-xl p-4 border ${isLight ? "bg-slate-50 border-slate-200" : "bg-[var(--bg-elevated)] border-[var(--border-tertiary)]"}`}>
                <p className={`text-xs font-medium mb-1 ${subText}`}>Plan</p>
                <p className={`text-sm font-semibold ${headingText}`}>{showInvoiceDetail.description}</p>
                <p className={`text-xs mt-1 ${subText}`}>Period: {showInvoiceDetail.period}</p>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Subtotal", value: showInvoiceDetail.subtotal },
                  { label: "Tax", value: showInvoiceDetail.tax },
                  { label: "Discount", value: showInvoiceDetail.discount },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between">
                    <span className={`text-sm ${subText}`}>{row.label}</span>
                    <span className={`text-sm ${headingText}`}>{row.value}</span>
                  </div>
                ))}
                <div className={`border-t pt-2 flex justify-between ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
                  <span className={`text-sm font-semibold ${headingText}`}>Total</span>
                  <span className={`text-sm font-bold ${headingText}`}>{showInvoiceDetail.total}</span>
                </div>
              </div>
              <div className={`rounded-xl p-4 border space-y-2 ${isLight ? "bg-slate-50 border-slate-200" : "bg-[var(--bg-elevated)] border-[var(--border-tertiary)]"}`}>
                <div className="flex justify-between">
                  <span className={`text-xs ${subText}`}>Payment method</span>
                  <span className={`text-xs font-medium ${headingText}`}>{showInvoiceDetail.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-xs ${subText}`}>Transaction ID</span>
                  <span className={`text-xs font-mono ${headingText}`}>{showInvoiceDetail.txId}</span>
                </div>
              </div>
            </div>
            <div className={`p-6 border-t flex justify-end gap-3 ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
              <button onClick={() => setShowInvoiceDetail(null)} className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${
                isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
              }`}>Close</button>
              <button onClick={() => { showToast.success(`Downloaded ${showInvoiceDetail.id}.pdf`); }} className={`h-10 px-5 rounded-xl text-sm font-semibold text-white transition-all flex items-center gap-2 ${accent.button} ${accent.buttonHover}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Cancel Plan Modal ── */}
      {showCancelPlan && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => setShowCancelPlan(false)} aria-hidden="true" />
          <div className={modalCardClass}>
            <div className={`p-6 border-b ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${headingText}`}>Cancel Plan</h3>
                  <p className={`text-sm ${subText}`}>Your {currentPlan.name} plan (${ currentPlan.price}/mo)</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className={`rounded-xl p-4 border ${isLight ? "bg-amber-50 border-amber-200" : "bg-amber-900/10 border-amber-700/30"}`}>
                <p className={`text-sm ${isLight ? "text-amber-800" : "text-amber-300"}`}>
                  Your plan will remain active until the end of your current billing cycle (April 25, 2026). You will not be charged again.
                </p>
              </div>
              <div>
                <label className={labelClass}>Why are you cancelling?</label>
                <select value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} className={inputClass}>
                  {CANCEL_REASONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Additional feedback (optional)</label>
                <textarea
                  value={cancelFeedback}
                  onChange={(e) => setCancelFeedback(e.target.value)}
                  placeholder="Help us improve..."
                  rows={3}
                  className={`${inputClass} h-auto py-2.5`}
                />
              </div>
            </div>
            <div className={`p-6 border-t flex justify-end gap-3 ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
              <button onClick={() => setShowCancelPlan(false)} className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${
                isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
              }`}>Keep Plan</button>
              <button onClick={handleCancelPlan} className="h-10 px-5 rounded-xl text-sm font-semibold text-white transition-all bg-red-600 hover:bg-red-700">
                Cancel Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Cancel Plan ConfirmDialog ── */}
      <ConfirmDialog
        open={cancelConfirmOpen}
        onClose={() => setCancelConfirmOpen(false)}
        onConfirm={handleCancelConfirm}
        title="Confirm Cancellation"
        message={`Are you sure you want to cancel your ${currentPlan.name} plan? This will take effect at the end of your current billing cycle.`}
        confirmText="Yes, Cancel Plan"
        variant="danger"
        isLoading={actionLoading}
      />

      {/* ── Upgrade / Downgrade Confirmation Modal ── */}
      {upgradeTarget && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => setUpgradeTarget(null)} aria-hidden="true" />
          <div className={modalCardClass}>
            <div className={`p-6 border-b ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
              <h3 className={`text-lg font-semibold ${headingText}`}>
                {upgradeTarget.price > currentPlan.price ? "Upgrade" : "Downgrade"} to {upgradeTarget.name}
              </h3>
              <p className={`text-sm mt-1 ${subText}`}>
                {upgradeTarget.price > currentPlan.price
                  ? `You'll be charged the pro-rated difference of $${(upgradeTarget.price - currentPlan.price).toFixed(2)}/mo`
                  : `Downgrade takes effect at the end of your current billing cycle`
                }
              </p>
            </div>
            <div className="p-6 space-y-5">
              {/* Plan comparison summary */}
              <div className={`rounded-xl p-4 border ${isLight ? "bg-slate-50 border-slate-200" : "bg-[var(--bg-elevated)] border-[var(--border-tertiary)]"}`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className={`text-xs ${subText}`}>Current</p>
                    <p className={`text-sm font-semibold ${headingText}`}>{currentPlan.name} - ${currentPlan.price}/mo</p>
                  </div>
                  <svg className={`w-5 h-5 ${subText}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                  <div className="text-right">
                    <p className={`text-xs ${subText}`}>New</p>
                    <p className={`text-sm font-semibold ${accent.text}`}>{upgradeTarget.name} - ${upgradeTarget.price}/mo</p>
                  </div>
                </div>
                <div className={`border-t pt-3 ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
                  <div className="flex justify-between">
                    <span className={`text-sm ${subText}`}>Price difference</span>
                    <span className={`text-sm font-semibold ${upgradeTarget.price > currentPlan.price ? "text-amber-500" : "text-emerald-500"}`}>
                      {upgradeTarget.price > currentPlan.price ? "+" : "-"}${Math.abs(upgradeTarget.price - currentPlan.price).toFixed(2)}/mo
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment method selection (for upgrade) */}
              {upgradeTarget.price > currentPlan.price && cryptoStep === "idle" && (
                <div>
                  <label className={labelClass}>Payment method</label>
                  <div className="space-y-2">
                    {(["card", "balance", "crypto"] as const).map((method) => (
                      <button
                        key={method}
                        onClick={() => { setUpgradePaymentMethod(method); if (method !== "crypto") setSelectedCrypto(null); }}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                          upgradePaymentMethod === method
                            ? isLight ? "border-slate-400 bg-slate-50" : "border-slate-500 bg-[var(--bg-elevated)]"
                            : isLight ? "border-slate-200 hover:border-slate-300" : "border-[var(--border-tertiary)] hover:border-[var(--border-primary)]"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          method === "card" ? "bg-blue-500/10" : method === "balance" ? "bg-emerald-500/10" : "bg-violet-500/10"
                        }`}>
                          {method === "card" && <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>}
                          {method === "balance" && <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" /></svg>}
                          {method === "crypto" && <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" /></svg>}
                        </div>
                        <div className="text-left">
                          <span className={`text-sm font-medium block ${headingText}`}>
                            {method === "card" ? "Credit Card" : method === "balance" ? `Account Balance ($${accountBalance.toFixed(2)})` : "Cryptocurrency"}
                          </span>
                          <span className={`text-xs ${subText}`}>
                            {method === "card" ? `Default: Visa ****${paymentMethods.find(p => p.isDefault)?.last4 || "4242"}` : method === "balance" ? "Pay from your prepaid credits" : "BTC, ETH, USDT"}
                          </span>
                        </div>
                        {upgradePaymentMethod === method && (
                          <svg className={`w-4 h-4 ml-auto ${accent.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Crypto coin selection (idle state) */}
              {upgradeTarget.price > currentPlan.price && upgradePaymentMethod === "crypto" && cryptoStep === "idle" && (
                <div>
                  <label className={labelClass}>Select cryptocurrency</label>
                  <div className="space-y-2">
                    {CRYPTO_OPTIONS.map((coin) => (
                      <button
                        key={coin.key}
                        onClick={() => setSelectedCrypto(coin.key)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-left ${
                          selectedCrypto === coin.key
                            ? isLight ? "border-emerald-500/50 bg-emerald-50" : "border-emerald-500/30 bg-emerald-500/5"
                            : isLight ? "border-slate-200 hover:border-slate-300" : "border-[var(--border-tertiary)] hover:border-[var(--border-primary)]"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold ${coin.color}`}>{coin.icon}</div>
                        <span className={`text-sm font-medium flex-1 ${headingText}`}>{coin.name}</span>
                        {selectedCrypto === coin.key && (
                          <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Crypto payment flow — wallet + QR + confirmations */}
              {upgradeTarget.price > currentPlan.price && upgradePaymentMethod === "crypto" && cryptoStep !== "idle" && (() => {
                const priceDiff = Math.abs(upgradeTarget.price - currentPlan.price);
                const coinData: Record<string, { name: string; icon: string; color: string; amount: string; address: string }> = {
                  btc: { name: "Bitcoin", icon: "\u20BF", color: "bg-orange-500", amount: (priceDiff / 65000).toFixed(6), address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" },
                  eth: { name: "Ethereum", icon: "\u039E", color: "bg-violet-500", amount: (priceDiff / 3200).toFixed(5), address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F" },
                  usdt: { name: "USDT", icon: "\u20AE", color: "bg-emerald-500", amount: priceDiff.toFixed(2), address: "TN2Yv5jGdP2RVbGMEBfaWEed7JE6mczZ3p" },
                };
                const coin = coinData[selectedCrypto || "btc"];
                const minutes = Math.floor(cryptoTimer / 60);
                const seconds = cryptoTimer % 60;
                return (
                  <div className={`rounded-xl p-5 ${isLight ? "bg-slate-50 border border-slate-200" : "bg-[var(--bg-elevated)] border border-[var(--border-tertiary)]"}`}>
                    {/* Status */}
                    <div className="flex items-center justify-center gap-2 mb-4">
                      {cryptoStep === "paying" && <><svg className="w-5 h-5 animate-spin text-amber-400" fill="none" viewBox="0 0 24 24" aria-hidden="true"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg><span className="text-sm font-semibold text-amber-400">Waiting for payment...</span></>}
                      {cryptoStep === "confirming" && <><svg className="w-5 h-5 animate-spin text-sky-400" fill="none" viewBox="0 0 24 24" aria-hidden="true"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg><span className="text-sm font-semibold text-sky-400">Confirming... ({cryptoConfirmations}/3)</span></>}
                      {cryptoStep === "done" && <><svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><span className="text-sm font-semibold text-emerald-400">Payment confirmed!</span></>}
                    </div>

                    {/* Amount */}
                    <div className="text-center mb-4">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold ${coin.color}`}>{coin.icon}</div>
                        <span className={`text-xl font-bold ${headingText}`}>{coin.amount} {(selectedCrypto || "btc").toUpperCase()}</span>
                      </div>
                      <span className={`text-xs ${subText}`}>&asymp; ${priceDiff.toFixed(2)} USD</span>
                    </div>

                    {/* Wallet address + QR (paying step) */}
                    {cryptoStep === "paying" && (
                      <>
                        <div className={`rounded-lg p-3 mb-4 ${isLight ? "bg-white border border-slate-200" : "bg-[var(--bg-primary)] border border-[var(--border-tertiary)]"}`}>
                          <p className={`text-[10px] mb-1.5 ${subText}`}>Send exactly to this address:</p>
                          <div className="flex items-center gap-2">
                            <p className={`text-xs font-mono break-all flex-1 ${isLight ? "text-slate-700" : "text-slate-200"}`}>{coin.address}</p>
                            <button onClick={() => { navigator.clipboard.writeText(coin.address); showToast.success("Address copied"); }} aria-label="Copy address" className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${isLight ? "bg-slate-100 hover:bg-slate-200 text-slate-500" : "bg-[var(--bg-elevated)] hover:bg-[var(--border-primary)] text-slate-400"}`}>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg>
                            </button>
                          </div>
                        </div>

                        {/* QR Code */}
                        <div className="flex justify-center mb-4">
                          <div className="w-36 h-36 rounded-xl bg-white p-2 shadow-sm">
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                              <rect fill="#000" x="5" y="5" width="25" height="25" rx="2" />
                              <rect fill="#fff" x="9" y="9" width="17" height="17" rx="1" />
                              <rect fill="#000" x="13" y="13" width="9" height="9" rx="1" />
                              <rect fill="#000" x="70" y="5" width="25" height="25" rx="2" />
                              <rect fill="#fff" x="74" y="9" width="17" height="17" rx="1" />
                              <rect fill="#000" x="78" y="13" width="9" height="9" rx="1" />
                              <rect fill="#000" x="5" y="70" width="25" height="25" rx="2" />
                              <rect fill="#fff" x="9" y="74" width="17" height="17" rx="1" />
                              <rect fill="#000" x="13" y="78" width="9" height="9" rx="1" />
                              <rect fill="#000" x="35" y="5" width="5" height="5" />
                              <rect fill="#000" x="45" y="5" width="5" height="5" />
                              <rect fill="#000" x="55" y="5" width="5" height="5" />
                              <rect fill="#000" x="35" y="15" width="5" height="5" />
                              <rect fill="#000" x="50" y="15" width="5" height="5" />
                              <rect fill="#000" x="60" y="15" width="5" height="5" />
                              <rect fill="#000" x="40" y="25" width="5" height="5" />
                              <rect fill="#000" x="55" y="25" width="5" height="5" />
                              <rect fill="#000" x="5" y="35" width="5" height="5" />
                              <rect fill="#000" x="15" y="35" width="5" height="5" />
                              <rect fill="#000" x="35" y="35" width="5" height="5" />
                              <rect fill="#000" x="45" y="35" width="5" height="5" />
                              <rect fill="#000" x="60" y="35" width="5" height="5" />
                              <rect fill="#000" x="75" y="35" width="5" height="5" />
                              <rect fill="#000" x="90" y="35" width="5" height="5" />
                              <rect fill="#000" x="10" y="45" width="5" height="5" />
                              <rect fill="#000" x="25" y="45" width="5" height="5" />
                              <rect fill="#000" x="40" y="45" width="5" height="5" />
                              <rect fill="#000" x="55" y="45" width="5" height="5" />
                              <rect fill="#000" x="70" y="45" width="5" height="5" />
                              <rect fill="#000" x="85" y="45" width="5" height="5" />
                              <rect fill="#000" x="5" y="55" width="5" height="5" />
                              <rect fill="#000" x="20" y="55" width="5" height="5" />
                              <rect fill="#000" x="35" y="55" width="5" height="5" />
                              <rect fill="#000" x="50" y="55" width="5" height="5" />
                              <rect fill="#000" x="65" y="55" width="5" height="5" />
                              <rect fill="#000" x="80" y="55" width="5" height="5" />
                              <rect fill="#000" x="70" y="65" width="5" height="5" />
                              <rect fill="#000" x="85" y="65" width="5" height="5" />
                              <rect fill="#000" x="40" y="75" width="5" height="5" />
                              <rect fill="#000" x="55" y="75" width="5" height="5" />
                              <rect fill="#000" x="70" y="75" width="5" height="5" />
                              <rect fill="#000" x="85" y="75" width="5" height="5" />
                              <rect fill="#000" x="45" y="85" width="5" height="5" />
                              <rect fill="#000" x="60" y="85" width="5" height="5" />
                              <rect fill="#000" x="75" y="85" width="5" height="5" />
                              <rect fill="#000" x="90" y="85" width="5" height="5" />
                            </svg>
                          </div>
                        </div>

                        {/* Timer */}
                        <div className="text-center">
                          <span className={`text-xs ${cryptoTimer < 300 ? "text-rose-400" : subText}`}>Expires in {minutes}:{seconds.toString().padStart(2, "0")}</span>
                        </div>
                      </>
                    )}

                    {/* Confirmations */}
                    {cryptoStep === "confirming" && (
                      <div className="space-y-2">
                        {[1, 2, 3].map((n) => (
                          <div key={n} className="flex items-center gap-2">
                            {cryptoConfirmations >= n ? (
                              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                            ) : (
                              <div className={`w-4 h-4 rounded-full border-2 ${isLight ? "border-slate-300" : "border-slate-600"}`} />
                            )}
                            <span className={`text-xs ${cryptoConfirmations >= n ? headingText : subText}`}>Confirmation {n}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Footer buttons — hide during active crypto flow */}
            {cryptoStep === "idle" && (
            <div className={`p-6 border-t flex justify-end gap-3 ${isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"}`}>
              <button onClick={() => { setUpgradeTarget(null); setUpgradePaymentMethod("card"); setSelectedCrypto(null); setCryptoStep("idle"); setCryptoTimer(1800); setCryptoConfirmations(0); }} className={`h-10 px-5 rounded-xl text-sm font-medium transition-colors ${
                isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
              }`}>Cancel</button>
              <button onClick={handleUpgrade} disabled={actionLoading || (upgradePaymentMethod === "crypto" && !selectedCrypto)} className={`h-10 px-5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60 flex items-center gap-2 ${accent.button} ${accent.buttonHover}`}>
                {actionLoading && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>}
                {actionLoading ? "Processing..." : upgradePaymentMethod === "crypto" ? `Pay with ${selectedCrypto ? selectedCrypto.toUpperCase() : "Crypto"}` : upgradeTarget.price > currentPlan.price ? `Upgrade to ${upgradeTarget.name}` : `Downgrade to ${upgradeTarget.name}`}
              </button>
            </div>
            )}
          </div>
        </div>
      )}

      </>
      )}
    </>
  );
}

// Redirect /billing to /settings?tab=billing
export default function BillingPage() {
  const router = useRouter();
  useEffect(() => { router.replace("/settings?tab=billing"); }, [router]);
  return null;
}
