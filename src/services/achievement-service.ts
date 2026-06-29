import { db } from "@/lib/db";
import type { AchievementType } from "@prisma/client";
import { createAuditLog } from "@/lib/audit";

interface AchievementDefinition {
  type: AchievementType;
  title: string;
  description: string;
  icon?: string;
  check: (userId: string) => Promise<boolean>;
}

const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    type: "MILESTONE",
    title: "Primeira Evidência",
    description: "Adicionou sua primeira evidência ao perfil",
    icon: "star",
    check: async (userId) => {
      const count = await db.evidence.count({ where: { userId } });
      return count >= 1;
    },
  },
  {
    type: "MILESTONE",
    title: "Colecionador de Evidências",
    description: "Acumulou 10 evidências no perfil",
    icon: "award",
    check: async (userId) => {
      const count = await db.evidence.count({ where: { userId } });
      return count >= 10;
    },
  },
  {
    type: "SKILL_MASTERY",
    title: "Primeira Habilidade",
    description: "Cadastrou sua primeira habilidade",
    icon: "zap",
    check: async (userId) => {
      const count = await db.skill.count({ where: { userId } });
      return count >= 1;
    },
  },
  {
    type: "SKILL_MASTERY",
    title: "Poliglota",
    description: "Cadastrou 3 ou mais idiomas",
    icon: "globe",
    check: async (userId) => {
      const count = await db.skill.count({
        where: { userId, category: "LANGUAGE" },
      });
      return count >= 3;
    },
  },
  {
    type: "VERIFICATION_COUNT",
    title: "Verificado",
    description: "Teve sua primeira evidência verificada",
    icon: "shield-check",
    check: async (userId) => {
      const count = await db.validation.count({
        where: {
          evidence: { userId },
          status: "APPROVED",
        },
      });
      return count >= 1;
    },
  },
  {
    type: "VERIFICATION_COUNT",
    title: "Confiança Comprovada",
    description: "Acumulou 10 validações aprovadas",
    icon: "badge-check",
    check: async (userId) => {
      const count = await db.validation.count({
        where: {
          evidence: { userId },
          status: "APPROVED",
        },
      });
      return count >= 10;
    },
  },
  {
    type: "MILESTONE",
    title: "Primeiro Projeto",
    description: "Criou seu primeiro projeto",
    icon: "briefcase",
    check: async (userId) => {
      const count = await db.project.count({ where: { userId } });
      return count >= 1;
    },
  },
  {
    type: "STREAK",
    title: "Perfil Completo",
    description: "Completou todas as seções do perfil",
    icon: "check-circle",
    check: async (userId) => {
      const profile = await db.profile.findUnique({ where: { userId } });
      if (!profile) return false;
      const filled = [
        profile.bio,
        profile.headline,
        profile.location,
        profile.github,
        profile.linkedin,
      ].filter(Boolean).length;
      return filled >= 4;
    },
  },
  {
    type: "SPECIAL",
    title: "Membro Inicial",
    description: "Um dos primeiros usuários da plataforma",
    icon: "medal",
    check: async (_userId) => {
      const count = await db.user.count();
      return count <= 1000;
    },
  },
];

export class AchievementService {
  async checkAndAward(userId: string): Promise<string[]> {
    const awarded: string[] = [];
    const existingAchievements = await db.achievement.findMany({
      where: { userId },
      select: { title: true },
    });
    const existingTitles = new Set(existingAchievements.map((a) => a.title));

    for (const achievement of ACHIEVEMENTS) {
      if (existingTitles.has(achievement.title)) continue;

      try {
        const earned = await achievement.check(userId);
        if (earned) {
          await db.achievement.create({
            data: {
              userId,
              type: achievement.type,
              title: achievement.title,
              description: achievement.description,
              icon: achievement.icon,
              metadata: { source: "automatic" },
            },
          });

          await db.notification.create({
            data: {
              userId,
              type: "ACHIEVEMENT_UNLOCKED",
              title: `Conquista desbloqueada: ${achievement.title}`,
              message: achievement.description,
              data: { achievement: achievement.title, icon: achievement.icon },
            },
          });

          await createAuditLog({
            userId,
            action: "ACHIEVEMENT_UNLOCKED",
            resource: "achievement",
            metadata: { achievement: achievement.title },
          });

          awarded.push(achievement.title);
        }
      } catch {
        continue;
      }
    }

    return awarded;
  }

  async getUserAchievements(userId: string) {
    return db.achievement.findMany({
      where: { userId },
      orderBy: { unlockedAt: "desc" },
    });
  }

  async getAchievementCount(userId: string): Promise<number> {
    return db.achievement.count({ where: { userId } });
  }
}

export const achievementService = new AchievementService();
