"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "O que é uma identidade digital baseada em provas?",
    a: "É um perfil online que vai além do currículo tradicional. Em vez de apenas listar habilidades, você adiciona evidências reais — certificados, projetos, portfólios e validações de escolas e empresas. Cada informação pode ser verificada, gerando um nível de confiança.",
  },
  {
    q: "Como funciona a verificação de informações?",
    a: "Escolas, empresas e mentores podem validar suas conquistas diretamente na plataforma. Quando uma instituição confirma um certificado ou experiência, isso fica registrado e aumenta seu nível de confiança. Quanto mais verificações, mais seu perfil se destaca.",
  },
  {
    q: "Meus dados estão protegidos? (LGPD)",
    a: "Sim. Seguimos rigorosamente a Lei Geral de Proteção de Dados (LGPD). Você controla o que aparece no seu perfil público. Dados sensíveis nunca são compartilhados sem autorização. Você pode exportar ou excluir seus dados a qualquer momento.",
  },
  {
    q: "Posso usar o Reflex ID de graça?",
    a: "Sim! O plano gratuito permite criar seu perfil, adicionar até 10 evidências e compartilhar seu link único. Planos premium oferecem recursos avançados como verificações ilimitadas, relatórios e integração com APIs.",
  },
  {
    q: "Quem pode verificar minhas informações?",
    a: "Qualquer instituição ou profissional cadastrado na plataforma: escolas, universidades, empresas, mentores e organizações. Você também pode convidar pessoas específicas para validar suas experiências.",
  },
  {
    q: "Qual a diferença entre Reflex ID e LinkedIn?",
    a: "O LinkedIn é uma rede social profissional baseada em autodeclaração. O Reflex ID é uma plataforma de identidade baseada em evidências verificadas. Enquanto no LinkedIn você diz o que sabe, no Reflex ID você prova. É a diferença entre promessa e confirmação.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 md:py-32">
      <div className="container-page max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mt-4">
            Perguntas <span className="gradient-text">frequentes</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="rounded-2xl border border-border overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-accent/50 transition-colors"
              >
                <span className="text-sm font-medium">{faq.q}</span>
                <svg
                  className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
