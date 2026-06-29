import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Preços",
  description: "Planos do Reflex ID. Comece gratuitamente.",
};

const plans = [
  {
    name: "Gratuito",
    price: "R$ 0",
    period: "/mês",
    description: "Para começar a construir sua identidade digital.",
    features: [
      "Perfil público completo",
      "Até 10 evidências",
      "Link único para compartilhar",
      "QR Code do perfil",
      "Badge de verificação básico",
    ],
    cta: "Começar grátis",
    href: "/register",
    highlighted: false,
  },
  {
    name: "Profissional",
    price: "R$ 19,90",
    period: "/mês",
    description: "Para quem leva a carreira a sério.",
    features: [
      "Tudo do Gratuito",
      "Evidências ilimitadas",
      "Verificações ilimitadas",
      "PDF do perfil exportável",
      "Tema personalizado",
      "Estatísticas de visualização",
      "Suporte prioritário",
    ],
    cta: "Assinar agora",
    href: "/register?plan=pro",
    highlighted: true,
  },
  {
    name: "Organizacional",
    price: "R$ 99",
    period: "/mês",
    description: "Para escolas e empresas que querem verificar talentos.",
    features: [
      "Tudo do Profissional",
      "Até 50 perfis vinculados",
      "Painel administrativo",
      "Relatórios de desempenho",
      "API de integração",
      "Verificação em lote",
      "SLA de suporte",
      "Personalização de marca",
    ],
    cta: "Falar com vendas",
    href: "/contact",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="pt-24 pb-32">
      <div className="container-page">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
            Preços
          </span>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mt-4 mb-6">
            Planos simples para{" "}
            <span className="gradient-text">cada jornada</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Comece grátis e evolua conforme sua necessidade.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 flex flex-col ${
                plan.highlighted
                  ? "border-foreground bg-card shadow-lg"
                  : "border-border bg-card"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-foreground text-background text-xs font-semibold">
                  Mais popular
                </span>
              )}
              <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <svg
                      className="size-4 mt-0.5 shrink-0 text-emerald-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`block text-center rounded-full py-3 text-sm font-semibold transition-all ${
                  plan.highlighted
                    ? "bg-foreground text-background hover:opacity-90"
                    : "border border-border hover:bg-accent"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
