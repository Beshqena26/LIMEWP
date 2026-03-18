"use client";

import Header from "./Header";
import Footer from "./Footer";
import { useTheme } from "@/lib/context/ThemeContext";
import { SupportChat } from "./ui/SupportChat";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className={`pt-16 flex-1 transition-colors ${
        isLight ? "bg-zinc-100" : "bg-[#18181B]"
      }`}>
        <div className="max-w-[1440px] mx-auto px-4 py-6 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
      <Footer />
      <SupportChat />
    </div>
  );
}
