# Backend Horários Professores - API Completa

Backend API para o sistema de gestão de horários de professores, agora completamente implementado com todas as operações.

## Operações Implementadas

### ✅ Autenticação
- `POST /login` - Login com email e senha
- `POST /usuarios` - Registrar novo usuário

### ✅ Professores (CRUD Completo)
- `GET /professores` - Listar todos os professores
- `GET /professores/:id` - Obter professor por ID
- `POST /professores` - Criar novo professor
- `PUT /professores/:id` - Atualizar professor
- `DELETE /professores/:id` - Remover professor

### ✅ Cursos (CRUD Completo)
- `GET /cursos` - Listar todos os cursos
- `GET /cursos/:id` - Obter curso por ID
- `POST /cursos` - Criar novo curso
- `PUT /cursos/:id` - Atualizar curso
- `DELETE /cursos/:id` - Remover curso

### ✅ Disciplinas (CRUD Completo)
- `GET /disciplinas` - Listar todas as disciplinas
- `GET /disciplinas/:id` - Obter disciplina por ID
- `POST /disciplinas` - Criar nova disciplina
- `PUT /disciplinas/:id` - Atualizar disciplina
- `DELETE /disciplinas/:id` - Remover disciplina

### ✅ Aulas (CRUD Completo)
- `GET /aulas` - Listar todas as aulas
- `GET /aulas/:id` - Obter aula por ID
- `POST /aulas` - Criar nova aula
- `PUT /aulas/:id` - Atualizar aula
- `DELETE /aulas/:id` - Remover aula

## Requisitos

- Node.js 18+
- PostgreSQL 12+
- npm ou yarn

## Setup

### 1. Instalação de Dependências
```bash
npm install
```

### 2. Configurar Banco de Dados

Copie o arquivo `.env.example` para `.env` e configure:
```bash
cp .env.example .env
```

Edite `.env` com suas credenciais PostgreSQL:
```
DATABASE_URL="postgresql://user:password@localhost:5432/professores_db"
JWT_SECRET="sua_senha_secreta_aqui"
PORT=3000
```

### 3. Executar Migrations

Se usando Docker:
```bash
docker-compose up -d db
npm run prisma:migrate
```

Se usando PostgreSQL local:
```bash
npm run prisma:migrate
```

### 4. Gerar Client Prisma
```bash
npm run prisma:generate
```

### 5. Iniciar Servidor

Desenvolvimento:
```bash
npm run dev
```

Produção:
```bash
npm run build
npm run start
```

## Exemplos de Uso

### Criar Professor
```bash
curl -X POST http://localhost:3000/professores \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@example.com",
    "disponibilidade": ["SEGUNDA", "TERCA", "QUARTA"]
  }'
```

### Criar Curso
```bash
curl -X POST http://localhost:3000/cursos \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Engenharia de Software",
    "periodo": "3º Período",
    "descricao": "Curso de Engenharia de Software",
    "cargaHoraria": 120
  }'
```

### Criar Disciplina
```bash
curl -X POST http://localhost:3000/disciplinas \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Programação em Java",
    "cursoId": "clh7k9j3o0000qz088k8w3h4v"
  }'
```

### Criar Aula
```bash
curl -X POST http://localhost:3000/aulas \
  -H "Content-Type: application/json" \
  -d '{
    "professorId": "clh7k9j3o0000qz088k8w3h4v",
    "cursoId": "clh7k9j3o0000qz088k8w3h4w",
    "disciplinaId": "clh7k9j3o0000qz088k8w3h4x",
    "diaSemana": "SEGUNDA",
    "periodoTurma": "3º Período - Turma A",
    "campus": "Campus Principal"
  }'
```

## Estrutura do Projeto

```
backend/
├── src/
│   ├── services/
│   │   ├── AuthService.ts
│   │   ├── ProfessorService.ts
│   │   ├── CursoService.ts
│   │   ├── DisciplinaService.ts
│   │   └── AulaService.ts
│   ├── types/
│   │   ├── dtos.ts
│   │   ├── enums.ts
│   │   └── index.ts
│   ├── errors/
│   │   └── AppError.ts
│   └── index.ts
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── .env
├── .env.example
├── docker-compose.yml
└── package.json
```

## Tecnologias

- Express.js - Framework HTTP
- TypeScript - Linguagem de programação
- Prisma - ORM para PostgreSQL
- JWT - Autenticação
- bcrypt - Hashing de senhas
- CORS - Cross-origin requests

## Alterações Realizadas

### Schema Prisma Atualizado
- ✅ Adicionado `email` e `disponibilidade` ao modelo `Professor`
- ✅ Adicionado `periodo`, `descricao`, `cargaHoraria` ao modelo `Curso`
- ✅ Adicionado `periodoTurma` e `campus` ao modelo `Aula`
- ✅ Removidas constraints de unique inadequadas em `Aula`

### Serviços Implementados
- ✅ `ProfessorService` - Gerenciamento completo de professores
- ✅ `CursoService` - Gerenciamento completo de cursos
- ✅ `DisciplinaService` - Gerenciamento completo de disciplinas
- ✅ `AulaService` - Gerenciamento completo de aulas com validações

### Rotas Implementadas
- ✅ 28 rotas de API RESTful
- ✅ Tratamento de erros centralizado
- ✅ Validações de negócio
- ✅ CORS habilitado
- ✅ Health check endpoint

## Próximos Passos

1. Integrar autenticação JWT nas rotas protegidas
2. Adicionar middleware de autenticação
3. Implementar testes unitários
4. Documentação OpenAPI/Swagger
5. Rate limiting e validação de entrada
