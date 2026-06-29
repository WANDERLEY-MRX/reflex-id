import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

type EventName =
  | "user_signup"
  | "user_login"
  | "profile_viewed"
  | "evidence_created"
  | "evidence_verified"
  | "evidence_rejected"
  | "skill_added"
  | "project_created"
  | "badge_earned"
  | "achievement_unlocked"
  | "verification_requested"
  | "organization_joined"
  | "search_performed"
  | "qr_code_scanned";

interface AnalyticsEvent {
  event: EventName;
  userId?: string;
  properties?: Record<string, unknown>;
  timestamp?: Date;
}

class AnalyticsService {
  async track(event: AnalyticsEvent): Promise<void> {
    try {
      await db.analytics.create({
        data: {
          event: event.event,
          userId: event.userId ?? null,
          properties: (event.properties ?? Prisma.DbNull) as unknown as Prisma.InputJsonValue,
          timestamp: event.timestamp ?? new Date(),
        },
      });

      await this.trackPostHog(event);
    } catch {
      console.error(`Failed to track analytics event: ${event.event}`);
    }
  }

  private async trackPostHog(event: AnalyticsEvent): Promise<void> {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
    if (!key || !host) return; // silently skip

    try {
      const body = {
        api_key: key,
        event: event.event,
        distinct_id: event.userId ?? "anonymous",
        properties: {
          ...event.properties,
          $lib: "reflex-id-server",
          $host: host,
        },
        timestamp: (event.timestamp ?? new Date()).toISOString(),
      };

      await fetch(`${host}/capture`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).catch(() => {});
    } catch {
      console.error("Failed to send event to PostHog");
    }
  }

  async trackPageView(page: string, userId?: string): Promise<void> {
    await this.track({
      event: "profile_viewed",
      userId,
      properties: { page, source: "web" },
    });
  }

  async trackSearch(query: string, userId?: string): Promise<void> {
    await this.track({
      event: "search_performed",
      userId,
      properties: { query, length: query.length },
    });
  }

  async getEventCount(
    event: EventName,
    options?: { userId?: string; startDate?: Date; endDate?: Date }
  ): Promise<number> {
    const where: Record<string, unknown> = { event };

    if (options?.userId) where.userId = options.userId;
    if (options?.startDate) where.startDate = { gte: options.startDate };
    if (options?.endDate) where.endDate = { lte: options.endDate };

    return db.analytics.count({ where: where as any });
  }

  async getUserStats(userId: string) {
    const [evidences, verifiedEvidences, skills, projects, achievements] =
      await Promise.all([
        db.evidence.count({ where: { userId } }),
        db.evidence.count({
          where: { userId, verificationStatus: "VERIFIED" },
        }),
        db.skill.count({ where: { userId } }),
        db.project.count({ where: { userId } }),
        db.achievement.count({ where: { userId } }),
      ]);

    return {
      evidences,
      verifiedEvidences,
      skills,
      projects,
      achievements,
    };
  }
}

export const analyticsService = new AnalyticsService();