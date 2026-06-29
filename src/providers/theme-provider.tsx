"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { type ReactNode } from "react";

interface ThemeProviderComponentProps
  extends Omit<ThemeProviderProps, "children"> {
  children: ReactNode;
}

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderComponentProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
