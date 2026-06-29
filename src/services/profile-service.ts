import { db } from "@/lib/db";
import { createHash } from "crypto";
import { cacheGet, cacheSet } from "@/lib/redis";
import { config } from "@/config";

export interface ProfileCompleteness {
  percentage: number;
  filled: number;
  total: number;
  missing: string[];
}

export class ProfileService {
  async getProfileBySlug(slug: string) {
    const cacheKey = `profile:slug:${slug}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return cached;

    const profile = await db.profile.findUnique({
      where: { slug },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    if (profile) {
      await cacheSet(cacheKey, profile, config.redis.ttl.cache);
    }

    return profile;
  }

  async getProfileByUserId(userId: string) {
    const cacheKey = `profile:user:${userId}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return cached;

    const profile = await db.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    if (profile) {
      await cacheSet(cacheKey, profile, config.redis.ttl.cache);
    }

    return profile;
  }

  calculateCompleteness(profile: {
    bio?: string | null;
    headline?: string | null;
    location?: string | null;
    website?: string | null;
    github?: string | null;
    linkedin?: string | null;
    twitter?: string | null;
    instagram?: string | null;
    interests?: string[];
    goals?: string[];
    availability?: string | null;
  }): ProfileCompleteness {
    const fields: Record<string, unknown> = {
      bio: profile.bio,
      headline: profile.headline,
      location: profile.location,
      website: profile.website,
      github: profile.github,
      linkedin: profile.linkedin,
      twitter: profile.twitter,
      instagram: profile.instagram,
      interests: profile.interests?.length ? profile.interests : null,
      goals: profile.goals?.length ? profile.goals : null,
      availability: profile.availability,
    };

    const missing: string[] = [];

    for (const [key, value] of Object.entries(fields)) {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        missing.push(key);
      }
    }

    const filled = Object.keys(fields).length - missing.length;
    const total = Object.keys(fields).length;
    const percentage = Math.round((filled / total) * 100);

    return { percentage, filled, total, missing };
  }

  async generateQRCodeData(slug: string): Promise<string> {
    const appUrl = config.app.url;
    return `${appUrl}/profile/${slug}`;
  }

  async isSlugAvailable(slug: string, excludeUserId?: string): Promise<boolean> {
    const existing = await db.profile.findUnique({ where: { slug } });
    if (!existing) return true;
    if (excludeUserId && existing.userId === excludeUserId) return true;
    return false;
  }

  async generateUniqueSlug(base: string, userId: string): Promise<string> {
    const slug = base
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 40);

    const exists = await db.profile.findUnique({ where: { slug } });
    if (!exists) return slug;

    return `${slug}-${userId.slice(0, 8)}`;
  }

  hashProfileData(data: string): string {
    return createHash("sha256").update(data).digest("hex");
  }
}

export const profileService = new ProfileService();
