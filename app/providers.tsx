"use client";

import React from "react";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider, useTheme } from "@/lib/context/ThemeContext";
import { AuthProvider } from "@/lib/context/AuthContext";
import { NotificationProvider } from "@/lib/context/NotificationContext";
import { Toaster } from "sonner";

// Accessibility testing in development only
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  void Promise.all([import("@axe-core/react"), import("react-dom")]).then(
    ([axe, ReactDOM]) => { axe.default(React, ReactDOM, 1000); }
  ).catch(() => {});
}

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
        <NotificationProvider>
          <HeroUIProvider>{children}</HeroUIProvider>
          <ToasterWrapper />
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
