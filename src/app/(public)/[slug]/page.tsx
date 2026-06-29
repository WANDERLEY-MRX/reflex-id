import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug} | Reflex ID`,
    description: `Perfil público de ${slug} no Reflex ID. Veja evidências, certificados e projetos verificados.`,
    openGraph: {
      title: `${slug} | Reflex ID`,
      description: `Perfil público de ${slug} no Reflex ID.`,
      type: "profile",
    },
  };
}

const mockProfile = {
  name: "Ana Silva",
  headline: "Designer de Produto · UX Strategist",
  initials: "AS",
  gradient: "from-violet-500 to-fuchsia-500",
  bio: "Designer de produto com 5+ anos de experiência em produtos digitais. Apaixonada por criar experiências que conectam pessoas e tecnologia. Atualmente liderando redesign do app do Nubank.",
  location: "São Paulo, SP",
  verified: true,
  trustLevel: 4.9,
  links: [
    { label: "Portfolio", url: "https://anasilva.design" },
    { label: "LinkedIn", url: "https://linkedin.com/in/anasilva" },
    { label: "GitHub", url: "https://github.com/anasilva" },
  ],
  skills: [
    { name: "Design Thinking", level: "Avançado", type: "soft" },
    { name: "Figma", level: "Avançado", type: "hard" },
    { name: "Prototipagem", level: "Avançado", type: "hard" },
    { name: "Inglês", level: "C1 - Avançado", type: "language" },
    { name: "Liderança", level: "Intermediário", type: "soft" },
    { name: "React", level: "Intermediário", type: "hard" },
    { name: "Espanhol", level: "B2 - Intermediário", type: "language" },
    { name: "User Research", level: "Avançado", type: "hard" },
  ],
  timeline: [
    {
      date: "2024 - Presente",
      title: "Designer de Produto Sênior",
      org: "Nubank",
      verified: true,
    },
    {
      date: "2022 - 2024",
      title: "UX Designer",
      org: "QuintoAndar",
      verified: true,
    },
    {
      date: "2021",
      title: "Certificação UX Design",
      org: "Google · Coursera",
      verified: true,
    },
    {
      date: "2020 - 2022",
      title: "Designer Júnior",
      org: "Agência Fuzz",
      verified: false,
    },
    {
      date: "2018 - 2020",
      title: "Bacharel em Design Digital",
      org: "Universidade Anhembi Morumbi",
      verified: true,
    },
  ],
  projects: [
    {
      title: "Redesign App Nubank",
      description: "Liderou redesign da tela inicial, resultando em +23% de engajamento.",
      tags: ["UX", "Design System", "Figma"],
    },
    {
      title: "Plataforma de Aluguéis",
      description: "Criou fluxo de locação completo para o QuintoAndar.",
      tags: ["Product Design", "Prototipagem", "Testes A/B"],
    },
    {
      title: "Sistema de Design",
      description: "Contribuiu com 40+ componentes para o design system interno.",
      tags: ["Design System", "Storybook", "React"],
    },
  ],
  achievements: [
    "Prêmio Design de Impacto 2024",
    "Palestrante no UXConf Brasil 2023",
    "Artigo publicado no UX Collective",
    "Mentora no Projeto Alpha",
  ],
  stats: [
    { value: "12", label: "Certificados" },
    { value: "8", label: "Projetos" },
    { value: "24", label: "Recomendações" },
  ],
};

export default async function ProfilePage({ params }: Props) {
  const { slug } = await params;

  if (slug !== "ana.silva" && slug !== "exemplo") {
    notFound();
  }

  const profile = mockProfile;

  return (
    <div className="pt-20 pb-16">
      <div className="container-page max-w-4xl">
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="h-32 sm:h-40 bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-cyan-500/20" />

          <div className="px-6 sm:px-8 pb-8 -mt-16">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div
                className={`size-24 sm:size-28 rounded-2xl bg-gradient-to-br ${profile.gradient} flex items-center justify-center text-white font-bold text-2xl sm:text-3xl shrink-0 border-4 border-card`}
              >
                {profile.initials}
              </div>

              <div className="flex-1 min-w-0 pt-4 sm:pt-0">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-bold">{profile.name}</h1>
                  {profile.verified && (
                    <span className="px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium border border-emerald-500/20 flex items-center gap-1">
                      <svg className="size-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Verificado
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground">{profile.headline}</p>

                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {profile.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Confiança: {profile.trustLevel}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3 mt-4">
                  {profile.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors border border-border rounded-full px-4 py-1.5"
                    >
                      <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <p className="mt-8 text-sm text-muted-foreground leading-relaxed">
              {profile.bio}
            </p>

            <div className="flex items-center gap-8 mt-6 pt-6 border-t border-border">
              {profile.stats.map((stat) => (
                <div key={stat.label}>
                  <span className="text-xl font-bold">{stat.value}</span>
                  <span className="text-sm text-muted-foreground ml-1.5">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-lg font-semibold mb-4">Timeline</h2>
              <div className="space-y-0">
                {profile.timeline.map((item, i) => (
                  <div key={i} className="relative pl-8 pb-6 last:pb-0">
                    {i < profile.timeline.length - 1 && (
                      <div className="absolute left-[11px] top-4 bottom-0 w-px bg-border" />
                    )}
                    <div className="absolute left-0 top-1.5 size-2.5 rounded-full border-2 border-foreground bg-background" />
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-medium">{item.title}</h3>
                        <p className="text-xs text-muted-foreground">{item.org}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-muted-foreground">{item.date}</span>
                        {item.verified && (
                          <svg
                            className="size-3.5 text-emerald-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-4">Projetos</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {profile.projects.map((project) => (
                  <div
                    key={project.title}
                    className="rounded-xl border border-border bg-card p-5"
                  >
                    <h3 className="text-sm font-semibold mb-1">{project.title}</h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-accent text-xs text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-lg font-semibold mb-4">Competências</h2>
              <div className="space-y-4">
                {(["hard", "soft", "language"] as const).map((type) => (
                  <div key={type}>
                    <h3 className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-2">
                      {type === "hard"
                        ? "Técnicas"
                        : type === "soft"
                          ? "Comportamentais"
                          : "Idiomas"}
                    </h3>
                    <div className="space-y-2">
                      {profile.skills
                        .filter((s) => s.type === type)
                        .map((skill) => (
                          <div
                            key={skill.name}
                            className="flex items-center justify-between py-1.5"
                          >
                            <span className="text-sm">{skill.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {skill.level}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-4">Conquistas</h2>
              <div className="space-y-3">
                {profile.achievements.map((achievement) => (
                  <div key={achievement} className="flex items-start gap-3">
                    <svg
                      className="size-4 mt-0.5 shrink-0 text-amber-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm">{achievement}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Este perfil foi construído no Reflex ID
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-full text-sm font-semibold hover:opacity-90 transition-all"
          >
            Criar seu perfil gratuito
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
