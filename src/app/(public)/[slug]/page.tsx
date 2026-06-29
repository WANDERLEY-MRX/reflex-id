"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import {
  getProfileBySlug,
  getUserById,
  getSkillsByUserId,
  getProjectsByUserId,
  getEvidencesByUserId,
  getTimelineByUserId,
  type LocalProfile,
  type LocalUser,
  type LocalSkill,
  type LocalProject,
  type LocalEvidence,
  type LocalTimelineEvent,
} from "@/lib/local-db"

interface ProfileData {
  user: LocalUser
  profile: LocalProfile
  skills: LocalSkill[]
  projects: LocalProject[]
  evidences: LocalEvidence[]
  timeline: LocalTimelineEvent[]
}

export default function PublicProfilePage() {
  const params = useParams()
  const slug = params.slug as string
  const [data, setData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound_, setNotFound] = useState(false)

  useEffect(() => {
    const profile = getProfileBySlug(slug)
    if (!profile) {
      setNotFound(true)
      setLoading(false)
      return
    }
    const user = getUserById(profile.userId)
    if (!user) {
      setNotFound(true)
      setLoading(false)
      return
    }
    setData({
      user,
      profile,
      skills: getSkillsByUserId(user.id),
      projects: getProjectsByUserId(user.id),
      evidences: getEvidencesByUserId(user.id),
      timeline: getTimelineByUserId(user.id),
    })
    setLoading(false)
  }, [slug])

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    )
  }

  if (notFound_ || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h1 className="text-2xl font-bold">Perfil não encontrado</h1>
        <p className="mt-2 text-zinc-500">Este perfil público não existe.</p>
        <Link href="/" className="mt-4 text-sm font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400">
          Voltar ao início
        </Link>
      </div>
    )
  }

  const { user, profile, skills, projects, evidences, timeline } = data

  return (
    <div className="mx-auto max-w-4xl space-y-12 py-12">
      <div className="flex items-start gap-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-100 text-3xl font-bold text-violet-700 dark:bg-violet-900 dark:text-violet-300">
          {user.name?.charAt(0) ?? "U"}
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{user.name}</h1>
          {profile.headline && <p className="text-lg text-zinc-600 dark:text-zinc-400">{profile.headline}</p>}
          {profile.location && <p className="text-sm text-zinc-500">{profile.location}</p>}
          {profile.bio && <p className="mt-2 text-zinc-600 dark:text-zinc-400">{profile.bio}</p>}
          <div className="flex gap-3 pt-2">
            {profile.github && <Link href={`https://github.com/${profile.github}`} target="_blank" className="text-sm text-violet-600 hover:underline dark:text-violet-400">GitHub</Link>}
            {profile.linkedin && <Link href={`https://linkedin.com/in/${profile.linkedin}`} target="_blank" className="text-sm text-violet-600 hover:underline dark:text-violet-400">LinkedIn</Link>}
            {profile.website && <Link href={profile.website} target="_blank" className="text-sm text-violet-600 hover:underline dark:text-violet-400">Website</Link>}
          </div>
        </div>
      </div>

      {skills.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-bold">Habilidades</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <span key={s.id} className="rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-700 dark:bg-violet-900 dark:text-violet-300">
                {s.name} ({s.level}/10)
              </span>
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-bold">Projetos</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {projects.map((p) => (
              <div key={p.id} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
                <h3 className="font-semibold">{p.name}</h3>
                {p.description && <p className="mt-1 text-sm text-zinc-500">{p.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {evidences.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-bold">Evidências ({evidences.length})</h2>
          <div className="space-y-3">
            {evidences.map((e) => (
              <div key={e.id} className="flex items-center justify-between rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
                <div>
                  <p className="font-medium">{e.title}</p>
                  {e.description && <p className="text-sm text-zinc-500">{e.description}</p>}
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                  e.verificationStatus === "VERIFIED" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" :
                  e.verificationStatus === "REJECTED" ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" :
                  "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                }`}>
                  {e.verificationStatus}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {timeline.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-bold">Linha do Tempo</h2>
          <div className="space-y-4 border-l-2 border-zinc-200 pl-4 dark:border-zinc-700">
            {timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((t) => (
              <div key={t.id} className="relative">
                <div className="absolute -left-6 top-1 h-3 w-3 rounded-full bg-violet-500" />
                <p className="text-sm font-medium">{t.title}</p>
                {t.description && <p className="text-sm text-zinc-500">{t.description}</p>}
                <p className="text-xs text-zinc-400">{new Date(t.date).toLocaleDateString("pt-BR")}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
