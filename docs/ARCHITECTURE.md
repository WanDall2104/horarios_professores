# Arquitetura e Decisões de Design

## Visão Geral

Este documento descreve as decisões arquiteturais e de design tomadas para o Sistema de Gestão de Horários de Professores.

## Princípios de Design

### 1. Separação de Responsabilidades

A aplicação segue o padrão de arquitetura em camadas:

- **Camada de Apresentação**: Express routes
- **Camada de Negócio**: Services (CriarAulaService)
- **Camada de Dados**: Prisma ORM

### 2. Validação de Regras de Negócio

**Decisão**: Validações de negócio são responsabilidade da camada de serviço, não do banco de dados.

**Justificativa**:
- Permite lógica de negócio complexa e flexível
- Mensagens de erro descritivas para o cliente
- Facilita testes unitários sem mockar o banco

**Implementação**:
- `CriarAulaService` executa 4 passos de validação antes de salvar
- Cada validação retorna erros específicos (DisponibilidadeError, ConflitoProfessorError, ConflitoCursoError)
- Constraints do banco de dados actuam como última linha de defesa

### 3. Tratamento de Erros

**Decisão**: Usar classe base `AppError` com subclasses específicas para cada tipo de erro.

**Benefícios**:
- Códigos HTTP apropriados (409 Conflict para validações)
- Mensagens de erro consistentes
- Fácil adicionar logs sem modificar routes

### 4. Enumerações para Dias da Semana

**Decisão**: Usar enum `DiaSemana` em TypeScript e no schema Prisma.

**Alternativas Consideradas**:
- String livre (rejeitada por falta de type safety)
- Números 0-6 (rejeitada por legibilidade)

**Benefícios**:
- Type safety em tempo de compilação
- Validação automática pelo Prisma
- Autocomplete no IDE

## Modelagem de Dados

### Estrutura de Relacionamentos

```
Curso (1) ──────────────── (N) Disciplina
  │                              │
  │                              │
  └─────────────── (N) Aula (N) ─┘
                    │
                    │ (N)
                    │
                Professor (1)
                    │
                    │ (N)
                    │
            Disponibilidade
```

### Constraints de Unicidade

1. **Aula**: `(professorId, diaSemana)` - Professor não pode ter 2 aulas no mesmo dia
2. **Aula**: `(cursoId, diaSemana)` - Curso não pode ter 2 aulas no mesmo dia
3. **Disponibilidade**: `(professorId, diaSemana)` - Cada professor tem no máximo 1 registro de disponibilidade por dia
4. **Curso**: `nome` - Nomes de cursos são únicos
5. **Professor**: `nome` - Nomes de professores são únicos
6. **Disciplina**: `(nome, cursoId)` - Nome da disciplina é único dentro de um curso

### Campos Temporais

Todas as entidades têm:
- `createdAt`: Timestamp de criação (auto-preenchido)
- `updatedAt`: Timestamp de atualização (auto-atualizado)

### Cascata de Exclusão

Todos os relacionamentos usam `onDelete: Cascade`:
- Deletar Curso deleta suas Disciplinas e Aulas
- Deletar Professor deleta suas Disponibilidades e Aulas
- Deletar Disciplina deleta suas Aulas

## Fluxo de Validação

```
CriarAulaService.execute(DTO)
    │
    ├─→ Passo 1: Validar Disponibilidade
    │   └─→ Consulta: Disponibilidade[professorId, diaSemana]
    │
    ├─→ Passo 2: Validar Conflito de Professor
    │   └─→ Consulta: Aula[professorId, diaSemana]
    │
    ├─→ Passo 3: Validar Conflito de Curso
    │   └─→ Consulta: Aula[cursoId, diaSemana]
    │
    └─→ Passo 4: Salvar
        └─→ CREATE: Aula[...]
```

### Razão da Ordem de Validações

1. **Disponibilidade primeiro**: Falha rápida se professor não trabalha esse dia
2. **Conflito de Professor**: Verifica limite de capacidade do professor
3. **Conflito de Curso**: Verifica limite de capacidade do curso
4. **Salvar**: Apenas se todas as validações passarem

## Tratamento de Erros

### Códigos HTTP

- **201 Created**: Aula criada com sucesso
- **400 Bad Request**: Erro de validação de entrada
- **409 Conflict**: Violação de regra de negócio (disponibilidade ou conflito)
- **500 Internal Server Error**: Erro do servidor

### Classe de Erros

```typescript
AppError (base)
├── DisponibilidadeError
├── ConflitoProfessorError
└── ConflitoCursoError
```

## Fluxo de Inicialização

1. Instanciar `PrismaClient`
2. Criar Express app
3. Registrar middleware de parse JSON
4. Registrar middleware de tratamento de erros
5. Registrar routes
6. Iniciar servidor

## Testes de Cenários

### Sucesso

```
POST /aulas
{
  "diaSemana": "SEGUNDA",
  "professorId": "prof-123",
  "disciplinaId": "disc-456",
  "cursoId": "curso-789"
}

Resultado:
✓ Professor está disponível em SEGUNDA
✓ Professor não tem outra aula em SEGUNDA
✓ Curso não tem outra aula em SEGUNDA
✓ Aula criada com sucesso
HTTP 201
```

### Erro: Professor Indisponível

```
POST /aulas
{
  "diaSemana": "SEGUNDA",
  "professorId": "prof-indisponivel",
  "disciplinaId": "disc-456",
  "cursoId": "curso-789"
}

Resultado:
✗ Professor não está disponível em SEGUNDA
HTTP 409
{
  "error": "Professor com ID prof-indisponivel não está disponível para SEGUNDA",
  "statusCode": 409
}
```

### Erro: Conflito de Professor

```
POST /aulas (segunda tentativa mesmo professor, mesmo dia)
{
  "diaSemana": "SEGUNDA",
  "professorId": "prof-123",
  "disciplinaId": "disc-789",
  "cursoId": "curso-999"
}

Resultado:
✗ Professor prof-123 já tem aula em SEGUNDA
HTTP 409
{
  "error": "Professor com ID prof-123 já possui aula agendada para SEGUNDA",
  "statusCode": 409
}
```

### Erro: Conflito de Curso

```
POST /aulas (segundo curso, mesmo dia)
{
  "diaSemana": "SEGUNDA",
  "professorId": "prof-999",
  "disciplinaId": "disc-789",
  "cursoId": "curso-789"
}

Resultado:
✗ Curso curso-789 já tem aula em SEGUNDA
HTTP 409
{
  "error": "Curso com ID curso-789 já possui aula agendada para SEGUNDA",
  "statusCode": 409
}
```

## Extensões Futuras

### Segurança

- [ ] Autenticação via JWT
- [ ] Autorização baseada em roles (Admin, Professor, Secretário)
- [ ] Rate limiting
- [ ] Validação de entrada mais rigorosa

### Features

- [ ] Listar aulas com filtros (por professor, curso, dia)
- [ ] Atualizar disponibilidade de professor
- [ ] Endpoints CRUD para Cursos, Disciplinas, Professores
- [ ] Busca por conflitos de horários antes de criar aula
- [ ] Bulk operations (criar múltiplas aulas)

### Qualidade

- [ ] Testes unitários (Jest)
- [ ] Testes de integração
- [ ] E2E tests
- [ ] Documentação OpenAPI/Swagger
- [ ] Logs estruturados (Winston, Pino)
- [ ] Monitoring e alertas

### Performance

- [ ] Caching de disponibilidades
- [ ] Índices no banco de dados
- [ ] Paginação de listagens
- [ ] Query optimization

## Stack Técnico

| Camada | Tecnologia |
|--------|-----------|
| Runtime | Node.js 20+ |
| Linguagem | TypeScript |
| Web Framework | Express.js |
| ORM | Prisma |
| Banco de Dados | PostgreSQL |
| Containerização | Docker |
| Package Manager | npm |

## Como Executar

Veja [README.md](README.md) para instruções de instalação e execução.
