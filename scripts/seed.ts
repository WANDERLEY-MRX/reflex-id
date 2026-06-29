import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({ url: "./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Limpar dados existentes
  await prisma.analytics.deleteMany();
  await prisma.apiKey.deleteMany();
  await prisma.consentLog.deleteMany();
  await prisma.userPermission.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.role.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.verificationRequest.deleteMany();
  await prisma.report.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.validation.deleteMany();
  await prisma.evidenceFile.deleteMany();
  await prisma.evidence.deleteMany();
  await prisma.project.deleteMany();
  await prisma.timelineEvent.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.schoolProfile.deleteMany();
  await prisma.organizationMember.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // Criar senhas hash
  const password = await bcrypt.hash("senha123", 12);

  // Criar usuário admin
  const admin = await prisma.user.create({
    data: {
      email: "admin@reflexid.com",
      name: "Administrador",
      password,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  // Criar perfil do admin
  await prisma.profile.create({
    data: {
      userId: admin.id,
      slug: "admin",
      bio: "Administrador da plataforma Reflex ID",
      headline: "Admin do Reflex ID",
      location: "São Paulo, SP",
      interests: "Tecnologia, Gestão de Projetos",
      goals: "Manter a plataforma funcionando e crescendo",
    },
  });

  // Criar usuário demo 1 - Estudante
  const student = await prisma.user.create({
    data: {
      email: "joao@email.com",
      name: "João Silva",
      password,
      role: "USER",
      emailVerified: new Date(),
    },
  });

  await prisma.profile.create({
    data: {
      userId: student.id,
      slug: "joaosilva",
      bio: "Estudante de Engenharia de Software na USP. Apaixonado por tecnologia e inovação.",
      headline: "Estudante de Engenharia de Software",
      location: "São Paulo, SP",
      website: "https://joaosilva.dev",
      github: "joaosilva",
      linkedin: "joaosilva",
      interests: JSON.stringify(["Tecnologia", "IA", "Startup"]),
      goals: JSON.stringify(["Conseguir estágio em Big Tech", "Criar startup"]),
    },
  });

  // Skills do João
  await prisma.skill.createMany({
    data: [
      { userId: student.id, name: "React", category: "HARD", level: 8 },
      { userId: student.id, name: "TypeScript", category: "HARD", level: 7 },
      { userId: student.id, name: "Python", category: "HARD", level: 6 },
      { userId: student.id, name: "Trabalho em Equipe", category: "SOFT", level: 9 },
      { userId: student.id, name: "Inglês", category: "LANGUAGE", level: 7 },
      { userId: student.id, name: "Espanhol", category: "LANGUAGE", level: 4 },
    ],
  });

  // Timeline do João
  await prisma.timelineEvent.createMany({
    data: [
      {
        userId: student.id,
        title: "Início da Graduação em Engenharia de Software",
        description: "Universidade de São Paulo (USP)",
        date: new Date("2023-03-01"),
        category: "ACADEMIC",
      },
      {
        userId: student.id,
        title: "Hackathon USP 2024",
        description: "1º lugar com projeto de IA para educação",
        date: new Date("2024-09-15"),
        category: "COMPETITION",
      },
      {
        userId: student.id,
        title: "Estágio na TechCorp",
        description: "Desenvolvimento frontend com React e TypeScript",
        date: new Date("2024-06-01"),
        category: "PROFESSIONAL",
      },
    ],
  });

  // Projetos do João
  await prisma.project.create({
    data: {
      userId: student.id,
      name: "Reflex ID",
      description: "Plataforma de identidade digital verificável para jovens",
      technologies: JSON.stringify(["Next.js", "React", "TypeScript", "Prisma", "PostgreSQL"]),
      skillsAcquired: JSON.stringify(["Full Stack", "UI/UX", "Segurança"]),
    },
  });

  // Evidências do João
  await prisma.evidence.create({
    data: {
      userId: student.id,
      title: "Certificado de Hackathon USP 2024",
      description: "1º lugar no Hackathon USP 2024 com projeto de IA para educação",
      type: "CERTIFICATE",
      verificationStatus: "VERIFIED",
      confidenceLevel: "HIGH",
      source: "Universidade de São Paulo",
    },
  });

  // Criar usuário demo 2 - Programador
  const dev = await prisma.user.create({
    data: {
      email: "maria@email.com",
      name: "Maria Santos",
      password,
      role: "USER",
      emailVerified: new Date(),
    },
  });

  await prisma.profile.create({
    data: {
      userId: dev.id,
      slug: "mariasantos",
      bio: "Desenvolvedora Full Stack com 5 anos de experiência. Especialista em Node.js e React.",
      headline: "Desenvolvedora Full Stack Senior",
      location: "Rio de Janeiro, RJ",
      github: "mariasantos",
      linkedin: "mariasantos",
      interests: "Open Source, Arquitetura de Software, Mentoria",
      goals: "Tornar Tech Lead e contribuir para projetos open source",
    },
  });

  // Badges
  await prisma.badge.createMany({
    data: [
      { name: "Primeiro Passo", description: "Completou o perfil pela primeira vez", category: "MILESTONE", level: "BRONZE" },
      { name: "Verificado", description: "Primeira evidência verificada", category: "VERIFICATION", level: "BRONZE" },
      { name: "Projetista", description: "Adicionou 3 projetos", category: "ACHIEVEMENT", level: "SILVER" },
    ],
  });

  // Conquistas do João
  const badges = await prisma.badge.findMany();
  await prisma.userBadge.createMany({
    data: badges.map((badge) => ({
      userId: student.id,
      badgeId: badge.id,
    })),
  });

  // Organização demo
  await prisma.organization.create({
    data: {
      name: "Escola ABC",
      slug: "escola-abc",
      type: "SCHOOL",
      description: "Escola de ensino médio e técnico",
      verified: true,
    },
  });

  console.log("Seed concluído!");
  console.log("Usuários criados:");
  console.log("  admin@reflexid.com / senha123");
  console.log("  joao@email.com / senha123");
  console.log("  maria@email.com / senha123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
