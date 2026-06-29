"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: [0.25, 0.1, 0, 1] as const },
  }),
};

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/30 to-transparent pointer-events-none" />
      <div className="container-page relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-accent/50 text-sm text-muted-foreground mb-8"
          >
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Identidade Digital Baseada em Provas
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.1] mb-6"
          >
            Seu currículo diz o que você fez.
            <br />
            <span className="gradient-text">Sua identidade prova quem você é.</span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Empresas e escolas confiam mais em evidências do que em promessas.
            Construa sua identidade digital baseada em provas reais.
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-3.5 rounded-full text-sm font-semibold hover:opacity-90 transition-all active:scale-[0.98]"
            >
              Criar identidade gratuitamente
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/reflex/exemplo"
              className="inline-flex items-center gap-2 border border-border px-8 py-3.5 rounded-full text-sm font-medium hover:bg-accent transition-colors"
            >
              Ver exemplo
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.1, 0, 1] as const }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <div className="relative rounded-2xl border border-border bg-card overflow-hidden shadow-2xl">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-muted/50">
              <div className="size-2.5 rounded-full bg-red-500" />
              <div className="size-2.5 rounded-full bg-yellow-500" />
              <div className="size-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs text-muted-foreground ml-2">reflex.id/ana.silva</span>
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="size-16 sm:size-20 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-xl shrink-0">
                  AS
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-semibold">Ana Silva</h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium border border-emerald-500/20">
                      Verificado
                    </span>
                  </div>
                  <p className="text-muted-foreground">Designer de Produto · UX Strategist</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {["Design Thinking", "Figma", "Prototipagem", "Inglês C1"].map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-full bg-accent text-xs font-medium text-muted-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border">
                    {[
                      { value: "12", label: "Certificados" },
                      { value: "8", label: "Projetos" },
                      { value: "4.9", label: "Confiança" },
                    ].map((stat) => (
                      <div key={stat.label}>
                        <span className="text-lg font-semibold">{stat.value}</span>
                        <span className="text-xs text-muted-foreground ml-1">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
