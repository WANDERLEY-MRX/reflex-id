# Documentação da API - Reflex ID

## Visão Geral

Base URL: `https://api.reflexid.com.br/v1` (produção) / `http://localhost:3000/api` (desenvolvimento)

Autenticação: Bearer token (JWT) ou API Key (`X-API-Key` header)

## Autenticação

### POST /api/auth/register

Registra um novo usuário.

```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "SenhaForte123"
}
```

Resposta (201):
```json
{
  "success": true,
  "data": { "id": "uuid", "email": "joao@example.com" },
  "message": "Conta criada. Verifique seu email."
}
```

### POST /api/auth/login

Realiza login.

```json
{
  "email": "joao@example.com",
  "password": "SenhaForte123",
  "code": "123456"
}
```

Resposta (200):
```json
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "name": "João Silva", "email": "joao@example.com", "role": "USER" },
    "token": "jwt-token"
  }
}
```

### POST /api/auth/logout

Invalida a sessão atual.

### GET /api/auth/session

Retorna a sessão do usuário autenticado.

### POST /api/auth/verify-email

Verifica email com token.

```json
{
  "token": "verification-token-uuid"
}
```

### POST /api/auth/forgot-password

Solicita redefinição de senha.

```json
{
  "email": "joao@example.com"
}
```

### POST /api/auth/reset-password

Redefine senha com token.

```json
{
  "token": "reset-token-uuid",
  "password": "NovaSenha123",
  "confirmPassword": "NovaSenha123"
}
```

## Perfil

### GET /api/profile

Retorna o perfil do usuário autenticado.

### PUT /api/profile

Atualiza o perfil.

```json
{
  "slug": "joao-silva",
  "bio": "Desenvolvedor full-stack",
  "headline": "Software Engineer",
  "location": "São Paulo, SP",
  "website": "https://joao.dev",
  "github": "joaosilva",
  "linkedin": "joaosilva",
  "twitter": "@joaosilva",
  "interests": ["tecnologia", "música"],
  "goals": ["Aprender Rust"],
  "availability": "Disponível para estágio"
}
```

### GET /api/profile/:slug

Retorna perfil público pelo slug.

## Evidências

### GET /api/evidence

Lista evidências do usuário.

Query params: `page`, `pageSize`, `status`, `type`, `sort`

### POST /api/evidence

Cria nova evidência.

```json
{
  "title": "Certificado de React",
  "description": "Curso Avançado de React",
  "type": "CERTIFICATE",
  "url": "https://example.com/cert.pdf",
  "source": "Udemy"
}
```

### GET /api/evidence/:id

Retorna detalhes da evidência.

### PUT /api/evidence/:id

Atualiza evidência.

### DELETE /api/evidence/:id

Remove evidência.

## Arquivos

### POST /api/evidence/:id/files

Upload de arquivo (multipart/form-data).

`Content-Type: multipart/form-data`
- `file`: O arquivo (max 10MB)

### DELETE /api/evidence/:id/files/:fileId

Remove arquivo.

## Validações

### POST /api/evidence/:id/validate

Registra validação.

```json
{
  "status": "APPROVED",
  "comment": "Documento verificado e autêntico",
  "confidenceLevel": "HIGH"
}
```

### GET /api/evidence/:id/validations

Lista validações da evidência.

## Projetos

### GET /api/projects

Lista projetos.

### POST /api/projects

Cria projeto.

```json
{
  "name": "Portfólio Pessoal",
  "description": "Meu site pessoal",
  "technologies": ["React", "Next.js", "TypeScript"],
  "images": [{ "url": "https://example.com/img.png", "caption": "Home page" }],
  "links": [{ "title": "GitHub", "url": "https://github.com/test" }],
  "results": "Projeto concluído com sucesso",
  "skillsAcquired": ["Frontend", "UI/UX"]
}
```

### GET /api/projects/:id

### PUT /api/projects/:id

### DELETE /api/projects/:id

## Organizações

### GET /api/organizations

Lista organizações.

### POST /api/organizations

Cria organização.

```json
{
  "name": "Escola Exemplo",
  "slug": "escola-exemplo",
  "type": "SCHOOL",
  "description": "Escola de ensino médio",
  "website": "https://escolaexemplo.edu.br"
}
```

### POST /api/organizations/:id/invite

Convida membro.

```json
{
  "email": "convidado@example.com",
  "role": "MEMBER"
}
```

## Habilidades

### GET /api/skills

### POST /api/skills

```json
{
  "name": "React",
  "category": "HARD",
  "level": 4
}
```

### PUT /api/skills/:id

### DELETE /api/skills/:id

## Badges e Achievements

### GET /api/badges

### GET /api/achievements

## Notificações

### GET /api/notifications

### PUT /api/notifications/:id/read

Marca como lida.

### PUT /api/notifications/read-all

Marca todas como lidas.

## Admin

### GET /api/admin/verifications

Solicitações de verificação pendentes.

### POST /api/admin/verifications/:id/approve

### POST /api/admin/verifications/:id/reject

### GET /api/admin/users

Lista usuários.

### GET /api/admin/stats

Estatísticas da plataforma.

## Erros

Todos os endpoints retornam erros no formato:

```json
{
  "success": false,
  "error": "Descrição do erro",
  "code": "ERROR_CODE"
}
```

Códigos comuns:
- `VALIDATION_ERROR` - Dados inválidos
- `NOT_FOUND` - Recurso não encontrado
- `UNAUTHORIZED` - Não autenticado
- `FORBIDDEN` - Sem permissão
- `RATE_LIMITED` - Muitas requisições
- `CONFLICT` - Conflito (ex: email já existe)
- `INTERNAL_ERROR` - Erro interno do servidor
