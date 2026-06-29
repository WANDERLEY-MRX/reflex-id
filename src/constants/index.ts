export const SKILL_CATEGORIES = ["SOFT", "HARD", "LANGUAGE"] as const;
export type SkillCategory = (typeof SKILL_CATEGORIES)[number];

export const ACTIVITY_CATEGORIES = [
  "ACADEMIC",
  "PROFESSIONAL",
  "VOLUNTEER",
  "EXTRACURRICULAR",
  "COMPETITION",
  "COURSE",
  "OTHER",
] as const;
export type ActivityCategory = (typeof ACTIVITY_CATEGORIES)[number];

export const CONFIDENCE_LEVELS = ["LOW", "MEDIUM", "HIGH", "VERY_HIGH"] as const;
export type ConfidenceLevel = (typeof CONFIDENCE_LEVELS)[number];

export const EVIDENCE_TYPES = [
  "DOCUMENT",
  "IMAGE",
  "VIDEO",
  "LINK",
  "FILE",
  "CERTIFICATE",
  "DIPLOMA",
  "RECOMMENDATION",
] as const;
export type EvidenceType = (typeof EVIDENCE_TYPES)[number];

export const VERIFICATION_STATUSES = [
  "PENDING",
  "SUBMITTED",
  "VERIFIED",
  "REJECTED",
  "EXPIRED",
] as const;
export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];

export const VALIDATOR_TYPES = ["ORGANIZATION", "PEER", "AI", "MANUAL"] as const;
export type ValidatorType = (typeof VALIDATOR_TYPES)[number];

export const VALIDATION_STATUSES = ["PENDING", "APPROVED", "REJECTED"] as const;
export type ValidationStatus = (typeof VALIDATION_STATUSES)[number];

export const ORGANIZATION_TYPES = [
  "SCHOOL",
  "COMPANY",
  "NONPROFIT",
  "GOVERNMENT",
  "OTHER",
] as const;
export type OrganizationType = (typeof ORGANIZATION_TYPES)[number];

export const MEMBER_ROLES = ["OWNER", "ADMIN", "MEMBER", "VIEWER"] as const;
export type MemberRole = (typeof MEMBER_ROLES)[number];

export const BADGE_CATEGORIES = [
  "ACHIEVEMENT",
  "SKILL",
  "PARTICIPATION",
  "MILESTONE",
  "VERIFICATION",
] as const;
export type BadgeCategory = (typeof BADGE_CATEGORIES)[number];

export const BADGE_LEVELS = ["BRONZE", "SILVER", "GOLD", "PLATINUM"] as const;
export type BadgeLevel = (typeof BADGE_LEVELS)[number];

export const ACHIEVEMENT_TYPES = [
  "MILESTONE",
  "SKILL_MASTERY",
  "VERIFICATION_COUNT",
  "SOCIAL",
  "STREAK",
  "SPECIAL",
] as const;
export type AchievementType = (typeof ACHIEVEMENT_TYPES)[number];

export const NOTIFICATION_TYPES = [
  "VERIFICATION_UPDATE",
  "BADGE_EARNED",
  "ACHIEVEMENT_UNLOCKED",
  "VALIDATION_REQUEST",
  "COMMENT",
  "MENTION",
  "ORGANIZATION_INVITE",
  "SYSTEM",
] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export const TARGET_TYPES = [
  "EVIDENCE",
  "COMMENT",
  "PROFILE",
  "ORGANIZATION",
] as const;
export type TargetType = (typeof TARGET_TYPES)[number];

export const REPORT_STATUSES = [
  "PENDING",
  "REVIEWED",
  "DISMISSED",
  "ACTIONED",
] as const;
export type ReportStatus = (typeof REPORT_STATUSES)[number];

export const VERIFICATION_REQUEST_STATUSES = [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "EXPIRED",
] as const;
export type VerificationRequestStatus = (typeof VERIFICATION_REQUEST_STATUSES)[number];

export const USER_ROLES = ["USER", "ADMIN", "MODERATOR", "VERIFIER"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const CONFIDENCE_LABELS: Record<ConfidenceLevel, string> = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
  VERY_HIGH: "Muito Alta",
};

export const VERIFICATION_STATUS_LABELS: Record<VerificationStatus, string> = {
  PENDING: "Pendente",
  SUBMITTED: "Enviado",
  VERIFIED: "Verificado",
  REJECTED: "Rejeitado",
  EXPIRED: "Expirado",
};

export const EVIDENCE_TYPE_LABELS: Record<EvidenceType, string> = {
  DOCUMENT: "Documento",
  IMAGE: "Imagem",
  VIDEO: "Vídeo",
  LINK: "Link",
  FILE: "Arquivo",
  CERTIFICATE: "Certificado",
  DIPLOMA: "Diploma",
  RECOMMENDATION: "Recomendação",
};

export const SKILL_CATEGORY_LABELS: Record<SkillCategory, string> = {
  SOFT: "Soft Skill",
  HARD: "Hard Skill",
  LANGUAGE: "Idioma",
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  PROFILE_EDIT: "/profile/edit",
  PROFILE_SLUG: (slug: string) => `/profile/${slug}`,
  EVIDENCE: "/evidence",
  EVIDENCE_NEW: "/evidence/new",
  EVIDENCE_DETAIL: (id: string) => `/evidence/${id}`,
  PROJECTS: "/projects",
  PROJECT_NEW: "/projects/new",
  PROJECT_DETAIL: (id: string) => `/projects/${id}`,
  ORGANIZATIONS: "/organizations",
  ORGANIZATION_DETAIL: (id: string) => `/organizations/${id}`,
  SETTINGS: "/settings",
  SETTINGS_SECURITY: "/settings/security",
  SETTINGS_NOTIFICATIONS: "/settings/notifications",
  SETTINGS_API: "/settings/api",
  VERIFICATION: "/verification",
  VERIFICATION_REQUESTS: "/verification/requests",
  BADGES: "/badges",
  ACHIEVEMENTS: "/achievements",
  ADMIN: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_ORGANIZATIONS: "/admin/organizations",
  ADMIN_REPORTS: "/admin/reports",
  NOTIFICATIONS: "/notifications",
} as const;
