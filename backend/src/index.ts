import cors from 'cors';
import express, { Express, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { CriarAulaService } from './services/CriarAulaService';
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

app.post('/aulas', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto: CriarAulaDTO = req.body;
    const criarAulaService = new CriarAulaService(prisma);
    const aula = await criarAulaService.execute(dto);
    return res.status(201).json(aula);
  } catch (error) {
    next(error);
  }
});

// ↓ ROTAS NOVAS
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

process.on('SIGINT', async () => {
  console.log('Encerrando aplicação...');
  await prisma.$disconnect();
  process.exit(0);
});