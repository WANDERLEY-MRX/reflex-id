import { db } from "./db";
import { Prisma } from "@prisma/client";

interface AuditLogParams {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
}

export async function createAuditLog(params: AuditLogParams): Promise<void> {
  try {
    await db.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        resource: params.resource,
        resourceId: params.resourceId ?? null,
        metadata: (params.metadata ?? Prisma.DbNull) as unknown as Prisma.InputJsonValue,
        ip: params.ip ?? null,
        userAgent: params.userAgent ?? null,
      },
    });
  } catch (error) {
    console.error("Failed to create audit log:", error);
  }
}

export async function createAuditLogBulk(
  logs: AuditLogParams[]
): Promise<void> {
  try {
    await db.auditLog.createMany({
      data: logs.map((log) => ({
        userId: log.userId,
        action: log.action,
        resource: log.resource,
        resourceId: log.resourceId ?? null,
        metadata: (log.metadata ?? Prisma.DbNull) as unknown as Prisma.InputJsonValue,
        ip: log.ip ?? null,
        userAgent: log.userAgent ?? null,
      })),
    });
  } catch (error) {
    console.error("Failed to create bulk audit logs:", error);
  }
}

export const AuditActions = {
  USER_SIGN_IN: "USER_SIGN_IN",
  USER_SIGN_OUT: "USER_SIGN_OUT",
  USER_CREATED: "USER_CREATED",
  USER_UPDATED: "USER_UPDATED",
  USER_DELETED: "USER_DELETED",
  PROFILE_UPDATED: "PROFILE_UPDATED",
  EVIDENCE_CREATED: "EVIDENCE_CREATED",
  EVIDENCE_UPDATED: "EVIDENCE_UPDATED",
  EVIDENCE_DELETED: "EVIDENCE_DELETED",
  EVIDENCE_VERIFIED: "EVIDENCE_VERIFIED",
  EVIDENCE_REJECTED: "EVIDENCE_REJECTED",
  SKILL_CREATED: "SKILL_CREATED",
  SKILL_UPDATED: "SKILL_UPDATED",
  SKILL_DELETED: "SKILL_DELETED",
  PROJECT_CREATED: "PROJECT_CREATED",
  PROJECT_UPDATED: "PROJECT_UPDATED",
  PROJECT_DELETED: "PROJECT_DELETED",
  ORGANIZATION_CREATED: "ORGANIZATION_CREATED",
  ORGANIZATION_UPDATED: "ORGANIZATION_UPDATED",
  ORGANIZATION_DELETED: "ORGANIZATION_DELETED",
  MEMBER_ADDED: "MEMBER_ADDED",
  MEMBER_REMOVED: "MEMBER_REMOVED",
  MEMBER_ROLE_UPDATED: "MEMBER_ROLE_UPDATED",
  BADGE_AWARDED: "BADGE_AWARDED",
  ACHIEVEMENT_UNLOCKED: "ACHIEVEMENT_UNLOCKED",
  API_KEY_CREATED: "API_KEY_CREATED",
  API_KEY_REVOKED: "API_KEY_REVOKED",
  TWO_FACTOR_ENABLED: "TWO_FACTOR_ENABLED",
  TWO_FACTOR_DISABLED: "TWO_FACTOR_DISABLED",
  PASSWORD_CHANGED: "PASSWORD_CHANGED",
  EMAIL_CHANGED: "EMAIL_CHANGED",
  ACCOUNT_LINKED: "ACCOUNT_LINKED",
  ACCOUNT_UNLINKED: "ACCOUNT_UNLINKED",
  CONSENT_GRANTED: "CONSENT_GRANTED",
  CONSENT_REVOKED: "CONSENT_REVOKED",
  REPORT_CREATED: "REPORT_CREATED",
  REPORT_RESOLVED: "REPORT_RESOLVED",
} as const;
