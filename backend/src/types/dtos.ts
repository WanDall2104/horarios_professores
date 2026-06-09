import { DiaSemana } from './enums';

export interface CriarAulaDTO {
  diaSemana: DiaSemana;
  professorId: string;
  disciplinaId: string;
  cursoId: string;
  periodoTurma?: string;
  campus?: string;
}

export interface CriarAulaResponse {
  id: string;
  diaSemana: DiaSemana;
  professorId: string;
  disciplinaId: string;
  cursoId: string;
  periodoTurma?: string;
  campus?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CriarProfessorDTO {
  nome: string;
  email: string;
  disponibilidade: string[];
}

export interface CriarCursoDTO {
  nome: string;
  periodo?: string;
  descricao?: string;
  cargaHoraria?: number;
}

export interface CriarDisciplinaDTO {
  nome: string;
  cursoId: string;
}
