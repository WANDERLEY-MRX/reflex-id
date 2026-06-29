export const config = {
  app: {
    name: "Reflex ID",
    description: "Plataforma de identidade digital verificável para jovens",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    supportEmail: "suporte@reflexid.com.br",
  },

  auth: {
    sessionMaxAge: 30 * 24 * 60 * 60,
    verificationTokenExpiresIn: 24 * 60 * 60,
    bcryptRounds: 12,
  },

  features: {
    twoFactorAuth: true,
    socialLogin: true,
    organizationVerification: true,
    evidenceUpload: true,
    badgeSystem: true,
    analytics: true,
    apiKeys: true,
    auditLogging: true,
  },

  limits: {
    maxFileSize: 10 * 1024 * 1024,
    maxFilesPerEvidence: 5,
    maxSkills: 50,
    maxProjects: 20,
    maxOrganizations: 10,
    rateLimitWindow: 60,
    rateLimitMaxRequests: 100,
    verificationRequestsPerDay: 5,
  },

  pages: {
    home: "/",
    login: "/login",
    register: "/register",
    dashboard: "/dashboard",
    profile: "/profile",
    organizations: "/organizations",
    settings: "/settings",
    admin: "/admin",
  },

  api: {
    rateLimit: 100,
    rateLimitWindow: 60,
    maxBodySize: "10mb",
  },

  upload: {
    allowedMimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ],
    maxFileSize: 10 * 1024 * 1024,
  },

  redis: {
    prefix: "reflexid:",
    ttl: {
      session: 86400,
      rateLimit: 60,
      verificationToken: 900,
      cache: 300,
    },
  },

  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
  },

  verification: {
    requiredValidations: 2,
    confidenceThreshold: 0.7,
    autoVerifyOrganizations: true,
  },
} as const;

export type Config = typeof config;
