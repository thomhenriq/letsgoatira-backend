
<img src="./assets/logo.png" alt="Let's Go Atira Logo" width="100%" style="margin: 0 auto"/>

# Let's go Atira — API

API do projeto **Let's go Atira**, uma plataforma para registrar e guardar os momentos dos eventos do MEJ (Movimento Empresa Júnior) da **Atria Jr.** — a empresa júnior da Faculdade de Tecnologia da Unicamp Limeira.

O **Atira** é o mascote da Atria Jr. e dá nome ao projeto.

🔗 **Base URL:** `https://letsgoatira-backend.onrender.com`

---

## 🛠️ Tecnologias

- [NestJS](https://nestjs.com/) — framework Node.js para construção da API
- [TypeORM](https://typeorm.io/) — ORM para mapeamento das entidades
- [PostgreSQL](https://www.postgresql.org/) — banco de dados relacional
- [AWS S3 (compatível)](https://aws.amazon.com/s3/) — armazenamento de arquivos (imagens/fotos), configurado via Supabase Storage
- [class-validator](https://github.com/typestack/class-validator) — validação de dados de entrada

---

### Roles de membro

| Valor | Descrição |
|---|---|
| `trainee` | Trainee |
| `advisor` | Assessor |
| `coordinator` | Coordenador |
| `director` | Diretor |

---

## 🚀 Como rodar localmente

### Pré-requisitos

- Node.js 20+
- PostgreSQL rodando localmente ou via Docker
- Bucket S3-compatível (ex: Supabase Storage)

### Instalação

```bash
npm install
```

### Variáveis de ambiente

Copie o arquivo de exemplo e preencha com suas credenciais:

```bash
cp .env.example .env
```

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | URL de conexão com o PostgreSQL |
| `STORAGE_REGION` | Região do bucket de armazenamento |
| `STORAGE_ENDPOINT` | Endpoint do serviço S3-compatível |
| `STORAGE_PUBLIC_URL` | URL pública base para acesso aos arquivos |
| `STORAGE_BUCKET` | Nome do bucket |
| `SUPABASE_ACCESS_KEY_ID` | Access Key ID do Supabase Storage |
| `SUPABASE_SECRET_ACCESS_KEY` | Secret Access Key do Supabase Storage |

### Rodando

```bash
# desenvolvimento
npm run start:dev

# produção
npm run build
npm run start:prod
```

A API sobe por padrão na porta `3000`.

---

## 📡 Endpoints

### Members

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/members` | Cadastra um novo membro |
| `GET` | `/members` | Lista todos os membros (filtro opcional por `role`) |

#### POST /members

Aceita `multipart/form-data`:

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `name` | string | ✅ | Nome do membro |
| `email` | string | ✅ | Email `@atriajr.com.br` |
| `role` | enum | ✅ | `trainee`, `advisor`, `coordinator` ou `director` |
| `avatar` | file | ✅ | Foto de perfil do membro |

#### GET /members

| Query param | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `role` | enum | ❌ | Filtra por cargo |

---

### Events

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/events` | Cria um novo evento |
| `GET` | `/events` | Lista todos os eventos |
| `GET` | `/events/:id` | Busca um evento pelo ID |
| `POST` | `/events/:id/attendances` | Registra presenças em um evento |
| `POST` | `/events/:id/photos` | Adiciona fotos a um evento |
| `DELETE` | `/events/:id/photos/:photoId` | Remove uma foto de um evento |

#### POST /events

Aceita `multipart/form-data`:

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `title` | string | ✅ | Título do evento |
| `description` | string | ✅ | Descrição do evento |
| `date` | string (ISO 8601) | ✅ | Data do evento |
| `location` | JSON string | ✅ | Objeto com os dados de localização |
| `coverImage` | file | ✅ | Imagem de capa do evento |

#### POST /events/:id/attendances

```json
{
  "emails": ["membro@atriajr.com.br", "outro@atriajr.com.br"]
}
```

Apenas emails do domínio `@atriajr.com.br` são aceitos.

#### POST /events/:id/photos

Aceita `multipart/form-data` com o campo `photos` (múltiplos arquivos).

---

## 📁 Estrutura do projeto

```
src/
├── events/
│   ├── dtos/          # Validação de entrada
│   ├── entities/      # Entidades do banco (Event, Attendance, Location, Photo)
│   ├── interfaces/
│   ├── events.controller.ts
│   ├── events.service.ts
│   └── events.module.ts
├── members/
│   ├── dtos/
│   ├── entities/      # Entidade Member
│   ├── members.controller.ts
│   ├── members.service.ts
│   └── members.module.ts
├── storage/           # Integração com S3 (upload de arquivos)
├── pipes/             # Pipe de validação de tamanho de arquivo
├── app.module.ts
└── main.ts
```

---

## 🏢 Sobre a Atria Jr.

A [Atria Jr.](https://atriajr.com.br) é a empresa júnior da Faculdade de Tecnologia (FT) da Unicamp, campus Limeira. Faz parte do MEJ — Movimento Empresa Júnior — e desenvolve projetos de tecnologia com impacto real.
