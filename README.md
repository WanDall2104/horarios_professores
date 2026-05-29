# Sistema de Gestão de Horários de Professores

Sistema completo para gerenciamento de horários de professores com API REST e interface web.

## 📁 Estrutura do Projeto

```
horarios_professores/
├── backend/                 # API REST (Express + TypeScript)
│   ├── src/
│   │   ├── config/         # Configurações da aplicação
│   │   ├── controllers/    # Controladores HTTP
│   │   ├── middleware/     # Middlewares Express
│   │   ├── routes/         # Rotas da API
│   │   ├── repositories/   # Acesso a dados
│   │   ├── services/       # Lógica de negócio
│   │   ├── types/          # DTOs e interfaces
│   │   ├── errors/         # Classes de erro customizadas
│   │   └── index.ts        # Entrada da aplicação
│   ├── prisma/
│   │   ├── schema.prisma   # Schema do banco de dados
│   │   └── seed.ts         # Seed inicial
│   └── Dockerfile
│
├── frontend/                # Interface web
│   └── src/
│       ├── index.html       # Página principal
│       ├── css/             # Estilos
│       └── js/              # Scripts
│
├── docs/                    # Documentação
│   └── ARCHITECTURE.md      # Decisões arquiteturais
│
└── docker-compose.yml       # Orquestração de containers
```

## 🚀 Quick Start

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
# Abrir em um servidor HTTP local
cd frontend
# Use um servidor como: python -m http.server 8000
```

## 📚 Documentação

Veja [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) para entender as decisões arquiteturais do projeto.

## 🛠️ Tecnologias

- **Backend**: Express, TypeScript, Prisma, JWT
- **Banco de Dados**: PostgreSQL
- **Frontend**: HTML5, CSS, JavaScript

## 📝 Licença

ISC
