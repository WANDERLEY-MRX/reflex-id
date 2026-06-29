import {
  BadgeCategory,
  BadgeLevel,
  ConfidenceLevel,
  EvidenceType,
  NotificationType,
  OrganizationType,
  SkillCategory,
  TargetType,
  UserRole,
  ValidationStatus,
  ValidatorType,
  VerificationRequestStatus,
  VerificationStatus,
  ActivityCategory,
  AchievementType,
  ReportStatus,
  MemberRole,
} from "@prisma/client";

export const SKILL_CATEGORIES: SkillCategory[] = ["SOFT", "HARD", "LANGUAGE"];

export const ACTIVITY_CATEGORIES: ActivityCategory[] = [
  "ACADEMIC",
  "PROFESSIONAL",
  "VOLUNTEER",
  "EXTRACURRICULAR",
  "COMPETITION",
  "COURSE",
  "OTHER",
];

export const CONFIDENCE_LEVELS: ConfidenceLevel[] = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "VERY_HIGH",
];

export const EVIDENCE_TYPES: EvidenceType[] = [
  "DOCUMENT",
  "IMAGE",
  "VIDEO",
  "LINK",
  "FILE",
  "CERTIFICATE",
  "DIPLOMA",
  "RECOMMENDATION",
];

export const VERIFICATION_STATUSES: VerificationStatus[] = [
  "PENDING",
  "SUBMITTED",
  "VERIFIED",
  "REJECTED",
  "EXPIRED",
];

export const VALIDATOR_TYPES: ValidatorType[] = [
  "ORGANIZATION",
  "PEER",
  "AI",
  "MANUAL",
];

export const VALIDATION_STATUSES: ValidationStatus[] = [
  "PENDING",
  "APPROVED",
  "REJECTED",
];

export const ORGANIZATION_TYPES: OrganizationType[] = [
  "SCHOOL",
  "COMPANY",
  "NONPROFIT",
  "GOVERNMENT",
  "OTHER",
];

export const MEMBER_ROLES: MemberRole[] = ["OWNER", "ADMIN", "MEMBER", "VIEWER"];

export const BADGE_CATEGORIES: BadgeCategory[] = [
  "ACHIEVEMENT",
  "SKILL",
  "PARTICIPATION",
  "MILESTONE",
  "VERIFICATION",
];

export const BADGE_LEVELS: BadgeLevel[] = [
  "BRONZE",
  "SILVER",
  "GOLD",
  "PLATINUM",
];

export const ACHIEVEMENT_TYPES: AchievementType[] = [
  "MILESTONE",
  "SKILL_MASTERY",
  "VERIFICATION_COUNT",
  "SOCIAL",
  "STREAK",
  "SPECIAL",
];

export const NOTIFICATION_TYPES: NotificationType[] = [
  "VERIFICATION_UPDATE",
  "BADGE_EARNED",
  "ACHIEVEMENT_UNLOCKED",
  "VALIDATION_REQUEST",
  "COMMENT",
  "MENTION",
  "ORGANIZATION_INVITE",
  "SYSTEM",
];

export const TARGET_TYPES: TargetType[] = [
  "EVIDENCE",
  "COMMENT",
  "PROFILE",
  "ORGANIZATION",
];

export const REPORT_STATUSES: ReportStatus[] = [
  "PENDING",
  "REVIEWED",
  "DISMISSED",
  "ACTIONED",
];

export const VERIFICATION_REQUEST_STATUSES: VerificationRequestStatus[] = [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "EXPIRED",
];

export const USER_ROLES: UserRole[] = ["USER", "ADMIN", "MODERATOR", "VERIFIER"];

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
