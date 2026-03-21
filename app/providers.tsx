"use client";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider, useTheme } from "@/lib/context/ThemeContext";
import { AuthProvider } from "@/lib/context/AuthContext";
import { Toaster } from "sonner";

function ToasterWrapper() {
  const { resolvedTheme } = useTheme();
  return (
    <Toaster
      theme={resolvedTheme as "dark" | "light"}
      position="bottom-right"
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        className: "font-sans",
      }}
    />
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HeroUIProvider>{children}</HeroUIProvider>
        <ToasterWrapper />
      </AuthProvider>
    </ThemeProvider>
  );
}
