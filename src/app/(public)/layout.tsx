import type { Metadata } from "next";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

const siteUrl = "https://reflex.id";

export const metadata: Metadata = {
  title: {
    default: "Reflex ID - Sua identidade digital baseada em provas",
    template: "%s | Reflex ID",
  },
  description:
    "Empresas e escolas confiam mais em evidências do que em promessas. Construa sua identidade digital baseada em provas reais.",
  keywords: [
    "identidade digital",
    "currículo",
    "verificação",
    "certificados",
    "portfolio",
    "LGPD",
    "provas reais",
  ],
  authors: [{ name: "Reflex ID" }],
  creator: "Reflex ID",
  publisher: "Reflex ID",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Reflex ID",
    title: "Reflex ID - Sua identidade digital baseada em provas",
    description:
      "Empresas e escolas confiam mais em evidências do que em promessas. Construa sua identidade digital baseada em provas reais.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Reflex ID",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reflex ID - Identidade digital baseada em provas",
    description:
      "Construa sua identidade digital baseada em provas reais. Certificados, projetos e verificações em um só lugar.",
    images: ["/og-image.png"],
    creator: "@reflexid",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "technology",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Reflex ID",
  url: siteUrl,
  description:
    "Plataforma de identidade digital baseada em provas reais. Crie seu perfil, adicione evidências e receba verificações.",
  applicationCategory: "Professional Networking",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "BRL",
  },
  author: {
    "@type": "Organization",
    name: "Reflex ID",
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
