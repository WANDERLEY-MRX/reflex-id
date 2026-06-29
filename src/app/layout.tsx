import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CombinedProviders } from "@/providers";
import { auth } from "@/lib/auth-config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reflex ID - Sua identidade digital baseada em provas",
  description:
    "Empresas e escolas confiam mais em evidências do que em promessas. Construa sua identidade digital baseada em provas reais.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CombinedProviders session={session}>
          {children}
        </CombinedProviders>
      </body>
    </html>
  );
}
