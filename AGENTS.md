<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Reflex ID — Guia de Contexto Global

## Stack

- **Frontend**: Next.js 16 (App Router), React 19.2, Tailwind CSS v4
- **ORM**: Prisma 7 + PostgreSQL
- **Auth**: NextAuth v5 (Auth.js) com OAuth (Google, GitHub, LinkedIn)
- **Validação**: Zod + react-hook-form
- **Testes**: Vitest (unit/integration) + Playwright (E2E)
- **Email**: React Email + Resend
- **Cache/Estado**: Zustand + TanStack React Query + Redis (Upstash)
- **UI**: Radix UI + Lucide + Framer Motion
- **CSS**: tailwind-merge + class-variance-authority
- **Upload**: Uploadthing + CDN
- **Linguagem**: TypeScript strict mode

## Estrutura

```
src/
  actions/        # Server Actions
  app/            # App Router pages
  components/     # UI components
  config/         # Config centralizada
  constants/      # Constantes
  hooks/          # Custom hooks
  lib/            # Utilitários (auth, db, email, rate-limit, upload, utils)
  middleware/     # Security middleware
  providers/      # NextAuth / React Query providers
  repositories/   # Data access layer
  schemas/        # Zod schemas
  services/       # Business logic
  store/          # Zustand stores
  types/          # TypeScript types
  utils/          # Utility functions
  validators/     # Custom validators
emails/           # React Email templates
  components/     # Email components (layout, header, footer, button)
tests/
  unit/           # Vitest unit tests
  integration/    # Vitest integration tests
  e2e/            # Playwright E2E tests
docs/             # Documentation
scripts/          # Seed scripts
.github/workflows/ # CI/CD
```

## Convenções

- **Server Actions** preferidas para mutações; API Routes para webhooks/integrações
- **Repositories pattern** para acesso a dados
- **Zod schemas** validam em server e client side
- **React Email** para templates de email type-safe
- **Vitest** para testes unitários e integração; Playwright para E2E
- **Color primária**: `#7c3aed` (violet-600)
- **Locale**: pt-BR
- **Naming**: camelCase para funções/variáveis, PascalCase para componentes/tipos
- **Imports**: path alias `@/` mapeado para `./src/`

## Regras

1. Todo schema Zod deve ter tipos inferidos exportados
2. Toda ação deve validar input com Zod antes de processar
3. Uploads devem ter hash SHA-256 para integridade
4. Rate limiting em todas as rotas de autenticação
5. Soft delete para dados de usuário (LGPD)
6. Audit logging para ações sensíveis
7. Testes unitários para todos os schemas e utils
8. Testes de integração para fluxos críticos (auth, evidence)
9. E2E tests para fluxos completos no Playwright
10. Componentes de email responsivos com estilos inline
