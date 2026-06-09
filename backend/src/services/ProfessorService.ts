import { PrismaClient } from '@prisma/client';
import { AppError } from '../errors/AppError';

export class ProfessorService {
  constructor(private prisma: PrismaClient) {}

  async listar() {
    const professores = await this.prisma.professor.findMany({
      include: {
        disponibilidades: true,
        aulas: true,
      },
      orderBy: { nome: 'asc' },
    });
    return professores;
  }

  async obterPorId(id: string) {
    const professor = await this.prisma.professor.findUnique({
      where: { id },
      include: {
        disponibilidades: true,
        aulas: true,
      },
    });
    if (!professor) throw new AppError('Professor não encontrado', 404);
    return professor;
  }

  async criar(nome: string, email: string, disponibilidade: string[]) {
    const existePorNome = await this.prisma.professor.findUnique({
      where: { nome },
    });
    if (existePorNome) throw new AppError('Já existe um professor com este nome', 400);

    const existePorEmail = await this.prisma.professor.findUnique({
      where: { email },
    });
    if (existePorEmail) throw new AppError('Já existe um professor com este email', 400);

    const professor = await this.prisma.professor.create({
      data: {
        nome,
        email,
        disponibilidades: {
          create: disponibilidade.map((dia) => ({
            diaSemana: dia as any,
            disponivel: true,
          })),
        },
      },
      include: {
        disponibilidades: true,
      },
    });
    return professor;
  }

  async atualizar(id: string, nome: string, email: string, disponibilidade: string[]) {
    const professor = await this.prisma.professor.findUnique({ where: { id } });
    if (!professor) throw new AppError('Professor não encontrado', 404);

    if (nome !== professor.nome) {
      const existeNome = await this.prisma.professor.findUnique({
        where: { nome },
      });
      if (existeNome) throw new AppError('Já existe um professor com este nome', 400);
    }

    if (email !== professor.email) {
      const existeEmail = await this.prisma.professor.findUnique({
        where: { email },
      });
      if (existeEmail) throw new AppError('Já existe um professor com este email', 400);
    }

    // Atualizar disponibilidades
    await this.prisma.disponibilidade.deleteMany({ where: { professorId: id } });

    const updated = await this.prisma.professor.update({
      where: { id },
      data: {
        nome,
        email,
        disponibilidades: {
          create: disponibilidade.map((dia) => ({
            diaSemana: dia as any,
            disponivel: true,
          })),
        },
      },
      include: {
        disponibilidades: true,
      },
    });
    return updated;
  }

  async remover(id: string) {
    const professor = await this.prisma.professor.findUnique({ where: { id } });
    if (!professor) throw new AppError('Professor não encontrado', 404);

    await this.prisma.professor.delete({ where: { id } });
    return { message: 'Professor removido com sucesso' };
  }
}
