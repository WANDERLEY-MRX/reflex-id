# Arquitetura do Reflex ID

## Stack Tecnológica

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS v4
- **Linguagem**: TypeScript 5 (strict mode)
- **ORM**: Prisma 7 com PostgreSQL
- **Autenticação**: NextAuth v5 (Auth.js) com suporte a OAuth (Google, GitHub, LinkedIn)
- **Validação**: Zod com react-hook-form
- **UI**: Radix UI primitives + Lucide icons + Framer Motion
- **Cache/Estado**: Zustand + TanStack React Query + Redis (Upstash)
- **Upload**: Uploadthing + CDN
- **Email**: React Email + Resend
- **Testes**: Vitest (unit/integration) + Playwright (E2E)
- **CSS**: Tailwind v4 + class-variance-authority + tailwind-merge

## Estrutura de Pastas

```
src/
  actions/       # Server Actions (Next.js)
  app/           # App Router pages
  components/    # Componentes React reutilizáveis
  config/        # Configurações centralizadas
  constants/     # Constantes e enums
  context/       # React Context providers
  hooks/         # Custom React hooks
  lib/           # Utilitários e bibliotecas
  middleware/    # Middleware de segurança
  providers/     # Providers do NextAuth e React Query
  repositories/  # Data access layer
  schemas/       # Schemas Zod
  services/      # Lógica de negócio
  store/         # Zustand stores
  styles/        # Estilos globais
  types/         # Tipos TypeScript
  utils/         # Funções utilitárias
  validators/    # Validações customizadas

emails/          # React Email templates
tests/
  unit/          # Testes unitários (Vitest)
  integration/   # Testes de integração (Vitest)
  e2e/           # Testes end-to-end (Playwright)
prisma/          # Schema e migrations
.github/workflows/ # CI/CD pipelines
docs/            # Documentação
scripts/         # Scripts auxiliares
```

## Fluxo de Dados

1. **Autenticação**: NextAuth gerencia sessões JWT. O fluxo inclui:
   - Registro com email/senha ou OAuth
   - Verificação de email via token
   - Login com 2FA opcional
   - Recuperação de senha

2. **Evidências**: O usuário cria evidências que passam por:
   - Upload de arquivo com hash SHA-256
   - Criação no banco (status PENDING)
   - Solicitação de verificação
   - Validação manual ou automática
   - Atualização de confidence level

3. **Verificação**: Fluxo multi-etapas:
   - Usuário envia evidência
   - Admin/verificador analisa
   - Aprova ou rejeita com motivo
   - Confiança é recalculada

4. **Perfil**: Score de confiança é calculado com base em:
   - Quantidade de evidências verificadas
   - Nível de confiança das evidências
   - Validações recebidas
   - Badges e achievements

## Decisões de Arquitetura

### Server Actions vs API Routes
Server Actions são preferidas para mutações (CRUD), enquanto API Routes são usadas para webhooks e integrações externas.

### Repositories Pattern
Camada de acesso a dados separada para facilitar testes e manutenção.

### Redis para Rate Limiting
Upstash Redis (serverless) para rate limiting distribuído e cache de sessão.

### React Email Templates
Templates de email em React para type-safety e reuso de componentes.

## Segurança

- Senhas hasheadas com bcrypt (12 rounds)
- 2FA com TOTP
- Rate limiting por IP e rota
- Sanitização de input com Zod
- Headers de segurança (CSP, HSTS, X-Frame-Options)
- Audit logging de ações sensíveis
- Conformidade LGPD (consentimento, exclusão lógica)

## Performance

- ISR para páginas públicas
- React Query cache client-side
- Redis cache para queries frequentes
- Lazy loading de componentes pesados
- Otimização de imagens com Next/Image
