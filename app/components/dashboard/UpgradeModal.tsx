"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { useTheme } from "@/lib/context/ThemeContext";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PLANS = [
  {
    id: "pro",
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "Perfect for growing businesses",
    features: [
      "Up to 10 WordPress sites",
      "Priority support",
      "Advanced analytics",
      "Daily backups",
      "Staging environments",
    ],
    popular: true,
  },
  {
    id: "business",
    name: "Business",
    price: "$49",
    period: "/month",
    description: "For agencies and teams",
    features: [
      "Unlimited WordPress sites",
      "24/7 dedicated support",
      "White-label dashboard",
      "Hourly backups",
      "Multi-user access",
      "API access",
    ],
    popular: false,
  },
];

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpgrade = async () => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Upgrading to:", selectedPlan);
    setIsProcessing(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      backdrop="opaque"
      placement="center"
      hideCloseButton
      classNames={{
        backdrop: "bg-black/70",
        base: isLight
          ? "bg-white border border-zinc-200 shadow-2xl max-w-[600px] rounded-2xl"
          : "bg-[#18181B] border border-[#27272A] shadow-2xl max-w-[600px] rounded-2xl",
        header: isLight ? "border-b border-zinc-200" : "border-b border-[#27272A]",
        body: "py-6",
        footer: isLight ? "border-t border-zinc-200" : "border-t border-[#27272A]",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center justify-between gap-3">
          <div>
            <h2
              className={`text-lg font-semibold ${
                isLight ? "text-zinc-800" : "text-zinc-100"
              }`}
            >
              Upgrade Your Plan
            </h2>
            <p className="text-xs text-zinc-500 font-normal">
              Choose a plan that works best for you
            </p>
          </div>
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              isLight
                ? "hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600"
                : "hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </ModalHeader>

        <ModalBody>
          <div className="space-y-4">
            {/* Plan Selection */}
            <div className="grid grid-cols-2 gap-4">
              {PLANS.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                    selectedPlan === plan.id
                      ? isLight
                        ? "border-zinc-400 bg-zinc-100/50"
                        : "border-zinc-500 bg-zinc-800/50"
                      : isLight
                        ? "border-zinc-200 hover:border-zinc-300 bg-zinc-50"
                        : "border-[#2A2A2E] hover:border-[#3F3F46] bg-[#1E1E21]"
                  }`}
                >
                  {plan.popular && (
                    <span className={`absolute -top-2.5 left-4 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isLight ? "bg-zinc-800 text-white" : "bg-zinc-200 text-zinc-900"
                    }`}>
                      POPULAR
                    </span>
                  )}
                  <div className="mb-3">
                    <h3
                      className={`font-semibold ${
                        isLight ? "text-zinc-800" : "text-zinc-100"
                      }`}
                    >
                      {plan.name}
                    </h3>
                    <p className="text-xs text-zinc-500">{plan.description}</p>
                  </div>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span
                      className={`text-2xl font-bold ${
                        isLight ? "text-zinc-800" : "text-zinc-100"
                      }`}
                    >
                      {plan.price}
                    </span>
                    <span className="text-sm text-zinc-500">{plan.period}</span>
                  </div>
                  <ul className="space-y-1.5">
                    {plan.features.slice(0, 4).map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-xs text-zinc-500"
                      >
                        <svg
                          className={`w-3.5 h-3.5 flex-shrink-0 ${isLight ? "text-zinc-500" : "text-zinc-400"}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>

            {/* Order Summary */}
            <div
              className={`rounded-xl p-4 ${
                isLight
                  ? "bg-zinc-50 border border-zinc-200"
                  : "bg-[#1E1E21] border border-[#2A2A2E]"
              }`}
            >
              <h4
                className={`text-sm font-medium mb-3 ${
                  isLight ? "text-zinc-800" : "text-zinc-100"
                }`}
              >
                Order Summary
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">
                    {PLANS.find((p) => p.id === selectedPlan)?.name} Plan
                  </span>
                  <span className={isLight ? "text-zinc-800" : "text-zinc-100"}>
                    {PLANS.find((p) => p.id === selectedPlan)?.price}/mo
                  </span>
                </div>
                <div className={`flex justify-between ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>
                  <span>Annual discount (20%)</span>
                  <span>
                    -$
                    {(
                      Number(
                        PLANS.find((p) => p.id === selectedPlan)?.price.replace(
                          "$",
                          ""
                        )
                      ) * 0.2
                    ).toFixed(0)}
                    /mo
                  </span>
                </div>
                <div
                  className={`flex justify-between pt-2 border-t font-semibold ${
                    isLight ? "border-zinc-200 text-zinc-800" : "border-[#2A2A2E] text-zinc-100"
                  }`}
                >
                  <span>Total</span>
                  <span>
                    $
                    {(
                      Number(
                        PLANS.find((p) => p.id === selectedPlan)?.price.replace(
                          "$",
                          ""
                        )
                      ) * 0.8
                    ).toFixed(0)}
                    /mo
                  </span>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
              <span>Secure checkout powered by Stripe</span>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="flat"
            onPress={onClose}
            className={`font-medium text-sm rounded-xl h-10 px-5 ${
              isLight
                ? "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-800"
                : "bg-[#27272A] text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Cancel
          </Button>
          <Button
            onPress={handleUpgrade}
            isLoading={isProcessing}
            className={`font-semibold text-sm rounded-xl h-10 px-5 shadow-lg transition-all ${
              isLight
                ? "bg-zinc-800 text-white hover:bg-zinc-700 shadow-zinc-500/20"
                : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 shadow-zinc-500/10"
            }`}
          >
            {isProcessing ? "Processing..." : "Upgrade Now"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
