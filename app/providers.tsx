"use client";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "@/lib/context/ThemeContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <HeroUIProvider>{children}</HeroUIProvider>
    </ThemeProvider>
  );
}
