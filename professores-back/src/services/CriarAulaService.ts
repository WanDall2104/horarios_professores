import { PrismaClient, Aula, Disponibilidade } from '@prisma/client';
import { CriarAulaDTO, CriarAulaResponse } from '../types/dtos';
import {
  DisponibilidadeError,
  ConflitoProfessorError,
  ConflitoCursoError,
} from '../errors/AppError';

export class CriarAulaService {
  constructor(private prisma: PrismaClient) {}

  async execute(dto: CriarAulaDTO): Promise<CriarAulaResponse> {
    const { diaSemana, professorId, disciplinaId, cursoId } = dto;

    await this.validarDisponibilidadeProfessor(professorId, diaSemana);

    await this.validarConflitoDeProf(professorId, diaSemana);

    await this.validarConflitoDeCurso(cursoId, diaSemana);

    const aula = await this.salvarAula({
      diaSemana,
      professorId,
      disciplinaId,
      cursoId,
    });

    return aula;
  }

  private async validarDisponibilidadeProfessor(
    professorId: string,
    diaSemana: string
  ): Promise<void> {
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

  private async validarConflitoDeProf(
    professorId: string,
    diaSemana: string
  ): Promise<void> {
    const aulaExistente: Aula | null = await this.prisma.aula.findUnique({
      where: {
        professorId_diaSemana: {
          professorId,
          diaSemana: diaSemana as any,
        },
      },
    });

    if (aulaExistente) {
      throw new ConflitoProfessorError(professorId, diaSemana);
    }
  }

  private async validarConflitoDeCurso(
    cursoId: string,
    diaSemana: string
  ): Promise<void> {
    const aulaExistente: Aula | null = await this.prisma.aula.findUnique({
      where: {
        cursoId_diaSemana: {
          cursoId,
          diaSemana: diaSemana as any,
        },
      },
    });

    if (aulaExistente) {
      throw new ConflitoCursoError(cursoId, diaSemana);
    }
  }

  private async salvarAula(dto: CriarAulaDTO): Promise<CriarAulaResponse> {
    const aula = await this.prisma.aula.create({
      data: {
        diaSemana: dto.diaSemana as any,
        professorId: dto.professorId,
        disciplinaId: dto.disciplinaId,
        cursoId: dto.cursoId,
      },
    });

    return aula as CriarAulaResponse;
  }
}
