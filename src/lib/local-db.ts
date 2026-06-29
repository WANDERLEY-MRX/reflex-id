"use client";

export interface LocalUser {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  role: string;
  password: string;
  twoFactorEnabled: boolean;
  emailVerified: string | null;
  createdAt: string;
  deletedAt: string | null;
}

export interface LocalProfile {
  id: string;
  userId: string;
  slug: string;
  bio: string | null;
  headline: string | null;
  location: string | null;
  website: string | null;
  github: string | null;
  linkedin: string | null;
  twitter: string | null;
  instagram: string | null;
  interests: string | null;
  goals: string | null;
  availability: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LocalSkill {
  id: string;
  userId: string;
  name: string;
  category: string;
  level: number;
  verified: boolean;
  createdAt: string;
}

export interface LocalProject {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  technologies: string;
  images: string | null;
  links: string | null;
  results: string | null;
  skillsAcquired: string;
  createdAt: string;
  updatedAt: string;
}

export interface LocalEvidence {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  type: string;
  verificationStatus: string;
  confidenceLevel: string;
  source: string | null;
  fileUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LocalTimelineEvent {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  date: string;
  category: string;
  verifiedById: string | null;
  createdAt: string;
}

export interface LocalNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

function generateId(): string {
  return "cl" + Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

const DB_PREFIX = "reflexid_";

function getCollection<T>(name: string): T[] {
  return getItem<T[]>(`${DB_PREFIX}${name}`, []);
}

function setCollection<T>(name: string, data: T[]): void {
  setItem(`${DB_PREFIX}${name}`, data);
}

export function seedDemoData(): void {
  if (typeof window === "undefined") return;
  const users = getCollection<LocalUser>("users");
  if (users.length > 0) return;

  const now = new Date().toISOString();
  const demoUsers: LocalUser[] = [
    {
      id: "user_admin_001",
      email: "admin@reflexid.com",
      name: "Administrador",
      avatar: null,
      role: "ADMIN",
      password: "senha123",
      twoFactorEnabled: false,
      emailVerified: now,
      createdAt: now,
      deletedAt: null,
    },
    {
      id: "user_joao_001",
      email: "joao@email.com",
      name: "João Silva",
      avatar: null,
      role: "USER",
      password: "senha123",
      twoFactorEnabled: false,
      emailVerified: now,
      createdAt: now,
      deletedAt: null,
    },
    {
      id: "user_maria_001",
      email: "maria@email.com",
      name: "Maria Santos",
      avatar: null,
      role: "USER",
      password: "senha123",
      twoFactorEnabled: false,
      emailVerified: now,
      createdAt: now,
      deletedAt: null,
    },
  ];

  const demoProfiles: LocalProfile[] = [
    {
      id: "profile_admin_001",
      userId: "user_admin_001",
      slug: "admin",
      bio: "Administrador da plataforma Reflex ID",
      headline: "Admin do Reflex ID",
      location: "São Paulo, SP",
      website: null,
      github: null,
      linkedin: null,
      twitter: null,
      instagram: null,
      interests: "Tecnologia, Gestão de Projetos",
      goals: "Manter a plataforma funcionando e crescendo",
      availability: null,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "profile_joao_001",
      userId: "user_joao_001",
      slug: "joaosilva",
      bio: "Estudante de Engenharia de Software na USP. Apaixonado por tecnologia e inovação.",
      headline: "Estudante de Engenharia de Software",
      location: "São Paulo, SP",
      website: "https://joaosilva.dev",
      github: "joaosilva",
      linkedin: "joaosilva",
      twitter: null,
      instagram: null,
      interests: JSON.stringify(["Tecnologia", "IA", "Startup"]),
      goals: JSON.stringify(["Conseguir estágio em Big Tech", "Criar startup"]),
      availability: null,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "profile_maria_001",
      userId: "user_maria_001",
      slug: "mariasantos",
      bio: "Desenvolvedora Full Stack com 5 anos de experiência. Especialista em Node.js e React.",
      headline: "Desenvolvedora Full Stack Senior",
      location: "Rio de Janeiro, RJ",
      website: null,
      github: "mariasantos",
      linkedin: "mariasantos",
      twitter: null,
      instagram: null,
      interests: "Open Source, Arquitetura de Software, Mentoria",
      goals: "Tornar Tech Lead e contribuir para projetos open source",
      availability: null,
      createdAt: now,
      updatedAt: now,
    },
  ];

  const demoSkills: LocalSkill[] = [
    { id: "skill_001", userId: "user_joao_001", name: "React", category: "HARD", level: 8, verified: false, createdAt: now },
    { id: "skill_002", userId: "user_joao_001", name: "TypeScript", category: "HARD", level: 7, verified: false, createdAt: now },
    { id: "skill_003", userId: "user_joao_001", name: "Python", category: "HARD", level: 6, verified: false, createdAt: now },
    { id: "skill_004", userId: "user_joao_001", name: "Trabalho em Equipe", category: "SOFT", level: 9, verified: false, createdAt: now },
    { id: "skill_005", userId: "user_joao_001", name: "Inglês", category: "LANGUAGE", level: 7, verified: false, createdAt: now },
    { id: "skill_006", userId: "user_maria_001", name: "Node.js", category: "HARD", level: 9, verified: false, createdAt: now },
    { id: "skill_007", userId: "user_maria_001", name: "React", category: "HARD", level: 9, verified: false, createdAt: now },
    { id: "skill_008", userId: "user_maria_001", name: "PostgreSQL", category: "HARD", level: 8, verified: false, createdAt: now },
    { id: "skill_009", userId: "user_maria_001", name: "Liderança", category: "SOFT", level: 8, verified: false, createdAt: now },
  ];

  const demoProjects: LocalProject[] = [
    {
      id: "project_001",
      userId: "user_joao_001",
      name: "Reflex ID",
      description: "Plataforma de identidade digital verificável para jovens",
      technologies: JSON.stringify(["Next.js", "React", "TypeScript", "Prisma"]),
      images: null,
      links: null,
      results: "Plataforma em produção com 100+ usuários",
      skillsAcquired: JSON.stringify(["Full Stack", "UI/UX", "Segurança"]),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "project_002",
      userId: "user_maria_001",
      name: "API Gateway",
      description: "Gateway de APIs para microserviços com rate limiting e caching",
      technologies: JSON.stringify(["Node.js", "Express", "Redis", "Docker"]),
      images: null,
      links: null,
      results: "Reduziu latência em 40%",
      skillsAcquired: JSON.stringify(["Arquitetura", "DevOps", "Performance"]),
      createdAt: now,
      updatedAt: now,
    },
  ];

  const demoTimeline: LocalTimelineEvent[] = [
    { id: "tl_001", userId: "user_joao_001", title: "Início da Graduação em Engenharia de Software", description: "Universidade de São Paulo (USP)", date: "2023-03-01T00:00:00.000Z", category: "ACADEMIC", verifiedById: null, createdAt: now },
    { id: "tl_002", userId: "user_joao_001", title: "Hackathon USP 2024", description: "1º lugar com projeto de IA para educação", date: "2024-09-15T00:00:00.000Z", category: "COMPETITION", verifiedById: null, createdAt: now },
    { id: "tl_003", userId: "user_joao_001", title: "Estágio na TechCorp", description: "Desenvolvimento frontend com React e TypeScript", date: "2024-06-01T00:00:00.000Z", category: "PROFESSIONAL", verifiedById: null, createdAt: now },
  ];

  const demoEvidence: LocalEvidence[] = [
    { id: "ev_001", userId: "user_joao_001", title: "Certificado de Hackathon USP 2024", description: "1º lugar no Hackathon USP 2024 com projeto de IA para educação", type: "CERTIFICATE", verificationStatus: "VERIFIED", confidenceLevel: "HIGH", source: "Universidade de São Paulo", fileUrl: null, createdAt: now, updatedAt: now },
  ];

  setCollection("users", demoUsers);
  setCollection("profiles", demoProfiles);
  setCollection("skills", demoSkills);
  setCollection("projects", demoProjects);
  setCollection("timeline", demoTimeline);
  setCollection("evidences", demoEvidence);
  setCollection("notifications", []);
}

export function authenticateUser(email: string, password: string): LocalUser | null {
  const users = getCollection<LocalUser>("users");
  const user = users.find((u) => u.email === email && u.password === password && !u.deletedAt);
  return user || null;
}

export function registerUser(email: string, name: string, password: string): LocalUser | null {
  const users = getCollection<LocalUser>("users");
  if (users.find((u) => u.email === email)) return null;

  const now = new Date().toISOString();
  const newUser: LocalUser = {
    id: generateId(),
    email,
    name,
    avatar: null,
    role: "USER",
    password,
    twoFactorEnabled: false,
    emailVerified: now,
    createdAt: now,
    deletedAt: null,
  };

  users.push(newUser);
  setCollection("users", users);

  const profiles = getCollection<LocalProfile>("profiles");
  profiles.push({
    id: generateId(),
    userId: newUser.id,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + newUser.id.slice(0, 8),
    bio: null,
    headline: null,
    location: null,
    website: null,
    github: null,
    linkedin: null,
    twitter: null,
    instagram: null,
    interests: null,
    goals: null,
    availability: null,
    createdAt: now,
    updatedAt: now,
  });
  setCollection("profiles", profiles);

  return newUser;
}

export function getUserById(id: string): LocalUser | null {
  const users = getCollection<LocalUser>("users");
  return users.find((u) => u.id === id && !u.deletedAt) || null;
}

export function getUserByEmail(email: string): LocalUser | null {
  const users = getCollection<LocalUser>("users");
  return users.find((u) => u.email === email && !u.deletedAt) || null;
}

export function updateUser(id: string, data: Partial<LocalUser>): LocalUser | null {
  const users = getCollection<LocalUser>("users");
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...data };
  setCollection("users", users);
  return users[idx];
}

export function getProfileByUserId(userId: string): LocalProfile | null {
  const profiles = getCollection<LocalProfile>("profiles");
  return profiles.find((p) => p.userId === userId) || null;
}

export function getProfileBySlug(slug: string): LocalProfile | null {
  const profiles = getCollection<LocalProfile>("profiles");
  return profiles.find((p) => p.slug === slug) || null;
}

export function updateProfile(userId: string, data: Partial<LocalProfile>): LocalProfile | null {
  const profiles = getCollection<LocalProfile>("profiles");
  const idx = profiles.findIndex((p) => p.userId === userId);
  if (idx === -1) return null;
  profiles[idx] = { ...profiles[idx], ...data, updatedAt: new Date().toISOString() };
  setCollection("profiles", profiles);
  return profiles[idx];
}

export function getSkillsByUserId(userId: string): LocalSkill[] {
  return getCollection<LocalSkill>("skills").filter((s) => s.userId === userId);
}

export function addSkill(userId: string, name: string, category: string, level: number): LocalSkill {
  const skills = getCollection<LocalSkill>("skills");
  const skill: LocalSkill = {
    id: generateId(),
    userId,
    name,
    category,
    level,
    verified: false,
    createdAt: new Date().toISOString(),
  };
  skills.push(skill);
  setCollection("skills", skills);
  return skill;
}

export function updateSkillLevel(id: string, level: number): void {
  const skills = getCollection<LocalSkill>("skills");
  const idx = skills.findIndex((s) => s.id === id);
  if (idx !== -1) {
    skills[idx].level = level;
    setCollection("skills", skills);
  }
}

export function removeSkill(id: string): void {
  const skills = getCollection<LocalSkill>("skills");
  setCollection("skills", skills.filter((s) => s.id !== id));
}

export function getProjectsByUserId(userId: string): LocalProject[] {
  return getCollection<LocalProject>("projects").filter((p) => p.userId === userId);
}

export function addProject(userId: string, data: Omit<LocalProject, "id" | "userId" | "createdAt" | "updatedAt">): LocalProject {
  const projects = getCollection<LocalProject>("projects");
  const now = new Date().toISOString();
  const project: LocalProject = { ...data, id: generateId(), userId, createdAt: now, updatedAt: now };
  projects.push(project);
  setCollection("projects", projects);
  return project;
}

export function updateProject(id: string, data: Partial<LocalProject>): void {
  const projects = getCollection<LocalProject>("projects");
  const idx = projects.findIndex((p) => p.id === id);
  if (idx !== -1) {
    projects[idx] = { ...projects[idx], ...data, updatedAt: new Date().toISOString() };
    setCollection("projects", projects);
  }
}

export function deleteProject(id: string): void {
  const projects = getCollection<LocalProject>("projects");
  setCollection("projects", projects.filter((p) => p.id !== id));
}

export function getTimelineByUserId(userId: string): LocalTimelineEvent[] {
  return getCollection<LocalTimelineEvent>("timeline").filter((t) => t.userId === userId);
}

export function addTimelineEvent(userId: string, data: Omit<LocalTimelineEvent, "id" | "userId" | "createdAt">): LocalTimelineEvent {
  const events = getCollection<LocalTimelineEvent>("timeline");
  const event: LocalTimelineEvent = { ...data, id: generateId(), userId, createdAt: new Date().toISOString() };
  events.push(event);
  setCollection("timeline", events);
  return event;
}

export function getEvidencesByUserId(userId: string): LocalEvidence[] {
  return getCollection<LocalEvidence>("evidences").filter((e) => e.userId === userId);
}

export function addEvidence(userId: string, data: Omit<LocalEvidence, "id" | "userId" | "createdAt" | "updatedAt">): LocalEvidence {
  const evidences = getCollection<LocalEvidence>("evidences");
  const now = new Date().toISOString();
  const evidence: LocalEvidence = { ...data, id: generateId(), userId, createdAt: now, updatedAt: now };
  evidences.push(evidence);
  setCollection("evidences", evidences);
  return evidence;
}

export function getNotificationsByUserId(userId: string): LocalNotification[] {
  return getCollection<LocalNotification>("notifications").filter((n) => n.userId === userId);
}

export function addNotification(userId: string, title: string, message: string, type: string): void {
  const notifications = getCollection<LocalNotification>("notifications");
  notifications.unshift({
    id: generateId(),
    userId,
    title,
    message,
    type,
    read: false,
    createdAt: new Date().toISOString(),
  });
  setCollection("notifications", notifications);
}

export function markNotificationRead(id: string): void {
  const notifications = getCollection<LocalNotification>("notifications");
  const idx = notifications.findIndex((n) => n.id === id);
  if (idx !== -1) {
    notifications[idx].read = true;
    setCollection("notifications", notifications);
  }
}

export function markAllNotificationsRead(userId: string): void {
  const notifications = getCollection<LocalNotification>("notifications");
  notifications.forEach((n) => {
    if (n.userId === userId) n.read = true;
  });
  setCollection("notifications", notifications);
}

export function setSession(userId: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${DB_PREFIX}session`, userId);
}

export function getSession(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(`${DB_PREFIX}session`);
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(`${DB_PREFIX}session`);
}

export function getCurrentUser(): LocalUser | null {
  const sessionId = getSession();
  if (!sessionId) return null;
  return getUserById(sessionId);
}

export function getCurrentProfile(): LocalProfile | null {
  const user = getCurrentUser();
  if (!user) return null;
  return getProfileByUserId(user.id);
}
