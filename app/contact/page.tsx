"use client";

import { useState } from "react";
import AppShell from "../components/AppShell";
import { Button, Input, Textarea } from "@heroui/react";
import { useTheme } from "@/lib/context/ThemeContext";
import { cn } from "@/lib/utils";
import { getColorClasses } from "@/lib/utils/colors";

const CONTACT_INFO = [
  {
    label: "Email",
    value: "support@example.com",
    description: "We'll respond within 24 hours",
    icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75",
  },
  {
    label: "Phone",
    value: "+1 (555) 123-4567",
    description: "Mon-Fri, 9am to 6pm EST",
    icon: "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z",
  },
  {
    label: "Office",
    value: "123 Main Street",
    description: "New York, NY 10001",
    icon: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
  },
];

const SUPPORT_HOURS = [
  { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM EST", available: true },
  { day: "Saturday", hours: "10:00 AM - 4:00 PM EST", available: true },
  { day: "Sunday", hours: "Closed", available: false },
];

export default function ContactPage() {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const colors = getColorClasses(accentColor);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1000);
  };

  const inputClassNames = isLight
    ? {
        inputWrapper: "bg-zinc-50 border-zinc-200 hover:border-zinc-300 group-data-[focus=true]:border-zinc-400 !rounded-xl",
        input: "text-zinc-800 placeholder:text-zinc-400",
        label: "text-zinc-600",
      }
    : {
        inputWrapper: [
          "bg-[#1E1E21]",
          "border-[#2A2A2E]",
          "hover:border-[#3F3F46]",
          "group-data-[focus=true]:border-[#52525B]",
          "rounded-xl",
          "transition-all",
        ],
        input: ["text-zinc-100", "placeholder:text-zinc-500"],
        label: ["text-zinc-400"],
      };

  return (
    <AppShell>
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={cn(
          "absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full blur-3xl opacity-30",
          colors.bg
        )} />
        <div className={cn(
          "absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full blur-3xl opacity-20",
          colors.bg
        )} />
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-10 text-center">
          <div className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4",
            colors.bg, colors.text
          )}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
            Get in Touch
          </div>
          <h1 className={cn(
            "text-4xl font-bold mb-3",
            isLight ? "text-zinc-800" : "text-zinc-100"
          )}>Contact Us</h1>
          <p className={cn(
            "text-base max-w-lg mx-auto",
            isLight ? "text-zinc-500" : "text-zinc-400"
          )}>Have a question or need help? We'd love to hear from you. Our team is always ready to assist.</p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {CONTACT_INFO.map((item) => (
            <div
              key={item.label}
              className={cn(
                "group relative rounded-2xl border p-5 transition-all duration-300 hover:scale-[1.02]",
                isLight
                  ? "bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-lg"
                  : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E] hover:border-[#3F3F46]"
              )}
            >
              <div className={cn(
                "w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
                colors.bg
              )}>
                <svg className={cn("w-5 h-5", colors.text)} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
              </div>
              <p className={cn(
                "text-xs font-medium uppercase tracking-wider mb-1",
                isLight ? "text-zinc-400" : "text-zinc-500"
              )}>{item.label}</p>
              <p className={cn(
                "text-sm font-semibold mb-1",
                isLight ? "text-zinc-800" : "text-zinc-100"
              )}>{item.value}</p>
              <p className={cn(
                "text-xs",
                isLight ? "text-zinc-500" : "text-zinc-500"
              )}>{item.description}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Contact Form */}
          <div className={cn(
            "lg:col-span-3 rounded-2xl border p-8",
            isLight
              ? "bg-white border-zinc-200 shadow-sm"
              : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E]"
          )}>
            <div className="mb-6">
              <h2 className={cn(
                "text-xl font-semibold mb-1",
                isLight ? "text-zinc-800" : "text-zinc-100"
              )}>Send us a Message</h2>
              <p className={cn(
                "text-sm",
                isLight ? "text-zinc-500" : "text-zinc-400"
              )}>Fill out the form below and we'll get back to you shortly.</p>
            </div>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className={cn(
                  "relative w-20 h-20 rounded-full flex items-center justify-center mb-6",
                  colors.bg
                )}>
                  <div className={cn(
                    "absolute inset-0 rounded-full animate-ping opacity-20",
                    colors.bg
                  )} />
                  <svg className={cn("w-10 h-10", colors.text)} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className={cn(
                  "text-2xl font-bold mb-2",
                  isLight ? "text-zinc-800" : "text-zinc-100"
                )}>Message Sent!</h3>
                <p className={cn(
                  "text-sm mb-8 max-w-sm",
                  isLight ? "text-zinc-500" : "text-zinc-400"
                )}>Thank you for reaching out. Our team will review your message and get back to you within 24 hours.</p>
                <Button
                  onPress={() => setSubmitted(false)}
                  variant="flat"
                  className={cn(
                    "font-medium rounded-xl px-6",
                    isLight ? "bg-zinc-100 text-zinc-700 hover:bg-zinc-200" : "bg-[#27272A] text-zinc-300 hover:bg-[#323235]"
                  )}
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Name"
                    placeholder="Your name"
                    variant="bordered"
                    classNames={inputClassNames}
                    isRequired
                  />
                  <Input
                    label="Email"
                    placeholder="you@example.com"
                    type="email"
                    variant="bordered"
                    classNames={inputClassNames}
                    isRequired
                  />
                </div>
                <Input
                  label="Subject"
                  placeholder="How can we help?"
                  variant="bordered"
                  classNames={inputClassNames}
                  isRequired
                />
                <Textarea
                  label="Message"
                  placeholder="Tell us more about your inquiry..."
                  variant="bordered"
                  minRows={5}
                  classNames={{
                    ...inputClassNames,
                    inputWrapper: isLight
                      ? "bg-zinc-50 border-zinc-200 hover:border-zinc-300 group-data-[focus=true]:border-zinc-400 !rounded-xl"
                      : "bg-[#1E1E21] border-[#2A2A2E] hover:border-[#3F3F46] group-data-[focus=true]:border-[#52525B] rounded-xl transition-all",
                  }}
                  isRequired
                />
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className={cn(
                    "w-full font-semibold text-sm rounded-xl h-11 text-white shadow-lg",
                    `bg-gradient-to-r ${colors.gradient}`
                  )}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Support Hours */}
            <div className={cn(
              "rounded-2xl border p-6",
              isLight
                ? "bg-white border-zinc-200 shadow-sm"
                : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E]"
            )}>
              <div className="flex items-center gap-3 mb-5">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  colors.bg
                )}>
                  <svg className={cn("w-5 h-5", colors.text)} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className={cn(
                    "text-base font-semibold",
                    isLight ? "text-zinc-800" : "text-zinc-100"
                  )}>Support Hours</h3>
                  <p className={cn(
                    "text-xs",
                    isLight ? "text-zinc-500" : "text-zinc-500"
                  )}>When our team is available</p>
                </div>
              </div>
              <div className="space-y-3">
                {SUPPORT_HOURS.map((item) => (
                  <div key={item.day} className={cn(
                    "flex items-center justify-between p-3 rounded-xl",
                    isLight ? "bg-zinc-50" : "bg-[#27272A]/50"
                  )}>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "w-2 h-2 rounded-full",
                        item.available ? "bg-emerald-500" : "bg-zinc-400"
                      )} />
                      <span className={cn(
                        "text-sm",
                        isLight ? "text-zinc-600" : "text-zinc-400"
                      )}>{item.day}</span>
                    </div>
                    <span className={cn(
                      "text-sm font-medium",
                      item.available
                        ? (isLight ? "text-zinc-800" : "text-zinc-200")
                        : (isLight ? "text-zinc-400" : "text-zinc-500")
                    )}>{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Help */}
            <div className={cn(
              "rounded-2xl border p-6 relative overflow-hidden",
              isLight
                ? "bg-white border-zinc-200 shadow-sm"
                : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border-[#2A2A2E]"
            )}>
              <div className={cn(
                "absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-20",
                colors.bg
              )} />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    colors.bg
                  )}>
                    <svg className={cn("w-5 h-5", colors.text)} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className={cn(
                      "text-base font-semibold",
                      isLight ? "text-zinc-800" : "text-zinc-100"
                    )}>Need Quick Help?</h3>
                    <p className={cn(
                      "text-xs",
                      isLight ? "text-zinc-500" : "text-zinc-500"
                    )}>Get instant answers</p>
                  </div>
                </div>
                <p className={cn(
                  "text-sm mb-5",
                  isLight ? "text-zinc-500" : "text-zinc-400"
                )}>Check out our documentation and FAQ for instant answers to common questions.</p>
                <Button
                  variant="flat"
                  className={cn(
                    "w-full font-semibold text-sm rounded-xl h-11",
                    colors.bg, colors.text
                  )}
                >
                  Visit Help Center
                </Button>
              </div>
            </div>

            {/* Response Time Badge */}
            <div className={cn(
              "rounded-2xl border p-5 text-center",
              isLight
                ? "bg-gradient-to-br from-emerald-50 to-sky-50 border-emerald-100"
                : "bg-gradient-to-br from-emerald-500/10 to-sky-500/10 border-emerald-500/20"
            )}>
              <div className="flex items-center justify-center gap-2 mb-2">
                <svg className={cn(
                  "w-5 h-5",
                  isLight ? "text-emerald-600" : "text-emerald-400"
                )} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
                <span className={cn(
                  "text-sm font-semibold",
                  isLight ? "text-emerald-700" : "text-emerald-300"
                )}>Fast Response</span>
              </div>
              <p className={cn(
                "text-xs",
                isLight ? "text-zinc-600" : "text-zinc-400"
              )}>Average response time under 4 hours during business hours</p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
