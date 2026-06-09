import { PrismaClient } from '@prisma/client';
import { AppError } from '../errors/AppError';

export class DisciplinaService {
  constructor(private prisma: PrismaClient) {}

  async listar() {
    const disciplinas = await this.prisma.disciplina.findMany({
      include: {
        curso: true,
        aulas: true,
      },
      orderBy: { nome: 'asc' },
    });
    return disciplinas;
  }

  async obterPorId(id: string) {
    const disciplina = await this.prisma.disciplina.findUnique({
      where: { id },
      include: {
        curso: true,
        aulas: true,
      },
    });
    if (!disciplina) throw new AppError('Disciplina não encontrada', 404);
    return disciplina;
  }

  async criar(nome: string, cursoId: string) {
    // Verificar se o curso existe
    const curso = await this.prisma.curso.findUnique({
      where: { id: cursoId },
    });
    if (!curso) throw new AppError('Curso não encontrado', 404);

    // Verificar se já existe uma disciplina com o mesmo nome neste curso
    const existe = await this.prisma.disciplina.findFirst({
      where: {
        nome,
        cursoId,
      },
    });
    if (existe) throw new AppError('Já existe uma disciplina com este nome neste curso', 400);

    const disciplina = await this.prisma.disciplina.create({
      data: {
        nome,
        cursoId,
      },
      include: {
        curso: true,
      },
    });
    return disciplina;
  }

  async atualizar(id: string, nome: string, cursoId: string) {
    const disciplina = await this.prisma.disciplina.findUnique({ where: { id } });
    if (!disciplina) throw new AppError('Disciplina não encontrada', 404);

    // Verificar se o curso existe
    const curso = await this.prisma.curso.findUnique({
      where: { id: cursoId },
    });
    if (!curso) throw new AppError('Curso não encontrado', 404);

    // Verificar se já existe outra disciplina com o mesmo nome neste curso
    if (nome !== disciplina.nome || cursoId !== disciplina.cursoId) {
      const existe = await this.prisma.disciplina.findFirst({
        where: {
          nome,
          cursoId,
          id: { not: id },
        },
      });
      if (existe) throw new AppError('Já existe uma disciplina com este nome neste curso', 400);
    }

    const updated = await this.prisma.disciplina.update({
      where: { id },
      data: {
        nome,
        cursoId,
      },
      include: {
        curso: true,
      },
    });
    return updated;
  }

  async remover(id: string) {
    const disciplina = await this.prisma.disciplina.findUnique({ where: { id } });
    if (!disciplina) throw new AppError('Disciplina não encontrada', 404);

    await this.prisma.disciplina.delete({ where: { id } });
    return { message: 'Disciplina removida com sucesso' };
  }
}
