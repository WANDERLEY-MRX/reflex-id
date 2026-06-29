"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "Consegui meu primeiro estágio porque a empresa viu meus projetos validados no Reflex ID. O currículo não mostrava nem metade do que eu sabia.",
    author: "Camila Rocha",
    role: "Estagiária de Marketing",
    initials: "CR",
    gradient: "from-violet-500 to-fuchsia-500",
  },
  {
    quote: "Como recrutadora, o Reflex ID mudou a forma como avaliamos candidatos. Evidências reais > promessas no currículo.",
    author: "Daniela Castro",
    role: "Tech Recruiter @ Nubank",
    initials: "DC",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    quote: "Uso com meus alunos do ensino médio. Eles criam portfólios incríveis e chegam na faculdade com identidade profissional pronta.",
    author: "Prof. Ricardo Nunes",
    role: "Professor de Tecnologia",
    initials: "RN",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    quote: "O sistema de verificação deu credibilidade ao meu perfil. Fechei 3 contratos como freelancer depois que ativei.",
    author: "Thiago Almeida",
    role: "Designer Freelancer",
    initials: "TA",
    gradient: "from-amber-500 to-orange-500",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 md:py-32 bg-accent/30">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
            Depoimentos
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mt-4">
            O que estão <span className="gradient-text">falando</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-card p-8"
            >
              <svg className="size-8 text-muted-foreground/30 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {t.quote}
              </p>
              <div className="flex items-center gap-3">
                <div
                  className={`size-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-semibold text-xs`}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.author}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
