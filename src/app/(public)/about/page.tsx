import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Conheça a história e o propósito do Reflex ID.",
};

const values = [
  {
    title: "Provas > Promessas",
    description:
      "Acreditamos que ações falam mais alto que palavras. Nossa plataforma é construída para evidenciar habilidades com provas reais, não com auto-promoção.",
  },
  {
    title: "Verificação e Confiança",
    description:
      "Cada conquista validada aumenta a credibilidade. Criamos um sistema onde escolas, empresas e mentores podem atestar competências de forma transparente.",
  },
  {
    title: "Inclusão e Oportunidade",
    description:
      "Todo mundo merece ser avaliado pelo que realmente importa. Democratizamos o acesso a oportunidades ao conectar talentos com quem valoriza evidências.",
  },
  {
    title: "Privacidade Primeiro",
    description:
      "Seguimos a LGPD e colocamos o usuário no controle. Você decide o que compartilhar, com quem e por quanto tempo.",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-24 pb-32">
      <div className="container-page max-w-4xl">
        <div className="text-center mb-20">
          <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
            Sobre nós
          </span>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mt-4 mb-6">
            Construindo a nova geração de{" "}
            <span className="gradient-text">identidade profissional</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            O Reflex ID nasceu de uma constatação simples: o currículo tradicional
            não representa mais o potencial real das pessoas. Em um mundo onde
            habilidades mudam rápido, precisamos de provas, não de promessas.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-8 mb-20">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-2xl border border-border bg-card p-8"
            >
              <h3 className="text-lg font-semibold mb-3">{value.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-accent/30 p-10 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Pronto para construir sua identidade?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Junte-se a milhares de pessoas que já estão provando seu potencial.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-3.5 rounded-full text-sm font-semibold hover:opacity-90 transition-all"
          >
            Criar identidade gratuitamente
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
