import type {
  User,
  Profile,
  Evidence,
  EvidenceFile,
  Validation,
  Skill,
  Project,
  TimelineEvent,
  UserBadge,
  Badge,
  Achievement,
  Notification,
  Organization,
  OrganizationMember,
  Comment,
  Account,
  Session,
} from "@prisma/client";

export type UserWithProfile = User & {
  profile: Profile | null;
};

export type UserWithRelations = User & {
  profile: Profile | null;
  skills: Skill[];
  accounts: Account[];
  sessions: Session[];
};

export type ProfileWithUser = Profile & {
  user: User;
};

export type EvidenceWithFiles = Evidence & {
  files: EvidenceFile[];
  validations: Validation[];
};

export type EvidenceWithRelations = Evidence & {
  files: EvidenceFile[];
  validations: ValidationWithUser[];
  user: User;
  comments: CommentWithUser[];
};

export type ValidationWithUser = Validation & {
  validator: User;
};

export type CommentWithUser = Comment & {
  user: User;
};

export type ProjectWithUser = Project & {
  user: User;
};

export type SkillWithUser = Skill & {
  user: User;
};

export type TimelineEventWithUser = TimelineEvent & {
  user: User;
  verifiedBy: User | null;
};

export type UserBadgeWithBadge = UserBadge & {
  badge: Badge;
};

export type UserWithBadges = User & {
  badges: UserBadgeWithBadge[];
};

export type OrganizationWithMembers = Organization & {
  members: OrganizationMemberWithUser[];
};

export type OrganizationMemberWithUser = OrganizationMember & {
  user: User;
};

export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  role: string;
  twoFactorEnabled: boolean;
};

export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: string;
};

export interface SearchParams {
  q?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: "asc" | "desc";
  [key: string]: unknown;
}

export interface FileUpload {
  filename: string;
  mimeType: string;
  size: number;
  hash: string;
  url: string;
}

export interface EvidenceLink {
  title: string;
  url: string;
  description?: string;
}

export interface ActivityAttachment {
  name: string;
  url: string;
  mimeType: string;
  size: number;
}

export interface NotificationData {
  type: string;
  referenceId?: string;
  referenceType?: string;
  actorId?: string;
  actorName?: string;
  actorAvatar?: string;
  [key: string]: unknown;
}

export interface AnalyticsEvent {
  event: string;
  userId?: string;
  properties?: Record<string, unknown>;
  timestamp?: Date;
}

export interface AuditLogEntry {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
}

export interface VerificationStats {
  total: number;
  verified: number;
  pending: number;
  rejected: number;
  expired: number;
  verificationRate: number;
}

export interface ProfileStats {
  totalEvidences: number;
  verifiedEvidences: number;
  totalSkills: number;
  totalProjects: number;
  totalBadges: number;
  totalAchievements: number;
  totalValidations: number;
  confidenceScore: number;
}

export interface ConfidenceScore {
  overall: number;
  academic: number;
  professional: number;
  social: number;
  skills: number;
}
