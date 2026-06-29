# Políticas de Segurança - Reflex ID

## Conformidade LGPD

### Dados Pessoais

- Coleta mínima necessária: nome, email, foto (opcional)
- Consentimento explícito para cada finalidade
- Direito de acesso, correção, exclusão e portabilidade
- Exclusão lógica (soft delete) com retention de 90 dias após solicitação
- Registro de consentimento em `ConsentLog`

### Direitos do Titular

- `GET /api/privacy/data` - Exportar dados pessoais
- `DELETE /api/privacy/data` - Solicitar exclusão
- `PUT /api/privacy/consent` - Atualizar consentimentos

### DPO

Email: dpo@reflexid.com.br
Prazo de resposta: 5 dias úteis

## Criptografia

### Dados em Trânsito

- TLS 1.3 obrigatório em todos os endpoints
- HSTS com max-age=31536000
- Certificados Let's Encrypt (auto-renewal)

### Dados em Repouso

- Senhas: bcrypt com 12 rounds de salt
- Tokens 2FA: armazenados como hash SHA-256
- Chaves de API: armazenadas como hash SHA-512
- Sessões: JWT assinado com RS256

### Hash de Arquivos

- SHA-256 para verificação de integridade de uploads
- Comparação de hash antes do processamento

## Autenticação

### Política de Senhas

- Mínimo 8 caracteres
- Pelo menos 1 letra maiúscula, 1 minúscula, 1 número
- Troca obrigatória a cada 90 dias (admin configurável)
- Histórico de 5 senhas anteriores

### 2FA (Autenticação de Dois Fatores)

- TOTP (Time-based One-Time Password)
- Código de 6 dígitos com validade de 30 segundos
- Códigos de recuperação (10 códigos, uso único)
- Obrigatório para admins e moderadores

### Sessão

- JWT com expiração de 7 dias
- Refresh token com expiração de 30 dias
- Revogação de sessão em caso de mudança de senha
- Limite de 5 sessões simultâneas por usuário

## Rate Limit

### Por Endpoint

| Rota              | Limite       | Janela |
|-------------------|-------------|--------|
| /api/auth/login    | 5 tentativas | 15 min |
| /api/auth/register | 3 tentativas | 60 min |
| /api/auth/*        | 10 req/min   | 1 min  |
| /api/*             | 100 req/min  | 1 min  |
| Upload de arquivo  | 10 req/hora  | 1 hora |

### Por Usuário

- Verificações/dia: 5 solicitações
- API Key: 1000 req/min
- Máximo de 5 evidências criadas por hora

## Headers de Segurança

Política de Content-Security-Policy (CSP) aplicada via middleware:

```typescript
default-src 'self';
script-src 'self' 'unsafe-eval' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' https: data: blob:;
font-src 'self';
connect-src 'self' https://api.resend.com https://uploadthing.com;
frame-src 'none';
object-src 'none';
```

Outros headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

## API Keys

### Criação

- Prefixo `rx_` para identificação
- Hash SHA-512 armazenado no banco
- Chave completa mostrada apenas uma vez

### Permissões

- Escopo definido por permissões associadas
- Expiração configurável (máx. 1 ano)
- Revogação imediata via dashboard

## Audit Logging

Todas as ações sensíveis são registradas:

- Login/logout
- Criação/alteração/exclusão de evidências
- Verificações realizadas
- Mudanças de permissão
- Acessos admin
- Exportação de dados

## Vulnerabilidades

Para reportar vulnerabilidades de segurança:

- Email: security@reflexid.com.br
- PGP Key: https://reflexid.com.br/security/pgp.asc
- Resposta esperada em até 48 horas úteis

Política de divulgação responsável: 90 dias para correção antes da divulgação pública.
