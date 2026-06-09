import 'dotenv/config';
import cors from 'cors';
import express, { Express, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AulaService } from './services/AulaService';
import { ProfessorService } from './services/ProfessorService';
import { CursoService } from './services/CursoService';
import { DisciplinaService } from './services/DisciplinaService';
import { CriarAulaDTO } from './types/dtos';
import { AppError } from './errors/AppError';
import { AuthService } from './services/AuthService';

const app: Express = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// ========== ROTAS DE AUTENTICAÇÃO ==========
app.post('/usuarios', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, senha } = req.body;
    const authService = new AuthService(prisma);
    const usuario = await authService.cadastrar(email, senha);
    return res.status(201).json(usuario);
  } catch (error) {
    next(error);
  }
});

app.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, senha } = req.body;
    const authService = new AuthService(prisma);
    const resultado = await authService.login(email, senha);
    return res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
});

// ========== ROTAS DE PROFESSORES ==========
app.get('/professores', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const service = new ProfessorService(prisma);
    const professores = await service.listar();
    return res.status(200).json(professores);
  } catch (error) {
    next(error);
  }
});

app.get('/professores/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = new ProfessorService(prisma);
    const professor = await service.obterPorId(req.params.id);
    return res.status(200).json(professor);
  } catch (error) {
    next(error);
  }
});

app.post('/professores', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nome, email, disponibilidade } = req.body;
    const service = new ProfessorService(prisma);
    const professor = await service.criar(nome, email, disponibilidade);
    return res.status(201).json(professor);
  } catch (error) {
    next(error);
  }
});

app.put('/professores/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nome, email, disponibilidade } = req.body;
    const service = new ProfessorService(prisma);
    const professor = await service.atualizar(req.params.id, nome, email, disponibilidade);
    return res.status(200).json(professor);
  } catch (error) {
    next(error);
  }
});

app.delete('/professores/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = new ProfessorService(prisma);
    const result = await service.remover(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// ========== ROTAS DE CURSOS ==========
app.get('/cursos', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const service = new CursoService(prisma);
    const cursos = await service.listar();
    return res.status(200).json(cursos);
  } catch (error) {
    next(error);
  }
});

app.get('/cursos/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = new CursoService(prisma);
    const curso = await service.obterPorId(req.params.id);
    return res.status(200).json(curso);
  } catch (error) {
    next(error);
  }
});

app.post('/cursos', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nome, periodo, descricao, cargaHoraria } = req.body;
    const service = new CursoService(prisma);
    const curso = await service.criar(nome, periodo, descricao, cargaHoraria);
    return res.status(201).json(curso);
  } catch (error) {
    next(error);
  }
});

app.put('/cursos/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nome, periodo, descricao, cargaHoraria } = req.body;
    const service = new CursoService(prisma);
    const curso = await service.atualizar(req.params.id, nome, periodo, descricao, cargaHoraria);
    return res.status(200).json(curso);
  } catch (error) {
    next(error);
  }
});

app.delete('/cursos/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = new CursoService(prisma);
    const result = await service.remover(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// ========== ROTAS DE DISCIPLINAS ==========
app.get('/disciplinas', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const service = new DisciplinaService(prisma);
    const disciplinas = await service.listar();
    return res.status(200).json(disciplinas);
  } catch (error) {
    next(error);
  }
});

app.get('/disciplinas/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = new DisciplinaService(prisma);
    const disciplina = await service.obterPorId(req.params.id);
    return res.status(200).json(disciplina);
  } catch (error) {
    next(error);
  }
});

app.post('/disciplinas', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nome, cursoId } = req.body;
    const service = new DisciplinaService(prisma);
    const disciplina = await service.criar(nome, cursoId);
    return res.status(201).json(disciplina);
  } catch (error) {
    next(error);
  }
});

app.put('/disciplinas/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nome, cursoId } = req.body;
    const service = new DisciplinaService(prisma);
    const disciplina = await service.atualizar(req.params.id, nome, cursoId);
    return res.status(200).json(disciplina);
  } catch (error) {
    next(error);
  }
});

app.delete('/disciplinas/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = new DisciplinaService(prisma);
    const result = await service.remover(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// ========== ROTAS DE AULAS ==========
app.get('/aulas', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const service = new AulaService(prisma);
    const aulas = await service.listar();
    return res.status(200).json(aulas);
  } catch (error) {
    next(error);
  }
});

app.get('/aulas/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = new AulaService(prisma);
    const aula = await service.obterPorId(req.params.id);
    return res.status(200).json(aula);
  } catch (error) {
    next(error);
  }
});

app.post('/aulas', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto: CriarAulaDTO = req.body;
    const service = new AulaService(prisma);
    const aula = await service.criar(dto);
    return res.status(201).json(aula);
  } catch (error) {
    next(error);
  }
});

app.put('/aulas/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto: Partial<CriarAulaDTO> = req.body;
    const service = new AulaService(prisma);
    const aula = await service.atualizar(req.params.id, dto);
    return res.status(200).json(aula);
  } catch (error) {
    next(error);
  }
});

app.delete('/aulas/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = new AulaService(prisma);
    const result = await service.remover(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// ========== MIDDLEWARE DE ERRO ==========
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      statusCode: err.statusCode,
    });
  }

  console.error(err);
  return res.status(500).json({
    error: 'Erro interno do servidor',
    statusCode: 500,
  });
});

// ========== INICIAÇÃO DO SERVIDOR ==========
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

process.on('SIGINT', async () => {
  console.log('Encerrando aplicação...');
  await prisma.$disconnect();
  process.exit(0);
});