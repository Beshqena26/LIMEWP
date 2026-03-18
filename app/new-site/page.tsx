"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import AppShell from "../components/AppShell";
import { useTheme } from "@/lib/context/ThemeContext";
import { cn } from "@/lib/utils";
import { INPUT_CLASS_NAMES, SELECT_CLASS_NAMES } from "@/data/settings";
import { ROUTES } from "@/config/routes";

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
    period: "/month",
    description: "Perfect for small sites",
    features: ["1 Website", "10GB SSD Storage", "Free SSL Certificate", "Daily Backups"],
  },
  {
    id: "premium",
    name: "Premium",
    price: "$45",
    period: "/month",
    description: "Ideal for growing businesses",
    features: ["5 Websites", "50GB SSD Storage", "Free SSL Certificate", "Daily Backups", "Staging Environment", "Priority Support"],
    popular: true,
  },
  {
    id: "business",
    name: "Business",
    price: "$80",
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

// Icon Component - defined outside to prevent recreation
const StepIcon = ({ type, className }: { type: string; className?: string }) => {
  const icons: Record<string, React.ReactNode> = {
    package: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
    ),
    globe: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    wordpress: (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-1.5 15.5L7 9.5h2l2.5 6 2.5-6h2l-3.5 8h-2zM12 4c4.411 0 8 3.589 8 8 0 .886-.146 1.739-.414 2.535L16.5 9.5h-2l2.086 5.035L14.5 19l-2.5-6-2.5 6-2.086-4.465L9.5 9.5h-2l-3.086 5.035A7.967 7.967 0 014 12c0-4.411 3.589-8 8-8z" />
      </svg>
    ),
    rocket: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
    ),
    starter: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
    premium: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    business: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21" />
      </svg>
    ),
    search: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
    link: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
      </svg>
    ),
    gift: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
    check: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
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
  const [siteName, setSiteName] = useState("");
  const [domain, setDomain] = useState("");
  const [domainType, setDomainType] = useState<"existing" | "subdomain">("existing");
  const [sslType, setSslType] = useState<"letsencrypt" | "cloudflare">("letsencrypt");
  const [phpVersion, setPhpVersion] = useState<Set<string>>(new Set(["8.3"]));
  const [wpVersion, setWpVersion] = useState<Set<string>>(new Set(["latest"]));
  const [adminEmail, setAdminEmail] = useState("");
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [originCertificate, setOriginCertificate] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  const inputClassNames = useMemo(() => isLight
    ? {
        inputWrapper: "bg-white border-zinc-200 hover:border-zinc-300 !rounded-xl shadow-sm group-data-[focus=true]:border-zinc-400",
        input: "text-zinc-800 placeholder:text-zinc-400",
      }
    : INPUT_CLASS_NAMES, [isLight]);

  const selectClassNames = useMemo(() => isLight
    ? {
        trigger: "bg-white border-zinc-200 hover:border-zinc-300 !rounded-xl text-zinc-800 shadow-sm data-[focus=true]:border-zinc-400",
        value: "text-zinc-800",
        popoverContent: "bg-white border border-zinc-200 rounded-xl shadow-lg",
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

  const handleSubmit = useCallback(async () => {
    if (!canProceed()) return;

    setIsCreating(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Creating site:", {
      package: selectedPackage,
      siteName,
      domain,
      domainType,
      phpVersion: Array.from(phpVersion)[0],
      wpVersion: Array.from(wpVersion)[0],
      adminEmail,
      adminUsername,
    });

    setIsCreating(false);
    router.push(ROUTES.DASHBOARD);
  }, [canProceed, selectedPackage, siteName, domain, domainType, phpVersion, wpVersion, adminEmail, adminUsername, router]);

  const handleCancel = useCallback(() => {
    router.push(ROUTES.DASHBOARD);
  }, [router]);

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
                      ? "bg-zinc-800 text-white shadow-lg scale-100"
                      : "bg-zinc-200 text-zinc-900 shadow-lg scale-100"
                    : currentStep === step.id
                    ? isLight
                      ? "bg-zinc-800 text-white shadow-xl ring-2 ring-zinc-300 scale-105"
                      : "bg-zinc-200 text-zinc-900 shadow-xl ring-2 ring-zinc-600 scale-105"
                    : isLight
                    ? "bg-zinc-100 text-zinc-400 scale-100"
                    : "bg-zinc-800 text-zinc-500 scale-100"
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
                    ? isLight ? "text-zinc-900" : "text-zinc-100"
                    : isLight ? "text-zinc-400" : "text-zinc-600"
                )}>
                  {step.name}
                </p>
              </div>
            </div>
            {index < STEPS.length - 1 && (
              <div className={cn(
                "w-10 h-1 mt-[-24px] rounded-full overflow-hidden relative",
                isLight ? "bg-zinc-200" : "bg-zinc-800"
              )}>
                <div
                  className={cn(
                    "absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out",
                    isLight ? "bg-zinc-800" : "bg-zinc-200",
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
                isLight ? "text-zinc-900" : "text-zinc-100"
              )}>
                Choose Your Package
              </h2>
              <p className={cn(
                "text-sm",
                isLight ? "text-zinc-500" : "text-zinc-400"
              )}>
                Select the plan that best fits your needs. You can upgrade anytime.
              </p>
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
                        ? "border-zinc-400 bg-gradient-to-b from-zinc-100 to-white"
                        : "border-zinc-500 bg-gradient-to-b from-zinc-700/30 to-transparent"
                      : isLight
                      ? "border-zinc-200 bg-white hover:border-zinc-300"
                      : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900"
                  )}
                >
                  {pkg.popular && (
                    <div className={cn(
                      "absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-[11px] font-bold shadow-lg",
                      isLight ? "bg-zinc-800 text-white" : "bg-zinc-200 text-zinc-900"
                    )}>
                      Most Popular
                    </div>
                  )}

                  {/* Package Name & Description */}
                  <div className="mb-5 w-full">
                    <h3 className={cn(
                      "text-lg font-bold leading-tight mb-0.5",
                      isLight ? "text-zinc-900" : "text-zinc-100"
                    )}>
                      {pkg.name}
                    </h3>
                    <p className={cn(
                      "text-xs",
                      isLight ? "text-zinc-500" : "text-zinc-500"
                    )}>
                      {pkg.description}
                    </p>
                  </div>

                  {/* Price Section */}
                  <div className={cn(
                    "mb-5 pb-5 w-full border-b",
                    isLight ? "border-zinc-100" : "border-zinc-800"
                  )}>
                    <div className="flex items-baseline gap-1">
                      <span className={cn(
                        "text-3xl font-bold tracking-tight",
                        isLight ? "text-zinc-900" : "text-zinc-100"
                      )}>
                        {pkg.price}
                      </span>
                      <span className={cn(
                        "text-sm font-medium",
                        isLight ? "text-zinc-400" : "text-zinc-500"
                      )}>
                        {pkg.period}
                      </span>
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 w-full">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm">
                        <div className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                          selectedPackage === pkg.id
                            ? isLight ? "bg-zinc-800" : "bg-zinc-200"
                            : isLight ? "bg-zinc-200" : "bg-zinc-700"
                        )}>
                          <StepIcon type="check" className={cn(
                            "w-3 h-3",
                            selectedPackage === pkg.id
                              ? isLight ? "text-white" : "text-zinc-900"
                              : isLight ? "text-zinc-500" : "text-zinc-400"
                          )} />
                        </div>
                        <span className={cn(
                          "font-medium",
                          isLight ? "text-zinc-700" : "text-zinc-300"
                        )}>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Selection indicator */}
                  <div className={cn(
                    "absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center transition-opacity duration-150",
                    isLight ? "bg-zinc-800" : "bg-zinc-200",
                    selectedPackage === pkg.id
                      ? "opacity-100"
                      : "opacity-0"
                  )}>
                    <StepIcon type="check" className={cn("w-3.5 h-3.5", isLight ? "text-white" : "text-zinc-900")} />
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
                isLight ? "text-zinc-900" : "text-zinc-100"
              )}>
                Configure Your Domain
              </h2>
              <p className={cn(
                "text-sm",
                isLight ? "text-zinc-500" : "text-zinc-400"
              )}>
                Choose how you want to set up your website address.
              </p>
            </div>

            {/* Domain Type Selection */}
            <div>
              <h3 className={cn("font-semibold text-sm mb-3", isLight ? "text-zinc-900" : "text-zinc-100")}>
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
                          ? "border-zinc-400 bg-zinc-100/50 shadow-md"
                          : "border-zinc-500 bg-zinc-700/20"
                        : isLight
                        ? "border-zinc-200 bg-white hover:border-zinc-300"
                        : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                        domainType === type.id
                          ? isLight ? "bg-zinc-800" : "bg-zinc-200"
                          : isLight ? "bg-zinc-100" : "bg-zinc-800"
                      )}>
                        <StepIcon
                          type={type.icon}
                          className={cn(
                            "w-5 h-5",
                            domainType === type.id
                              ? isLight ? "text-white" : "text-zinc-900"
                              : isLight ? "text-zinc-600" : "text-zinc-400"
                          )}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={cn("font-semibold text-sm leading-tight", isLight ? "text-zinc-900" : "text-zinc-100")}>
                          {type.title}
                        </h4>
                        <p className={cn("text-xs truncate", isLight ? "text-zinc-500" : "text-zinc-500")}>
                          {type.description}
                        </p>
                      </div>
                    </div>
                    {domainType === type.id && (
                      <div className={cn(
                        "absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center",
                        isLight ? "bg-zinc-800" : "bg-zinc-200"
                      )}>
                        <StepIcon type="check" className={cn("w-3.5 h-3.5", isLight ? "text-white" : "text-zinc-900")} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Domain Input Card */}
            <div className={cn(
              "rounded-xl border p-5",
              isLight ? "bg-white border-zinc-200 shadow-sm" : "bg-zinc-900/50 border-zinc-800"
            )}>
              <div className="mb-3">
                <h3 className={cn("font-semibold text-sm", isLight ? "text-zinc-900" : "text-zinc-100")}>
                  {domainType === "existing" ? "Your Domain" : "Choose Subdomain"}
                </h3>
                <p className={cn("text-xs", isLight ? "text-zinc-500" : "text-zinc-500")}>
                  {domainType === "subdomain" ? "Pick a unique name for your free subdomain" : "Enter your domain name"}
                </p>
              </div>
              <Input
                value={domain}
                onValueChange={setDomain}
                placeholder={domainType === "subdomain" ? "mysite" : "example.com"}
                classNames={inputClassNames}
                variant="bordered"
                size="md"
                startContent={
                  domainType !== "subdomain" && (
                    <span className="text-zinc-400 text-sm font-medium">https://</span>
                  )
                }
                endContent={
                  domainType === "subdomain" && (
                    <span className={cn("text-sm font-medium", isLight ? "text-zinc-600" : "text-zinc-400")}>.limewp.com</span>
                  )
                }
              />
            </div>

            {/* Info Box */}
            <div className={cn(
              "rounded-xl p-4 flex items-start gap-3",
              isLight
                ? "bg-zinc-100 border border-zinc-200"
                : "bg-zinc-800/50 border border-zinc-700"
            )}>
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                isLight ? "bg-zinc-800" : "bg-zinc-200"
              )}>
                <svg className={cn("w-5 h-5", isLight ? "text-white" : "text-zinc-900")} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
              </div>
              <div>
                <p className={cn("font-semibold text-sm", isLight ? "text-zinc-800" : "text-zinc-200")}>
                  Domain Configuration
                </p>
                <p className={cn("text-xs leading-relaxed", isLight ? "text-zinc-600" : "text-zinc-400")}>
                  Make sure your domain is registered and properly configured with DNS settings pointing to our nameservers. Your site will be accessible at this domain once the setup is complete.
                </p>
              </div>
            </div>

            {/* SSL Configuration */}
            <div>
              <h3 className={cn("font-semibold text-sm mb-3", isLight ? "text-zinc-900" : "text-zinc-100")}>
                SSL Certificate
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setSslType("letsencrypt")}
                  className={cn(
                    "group relative rounded-xl border-2 p-4 text-left transition-all duration-300",
                    sslType === "letsencrypt"
                      ? isLight
                        ? "border-zinc-400 bg-zinc-100/50 shadow-md"
                        : "border-zinc-500 bg-zinc-700/20"
                      : isLight
                      ? "border-zinc-200 bg-white hover:border-zinc-300"
                      : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                      sslType === "letsencrypt"
                        ? isLight ? "bg-zinc-800" : "bg-zinc-200"
                        : isLight ? "bg-zinc-100" : "bg-zinc-800"
                    )}>
                      <svg className={cn("w-5 h-5", sslType === "letsencrypt" ? isLight ? "text-white" : "text-zinc-900" : isLight ? "text-zinc-600" : "text-zinc-400")} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <h4 className={cn("font-semibold text-sm", isLight ? "text-zinc-900" : "text-zinc-100")}>
                          Let&apos;s Encrypt
                        </h4>
                        <span className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full",
                          isLight ? "bg-zinc-800 text-white" : "bg-zinc-200 text-zinc-900"
                        )}>
                          Auto
                        </span>
                      </div>
                      <p className={cn("text-xs leading-tight", isLight ? "text-zinc-500" : "text-zinc-500")}>
                        Auto provision & renew SSL
                      </p>
                    </div>
                  </div>
                  {sslType === "letsencrypt" && (
                    <div className={cn(
                      "absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center",
                      isLight ? "bg-zinc-800" : "bg-zinc-200"
                    )}>
                      <StepIcon type="check" className={cn("w-3.5 h-3.5", isLight ? "text-white" : "text-zinc-900")} />
                    </div>
                  )}
                </button>

                <button
                  onClick={() => setSslType("cloudflare")}
                  className={cn(
                    "group relative rounded-xl border-2 p-4 text-left transition-all duration-300",
                    sslType === "cloudflare"
                      ? isLight
                        ? "border-zinc-400 bg-zinc-100/50 shadow-md"
                        : "border-zinc-500 bg-zinc-700/20"
                      : isLight
                      ? "border-zinc-200 bg-white hover:border-zinc-300"
                      : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                      sslType === "cloudflare"
                        ? isLight ? "bg-zinc-800" : "bg-zinc-200"
                        : isLight ? "bg-zinc-100" : "bg-zinc-800"
                    )}>
                      <svg className={cn("w-5 h-5", sslType === "cloudflare" ? isLight ? "text-white" : "text-zinc-900" : isLight ? "text-zinc-600" : "text-zinc-400")} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16.5088 16.8447C16.6235 16.4476 16.5765 16.0976 16.3694 15.8224C16.1835 15.5765 15.8688 15.4329 15.4894 15.4094L8.84354 15.3553C8.75531 15.3506 8.68 15.3059 8.63531 15.2365C8.59062 15.1671 8.58354 15.0824 8.61354 15.0035C8.66531 14.8694 8.79354 14.7765 8.94354 14.7624L15.5929 14.7082C16.4894 14.6541 17.4494 13.9671 17.8094 13.1412L18.3176 11.9647C18.3694 11.8447 18.3929 11.7153 18.3788 11.5859C17.9953 9.32 16.0188 7.58 13.6376 7.58C11.5847 7.58 9.82354 8.90118 9.15177 10.7271C8.75531 10.4612 8.27531 10.3035 7.75531 10.3035C6.49177 10.3035 5.46354 11.2894 5.39531 12.5365C5.39531 12.5929 5.39531 12.6494 5.39531 12.7059C4.20708 12.9341 3.29177 13.9624 3.29177 15.2035C3.29177 15.3118 3.30354 15.4176 3.31531 15.5212C3.33062 15.6671 3.45531 15.7765 3.60354 15.7765H16.0329C16.1788 15.7765 16.31 15.6859 16.3624 15.5541L16.5088 16.8447Z"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={cn("font-semibold text-sm mb-0.5", isLight ? "text-zinc-900" : "text-zinc-100")}>
                        Cloudflare Origin
                      </h4>
                      <p className={cn("text-xs leading-tight", isLight ? "text-zinc-500" : "text-zinc-500")}>
                        Use your own certificate
                      </p>
                    </div>
                  </div>
                  {sslType === "cloudflare" && (
                    <div className={cn(
                      "absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center",
                      isLight ? "bg-zinc-800" : "bg-zinc-200"
                    )}>
                      <StepIcon type="check" className={cn("w-3.5 h-3.5", isLight ? "text-white" : "text-zinc-900")} />
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
                  isLight ? "bg-white border-zinc-200 shadow-sm" : "bg-zinc-900/50 border-zinc-800"
                )}>
                  <div className="mb-3">
                    <h3 className={cn("font-semibold text-sm", isLight ? "text-zinc-900" : "text-zinc-100")}>
                      DNS Configuration
                    </h3>
                    <p className={cn("text-xs", isLight ? "text-zinc-500" : "text-zinc-500")}>
                      Add these A records in Cloudflare with Proxied enabled:
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className={cn(
                      "flex items-center gap-2 p-2 rounded-lg font-mono text-xs",
                      isLight ? "bg-zinc-50" : "bg-zinc-800/50"
                    )}>
                      <span className={cn(
                        "px-1.5 py-0.5 rounded text-[10px] font-bold",
                        isLight ? "bg-zinc-200 text-zinc-600" : "bg-zinc-700 text-zinc-400"
                      )}>A</span>
                      <span className={cn(isLight ? "text-zinc-600" : "text-zinc-400")}>@</span>
                      <span className={cn(isLight ? "text-zinc-400" : "text-zinc-600")}>→</span>
                      <span className={cn("font-semibold", isLight ? "text-zinc-900" : "text-zinc-100")}>46.4.212.172</span>
                    </div>
                    <div className={cn(
                      "flex items-center gap-2 p-2 rounded-lg font-mono text-xs",
                      isLight ? "bg-zinc-50" : "bg-zinc-800/50"
                    )}>
                      <span className={cn(
                        "px-1.5 py-0.5 rounded text-[10px] font-bold",
                        isLight ? "bg-zinc-200 text-zinc-600" : "bg-zinc-700 text-zinc-400"
                      )}>A</span>
                      <span className={cn(isLight ? "text-zinc-600" : "text-zinc-400")}>www</span>
                      <span className={cn(isLight ? "text-zinc-400" : "text-zinc-600")}>→</span>
                      <span className={cn("font-semibold", isLight ? "text-zinc-900" : "text-zinc-100")}>46.4.212.172</span>
                    </div>
                  </div>
                </div>

                {/* Origin Certificate Instructions */}
                <div className={cn(
                  "rounded-xl p-4 flex items-start gap-3",
                  isLight
                    ? "bg-zinc-100 border border-zinc-200"
                    : "bg-zinc-800/50 border border-zinc-700"
                )}>
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                    isLight ? "bg-zinc-800" : "bg-zinc-200"
                  )}>
                    <svg className={cn("w-5 h-5", isLight ? "text-white" : "text-zinc-900")} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                  </div>
                  <div>
                    <p className={cn("font-semibold text-sm", isLight ? "text-zinc-800" : "text-zinc-200")}>
                      Generate an Origin Certificate
                    </p>
                    <p className={cn("text-xs leading-relaxed", isLight ? "text-zinc-600" : "text-zinc-400")}>
                      Go to Cloudflare → <span className="font-semibold">SSL/TLS → Origin Server</span> and create a certificate.
                    </p>
                  </div>
                </div>

                {/* Certificate Inputs */}
                <div className={cn(
                  "rounded-xl border p-5",
                  isLight ? "bg-white border-zinc-200 shadow-sm" : "bg-zinc-900/50 border-zinc-800"
                )}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={cn(
                        "block text-sm font-medium mb-2",
                        isLight ? "text-zinc-700" : "text-zinc-300"
                      )}>
                        Origin Certificate
                      </label>
                      <textarea
                        value={originCertificate}
                        onChange={(e) => setOriginCertificate(e.target.value)}
                        placeholder={"-----BEGIN CERTIFICATE-----\n..."}
                        rows={4}
                        className={cn(
                          "w-full px-3 py-2.5 rounded-lg border text-sm font-mono resize-none transition-colors",
                          isLight
                            ? "bg-white border-zinc-200 hover:border-zinc-300 focus:border-zinc-400 text-zinc-800 placeholder:text-zinc-400"
                            : "bg-zinc-900 border-zinc-800 hover:border-zinc-700 focus:border-zinc-500 text-zinc-100 placeholder:text-zinc-600",
                          "focus:outline-none focus:ring-1 focus:ring-zinc-500/20"
                        )}
                      />
                    </div>
                    <div>
                      <label className={cn(
                        "block text-sm font-medium mb-2",
                        isLight ? "text-zinc-700" : "text-zinc-300"
                      )}>
                        Private Key
                      </label>
                      <textarea
                        value={privateKey}
                        onChange={(e) => setPrivateKey(e.target.value)}
                        placeholder={"-----BEGIN PRIVATE KEY-----\n..."}
                        rows={4}
                        className={cn(
                          "w-full px-3 py-2.5 rounded-lg border text-sm font-mono resize-none transition-colors",
                          isLight
                            ? "bg-white border-zinc-200 hover:border-zinc-300 focus:border-zinc-400 text-zinc-800 placeholder:text-zinc-400"
                            : "bg-zinc-900 border-zinc-800 hover:border-zinc-700 focus:border-zinc-500 text-zinc-100 placeholder:text-zinc-600",
                          "focus:outline-none focus:ring-1 focus:ring-zinc-500/20"
                        )}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        );

      case 3:
        // Step 3: WordPress
        return (
          <div className="space-y-5">
            <div className="text-center">
              <h2 className={cn(
                "text-xl font-bold mb-1.5",
                isLight ? "text-zinc-900" : "text-zinc-100"
              )}>
                WordPress Settings
              </h2>
              <p className={cn(
                "text-sm",
                isLight ? "text-zinc-500" : "text-zinc-400"
              )}>
                Configure your WordPress installation preferences.
              </p>
            </div>

            {/* Site Name Card */}
            <div className={cn(
              "rounded-xl border p-5",
              isLight ? "bg-white border-zinc-200 shadow-sm" : "bg-zinc-900/50 border-zinc-800"
            )}>
              <div className="flex items-center gap-3 mb-3">
                <div className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center",
                  isLight ? "bg-zinc-100" : "bg-zinc-800"
                )}>
                  <svg className={cn("w-5 h-5", isLight ? "text-zinc-600" : "text-zinc-400")} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                  </svg>
                </div>
                <div>
                  <h3 className={cn("font-semibold text-sm leading-tight", isLight ? "text-zinc-900" : "text-zinc-100")}>Site Name</h3>
                  <p className={cn("text-xs", isLight ? "text-zinc-500" : "text-zinc-500")}>Appears in your WordPress dashboard</p>
                </div>
              </div>
              <Input
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
              isLight ? "bg-white border-zinc-200 shadow-sm" : "bg-zinc-900/50 border-zinc-800"
            )}>
              <div className="flex items-center gap-3 mb-4">
                <div className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center",
                  isLight ? "bg-zinc-100" : "bg-zinc-800"
                )}>
                  <svg className={cn("w-5 h-5", isLight ? "text-zinc-600" : "text-zinc-400")} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                  </svg>
                </div>
                <div>
                  <h3 className={cn("font-semibold text-sm leading-tight", isLight ? "text-zinc-900" : "text-zinc-100")}>Admin Credentials</h3>
                  <p className={cn("text-xs", isLight ? "text-zinc-500" : "text-zinc-500")}>Login details sent to your email</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={cn(
                    "block text-xs font-medium mb-1.5",
                    isLight ? "text-zinc-600" : "text-zinc-400"
                  )}>
                    Admin Username
                  </label>
                  <Input
                    value={adminUsername}
                    onValueChange={setAdminUsername}
                    placeholder="admin"
                    classNames={inputClassNames}
                    variant="bordered"
                    size="md"
                  />
                </div>
                <div>
                  <label className={cn(
                    "block text-xs font-medium mb-1.5",
                    isLight ? "text-zinc-600" : "text-zinc-400"
                  )}>
                    Admin Email <span className="text-zinc-400">*</span>
                  </label>
                  <Input
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
                  <label className={cn(
                    "block text-xs font-medium mb-1.5",
                    isLight ? "text-zinc-600" : "text-zinc-400"
                  )}>
                    Admin Password <span className="text-zinc-400">*</span>
                  </label>
                  <Input
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
                  <label className={cn(
                    "block text-xs font-medium mb-1.5",
                    isLight ? "text-zinc-600" : "text-zinc-400"
                  )}>
                    Confirm Password <span className="text-zinc-400">*</span>
                  </label>
                  <Input
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
                  ? "bg-zinc-100 border border-zinc-200"
                  : "bg-zinc-800/50 border border-zinc-700"
              )}>
                <svg className={cn("w-4 h-4 flex-shrink-0 mt-0.5", isLight ? "text-zinc-600" : "text-zinc-400")} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <p className={cn("text-xs leading-relaxed", isLight ? "text-zinc-600" : "text-zinc-400")}>
                  <span className="font-semibold">Save these credentials!</span> You&apos;ll need them to log into your WordPress dashboard.
                </p>
              </div>
            </div>
          </div>
        );

      case 4:
        // Step 4: Finalize
        const selectedPkg = PACKAGES.find((p) => p.id === selectedPackage);

        return (
          <div className="space-y-5">
            <div className="text-center">
              <h2 className={cn(
                "text-xl font-bold mb-1.5",
                isLight ? "text-zinc-900" : "text-zinc-100"
              )}>
                Review & Create
              </h2>
              <p className={cn(
                "text-sm",
                isLight ? "text-zinc-500" : "text-zinc-400"
              )}>
                Double-check your configuration before launching.
              </p>
            </div>

            {/* Summary Card */}
            <div className={cn(
              "rounded-xl border overflow-hidden",
              isLight ? "bg-white border-zinc-200 shadow-sm" : "bg-zinc-900/50 border-zinc-800"
            )}>
              <div className={cn(
                "px-5 py-3 border-b",
                isLight ? "bg-zinc-50 border-zinc-200" : "bg-zinc-800/50 border-zinc-800"
              )}>
                <h3 className={cn("font-semibold text-sm", isLight ? "text-zinc-900" : "text-zinc-100")}>
                  Site Summary
                </h3>
              </div>
              <div className="p-4 space-y-0">
                {[
                  { label: "Package", value: `${selectedPkg?.name} (${selectedPkg?.price}${selectedPkg?.period})`, icon: "package" },
                  { label: "Site Name", value: siteName || "—", icon: "starter" },
                  { label: "Domain", value: domainType === "subdomain" ? `${domain || "—"}.limewp.com` : (domain || "—"), icon: "globe" },
                  { label: "PHP Version", value: PHP_VERSIONS.find((v) => v.key === Array.from(phpVersion)[0])?.label, icon: "wordpress" },
                  { label: "WordPress", value: WP_VERSIONS.find((v) => v.key === Array.from(wpVersion)[0])?.label, icon: "wordpress" },
                ].map((item, index) => (
                  <div
                    key={item.label}
                    className={cn(
                      "flex items-center justify-between py-2.5",
                      index < 4 && (isLight ? "border-b border-zinc-100" : "border-b border-zinc-800")
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={cn(
                        "w-7 h-7 rounded-md flex items-center justify-center",
                        isLight ? "bg-zinc-100" : "bg-zinc-800"
                      )}>
                        <StepIcon type={item.icon} className={cn("w-4 h-4", isLight ? "text-zinc-500" : "text-zinc-400")} />
                      </div>
                      <span className={cn("text-sm", isLight ? "text-zinc-600" : "text-zinc-400")}>{item.label}</span>
                    </div>
                    <span className={cn("text-sm font-semibold", isLight ? "text-zinc-900" : "text-zinc-100")}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Success Box */}
            <div className={cn(
              "rounded-xl p-4 flex items-start gap-3 border",
              isLight ? "bg-zinc-100 border-zinc-200" : "bg-zinc-800/50 border-zinc-700"
            )}>
              <div className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                isLight ? "bg-zinc-800" : "bg-zinc-200"
              )}>
                <StepIcon type="rocket" className={cn("w-5 h-5", isLight ? "text-white" : "text-zinc-900")} />
              </div>
              <div>
                <p className={cn("font-semibold text-sm", isLight ? "text-zinc-800" : "text-zinc-200")}>
                  Ready for Launch!
                </p>
                <p className={cn("text-xs leading-relaxed", isLight ? "text-zinc-600" : "text-zinc-400")}>
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
                ? "text-zinc-500 hover:text-zinc-700"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
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
          isLight ? "bg-white shadow-sm" : "bg-zinc-900/50"
        )}>
          {/* Step Indicator */}
          <div className={cn(
            "px-5 pt-5",
            isLight ? "bg-zinc-50/50" : "bg-zinc-900/30"
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
            isLight ? "bg-zinc-50/50" : "bg-zinc-900/30"
          )}>
          <Button
            variant="flat"
            onPress={currentStep === 1 ? handleCancel : handleBack}
            className={cn(
              "font-semibold text-sm rounded-lg h-10 px-5",
              isLight
                ? "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-800"
                : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
            )}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
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
                  ? "bg-zinc-800 text-white shadow-zinc-500/20 hover:bg-zinc-700 hover:shadow-zinc-500/30"
                  : "bg-zinc-100 text-zinc-900 shadow-zinc-500/10 hover:bg-zinc-200 hover:shadow-zinc-500/20"
              )}
            >
              Continue
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
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
                  ? "bg-zinc-800 text-white shadow-zinc-500/20 hover:bg-zinc-700 hover:shadow-zinc-500/30"
                  : "bg-zinc-100 text-zinc-900 shadow-zinc-500/10 hover:bg-zinc-200 hover:shadow-zinc-500/20"
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
