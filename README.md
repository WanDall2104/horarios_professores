# Sistema de Gestão de Horários de Professores

Sistema completo para gerenciamento de horários de professores com API REST e interface web.

## 📁 Estrutura do Projeto

```
horarios_professores/
├── backend/                 # API REST (Express + TypeScript + Prisma)
│   ├── src/
│   │   ├── services/        # Lógica de negócio
│   │   ├── types/           # DTOs e interfaces
│   │   ├── errors/          # Classes de erro customizadas
│   │   └── index.ts         # Entrada da aplicação
│   ├── prisma/
│   │   ├── schema.prisma    # Schema do banco de dados
│   │   └── seed.ts          # Seed inicial
│   └── docker-compose.yml   # Orquestração de containers
│
├── frontend/                # Interface web
│   └── src/
│       ├── *.html           # Páginas (login, dashboard, aulas, etc.)
│       ├── css/             # Estilos
│       └── js/              # Scripts (comunicação com API)
│
└── docs/
```

## 🚀 Quick Start

### 1. Banco de Dados (Docker)

```bash
cd backend
docker-compose up -d db
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite `.env` com as credenciais do Docker:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/professores_db"
```

### 3. Instalar dependências e migrar

```bash
npm install
npx prisma migrate dev --name init
npx ts-node prisma/seed.ts
```

### 4. Iniciar servidor

```bash
npm run dev
```

A API rodará em `http://localhost:3000`.

### 5. Frontend

Em outro terminal:

```bash
cd frontend\src
python -m http.server 8080
```

Acesse `http://localhost:8080`.

### 6. Criar usuário

```powershell
Invoke-RestMethod -Uri http://localhost:3000/usuarios -Method Post -ContentType "application/json" -Body '{"email":"admin@email.com","senha":"123456"}'
```

## 📚 Documentação

- [API Endpoints](backend/README_API.md)
- [Arquitetura](docs/ARCHITECTURE.md)

## 🛠️ Tecnologias

- **Backend**: Express, TypeScript, Prisma, JWT
- **Banco de Dados**: PostgreSQL (Docker)
- **Frontend**: HTML5, CSS, JavaScript (Vanilla)
