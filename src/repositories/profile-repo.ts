import { db } from "@/lib/db";
import type { Profile, Prisma } from "@prisma/client";
import type { UserWithProfile, PaginatedResult } from "@/types";

export interface ProfileFilters {
  search?: string;
  hasBio?: boolean;
  hasAvatar?: boolean;
  interests?: string[];
  location?: string;
}

export class ProfileRepository {
  async findById(id: string): Promise<Profile | null> {
    return db.profile.findUnique({ where: { id } });
  }

  async findByUserId(userId: string): Promise<Profile | null> {
    return db.profile.findUnique({ where: { userId } });
  }

  async findBySlug(slug: string): Promise<Profile | null> {
    return db.profile.findUnique({ where: { slug } });
  }

  async findBySlugWithUser(slug: string): Promise<UserWithProfile | null> {
    const profile = await db.profile.findUnique({
      where: { slug },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!profile) return null;
    return profile.user as UserWithProfile;
  }

  async findMany(
    filters: ProfileFilters = {},
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResult<Profile>> {
    const where: Prisma.ProfileWhereInput = {};

    if (filters.search) {
      where.OR = [
        { slug: { contains: filters.search, mode: "insensitive" } },
        { user: { name: { contains: filters.search, mode: "insensitive" } } },
      ];
    }
    if (filters.hasBio !== undefined) {
      where.bio = filters.hasBio ? { not: null } : null;
    }
    if (filters.location) {
      where.location = { contains: filters.location, mode: "insensitive" };
    }
    if (filters.interests && filters.interests.length > 0) {
      where.interests = { hasSome: filters.interests };
    }

    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      db.profile.findMany({
        where,
        skip,
        take: pageSize,
        include: { user: { select: { id: true, name: true, avatar: true } } },
        orderBy: { updatedAt: "desc" },
      }),
      db.profile.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      hasNextPage: page * pageSize < total,
      hasPreviousPage: page > 1,
    };
  }

  async create(data: Prisma.ProfileCreateInput): Promise<Profile> {
    return db.profile.create({ data });
  }

  async update(
    userId: string,
    data: Prisma.ProfileUpdateInput
  ): Promise<Profile> {
    return db.profile.update({ where: { userId }, data });
  }

  async delete(userId: string): Promise<void> {
    await db.profile.delete({ where: { userId } });
  }

  async isSlugAvailable(slug: string, excludeUserId?: string): Promise<boolean> {
    const existing = await db.profile.findUnique({ where: { slug } });
    if (!existing) return true;
    if (excludeUserId && existing.userId === excludeUserId) return true;
    return false;
  }

  async getCompleteness(userId: string): Promise<number> {
    const profile = await db.profile.findUnique({
      where: { userId },
      include: { user: { select: { avatar: true } } },
    });
    if (!profile) return 0;

    const fields = [
      profile.bio,
      profile.headline,
      profile.location,
      profile.website,
      profile.github,
      profile.linkedin,
      profile.user.avatar,
    ];

    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  }
}

export const profileRepo = new ProfileRepository();
