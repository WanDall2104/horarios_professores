import { PrismaClient } from '@prisma/client';
import { AppError } from '../errors/AppError';

export class CursoService {
  constructor(private prisma: PrismaClient) {}

  async listar() {
    const cursos = await this.prisma.curso.findMany({
      include: {
        disciplinas: true,
        aulas: true,
      },
      orderBy: { nome: 'asc' },
    });
    return cursos;
  }

  async obterPorId(id: string) {
    const curso = await this.prisma.curso.findUnique({
      where: { id },
      include: {
        disciplinas: true,
        aulas: true,
      },
    });
    if (!curso) throw new AppError('Curso não encontrado', 404);
    return curso;
  }

  async criar(nome: string, periodo?: string, descricao?: string, cargaHoraria?: number) {
    const existe = await this.prisma.curso.findUnique({
      where: { nome },
    });
    if (existe) throw new AppError('Já existe um curso com este nome', 400);

    const curso = await this.prisma.curso.create({
      data: {
        nome,
        periodo: periodo || null,
        descricao: descricao || null,
        cargaHoraria: cargaHoraria || null,
      },
      include: {
        disciplinas: true,
      },
    });
    return curso;
  }

  async atualizar(
    id: string,
    nome: string,
    periodo?: string,
    descricao?: string,
    cargaHoraria?: number
  ) {
    const curso = await this.prisma.curso.findUnique({ where: { id } });
    if (!curso) throw new AppError('Curso não encontrado', 404);

    if (nome !== curso.nome) {
      const existe = await this.prisma.curso.findUnique({
        where: { nome },
      });
      if (existe) throw new AppError('Já existe um curso com este nome', 400);
    }

    const updated = await this.prisma.curso.update({
      where: { id },
      data: {
        nome,
        periodo: periodo || null,
        descricao: descricao || null,
        cargaHoraria: cargaHoraria || null,
      },
      include: {
        disciplinas: true,
      },
    });
    return updated;
  }

  async remover(id: string) {
    const curso = await this.prisma.curso.findUnique({ where: { id } });
    if (!curso) throw new AppError('Curso não encontrado', 404);

    // Verificar se há disciplinas vinculadas
    const temDisciplinas = await this.prisma.disciplina.count({
      where: { cursoId: id },
    });
    if (temDisciplinas > 0) {
      throw new AppError('Não é possível deletar um curso com disciplinas vinculadas', 400);
    }

    await this.prisma.curso.delete({ where: { id } });
    return { message: 'Curso removido com sucesso' };
  }
}
