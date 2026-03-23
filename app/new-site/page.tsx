"use client";

import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import AppShell from "../components/AppShell";
import { useTheme } from "@/lib/context/ThemeContext";
import { cn } from "@/lib/utils";
import { INPUT_CLASS_NAMES, SELECT_CLASS_NAMES } from "@/data/settings";
import { ROUTES } from "@/config/routes";
import { showToast } from "@/lib/toast";
import { Toggle } from "@/app/components/ui/Toggle";

// Step definitions with icons
const STEPS = [
  { id: 1, name: "Package", description: "Select your plan", icon: "package" },
  { id: 2, name: "Domain", description: "Choose your domain", icon: "globe" },
  { id: 3, name: "WordPress", description: "Configure WordPress", icon: "wordpress" },
  { id: 4, name: "Finalize", description: "Review & create", icon: "rocket" },
];

// Package options with enhanced data
const PACKAGES = [
  {
    id: "starter",
    name: "Starter",
    price: "$27",
    annualPrice: "$22",
    period: "/month",
    description: "Perfect for small sites",
    features: ["1 Website", "10GB SSD Storage", "Free SSL Certificate", "Daily Backups"],
  },
  {
    id: "premium",
    name: "Premium",
    price: "$45",
    annualPrice: "$36",
    period: "/month",
    description: "Ideal for growing businesses",
    features: ["5 Websites", "50GB SSD Storage", "Free SSL Certificate", "Daily Backups", "Staging Environment", "Priority Support"],
    popular: true,
  },
  {
    id: "business",
    name: "Business",
    price: "$80",
    annualPrice: "$64",
    period: "/month",
    description: "For high-traffic sites and agencies",
    features: ["Unlimited Websites", "100GB SSD Storage", "Free SSL Certificate", "Hourly Backups", "Staging Environment", "24/7 Priority Support", "Global CDN"],
  },
];

const PHP_VERSIONS = [
  { key: "8.3", label: "PHP 8.3 (Latest)" },
  { key: "8.2", label: "PHP 8.2" },
  { key: "8.1", label: "PHP 8.1" },
];

const WP_VERSIONS = [
  { key: "latest", label: "WordPress 6.7 (Latest)" },
  { key: "6.6", label: "WordPress 6.6" },
  { key: "6.5", label: "WordPress 6.5" },
];

const DOMAIN_TYPES = [
  {
    id: "existing",
    title: "Use Existing Domain",
    description: "Connect a domain you already own",
    icon: "link",
  },
  {
    id: "subdomain",
    title: "Free Subdomain",
    description: "Get started with a free .limewp.com subdomain",
    icon: "gift",
  },
];

const DATA_CENTERS = [
  { id: "us-east", name: "US East", location: "Virginia", flag: "\u{1F1FA}\u{1F1F8}", latency: "~15ms" },
  { id: "eu-west", name: "EU West", location: "Frankfurt", flag: "\u{1F1E9}\u{1F1EA}", latency: "~25ms" },
  { id: "asia-pacific", name: "Asia Pacific", location: "Singapore", flag: "\u{1F1F8}\u{1F1EC}", latency: "~45ms" },
];

const PLUGINS = [
  { id: "yoast-seo", name: "Yoast SEO", recommended: true },
  { id: "woocommerce", name: "WooCommerce", recommended: false },
  { id: "contact-form-7", name: "Contact Form 7", recommended: false },
  { id: "wordfence-security", name: "Wordfence Security", recommended: false },
  { id: "wp-super-cache", name: "WP Super Cache", recommended: false },
];

const STARTER_TEMPLATES = [
  { id: "blank", name: "Blank", gradient: "from-slate-300 to-slate-400" },
  { id: "blog", name: "Blog", gradient: "from-blue-400 to-indigo-500" },
  { id: "business", name: "Business", gradient: "from-emerald-400 to-teal-500" },
  { id: "ecommerce", name: "E-commerce", gradient: "from-amber-400 to-orange-500" },
];

const SAVED_CARDS = [
  { id: "visa-4242", brand: "Visa", last4: "4242", expiry: "12/28", color: "bg-blue-600" },
  { id: "mc-8888", brand: "Mastercard", last4: "8888", expiry: "06/27", color: "bg-orange-500" },
  { id: "amex-1234", brand: "Amex", last4: "1234", expiry: "03/29", color: "bg-sky-500" },
];

const CRYPTO_OPTIONS = [
  { key: "btc", name: "Bitcoin (BTC)", icon: "\u20BF", color: "bg-orange-500" },
  { key: "eth", name: "Ethereum (ETH)", icon: "\u039E", color: "bg-violet-500" },
  { key: "usdt", name: "USDT (TRC-20)", icon: "\u20AE", color: "bg-emerald-500" },
];

const CREATION_STEPS = [
  "Provisioning server...",
  "Installing WordPress...",
  "Configuring domain...",
  "Installing plugins...",
  "Almost ready!",
];

// Icon Component - defined outside to prevent recreation
const StepIcon = ({ type, className }: { type: string; className?: string }) => {
  const icons: Record<string, React.ReactNode> = {
    package: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
    ),
    globe: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    wordpress: (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-1.5 15.5L7 9.5h2l2.5 6 2.5-6h2l-3.5 8h-2zM12 4c4.411 0 8 3.589 8 8 0 .886-.146 1.739-.414 2.535L16.5 9.5h-2l2.086 5.035L14.5 19l-2.5-6-2.5 6-2.086-4.465L9.5 9.5h-2l-3.086 5.035A7.967 7.967 0 014 12c0-4.411 3.589-8 8-8z" />
      </svg>
    ),
    rocket: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
    ),
    starter: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
    premium: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    business: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21" />
      </svg>
    ),
    search: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
    link: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
      </svg>
    ),
    gift: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
    check: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
    server: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
      </svg>
    ),
    plugin: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.959.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" />
      </svg>
    ),
    template: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
    creditcard: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
    migrate: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
  };
  return icons[type] || null;
};

export default function NewSitePage() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);

  // Form data
  const [selectedPackage, setSelectedPackage] = useState("premium");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [siteName, setSiteName] = useState("");
  const [domain, setDomain] = useState("");
  const [domainType, setDomainType] = useState<"existing" | "subdomain">("existing");
  const [domainStatus, setDomainStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [sslType, setSslType] = useState<"letsencrypt" | "cloudflare">("letsencrypt");
  const [phpVersion, setPhpVersion] = useState<Set<string>>(new Set(["8.3"]));
  const [wpVersion, setWpVersion] = useState<Set<string>>(new Set(["latest"]));
  const [adminEmail, setAdminEmail] = useState("");
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [originCertificate, setOriginCertificate] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [dataCenter, setDataCenter] = useState("us-east");
  const [selectedPlugins, setSelectedPlugins] = useState<Set<string>>(new Set());
  const [starterTemplate, setStarterTemplate] = useState("blank");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "balance" | "crypto">("card");
  const [selectedPaymentCard, setSelectedPaymentCard] = useState("visa-4242");
  const [showAddCard, setShowAddCard] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newCardExpiry, setNewCardExpiry] = useState("");
  const [newCardCvc, setNewCardCvc] = useState("");

  // Creation progress state
  const [creating, setCreating] = useState(false);
  const [creationStep, setCreationStep] = useState(0);
  const [creationComplete, setCreationComplete] = useState(false);

  // Crypto payment flow state
  const [cryptoStep, setCryptoStep] = useState<"idle" | "paying" | "confirming" | "done">("idle");
  const [cryptoTimer, setCryptoTimer] = useState(1800);
  const [cryptoConfirmations, setCryptoConfirmations] = useState(0);

  // Domain check debounce ref
  const domainCheckTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Domain availability check with debounce
  useEffect(() => {
    if (!domain || domain.length < 2) {
      setDomainStatus("idle");
      return;
    }

    setDomainStatus("checking");

    if (domainCheckTimeout.current) {
      clearTimeout(domainCheckTimeout.current);
    }

    domainCheckTimeout.current = setTimeout(() => {
      const lowerDomain = domain.toLowerCase();
      if (lowerDomain.includes("test") || lowerDomain.includes("example")) {
        setDomainStatus("taken");
      } else {
        setDomainStatus("available");
      }
    }, 1000);

    return () => {
      if (domainCheckTimeout.current) {
        clearTimeout(domainCheckTimeout.current);
      }
    };
  }, [domain]);

  // Creation progress animation
  useEffect(() => {
    if (!creating || creationComplete) return;

    const interval = setInterval(() => {
      setCreationStep((prev) => {
        if (prev >= CREATION_STEPS.length - 1) {
          clearInterval(interval);
          setCreationComplete(true);
          // Fire confetti
          import("canvas-confetti").then((m) =>
            m.default({
              particleCount: 150,
              spread: 80,
              origin: { y: 0.6 },
            })
          );
          return prev;
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [creating, creationComplete]);

  const togglePlugin = useCallback((pluginId: string) => {
    setSelectedPlugins((prev) => {
      const next = new Set(prev);
      if (next.has(pluginId)) {
        next.delete(pluginId);
      } else {
        next.add(pluginId);
      }
      return next;
    });
  }, []);

  const inputClassNames = useMemo(() => isLight
    ? {
        inputWrapper: "bg-white border-slate-200 hover:border-slate-300 !rounded-xl shadow-sm group-data-[focus=true]:border-slate-400",
        input: "text-slate-800 placeholder:text-slate-400",
      }
    : INPUT_CLASS_NAMES, [isLight]);

  const selectClassNames = useMemo(() => isLight
    ? {
        trigger: "bg-white border-slate-200 hover:border-slate-300 !rounded-xl text-slate-800 shadow-sm data-[focus=true]:border-slate-400",
        value: "text-slate-800",
        popoverContent: "bg-white border border-slate-200 rounded-xl shadow-lg",
        listbox: "bg-white",
      }
    : SELECT_CLASS_NAMES, [isLight]);

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 1:
        return !!selectedPackage;
      case 2:
        return !!domain;
      case 3:
        return !!siteName && !!adminEmail && !!adminPassword && adminPassword === confirmPassword;
      case 4:
        return true;
      default:
        return false;
    }
  }, [currentStep, selectedPackage, domain, siteName, adminEmail, adminPassword, confirmPassword]);

  const handleNext = useCallback(() => {
    if (currentStep < 4 && canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, canProceed]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  // Crypto timer countdown
  useEffect(() => {
    if (cryptoStep !== "paying" || cryptoTimer <= 0) return;
    const interval = setInterval(() => setCryptoTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [cryptoStep, cryptoTimer]);

  // Crypto done → start site creation
  useEffect(() => {
    if (cryptoStep !== "done") return;
    const timeout = setTimeout(() => {
      setCryptoStep("idle");
      setCreating(true);
      setCreationStep(0);
      setCreationComplete(false);
    }, 1500);
    return () => clearTimeout(timeout);
  }, [cryptoStep]);

  const handleSubmit = useCallback(async () => {
    if (!canProceed()) return;

    if (paymentMethod === "crypto") {
      if (!selectedCrypto) { showToast.error("Select a cryptocurrency"); return; }
      // Start crypto payment flow
      setCryptoStep("paying");
      setCryptoTimer(1800);
      setCryptoConfirmations(0);
      // Simulate payment detection after 6s
      setTimeout(() => {
        setCryptoStep("confirming");
        setCryptoConfirmations(1);
        setTimeout(() => setCryptoConfirmations(2), 1500);
        setTimeout(() => {
          setCryptoConfirmations(3);
          setCryptoStep("done");
        }, 3000);
      }, 6000);
      return;
    }

    setCreating(true);
    setCreationStep(0);
    setCreationComplete(false);
  }, [canProceed, paymentMethod, selectedCrypto]);

  const handleCancel = useCallback(() => {
    router.push(ROUTES.DASHBOARD);
  }, [router]);

  const getDisplayPrice = useCallback((pkg: typeof PACKAGES[0]) => {
    return billingCycle === "annual" ? pkg.annualPrice : pkg.price;
  }, [billingCycle]);

  // Step Indicator Component
  const StepIndicator = () => (
    <div className="pb-4">
      <div className="flex items-center justify-center">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center relative z-10 w-32">
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ease-out",
                  currentStep > step.id
                    ? isLight
                      ? "bg-slate-800 text-white shadow-lg scale-100"
                      : "bg-slate-200 text-slate-900 shadow-lg scale-100"
                    : currentStep === step.id
                    ? isLight
                      ? "bg-slate-800 text-white shadow-xl ring-2 ring-slate-300 scale-105"
                      : "bg-slate-200 text-slate-900 shadow-xl ring-2 ring-slate-600 scale-105"
                    : isLight
                    ? "bg-slate-100 text-slate-400 scale-100"
                    : "bg-slate-800 text-slate-500 scale-100"
                )}
              >
                {currentStep > step.id ? (
                  <StepIcon type="check" className="w-5 h-5" />
                ) : (
                  <StepIcon type={step.icon} className="w-5 h-5" />
                )}
              </div>
              <div className="mt-2 text-center">
                <p className={cn(
                  "text-xs font-semibold transition-colors",
                  currentStep >= step.id
                    ? isLight ? "text-slate-900" : "text-slate-100"
                    : isLight ? "text-slate-400" : "text-slate-600"
                )}>
                  {step.name}
                </p>
              </div>
            </div>
            {index < STEPS.length - 1 && (
              <div className={cn(
                "w-10 h-1 mt-[-24px] rounded-full overflow-hidden relative",
                isLight ? "bg-slate-200" : "bg-slate-800"
              )}>
                <div
                  className={cn(
                    "absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out",
                    isLight ? "bg-slate-800" : "bg-slate-200",
                    currentStep > step.id ? "w-full" : "w-0"
                  )}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Render current step content directly (not as separate components)
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        // Step 1: Package Selection
        return (
          <div className="space-y-5">
            <div className="text-center">
              <h2 className={cn(
                "text-xl font-bold mb-1.5",
                isLight ? "text-slate-900" : "text-slate-100"
              )}>
                Choose Your Package
              </h2>
              <p className={cn(
                "text-sm",
                isLight ? "text-slate-500" : "text-slate-400"
              )}>
                Select the plan that best fits your needs. You can upgrade anytime.
              </p>
            </div>

            {/* Billing Cycle Toggle */}
            <div className="flex items-center justify-center gap-3">
              <span className={cn(
                "text-sm font-medium transition-colors",
                billingCycle === "monthly"
                  ? isLight ? "text-slate-900" : "text-slate-100"
                  : isLight ? "text-slate-400" : "text-slate-500"
              )}>
                Monthly
              </span>
              <Toggle
                enabled={billingCycle === "annual"}
                onChange={(val) => setBillingCycle(val ? "annual" : "monthly")}
              />
              <span className={cn(
                "text-sm font-medium transition-colors",
                billingCycle === "annual"
                  ? isLight ? "text-slate-900" : "text-slate-100"
                  : isLight ? "text-slate-400" : "text-slate-500"
              )}>
                Annual
              </span>
              {billingCycle === "annual" && (
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500 text-white">
                  Save 20%
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
              {PACKAGES.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={cn(
                    "group relative rounded-2xl border-2 p-6 text-left flex flex-col items-start",
                    selectedPackage === pkg.id
                      ? isLight
                        ? "border-slate-400 bg-gradient-to-b from-slate-100 to-white"
                        : "border-slate-500 bg-gradient-to-b from-slate-700/30 to-transparent"
                      : isLight
                      ? "border-slate-200 bg-white hover:border-slate-300"
                      : "border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900"
                  )}
                >
                  {pkg.popular && (
                    <div className={cn(
                      "absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-[11px] font-bold shadow-lg",
                      isLight ? "bg-slate-800 text-white" : "bg-slate-200 text-slate-900"
                    )}>
                      Most Popular
                    </div>
                  )}

                  {/* Package Name & Description */}
                  <div className="mb-5 w-full">
                    <h3 className={cn(
                      "text-lg font-bold leading-tight mb-0.5",
                      isLight ? "text-slate-900" : "text-slate-100"
                    )}>
                      {pkg.name}
                    </h3>
                    <p className={cn(
                      "text-xs",
                      isLight ? "text-slate-500" : "text-slate-500"
                    )}>
                      {pkg.description}
                    </p>
                  </div>

                  {/* Price Section */}
                  <div className={cn(
                    "mb-5 pb-5 w-full border-b",
                    isLight ? "border-slate-100" : "border-slate-800"
                  )}>
                    <div className="flex items-baseline gap-1">
                      <span className={cn(
                        "text-3xl font-bold tracking-tight",
                        isLight ? "text-slate-900" : "text-slate-100"
                      )}>
                        {getDisplayPrice(pkg)}
                      </span>
                      <span className={cn(
                        "text-sm font-medium",
                        isLight ? "text-slate-400" : "text-slate-500"
                      )}>
                        {pkg.period}
                      </span>
                    </div>
                    {billingCycle === "annual" && (
                      <p className="text-xs text-emerald-500 font-medium mt-1">
                        Billed annually ({parseInt(pkg.annualPrice.replace("$", "")) * 12}/yr)
                      </p>
                    )}
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 w-full">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm">
                        <div className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                          selectedPackage === pkg.id
                            ? isLight ? "bg-slate-800" : "bg-slate-200"
                            : isLight ? "bg-slate-200" : "bg-slate-700"
                        )}>
                          <StepIcon type="check" className={cn(
                            "w-3 h-3",
                            selectedPackage === pkg.id
                              ? isLight ? "text-white" : "text-slate-900"
                              : isLight ? "text-slate-500" : "text-slate-400"
                          )} />
                        </div>
                        <span className={cn(
                          "font-medium",
                          isLight ? "text-slate-700" : "text-slate-300"
                        )}>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Selection indicator */}
                  <div className={cn(
                    "absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center transition-opacity duration-150",
                    isLight ? "bg-slate-800" : "bg-slate-200",
                    selectedPackage === pkg.id
                      ? "opacity-100"
                      : "opacity-0"
                  )}>
                    <StepIcon type="check" className={cn("w-3.5 h-3.5", isLight ? "text-white" : "text-slate-900")} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        // Step 2: Domain
        return (
          <div className="space-y-5">
            <div className="text-center">
              <h2 className={cn(
                "text-xl font-bold mb-1.5",
                isLight ? "text-slate-900" : "text-slate-100"
              )}>
                Configure Your Domain
              </h2>
              <p className={cn(
                "text-sm",
                isLight ? "text-slate-500" : "text-slate-400"
              )}>
                Choose how you want to set up your website address.
              </p>
            </div>

            {/* Domain Type Selection */}
            <div>
              <h3 className={cn("font-semibold text-sm mb-3", isLight ? "text-slate-900" : "text-slate-100")}>
                Domain Type
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DOMAIN_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setDomainType(type.id as "existing" | "subdomain")}
                    className={cn(
                      "group relative rounded-xl border-2 p-4 text-left transition-all duration-300",
                      domainType === type.id
                        ? isLight
                          ? "border-slate-400 bg-slate-100/50 shadow-md"
                          : "border-slate-500 bg-slate-700/20"
                        : isLight
                        ? "border-slate-200 bg-white hover:border-slate-300"
                        : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                        domainType === type.id
                          ? isLight ? "bg-slate-800" : "bg-slate-200"
                          : isLight ? "bg-slate-100" : "bg-slate-800"
                      )}>
                        <StepIcon
                          type={type.icon}
                          className={cn(
                            "w-5 h-5",
                            domainType === type.id
                              ? isLight ? "text-white" : "text-slate-900"
                              : isLight ? "text-slate-600" : "text-slate-400"
                          )}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={cn("font-semibold text-sm leading-tight", isLight ? "text-slate-900" : "text-slate-100")}>
                          {type.title}
                        </h4>
                        <p className={cn("text-xs truncate", isLight ? "text-slate-500" : "text-slate-500")}>
                          {type.description}
                        </p>
                      </div>
                    </div>
                    {domainType === type.id && (
                      <div className={cn(
                        "absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center",
                        isLight ? "bg-slate-800" : "bg-slate-200"
                      )}>
                        <StepIcon type="check" className={cn("w-3.5 h-3.5", isLight ? "text-white" : "text-slate-900")} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Domain Input Card */}
            <div className={cn(
              "rounded-xl border p-5",
              isLight ? "bg-white border-slate-200 shadow-sm" : "bg-slate-900/50 border-slate-800"
            )}>
              <div className="mb-3">
                <h3 className={cn("font-semibold text-sm", isLight ? "text-slate-900" : "text-slate-100")}>
                  {domainType === "existing" ? "Your Domain" : "Choose Subdomain"}
                </h3>
                <p className={cn("text-xs", isLight ? "text-slate-500" : "text-slate-500")}>
                  {domainType === "subdomain" ? "Pick a unique name for your free subdomain" : "Enter your domain name"}
                </p>
              </div>
              <Input
                id="domain-input"
                value={domain}
                onValueChange={setDomain}
                placeholder={domainType === "subdomain" ? "mysite" : "example.com"}
                classNames={inputClassNames}
                variant="bordered"
                size="md"
                startContent={
                  domainType !== "subdomain" && (
                    <span className="text-slate-400 text-sm font-medium">https://</span>
                  )
                }
                endContent={
                  domainType === "subdomain" && (
                    <span className={cn("text-sm font-medium", isLight ? "text-slate-600" : "text-slate-400")}>.limewp.com</span>
                  )
                }
              />

              {/* Domain Availability Status */}
              {domain.length >= 2 && (
                <div className="mt-2.5 flex items-center gap-2">
                  {domainStatus === "checking" && (
                    <>
                      <svg className="w-4 h-4 animate-spin text-slate-400" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span className="text-xs text-slate-400">Checking availability...</span>
                    </>
                  )}
                  {domainStatus === "available" && (
                    <>
                      <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-xs font-medium text-emerald-500">Domain available!</span>
                    </>
                  )}
                  {domainStatus === "taken" && (
                    <>
                      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-xs font-medium text-red-500">Domain already taken</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className={cn(
              "rounded-xl p-4 flex items-start gap-3",
              isLight
                ? "bg-slate-100 border border-slate-200"
                : "bg-slate-800/50 border border-slate-700"
            )}>
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                isLight ? "bg-slate-800" : "bg-slate-200"
              )}>
                <svg className={cn("w-5 h-5", isLight ? "text-white" : "text-slate-900")} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
              </div>
              <div>
                <p className={cn("font-semibold text-sm", isLight ? "text-slate-800" : "text-slate-200")}>
                  Domain Configuration
                </p>
                <p className={cn("text-xs leading-relaxed", isLight ? "text-slate-600" : "text-slate-400")}>
                  Make sure your domain is registered and properly configured with DNS settings pointing to our nameservers. Your site will be accessible at this domain once the setup is complete.
                </p>
              </div>
            </div>

            {/* SSL Configuration */}
            <div>
              <h3 className={cn("font-semibold text-sm mb-3", isLight ? "text-slate-900" : "text-slate-100")}>
                SSL Certificate
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setSslType("letsencrypt")}
                  className={cn(
                    "group relative rounded-xl border-2 p-4 text-left transition-all duration-300",
                    sslType === "letsencrypt"
                      ? isLight
                        ? "border-slate-400 bg-slate-100/50 shadow-md"
                        : "border-slate-500 bg-slate-700/20"
                      : isLight
                      ? "border-slate-200 bg-white hover:border-slate-300"
                      : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                      sslType === "letsencrypt"
                        ? isLight ? "bg-slate-800" : "bg-slate-200"
                        : isLight ? "bg-slate-100" : "bg-slate-800"
                    )}>
                      <svg className={cn("w-5 h-5", sslType === "letsencrypt" ? isLight ? "text-white" : "text-slate-900" : isLight ? "text-slate-600" : "text-slate-400")} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <h4 className={cn("font-semibold text-sm", isLight ? "text-slate-900" : "text-slate-100")}>
                          Let&apos;s Encrypt
                        </h4>
                        <span className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full",
                          isLight ? "bg-slate-800 text-white" : "bg-slate-200 text-slate-900"
                        )}>
                          Auto
                        </span>
                      </div>
                      <p className={cn("text-xs leading-tight", isLight ? "text-slate-500" : "text-slate-500")}>
                        Auto provision & renew SSL
                      </p>
                    </div>
                  </div>
                  {sslType === "letsencrypt" && (
                    <div className={cn(
                      "absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center",
                      isLight ? "bg-slate-800" : "bg-slate-200"
                    )}>
                      <StepIcon type="check" className={cn("w-3.5 h-3.5", isLight ? "text-white" : "text-slate-900")} />
                    </div>
                  )}
                </button>

                <button
                  onClick={() => setSslType("cloudflare")}
                  className={cn(
                    "group relative rounded-xl border-2 p-4 text-left transition-all duration-300",
                    sslType === "cloudflare"
                      ? isLight
                        ? "border-slate-400 bg-slate-100/50 shadow-md"
                        : "border-slate-500 bg-slate-700/20"
                      : isLight
                      ? "border-slate-200 bg-white hover:border-slate-300"
                      : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                      sslType === "cloudflare"
                        ? isLight ? "bg-slate-800" : "bg-slate-200"
                        : isLight ? "bg-slate-100" : "bg-slate-800"
                    )}>
                      <svg className={cn("w-5 h-5", sslType === "cloudflare" ? isLight ? "text-white" : "text-slate-900" : isLight ? "text-slate-600" : "text-slate-400")} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M16.5088 16.8447C16.6235 16.4476 16.5765 16.0976 16.3694 15.8224C16.1835 15.5765 15.8688 15.4329 15.4894 15.4094L8.84354 15.3553C8.75531 15.3506 8.68 15.3059 8.63531 15.2365C8.59062 15.1671 8.58354 15.0824 8.61354 15.0035C8.66531 14.8694 8.79354 14.7765 8.94354 14.7624L15.5929 14.7082C16.4894 14.6541 17.4494 13.9671 17.8094 13.1412L18.3176 11.9647C18.3694 11.8447 18.3929 11.7153 18.3788 11.5859C17.9953 9.32 16.0188 7.58 13.6376 7.58C11.5847 7.58 9.82354 8.90118 9.15177 10.7271C8.75531 10.4612 8.27531 10.3035 7.75531 10.3035C6.49177 10.3035 5.46354 11.2894 5.39531 12.5365C5.39531 12.5929 5.39531 12.6494 5.39531 12.7059C4.20708 12.9341 3.29177 13.9624 3.29177 15.2035C3.29177 15.3118 3.30354 15.4176 3.31531 15.5212C3.33062 15.6671 3.45531 15.7765 3.60354 15.7765H16.0329C16.1788 15.7765 16.31 15.6859 16.3624 15.5541L16.5088 16.8447Z"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={cn("font-semibold text-sm mb-0.5", isLight ? "text-slate-900" : "text-slate-100")}>
                        Cloudflare Origin
                      </h4>
                      <p className={cn("text-xs leading-tight", isLight ? "text-slate-500" : "text-slate-500")}>
                        Use your own certificate
                      </p>
                    </div>
                  </div>
                  {sslType === "cloudflare" && (
                    <div className={cn(
                      "absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center",
                      isLight ? "bg-slate-800" : "bg-slate-200"
                    )}>
                      <StepIcon type="check" className={cn("w-3.5 h-3.5", isLight ? "text-white" : "text-slate-900")} />
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Cloudflare Configuration - Only visible when Cloudflare is selected */}
            {sslType === "cloudflare" && (
              <>
                {/* DNS Configuration */}
                <div className={cn(
                  "rounded-xl border p-5",
                  isLight ? "bg-white border-slate-200 shadow-sm" : "bg-slate-900/50 border-slate-800"
                )}>
                  <div className="mb-3">
                    <h3 className={cn("font-semibold text-sm", isLight ? "text-slate-900" : "text-slate-100")}>
                      DNS Configuration
                    </h3>
                    <p className={cn("text-xs", isLight ? "text-slate-500" : "text-slate-500")}>
                      Add these A records in Cloudflare with Proxied enabled:
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className={cn(
                      "flex items-center gap-2 p-2 rounded-lg font-mono text-xs",
                      isLight ? "bg-slate-50" : "bg-slate-800/50"
                    )}>
                      <span className={cn(
                        "px-1.5 py-0.5 rounded text-[10px] font-bold",
                        isLight ? "bg-slate-200 text-slate-600" : "bg-slate-700 text-slate-400"
                      )}>A</span>
                      <span className={cn(isLight ? "text-slate-600" : "text-slate-400")}>@</span>
                      <span className={cn(isLight ? "text-slate-400" : "text-slate-600")}>&rarr;</span>
                      <span className={cn("font-semibold", isLight ? "text-slate-900" : "text-slate-100")}>46.4.212.172</span>
                    </div>
                    <div className={cn(
                      "flex items-center gap-2 p-2 rounded-lg font-mono text-xs",
                      isLight ? "bg-slate-50" : "bg-slate-800/50"
                    )}>
                      <span className={cn(
                        "px-1.5 py-0.5 rounded text-[10px] font-bold",
                        isLight ? "bg-slate-200 text-slate-600" : "bg-slate-700 text-slate-400"
                      )}>A</span>
                      <span className={cn(isLight ? "text-slate-600" : "text-slate-400")}>www</span>
                      <span className={cn(isLight ? "text-slate-400" : "text-slate-600")}>&rarr;</span>
                      <span className={cn("font-semibold", isLight ? "text-slate-900" : "text-slate-100")}>46.4.212.172</span>
                    </div>
                  </div>
                </div>

                {/* Origin Certificate Instructions */}
                <div className={cn(
                  "rounded-xl p-4 flex items-start gap-3",
                  isLight
                    ? "bg-slate-100 border border-slate-200"
                    : "bg-slate-800/50 border border-slate-700"
                )}>
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                    isLight ? "bg-slate-800" : "bg-slate-200"
                  )}>
                    <svg className={cn("w-5 h-5", isLight ? "text-white" : "text-slate-900")} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                  </div>
                  <div>
                    <p className={cn("font-semibold text-sm", isLight ? "text-slate-800" : "text-slate-200")}>
                      Generate an Origin Certificate
                    </p>
                    <p className={cn("text-xs leading-relaxed", isLight ? "text-slate-600" : "text-slate-400")}>
                      Go to Cloudflare &rarr; <span className="font-semibold">SSL/TLS &rarr; Origin Server</span> and create a certificate.
                    </p>
                  </div>
                </div>

                {/* Certificate Inputs */}
                <div className={cn(
                  "rounded-xl border p-5",
                  isLight ? "bg-white border-slate-200 shadow-sm" : "bg-slate-900/50 border-slate-800"
                )}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="origin-cert" className={cn(
                        "block text-sm font-medium mb-2",
                        isLight ? "text-slate-700" : "text-slate-300"
                      )}>
                        Origin Certificate
                      </label>
                      <textarea
                        id="origin-cert"
                        value={originCertificate}
                        onChange={(e) => setOriginCertificate(e.target.value)}
                        placeholder={"-----BEGIN CERTIFICATE-----\n..."}
                        rows={4}
                        className={cn(
                          "w-full px-3 py-2.5 rounded-lg border text-sm font-mono resize-none transition-colors",
                          isLight
                            ? "bg-white border-slate-200 hover:border-slate-300 focus:border-slate-400 text-slate-800 placeholder:text-slate-400"
                            : "bg-slate-900 border-slate-800 hover:border-slate-700 focus:border-slate-500 text-slate-100 placeholder:text-slate-600",
                          "focus:outline-none focus:ring-1 focus:ring-slate-500/20"
                        )}
                      />
                    </div>
                    <div>
                      <label htmlFor="private-key" className={cn(
                        "block text-sm font-medium mb-2",
                        isLight ? "text-slate-700" : "text-slate-300"
                      )}>
                        Private Key
                      </label>
                      <textarea
                        id="private-key"
                        value={privateKey}
                        onChange={(e) => setPrivateKey(e.target.value)}
                        placeholder={"-----BEGIN PRIVATE KEY-----\n..."}
                        rows={4}
                        className={cn(
                          "w-full px-3 py-2.5 rounded-lg border text-sm font-mono resize-none transition-colors",
                          isLight
                            ? "bg-white border-slate-200 hover:border-slate-300 focus:border-slate-400 text-slate-800 placeholder:text-slate-400"
                            : "bg-slate-900 border-slate-800 hover:border-slate-700 focus:border-slate-500 text-slate-100 placeholder:text-slate-600",
                          "focus:outline-none focus:ring-1 focus:ring-slate-500/20"
                        )}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Migration Option */}
            <button
              onClick={() => router.push(ROUTES.MIGRATE)}
              className={cn(
                "w-full rounded-xl border-2 border-dashed p-4 flex items-center gap-3 transition-all duration-300 text-left",
                isLight
                  ? "border-slate-200 hover:border-slate-400 hover:bg-slate-50"
                  : "border-slate-700 hover:border-slate-500 hover:bg-slate-800/50"
              )}
            >
              <div className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                isLight ? "bg-slate-100" : "bg-slate-800"
              )}>
                <StepIcon type="migrate" className={cn("w-5 h-5", isLight ? "text-slate-600" : "text-slate-400")} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={cn("font-semibold text-sm leading-tight", isLight ? "text-slate-900" : "text-slate-100")}>
                  Already have a site? Migrate it instead
                </h4>
                <p className={cn("text-xs", isLight ? "text-slate-500" : "text-slate-500")}>
                  Transfer your existing WordPress site to LimeWP with zero downtime
                </p>
              </div>
              <svg className={cn("w-5 h-5 flex-shrink-0", isLight ? "text-slate-400" : "text-slate-600")} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        );

      case 3:
        // Step 3: WordPress
        return (
          <div className="space-y-5">
            <div className="text-center">
              <h2 className={cn(
                "text-xl font-bold mb-1.5",
                isLight ? "text-slate-900" : "text-slate-100"
              )}>
                WordPress Settings
              </h2>
              <p className={cn(
                "text-sm",
                isLight ? "text-slate-500" : "text-slate-400"
              )}>
                Configure your WordPress installation preferences.
              </p>
            </div>

            {/* Data Center Selection */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center",
                  isLight ? "bg-slate-100" : "bg-slate-800"
                )}>
                  <StepIcon type="server" className={cn("w-5 h-5", isLight ? "text-slate-600" : "text-slate-400")} />
                </div>
                <div>
                  <h3 className={cn("font-semibold text-sm leading-tight", isLight ? "text-slate-900" : "text-slate-100")}>Data Center</h3>
                  <p className={cn("text-xs", isLight ? "text-slate-500" : "text-slate-500")}>Choose the closest region to your audience</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {DATA_CENTERS.map((dc) => (
                  <button
                    key={dc.id}
                    onClick={() => setDataCenter(dc.id)}
                    className={cn(
                      "relative rounded-xl border-2 p-4 text-left transition-all duration-300",
                      dataCenter === dc.id
                        ? isLight
                          ? "border-slate-400 bg-slate-100/50 shadow-md"
                          : "border-slate-500 bg-slate-700/20"
                        : isLight
                        ? "border-slate-200 bg-white hover:border-slate-300"
                        : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                    )}
                  >
                    <div className="text-center">
                      <span className="text-2xl block mb-1.5">{dc.flag}</span>
                      <h4 className={cn("font-semibold text-sm", isLight ? "text-slate-900" : "text-slate-100")}>
                        {dc.name}
                      </h4>
                      <p className={cn("text-xs", isLight ? "text-slate-500" : "text-slate-500")}>
                        {dc.location}
                      </p>
                      <p className={cn("text-[11px] font-medium mt-1", isLight ? "text-slate-400" : "text-slate-600")}>
                        {dc.latency}
                      </p>
                    </div>
                    {dataCenter === dc.id && (
                      <div className={cn(
                        "absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center",
                        isLight ? "bg-slate-800" : "bg-slate-200"
                      )}>
                        <StepIcon type="check" className={cn("w-3.5 h-3.5", isLight ? "text-white" : "text-slate-900")} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Site Name Card */}
            <div className={cn(
              "rounded-xl border p-5",
              isLight ? "bg-white border-slate-200 shadow-sm" : "bg-slate-900/50 border-slate-800"
            )}>
              <div className="flex items-center gap-3 mb-3">
                <div className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center",
                  isLight ? "bg-slate-100" : "bg-slate-800"
                )}>
                  <svg className={cn("w-5 h-5", isLight ? "text-slate-600" : "text-slate-400")} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                  </svg>
                </div>
                <div>
                  <h3 className={cn("font-semibold text-sm leading-tight", isLight ? "text-slate-900" : "text-slate-100")}>Site Name</h3>
                  <p className={cn("text-xs", isLight ? "text-slate-500" : "text-slate-500")}>Appears in your WordPress dashboard</p>
                </div>
              </div>
              <Input
                id="site-name"
                value={siteName}
                onValueChange={setSiteName}
                placeholder="My Website"
                classNames={inputClassNames}
                variant="bordered"
                size="md"
              />
            </div>

            {/* Admin Credentials Card */}
            <div className={cn(
              "rounded-xl border p-5",
              isLight ? "bg-white border-slate-200 shadow-sm" : "bg-slate-900/50 border-slate-800"
            )}>
              <div className="flex items-center gap-3 mb-4">
                <div className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center",
                  isLight ? "bg-slate-100" : "bg-slate-800"
                )}>
                  <svg className={cn("w-5 h-5", isLight ? "text-slate-600" : "text-slate-400")} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                  </svg>
                </div>
                <div>
                  <h3 className={cn("font-semibold text-sm leading-tight", isLight ? "text-slate-900" : "text-slate-100")}>Admin Credentials</h3>
                  <p className={cn("text-xs", isLight ? "text-slate-500" : "text-slate-500")}>Login details sent to your email</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="admin-username" className={cn(
                    "block text-xs font-medium mb-1.5",
                    isLight ? "text-slate-600" : "text-slate-400"
                  )}>
                    Admin Username
                  </label>
                  <Input
                    id="admin-username"
                    value={adminUsername}
                    onValueChange={setAdminUsername}
                    placeholder="admin"
                    classNames={inputClassNames}
                    variant="bordered"
                    size="md"
                  />
                </div>
                <div>
                  <label htmlFor="admin-email" className={cn(
                    "block text-xs font-medium mb-1.5",
                    isLight ? "text-slate-600" : "text-slate-400"
                  )}>
                    Admin Email <span className="text-slate-400">*</span>
                  </label>
                  <Input
                    id="admin-email"
                    value={adminEmail}
                    onValueChange={setAdminEmail}
                    placeholder="admin@example.com"
                    type="email"
                    classNames={inputClassNames}
                    variant="bordered"
                    size="md"
                  />
                </div>
                <div>
                  <label htmlFor="admin-password" className={cn(
                    "block text-xs font-medium mb-1.5",
                    isLight ? "text-slate-600" : "text-slate-400"
                  )}>
                    Admin Password <span className="text-slate-400">*</span>
                  </label>
                  <Input
                    id="admin-password"
                    value={adminPassword}
                    onValueChange={setAdminPassword}
                    placeholder="Enter password"
                    type="password"
                    classNames={inputClassNames}
                    variant="bordered"
                    size="md"
                  />
                </div>
                <div>
                  <label htmlFor="confirm-password" className={cn(
                    "block text-xs font-medium mb-1.5",
                    isLight ? "text-slate-600" : "text-slate-400"
                  )}>
                    Confirm Password <span className="text-slate-400">*</span>
                  </label>
                  <Input
                    id="confirm-password"
                    value={confirmPassword}
                    onValueChange={setConfirmPassword}
                    placeholder="Confirm password"
                    type="password"
                    classNames={inputClassNames}
                    variant="bordered"
                    size="md"
                    isInvalid={confirmPassword.length > 0 && adminPassword !== confirmPassword}
                    errorMessage={confirmPassword.length > 0 && adminPassword !== confirmPassword ? "Passwords do not match" : ""}
                  />
                </div>
              </div>

              {/* Credentials Warning */}
              <div className={cn(
                "mt-4 rounded-lg p-3 flex items-start gap-2.5",
                isLight
                  ? "bg-slate-100 border border-slate-200"
                  : "bg-slate-800/50 border border-slate-700"
              )}>
                <svg className={cn("w-4 h-4 flex-shrink-0 mt-0.5", isLight ? "text-slate-600" : "text-slate-400")} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <p className={cn("text-xs leading-relaxed", isLight ? "text-slate-600" : "text-slate-400")}>
                  <span className="font-semibold">Save these credentials!</span> You&apos;ll need them to log into your WordPress dashboard.
                </p>
              </div>
            </div>

            {/* Pre-installed Plugins */}
            <div className={cn(
              "rounded-xl border p-5",
              isLight ? "bg-white border-slate-200 shadow-sm" : "bg-slate-900/50 border-slate-800"
            )}>
              <div className="flex items-center gap-3 mb-4">
                <div className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center",
                  isLight ? "bg-slate-100" : "bg-slate-800"
                )}>
                  <StepIcon type="plugin" className={cn("w-5 h-5", isLight ? "text-slate-600" : "text-slate-400")} />
                </div>
                <div>
                  <h3 className={cn("font-semibold text-sm leading-tight", isLight ? "text-slate-900" : "text-slate-100")}>Pre-installed Plugins</h3>
                  <p className={cn("text-xs", isLight ? "text-slate-500" : "text-slate-500")}>Select plugins to install automatically</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {PLUGINS.map((plugin) => (
                  <label
                    key={plugin.id}
                    htmlFor={`plugin-${plugin.id}`}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                      selectedPlugins.has(plugin.id)
                        ? isLight ? "bg-slate-100" : "bg-slate-800/60"
                        : isLight ? "hover:bg-slate-50" : "hover:bg-slate-800/30"
                    )}
                  >
                    <input
                      type="checkbox"
                      id={`plugin-${plugin.id}`}
                      checked={selectedPlugins.has(plugin.id)}
                      onChange={() => togglePlugin(plugin.id)}
                      className={cn(
                        "w-4 h-4 rounded border-2 transition-colors cursor-pointer",
                        isLight ? "border-slate-300 accent-slate-800" : "border-slate-600 accent-slate-200"
                      )}
                    />
                    <span className={cn("text-sm font-medium flex-1", isLight ? "text-slate-700" : "text-slate-300")}>
                      {plugin.name}
                    </span>
                    {plugin.recommended && (
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full",
                        isLight ? "bg-slate-800 text-white" : "bg-slate-200 text-slate-900"
                      )}>
                        Recommended
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Starter Templates */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center",
                  isLight ? "bg-slate-100" : "bg-slate-800"
                )}>
                  <StepIcon type="template" className={cn("w-5 h-5", isLight ? "text-slate-600" : "text-slate-400")} />
                </div>
                <div>
                  <h3 className={cn("font-semibold text-sm leading-tight", isLight ? "text-slate-900" : "text-slate-100")}>Starter Template</h3>
                  <p className={cn("text-xs", isLight ? "text-slate-500" : "text-slate-500")}>Choose a starting point for your site</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {STARTER_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setStarterTemplate(tpl.id)}
                    className={cn(
                      "relative rounded-xl border-2 p-3 text-left transition-all duration-300 overflow-hidden",
                      starterTemplate === tpl.id
                        ? isLight
                          ? "border-slate-400 shadow-md"
                          : "border-slate-500"
                        : isLight
                        ? "border-slate-200 hover:border-slate-300"
                        : "border-slate-800 hover:border-slate-700"
                    )}
                  >
                    <div className={cn(
                      "w-full h-20 rounded-lg bg-gradient-to-br mb-2.5",
                      tpl.gradient
                    )} />
                    <h4 className={cn("font-semibold text-sm text-center", isLight ? "text-slate-900" : "text-slate-100")}>
                      {tpl.name}
                    </h4>
                    {starterTemplate === tpl.id && (
                      <div className={cn(
                        "absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center",
                        isLight ? "bg-slate-800" : "bg-slate-200"
                      )}>
                        <StepIcon type="check" className={cn("w-3.5 h-3.5", isLight ? "text-white" : "text-slate-900")} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        // Step 4: Finalize
        const selectedPkg = PACKAGES.find((p) => p.id === selectedPackage);
        const displayPrice = selectedPkg ? getDisplayPrice(selectedPkg) : "";
        const selectedDc = DATA_CENTERS.find((dc) => dc.id === dataCenter);
        const selectedTpl = STARTER_TEMPLATES.find((t) => t.id === starterTemplate);

        return (
          <div className="space-y-5">
            <div className="text-center">
              <h2 className={cn(
                "text-xl font-bold mb-1.5",
                isLight ? "text-slate-900" : "text-slate-100"
              )}>
                Review & Create
              </h2>
              <p className={cn(
                "text-sm",
                isLight ? "text-slate-500" : "text-slate-400"
              )}>
                Double-check your configuration before launching.
              </p>
            </div>

            {/* Order Summary Card */}
            <div className={cn(
              "rounded-xl border overflow-hidden",
              isLight ? "bg-white border-slate-200 shadow-sm" : "bg-slate-900/50 border-slate-800"
            )}>
              <div className={cn(
                "px-5 py-3 border-b",
                isLight ? "bg-slate-50 border-slate-200" : "bg-slate-800/50 border-slate-800"
              )}>
                <h3 className={cn("font-semibold text-sm", isLight ? "text-slate-900" : "text-slate-100")}>
                  Order Summary
                </h3>
              </div>
              <div className="p-4 space-y-0">
                {[
                  { label: "Package", value: `${selectedPkg?.name} (${displayPrice}${selectedPkg?.period})`, icon: "package" },
                  { label: "Billing", value: billingCycle === "annual" ? "Annual (Save 20%)" : "Monthly", icon: "creditcard" },
                  { label: "Site Name", value: siteName || "\u2014", icon: "starter" },
                  { label: "Domain", value: domainType === "subdomain" ? `${domain || "\u2014"}.limewp.com` : (domain || "\u2014"), icon: "globe" },
                  { label: "Data Center", value: selectedDc ? `${selectedDc.flag} ${selectedDc.name} (${selectedDc.location})` : "\u2014", icon: "server" },
                  { label: "Template", value: selectedTpl?.name || "\u2014", icon: "template" },
                  { label: "Plugins", value: selectedPlugins.size > 0 ? `${selectedPlugins.size} selected` : "None", icon: "plugin" },
                  { label: "PHP Version", value: PHP_VERSIONS.find((v) => v.key === Array.from(phpVersion)[0])?.label, icon: "wordpress" },
                  { label: "WordPress", value: WP_VERSIONS.find((v) => v.key === Array.from(wpVersion)[0])?.label, icon: "wordpress" },
                ].map((item, index, arr) => (
                  <div
                    key={item.label}
                    className={cn(
                      "flex items-center justify-between py-2.5",
                      index < arr.length - 1 && (isLight ? "border-b border-slate-100" : "border-b border-slate-800")
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={cn(
                        "w-7 h-7 rounded-md flex items-center justify-center",
                        isLight ? "bg-slate-100" : "bg-slate-800"
                      )}>
                        <StepIcon type={item.icon} className={cn("w-4 h-4", isLight ? "text-slate-500" : "text-slate-400")} />
                      </div>
                      <span className={cn("text-sm", isLight ? "text-slate-600" : "text-slate-400")}>{item.label}</span>
                    </div>
                    <span className={cn("text-sm font-semibold", isLight ? "text-slate-900" : "text-slate-100")}>
                      {item.value}
                    </span>
                  </div>
                ))}

                {/* Total */}
                <div className={cn(
                  "flex items-center justify-between py-3 mt-2 border-t-2",
                  isLight ? "border-slate-200" : "border-slate-700"
                )}>
                  <span className={cn("text-sm font-bold", isLight ? "text-slate-900" : "text-slate-100")}>
                    Total
                  </span>
                  <div className="text-right">
                    <span className={cn("text-lg font-bold", isLight ? "text-slate-900" : "text-slate-100")}>
                      {displayPrice}
                    </span>
                    <span className={cn("text-sm font-medium", isLight ? "text-slate-400" : "text-slate-500")}>
                      /month
                    </span>
                    {billingCycle === "annual" && (
                      <p className="text-xs text-emerald-500 font-medium">
                        Billed ${parseInt(displayPrice.replace("$", "")) * 12}/yr
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div>
              <h3 className={cn("font-semibold text-sm mb-3", isLight ? "text-slate-900" : "text-slate-100")}>
                Payment Method
              </h3>

              {/* Method tabs */}
              <div className="flex gap-2 mb-4">
                {([
                  { key: "card" as const, label: "Card", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
                  { key: "balance" as const, label: "Balance", icon: "M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 013 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 013 6v3" },
                  { key: "crypto" as const, label: "Crypto", icon: "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" },
                ]).map((m) => (
                  <button key={m.key} onClick={() => setPaymentMethod(m.key)} className={cn(
                    "flex-1 h-10 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 border",
                    paymentMethod === m.key
                      ? isLight ? "border-slate-400 bg-slate-100 text-slate-800" : "border-slate-500 bg-slate-700/30 text-slate-100"
                      : isLight ? "border-slate-200 text-slate-600 hover:bg-slate-50" : "border-slate-800 text-slate-400 hover:bg-slate-800/50"
                  )}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d={m.icon} /></svg>
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Card selection */}
              {paymentMethod === "card" && (
                <div className="space-y-2">
                  {SAVED_CARDS.map((card) => (
                    <button key={card.id} onClick={() => { setSelectedPaymentCard(card.id); setShowAddCard(false); }} className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-left",
                      selectedPaymentCard === card.id && !showAddCard
                        ? isLight ? "border-emerald-500/50 bg-emerald-50" : "border-emerald-500/30 bg-emerald-500/5"
                        : isLight ? "border-slate-200 hover:border-slate-300" : "border-slate-800 hover:border-slate-700"
                    )}>
                      <div className={cn("w-10 h-7 rounded-md flex items-center justify-center text-xs font-bold text-white", card.color)}>{card.brand[0]}</div>
                      <div className="flex-1">
                        <span className={cn("text-sm font-medium", isLight ? "text-slate-700" : "text-slate-200")}>{card.brand} •••• {card.last4}</span>
                        <span className={cn("text-xs ml-2", isLight ? "text-slate-400" : "text-slate-500")}>exp {card.expiry}</span>
                      </div>
                      {selectedPaymentCard === card.id && !showAddCard && (
                        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      )}
                    </button>
                  ))}

                  {/* Add new card */}
                  {!showAddCard ? (
                    <button onClick={() => setShowAddCard(true)} className={cn(
                      "w-full flex items-center justify-center gap-2 px-3 py-3 rounded-xl border-2 border-dashed transition-all text-sm font-medium",
                      isLight ? "border-slate-300 text-slate-500 hover:border-slate-400 hover:text-slate-700" : "border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                    )}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                      Add New Card
                    </button>
                  ) : (
                    <div className={cn("rounded-xl border p-4 space-y-3", isLight ? "border-slate-200 bg-slate-50" : "border-slate-800 bg-slate-900/50")}>
                      <div>
                        <label htmlFor="new-card-number" className={cn("text-xs font-medium block mb-1", isLight ? "text-slate-500" : "text-slate-400")}>Card Number</label>
                        <input id="new-card-number" type="text" value={newCardNumber} onChange={(e) => setNewCardNumber(e.target.value)} placeholder="4242 4242 4242 4242" className={cn("w-full h-10 rounded-xl border px-3 text-sm font-mono outline-none transition-colors", isLight ? "bg-white border-slate-200 text-slate-800 focus:border-slate-400" : "bg-[var(--bg-primary)] border-[var(--border-tertiary)] text-slate-200 focus:border-[var(--border-primary)]")} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="new-card-expiry" className={cn("text-xs font-medium block mb-1", isLight ? "text-slate-500" : "text-slate-400")}>Expiry</label>
                          <input id="new-card-expiry" type="text" value={newCardExpiry} onChange={(e) => setNewCardExpiry(e.target.value)} placeholder="MM/YY" className={cn("w-full h-10 rounded-xl border px-3 text-sm font-mono outline-none transition-colors", isLight ? "bg-white border-slate-200 text-slate-800 focus:border-slate-400" : "bg-[var(--bg-primary)] border-[var(--border-tertiary)] text-slate-200 focus:border-[var(--border-primary)]")} />
                        </div>
                        <div>
                          <label htmlFor="new-card-cvc" className={cn("text-xs font-medium block mb-1", isLight ? "text-slate-500" : "text-slate-400")}>CVC</label>
                          <input id="new-card-cvc" type="text" value={newCardCvc} onChange={(e) => setNewCardCvc(e.target.value)} placeholder="123" className={cn("w-full h-10 rounded-xl border px-3 text-sm font-mono outline-none transition-colors", isLight ? "bg-white border-slate-200 text-slate-800 focus:border-slate-400" : "bg-[var(--bg-primary)] border-[var(--border-tertiary)] text-slate-200 focus:border-[var(--border-primary)]")} />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setShowAddCard(false)} className={cn("flex-1 h-9 rounded-xl text-xs font-medium", isLight ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-slate-800 text-slate-400 hover:text-slate-200")}>Cancel</button>
                        <button onClick={() => { setShowAddCard(false); showToast.success("Card added"); }} className={cn("flex-1 h-9 rounded-xl text-xs font-semibold text-white", isLight ? "bg-slate-800 hover:bg-slate-700" : "bg-slate-200 text-slate-900 hover:bg-slate-100")}>Save Card</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Balance */}
              {paymentMethod === "balance" && (
                <div className={cn("rounded-xl p-4", isLight ? "bg-slate-50 border border-slate-200" : "bg-slate-800/30 border border-slate-700")}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn("text-sm font-medium", isLight ? "text-slate-700" : "text-slate-200")}>Account Balance</span>
                    <span className={cn("text-lg font-bold", isLight ? "text-slate-800" : "text-slate-100")}>$142.50</span>
                  </div>
                  <div className={cn("h-2 rounded-full overflow-hidden", isLight ? "bg-slate-200" : "bg-slate-700")}>
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: "71%" }} />
                  </div>
                  <p className={cn("text-[10px] mt-1.5", isLight ? "text-slate-400" : "text-slate-500")}>
                    Sufficient for this purchase
                  </p>
                </div>
              )}

              {/* Crypto */}
              {paymentMethod === "crypto" && (
                <div className="space-y-2">
                  {CRYPTO_OPTIONS.map((coin) => (
                    <button key={coin.key} onClick={() => setSelectedCrypto(coin.key)} className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-left",
                      selectedCrypto === coin.key
                        ? isLight ? "border-emerald-500/50 bg-emerald-50" : "border-emerald-500/30 bg-emerald-500/5"
                        : isLight ? "border-slate-200 hover:border-slate-300" : "border-slate-800 hover:border-slate-700"
                    )}>
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold", coin.color)}>{coin.icon}</div>
                      <span className={cn("text-sm font-medium flex-1", isLight ? "text-slate-700" : "text-slate-200")}>{coin.name}</span>
                      {selectedCrypto === coin.key && (
                        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      )}
                    </button>
                  ))}
                  <p className={cn("text-[10px]", isLight ? "text-slate-400" : "text-slate-500")}>You will receive a wallet address after confirming</p>
                </div>
              )}
            </div>

            {/* Success Box */}
            <div className={cn(
              "rounded-xl p-4 flex items-start gap-3 border",
              isLight ? "bg-slate-100 border-slate-200" : "bg-slate-800/50 border-slate-700"
            )}>
              <div className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                isLight ? "bg-slate-800" : "bg-slate-200"
              )}>
                <StepIcon type="rocket" className={cn("w-5 h-5", isLight ? "text-white" : "text-slate-900")} />
              </div>
              <div>
                <p className={cn("font-semibold text-sm", isLight ? "text-slate-800" : "text-slate-200")}>
                  Ready for Launch!
                </p>
                <p className={cn("text-xs leading-relaxed", isLight ? "text-slate-600" : "text-slate-400")}>
                  Your WordPress site will be deployed instantly with SSL, backups, and staging included.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Creation Progress Overlay
  const selectedPkgForPrice = PACKAGES.find((p) => p.id === selectedPackage);
  const currentPrice = selectedPkgForPrice ? getDisplayPrice(selectedPkgForPrice) : "$0";

  // Crypto payment overlay
  if (cryptoStep !== "idle" && !creating) {
    const priceNum = parseInt(currentPrice.replace("$", "")) || 0;
    const cryptoData: Record<string, { name: string; icon: string; color: string; amount: string; address: string }> = {
      btc: { name: "Bitcoin", icon: "\u20BF", color: "bg-orange-500", amount: (priceNum / 65000).toFixed(6), address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" },
      eth: { name: "Ethereum", icon: "\u039E", color: "bg-violet-500", amount: (priceNum / 3200).toFixed(5), address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F" },
      usdt: { name: "USDT", icon: "\u20AE", color: "bg-emerald-500", amount: String(priceNum), address: "TN2Yv5jGdP2RVbGMEBfaWEed7JE6mczZ3p" },
    };
    const coin = cryptoData[selectedCrypto || "btc"];
    const minutes = Math.floor(cryptoTimer / 60);
    const seconds = cryptoTimer % 60;

    return (
      <AppShell>
        <div className="max-w-md mx-auto py-12">
          <div className={cn("rounded-2xl border overflow-hidden", isLight ? "bg-white border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]")}>
            <div className={cn("p-6")}>
              {/* Status */}
              <div className="flex items-center justify-center gap-2 mb-6">
                {cryptoStep === "paying" && (
                  <>
                    <svg className="w-5 h-5 animate-spin text-amber-400" fill="none" viewBox="0 0 24 24" aria-hidden="true"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                    <span className="text-sm font-semibold text-amber-400">Waiting for payment...</span>
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
                    <span className="text-sm font-semibold text-emerald-400">Payment confirmed! Creating site...</span>
                  </>
                )}
              </div>

              {/* Amount */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className={cn("w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold", coin.color)}>{coin.icon}</div>
                  <span className={cn("text-xl font-bold", isLight ? "text-slate-800" : "text-slate-100")}>{coin.amount} {(selectedCrypto || "btc").toUpperCase()}</span>
                </div>
                <span className={cn("text-xs", isLight ? "text-slate-500" : "text-slate-400")}>≈ {currentPrice}/mo</span>
              </div>

              {/* Wallet address + QR (only during paying) */}
              {cryptoStep === "paying" && (
                <>
                  <div className={cn("rounded-xl p-3 mb-4", isLight ? "bg-slate-50 border border-slate-200" : "bg-[var(--bg-elevated)] border border-[var(--border-tertiary)]")}>
                    <p className={cn("text-[10px] mb-1.5", isLight ? "text-slate-500" : "text-slate-400")}>Send exactly to this address:</p>
                    <div className="flex items-center gap-2">
                      <p className={cn("text-xs font-mono break-all flex-1", isLight ? "text-slate-700" : "text-slate-200")}>{coin.address}</p>
                      <button onClick={() => { navigator.clipboard.writeText(coin.address); showToast.success("Address copied"); }} aria-label="Copy address" className={cn("w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center", isLight ? "bg-slate-100 hover:bg-slate-200 text-slate-500" : "bg-[var(--bg-primary)] hover:bg-[var(--border-primary)] text-slate-400")}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg>
                      </button>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="flex justify-center mb-4">
                    <div className="w-36 h-36 rounded-xl bg-white p-2 shadow-sm">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        {/* QR code pattern */}
                        <rect fill="#000" x="5" y="5" width="25" height="25" rx="2" />
                        <rect fill="#fff" x="9" y="9" width="17" height="17" rx="1" />
                        <rect fill="#000" x="13" y="13" width="9" height="9" rx="1" />
                        <rect fill="#000" x="70" y="5" width="25" height="25" rx="2" />
                        <rect fill="#fff" x="74" y="9" width="17" height="17" rx="1" />
                        <rect fill="#000" x="78" y="13" width="9" height="9" rx="1" />
                        <rect fill="#000" x="5" y="70" width="25" height="25" rx="2" />
                        <rect fill="#fff" x="9" y="74" width="17" height="17" rx="1" />
                        <rect fill="#000" x="13" y="78" width="9" height="9" rx="1" />
                        {/* Data modules */}
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
                        <rect fill="#000" x="35" y="70" width="5" height="5" />
                        <rect fill="#000" x="50" y="70" width="5" height="5" />
                        <rect fill="#000" x="65" y="70" width="5" height="5" />
                        <rect fill="#000" x="80" y="70" width="5" height="5" />
                        <rect fill="#000" x="40" y="80" width="5" height="5" />
                        <rect fill="#000" x="55" y="80" width="5" height="5" />
                        <rect fill="#000" x="70" y="80" width="5" height="5" />
                        <rect fill="#000" x="85" y="80" width="5" height="5" />
                        <rect fill="#000" x="35" y="90" width="5" height="5" />
                        <rect fill="#000" x="45" y="90" width="5" height="5" />
                        <rect fill="#000" x="60" y="90" width="5" height="5" />
                        <rect fill="#000" x="75" y="90" width="5" height="5" />
                        <rect fill="#000" x="90" y="90" width="5" height="5" />
                      </svg>
                    </div>
                  </div>

                  <div className="text-center">
                    <span className={cn("text-xs", cryptoTimer < 300 ? "text-rose-400" : isLight ? "text-slate-500" : "text-slate-400")}>
                      Expires in {minutes}:{seconds.toString().padStart(2, "0")}
                    </span>
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
                        <div className={cn("w-4 h-4 rounded-full border-2", isLight ? "border-slate-300" : "border-slate-600")} />
                      )}
                      <span className={cn("text-xs", cryptoConfirmations >= n ? (isLight ? "text-slate-700" : "text-slate-200") : (isLight ? "text-slate-400" : "text-slate-500"))}>
                        Confirmation {n}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  if (creating) {
    const progress = creationComplete
      ? 100
      : ((creationStep + 1) / CREATION_STEPS.length) * 100;

    return (
      <AppShell>
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: isLight ? "rgba(255,255,255,0.95)" : "rgba(15,23,42,0.97)" }}>
          <div className="max-w-md w-full mx-auto px-6">
            {!creationComplete ? (
              <div className="text-center">
                {/* Animated Rocket */}
                <div className="mb-8 relative">
                  <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center animate-pulse"
                    style={{ background: isLight ? "#1e293b" : "#e2e8f0" }}>
                    <StepIcon type="rocket" className={cn("w-10 h-10", isLight ? "text-white" : "text-slate-900")} />
                  </div>
                </div>

                <h2 className={cn("text-2xl font-bold mb-2", isLight ? "text-slate-900" : "text-slate-100")}>
                  Creating Your Site
                </h2>
                <p className={cn("text-sm mb-8", isLight ? "text-slate-500" : "text-slate-400")}>
                  This will only take a moment...
                </p>

                {/* Progress Bar */}
                <div className={cn(
                  "w-full h-2 rounded-full overflow-hidden mb-8",
                  isLight ? "bg-slate-200" : "bg-slate-800"
                )}>
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${progress}%`,
                      background: isLight ? "#1e293b" : "#e2e8f0",
                    }}
                  />
                </div>

                {/* Steps */}
                <div className="space-y-3 text-left">
                  {CREATION_STEPS.map((step, index) => (
                    <div
                      key={step}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300",
                        index <= creationStep
                          ? isLight ? "bg-slate-50" : "bg-slate-800/50"
                          : "opacity-40"
                      )}
                    >
                      {index < creationStep ? (
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                          isLight ? "bg-slate-800" : "bg-slate-200"
                        )}>
                          <StepIcon type="check" className={cn("w-3.5 h-3.5", isLight ? "text-white" : "text-slate-900")} />
                        </div>
                      ) : index === creationStep ? (
                        <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                          <svg className={cn("w-5 h-5 animate-spin", isLight ? "text-slate-800" : "text-slate-200")} fill="none" viewBox="0 0 24 24" aria-hidden="true">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        </div>
                      ) : (
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                          isLight ? "bg-slate-200" : "bg-slate-700"
                        )}>
                          <span className={cn("text-xs font-bold", isLight ? "text-slate-400" : "text-slate-500")}>
                            {index + 1}
                          </span>
                        </div>
                      )}
                      <span className={cn(
                        "text-sm font-medium",
                        index <= creationStep
                          ? isLight ? "text-slate-900" : "text-slate-100"
                          : isLight ? "text-slate-400" : "text-slate-600"
                      )}>
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center">
                {/* Success Icon */}
                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center"
                    style={{ background: "#10b981" }}>
                    <StepIcon type="check" className="w-10 h-10 text-white" />
                  </div>
                </div>

                <h2 className={cn("text-2xl font-bold mb-2", isLight ? "text-slate-900" : "text-slate-100")}>
                  Your Site is Ready!
                </h2>
                <p className={cn("text-sm mb-3", isLight ? "text-slate-500" : "text-slate-400")}>
                  <span className="font-semibold">{siteName || "Your site"}</span> has been created successfully.
                </p>
                <p className={cn("text-xs mb-8", isLight ? "text-slate-400" : "text-slate-500")}>
                  {domainType === "subdomain" ? `${domain}.limewp.com` : domain}
                </p>

                <Button
                  onPress={() => router.push(ROUTES.DASHBOARD)}
                  className={cn(
                    "font-semibold text-sm rounded-lg h-11 px-8 shadow-md transition-all hover:scale-[1.02]",
                    isLight
                      ? "bg-slate-800 text-white shadow-slate-500/20 hover:bg-slate-700"
                      : "bg-slate-100 text-slate-900 shadow-slate-500/10 hover:bg-slate-200"
                  )}
                >
                  Go to Dashboard
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Button>
              </div>
            )}
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto pb-6">
        {/* Header */}
        <div className="mb-4">
          <button
            onClick={handleCancel}
            className={cn(
              "flex items-center gap-2 text-sm transition-colors group",
              isLight
                ? "text-slate-500 hover:text-slate-700"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Back to Dashboard
          </button>
        </div>

        {/* Wizard Container */}
        <div className={cn(
          "rounded-xl overflow-hidden",
          isLight ? "bg-white shadow-sm" : "bg-slate-900/50"
        )}>
          {/* Step Indicator */}
          <div className={cn(
            "px-5 pt-5",
            isLight ? "bg-slate-50/50" : "bg-slate-900/30"
          )}>
            <StepIndicator />
          </div>

          {/* Step Content */}
          <div className="p-5">
            {renderStep()}
          </div>

          {/* Navigation */}
          <div className={cn(
            "flex items-center justify-between px-5 py-5",
            isLight ? "bg-slate-50/50" : "bg-slate-900/30"
          )}>
          <Button
            variant="flat"
            onPress={currentStep === 1 ? handleCancel : handleBack}
            className={cn(
              "font-semibold text-sm rounded-lg h-10 px-5",
              isLight
                ? "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800"
                : "bg-slate-800 text-slate-400 hover:text-slate-200"
            )}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            {currentStep === 1 ? "Cancel" : "Back"}
          </Button>

          {currentStep < 4 ? (
            <Button
              onPress={handleNext}
              isDisabled={!canProceed()}
              className={cn(
                "font-semibold text-sm rounded-lg h-10 px-6 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]",
                isLight
                  ? "bg-slate-800 text-white shadow-slate-500/20 hover:bg-slate-700 hover:shadow-slate-500/30"
                  : "bg-slate-100 text-slate-900 shadow-slate-500/10 hover:bg-slate-200 hover:shadow-slate-500/20"
              )}
            >
              Continue
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Button>
          ) : (
            <Button
              onPress={handleSubmit}
              isDisabled={!canProceed()}
              isLoading={isCreating}
              className={cn(
                "font-semibold text-sm rounded-lg h-10 px-7 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]",
                isLight
                  ? "bg-slate-800 text-white shadow-slate-500/20 hover:bg-slate-700 hover:shadow-slate-500/30"
                  : "bg-slate-100 text-slate-900 shadow-slate-500/10 hover:bg-slate-200 hover:shadow-slate-500/20"
              )}
            >
              {isCreating ? "Creating..." : (
                <>
                  <StepIcon type="rocket" className="w-4 h-4 mr-2" />
                  Launch Site
                </>
              )}
            </Button>
          )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
