"use client";

import { motion } from "framer-motion";

const profiles = [
  {
    initials: "LM",
    name: "Lucas Mendes",
    role: "Estudante",
    gradient: "from-blue-500 to-cyan-500",
    stats: "8 certificados · 3 projetos",
    badge: "Ensino Médio",
  },
  {
    initials: "TC",
    name: "Tatiane Costa",
    role: "Programadora",
    gradient: "from-emerald-500 to-teal-500",
    stats: "15 projetos · Nível A",
    badge: "Tech",
  },
  {
    initials: "RF",
    name: "Rafael Farias",
    role: "Designer",
    gradient: "from-violet-500 to-fuchsia-500",
    stats: "22 projetos · 4.9☆",
    badge: "Criativo",
  },
  {
    initials: "GO",
    name: "Gabriel Oliveira",
    role: "Atleta",
    gradient: "from-amber-500 to-orange-500",
    stats: "12 medalhas · 3 recordes",
    badge: "Esportes",
  },
  {
    initials: "JS",
    name: "Julia Santos",
    role: "Voluntária",
    gradient: "from-rose-500 to-pink-500",
    stats: "6 campanhas · 200h+",
    badge: "Social",
  },
  {
    initials: "PL",
    name: "Pedro Lima",
    role: "Empreendedor",
    gradient: "from-indigo-500 to-purple-500",
    stats: "3 startups · 5 premiações",
    badge: "Negócios",
  },
];

export function ProfileExamples() {
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
            Perfis exemplo
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mt-4">
            Quem já está usando{" "}
            <span className="gradient-text">Reflex ID</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile, i) => (
            <motion.div
              key={profile.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative group"
            >
              <div className="relative rounded-2xl border border-border bg-card p-6 hover:border-foreground/20 transition-colors cursor-default">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`size-12 rounded-full bg-gradient-to-br ${profile.gradient} flex items-center justify-center text-white font-bold text-sm`}
                  >
                    {profile.initials}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-accent text-xs font-medium text-muted-foreground border border-border">
                    {profile.badge}
                  </span>
                </div>
                <h3 className="font-semibold text-base">{profile.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{profile.role}</p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  {profile.stats}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
