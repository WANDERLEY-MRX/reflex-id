"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Plus,
  ExternalLink,
  GitBranch,
  Edit3,
  Trash2,
  FolderKanban,
  Loader2,
  X,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const projectSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  description: z
    .string()
    .min(10, "Descrição deve ter no mínimo 10 caracteres"),
  technologies: z.string().min(1, "Adicione pelo menos uma tecnologia"),
  link: z.string().url("URL inválida").optional().or(z.literal("")),
  github: z.string().url("URL inválida").optional().or(z.literal("")),
  results: z.string().optional(),
})

type ProjectData = z.infer<typeof projectSchema>

interface Project {
  id: string
  name: string
  description: string
  technologies: string
  link?: string
  github?: string
  results?: string
}

const initialProjects: Project[] = [
  {
    id: "1",
    name: "Reflex ID",
    description: "Plataforma de identidade digital com verificação de credenciais",
    technologies: "Next.js, TypeScript, Prisma, Tailwind CSS",
    link: "https://reflex.id",
    github: "https://github.com/reflex-id",
    results: "100+ usuários ativos",
  },
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectData>({
    resolver: zodResolver(projectSchema),
  })

  function openAdd() {
    reset({
      name: "",
      description: "",
      technologies: "",
      link: "",
      github: "",
      results: "",
    })
    setIsAdding(true)
    setEditingId(null)
  }

  function openEdit(project: Project) {
    reset({
      name: project.name,
      description: project.description,
      technologies: project.technologies,
      link: project.link ?? "",
      github: project.github ?? "",
      results: project.results ?? "",
    })
    setEditingId(project.id)
    setIsAdding(true)
  }

  async function onSubmit(data: ProjectData) {
    setIsLoading(true)
    try {
      if (editingId) {
        setProjects((prev) =>
          prev.map((p) => (p.id === editingId ? { ...p, ...data } : p)),
        )
        toast.success("Projeto atualizado!")
      } else {
        setProjects((prev) => [
          { id: crypto.randomUUID(), ...data },
          ...prev,
        ])
        toast.success("Projeto adicionado!")
      }
      setIsAdding(false)
      setEditingId(null)
    } catch {
      toast.error("Erro ao salvar projeto")
    } finally {
      setIsLoading(false)
    }
  }

  function deleteProject(id: string) {
    setProjects((prev) => prev.filter((p) => p.id !== id))
    toast.success("Projeto removido")
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projetos</h1>
          <p className="text-sm text-zinc-500">
            Gerencie seus projetos e portfólio
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700"
        >
          <Plus size={16} /> Adicionar Projeto
        </button>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">
              {editingId ? "Editar Projeto" : "Novo Projeto"}
            </h2>
            <button
              onClick={() => { setIsAdding(false); setEditingId(null) }}
              className="text-zinc-400 hover:text-zinc-600"
            >
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="name" className="text-sm font-medium">
                  Nome do Projeto
                </label>
                <input
                  id="name"
                  placeholder="Nome do projeto"
                  {...register("name")}
                  className={cn(
                    "w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500",
                    errors.name
                      ? "border-red-500"
                      : "border-zinc-300 dark:border-zinc-700",
                  )}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="technologies" className="text-sm font-medium">
                  Tecnologias
                </label>
                <input
                  id="technologies"
                  placeholder="React, Node.js, PostgreSQL"
                  {...register("technologies")}
                  className={cn(
                    "w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500",
                    errors.technologies
                      ? "border-red-500"
                      : "border-zinc-300 dark:border-zinc-700",
                  )}
                />
                {errors.technologies && (
                  <p className="text-xs text-red-500">
                    {errors.technologies.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="description" className="text-sm font-medium">
                Descrição
              </label>
              <textarea
                id="description"
                rows={3}
                placeholder="Descreva o projeto..."
                {...register("description")}
                className={cn(
                  "w-full resize-none rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500",
                  errors.description
                    ? "border-red-500"
                    : "border-zinc-300 dark:border-zinc-700",
                )}
              />
              {errors.description && (
                <p className="text-xs text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="link" className="text-sm font-medium">
                  Link do Projeto
                </label>
                <input
                  id="link"
                  placeholder="https://..."
                  {...register("link")}
                  className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-700"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="github" className="text-sm font-medium">
                  GitHub
                </label>
                <input
                  id="github"
                  placeholder="https://github.com/..."
                  {...register("github")}
                  className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-700"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="results" className="text-sm font-medium">
                Resultados
              </label>
              <textarea
                id="results"
                rows={2}
                placeholder="Ex: 1000+ usuários, 98% uptime..."
                {...register("results")}
                className="w-full resize-none rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-700"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => { setIsAdding(false); setEditingId(null) }}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
              >
                {isLoading && <Loader2 size={14} className="animate-spin" />}
                {editingId ? "Salvar" : "Adicionar"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects Grid */}
      {projects.length === 0 && !isAdding && (
        <div className="rounded-xl border border-dashed border-zinc-300 p-16 text-center dark:border-zinc-700">
          <FolderKanban
            size={48}
            className="mx-auto text-zinc-300 dark:text-zinc-600"
          />
          <p className="mt-3 text-sm text-zinc-500">
            Nenhum projeto adicionado ainda
          </p>
          <button
            onClick={openAdd}
            className="mt-4 text-sm font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400"
          >
            Adicionar primeiro projeto
          </button>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="group rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-start justify-between">
              <h3 className="font-semibold">{project.name}</h3>
              <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => openEdit(project)}
                  className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="rounded p-1 text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <p className="mt-2 text-sm text-zinc-600 line-clamp-3 dark:text-zinc-400">
              {project.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.technologies.split(",").map((tech) => (
                <span
                  key={tech.trim()}
                  className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                >
                  {tech.trim()}
                </span>
              ))}
            </div>
            {project.results && (
              <p className="mt-3 text-xs text-zinc-500">
                {project.results}
              </p>
            )}
            <div className="mt-3 flex gap-3">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-700 dark:text-violet-400"
                >
                  <ExternalLink size={12} /> Site
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                >
                  <GitBranch size={12} /> Código
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
