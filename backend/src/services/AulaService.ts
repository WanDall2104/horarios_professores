import { PrismaClient, Aula, Disponibilidade } from '@prisma/client';
import { CriarAulaDTO, CriarAulaResponse } from '../types/dtos';
import {
  DisponibilidadeError,
  ConflitoProfessorError,
  ConflitoCursoError,
} from '../errors/AppError';
import { AppError } from '../errors/AppError';

export class AulaService {
  constructor(private prisma: PrismaClient) {}

  async listar() {
    const aulas = await this.prisma.aula.findMany({
      include: {
        professor: true,
        disciplina: true,
        curso: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return aulas;
  }

  async obterPorId(id: string) {
    const aula = await this.prisma.aula.findUnique({
      where: { id },
      include: {
        professor: true,
        disciplina: true,
        curso: true,
      },
    });
    if (!aula) throw new AppError('Aula não encontrada', 404);
    return aula;
  }

  async criar(dto: CriarAulaDTO): Promise<CriarAulaResponse> {
    const { diaSemana, professorId, disciplinaId, cursoId } = dto;

    await this.validarDisponibilidadeProfessor(professorId, diaSemana);

    // Remover validação de conflito único (permitir múltiplas aulas do mesmo professor/curso no mesmo dia)
    const aula = await this.salvarAula({
      diaSemana,
      professorId,
      disciplinaId,
      cursoId,
    });

    return aula;
  }

  async atualizar(id: string, dto: Partial<CriarAulaDTO>) {
    const aula = await this.prisma.aula.findUnique({ where: { id } });
    if (!aula) throw new AppError('Aula não encontrada', 404);

    // Validar disponibilidade se o dia foi alterado
    if (dto.diaSemana && dto.diaSemana !== aula.diaSemana) {
      const professorId = dto.professorId || aula.professorId;
      await this.validarDisponibilidadeProfessor(professorId, dto.diaSemana);
    }

    const updated = await this.prisma.aula.update({
      where: { id },
      data: {
        diaSemana: dto.diaSemana || aula.diaSemana,
        professorId: dto.professorId || aula.professorId,
        disciplinaId: dto.disciplinaId || aula.disciplinaId,
        cursoId: dto.cursoId || aula.cursoId,
        periodoTurma: dto.periodoTurma !== undefined ? dto.periodoTurma : aula.periodoTurma,
        campus: dto.campus !== undefined ? dto.campus : aula.campus,
      },
      include: {
        professor: true,
        disciplina: true,
        curso: true,
      },
    });
    return updated;
  }

  async remover(id: string) {
    const aula = await this.prisma.aula.findUnique({ where: { id } });
    if (!aula) throw new AppError('Aula não encontrada', 404);

    await this.prisma.aula.delete({ where: { id } });
    return { message: 'Aula removida com sucesso' };
  }

  private async validarDisponibilidadeProfessor(
    professorId: string,
    diaSemana: string
  ): Promise<void> {
    // Verificar se o professor existe
    const professor = await this.prisma.professor.findUnique({
      where: { id: professorId },
    });
    if (!professor) throw new AppError('Professor não encontrado', 404);

    // Verificar se o professor tem disponibilidade para este dia
    const disponibilidade: Disponibilidade | null =
      await this.prisma.disponibilidade.findUnique({
        where: {
          professorId_diaSemana: {
            professorId,
            diaSemana: diaSemana as any,
          },
        },
      });

    if (!disponibilidade || !disponibilidade.disponivel) {
      throw new DisponibilidadeError(professorId, diaSemana);
    }
  }

  private async salvarAula(dto: CriarAulaDTO): Promise<CriarAulaResponse> {
    const aula = await this.prisma.aula.create({
      data: {
        diaSemana: dto.diaSemana as any,
        professorId: dto.professorId,
        disciplinaId: dto.disciplinaId,
        cursoId: dto.cursoId,
        periodoTurma: dto.periodoTurma,
        campus: dto.campus,
      },
      include: {
        professor: true,
        disciplina: true,
        curso: true,
      },
    });

    return aula as CriarAulaResponse;
  }
}
