# Backend - API REST

API REST para o Sistema de Gestão de Horários de Professores.

## 🏗️ Arquitetura em Camadas

```
src/
├── config/          # Configurações da app e banco de dados
├── middleware/      # Autenticação, validação, erro handling
├── routes/          # Definição de rotas Express
├── controllers/     # Recebem requisições e chamam services
├── services/        # Lógica de negócio principal
├── repositories/    # Acesso direto ao banco de dados
├── types/           # DTOs, interfaces, enums
└── errors/          # Exceções customizadas
```

## 🚀 Como Rodar

### Pré-requisitos
- Node.js >= 18
- PostgreSQL rodando

### Setup

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# Gerar cliente Prisma
npm run prisma:generate

# Executar migrations
npm run prisma:migrate

# (Opcional) Popular dados iniciais
npm run seed
```

### Desenvolvimento

```bash
npm run dev
```

O servidor rodará em `http://localhost:3000`

### Build e Produção

```bash
npm run build
npm start
```

## 📚 Scripts Disponíveis

- `npm run dev` - Inicia servidor em modo desenvolvimento
- `npm run build` - Compila TypeScript
- `npm start` - Roda aplicação compilada
- `npm run prisma:generate` - Gera cliente Prisma
- `npm run prisma:migrate` - Cria nova migration
- `npm run prisma:studio` - Abre Prisma Studio UI
- `npm run seed` - Popula banco de dados

## 🗄️ Banco de Dados

Usando Prisma ORM com PostgreSQL.

### Schema

Veja [prisma/schema.prisma](prisma/schema.prisma)

## 📝 Documentação Adicional

- [ARCHITECTURE.md](../docs/ARCHITECTURE.md) - Decisões de design
