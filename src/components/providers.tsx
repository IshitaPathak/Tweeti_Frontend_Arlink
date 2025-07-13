// components/providers.tsx
"use client";

import { ThemeProvider } from "./theme-provider";
import { TailwindIndicator } from "./tailwind-indicator";
import { ThemeToggle } from "./theme-toggle";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {children}
      <ThemeToggle />
      <TailwindIndicator />
    </ThemeProvider>
  );
}
