import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido")
    .max(255),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .max(100),
  code: z
    .string()
    .length(6, "Código deve ter 6 dígitos")
    .optional(),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Nome deve ter no mínimo 2 caracteres")
      .max(100, "Nome deve ter no máximo 100 caracteres"),
    email: z
      .string()
      .min(1, "Email é obrigatório")
      .email("Email inválido")
      .max(255),
    password: z
      .string()
      .min(8, "Senha deve ter no mínimo 8 caracteres")
      .max(100)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número"
      ),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não conferem",
    path: ["confirmPassword"],
  });

export const profileSchema = z.object({
  slug: z
    .string()
    .min(3, "Slug deve ter no mínimo 3 caracteres")
    .max(50)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug deve conter apenas letras minúsculas, números e hífens"
    ),
  bio: z.string().max(500, "Bio deve ter no máximo 500 caracteres").optional(),
  headline: z
    .string()
    .max(100, "Título deve ter no máximo 100 caracteres")
    .optional(),
  location: z
    .string()
    .max(100, "Localização deve ter no máximo 100 caracteres")
    .optional(),
  website: z.string().url("URL inválida").optional().or(z.literal("")),
  github: z.string().optional().or(z.literal("")),
  linkedin: z.string().optional().or(z.literal("")),
  twitter: z.string().optional().or(z.literal("")),
  instagram: z.string().optional().or(z.literal("")),
  interests: z.array(z.string()).max(20).default([]),
  goals: z.array(z.string()).max(10).default([]),
  availability: z
    .string()
    .max(200, "Disponibilidade deve ter no máximo 200 caracteres")
    .optional(),
});

export const evidenceSchema = z.object({
  title: z
    .string()
    .min(3, "Título deve ter no mínimo 3 caracteres")
    .max(200, "Título deve ter no máximo 200 caracteres"),
  description: z
    .string()
    .max(2000, "Descrição deve ter no máximo 2000 caracteres")
    .optional(),
  type: z.enum([
    "DOCUMENT",
    "IMAGE",
    "VIDEO",
    "LINK",
    "FILE",
    "CERTIFICATE",
    "DIPLOMA",
    "RECOMMENDATION",
  ]),
  url: z.string().url("URL inválida").optional().or(z.literal("")),
  source: z
    .string()
    .max(200, "Fonte deve ter no máximo 200 caracteres")
    .optional(),
});

export const evidenceUpdateSchema = evidenceSchema.partial();

export const projectSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(200, "Nome deve ter no máximo 200 caracteres"),
  description: z
    .string()
    .max(5000, "Descrição deve ter no máximo 5000 caracteres")
    .optional(),
  technologies: z.array(z.string()).max(30).default([]),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        caption: z.string().optional(),
      })
    )
    .max(10)
    .optional(),
  links: z
    .array(
      z.object({
        title: z.string(),
        url: z.string().url(),
      })
    )
    .max(10)
    .optional(),
  results: z
    .string()
    .max(2000, "Resultados deve ter no máximo 2000 caracteres")
    .optional(),
  skillsAcquired: z.array(z.string()).max(20).default([]),
});

export const projectUpdateSchema = projectSchema.partial();

export const skillSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(100),
  category: z.enum(["SOFT", "HARD", "LANGUAGE"]),
  level: z
    .number()
    .min(1, "Nível mínimo é 1")
    .max(5, "Nível máximo é 5")
    .default(1),
});

export const skillUpdateSchema = skillSchema.partial();

export const timelineEventSchema = z.object({
  title: z
    .string()
    .min(3, "Título deve ter no mínimo 3 caracteres")
    .max(200),
  description: z
    .string()
    .max(2000, "Descrição deve ter no máximo 2000 caracteres")
    .optional(),
  date: z.string().datetime("Data inválida"),
  category: z.enum([
    "ACADEMIC",
    "PROFESSIONAL",
    "VOLUNTEER",
    "EXTRACURRICULAR",
    "COMPETITION",
    "COURSE",
    "OTHER",
  ]),
  attachments: z
    .array(
      z.object({
        name: z.string(),
        url: z.string().url(),
        mimeType: z.string(),
        size: z.number(),
      })
    )
    .max(10)
    .optional(),
});

export const organizationSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(200),
  slug: z
    .string()
    .min(3, "Slug deve ter no mínimo 3 caracteres")
    .max(50)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug deve conter apenas letras minúsculas, números e hífens"
    ),
  type: z.enum(["SCHOOL", "COMPANY", "NONPROFIT", "GOVERNMENT", "OTHER"]),
  description: z
    .string()
    .max(2000)
    .optional(),
  website: z.string().url("URL inválida").optional().or(z.literal("")),
  logo: z.string().url().optional().or(z.literal("")),
});

export const validationSchema = z.object({
  evidenceId: z.string().min(1, "ID de evidência inválido"),
  status: z.enum(["APPROVED", "REJECTED"]),
  comment: z
    .string()
    .max(1000, "Comentário deve ter no máximo 1000 caracteres")
    .optional(),
  confidenceLevel: z.enum(["LOW", "MEDIUM", "HIGH", "VERY_HIGH"]).default("MEDIUM"),
});

export const notificationSchema = z.object({
  type: z.enum([
    "VERIFICATION_UPDATE",
    "BADGE_EARNED",
    "ACHIEVEMENT_UNLOCKED",
    "VALIDATION_REQUEST",
    "COMMENT",
    "MENTION",
    "ORGANIZATION_INVITE",
    "SYSTEM",
  ]),
  title: z.string().min(1).max(200),
  message: z.string().max(2000).optional(),
  data: z.record(z.string(), z.unknown()).optional(),
});

export const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comentário não pode estar vazio")
    .max(2000, "Comentário deve ter no máximo 2000 caracteres"),
});

export const reportSchema = z.object({
  targetId: z.string().min(1, "ID do alvo inválido"),
  targetType: z.enum(["EVIDENCE", "COMMENT", "PROFILE", "ORGANIZATION"]),
  reason: z
    .string()
    .min(10, "Razão deve ter no mínimo 10 caracteres")
    .max(2000),
});

export const apiKeySchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(100),
  expiresAt: z.string().datetime().optional(),
});

export const settingsSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(100)
    .optional(),
  avatar: z.string().url().optional().or(z.literal("")),
  twoFactorEnabled: z.boolean().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token é obrigatório"),
    password: z
      .string()
      .min(8, "Senha deve ter no mínimo 8 caracteres")
      .max(100)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número"
      ),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não conferem",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type EvidenceInput = z.infer<typeof evidenceSchema>;
export type EvidenceUpdateInput = z.infer<typeof evidenceUpdateSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;
export type SkillInput = z.infer<typeof skillSchema>;
export type TimelineEventInput = z.infer<typeof timelineEventSchema>;
export type OrganizationInput = z.infer<typeof organizationSchema>;
export type ValidationInput = z.infer<typeof validationSchema>;
export type NotificationInput = z.infer<typeof notificationSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
export type ReportInput = z.infer<typeof reportSchema>;
export type ApiKeyInput = z.infer<typeof apiKeySchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
