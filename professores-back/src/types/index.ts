import { DiaSemana } from './enums';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  statusCode: number;
}

export interface ErrorResponse {
  error: string;
  statusCode: number;
}

export interface Curso {
  id: string;
  nome: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Disciplina {
  id: string;
  nome: string;
  cursoId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Professor {
  id: string;
  nome: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Disponibilidade {
  id: string;
  diaSemana: DiaSemana;
  disponivel: boolean;
  professorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Aula {
  id: string;
  diaSemana: DiaSemana;
  professorId: string;
  disciplinaId: string;
  cursoId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CriarCursoDTO {
  nome: string;
}

export interface CriarDisciplinaDTO {
  nome: string;
  cursoId: string;
}

export interface CriarProfessorDTO {
  nome: string;
}

export interface AtualizarDisponibilidadeDTO {
  disponivel: boolean;
}

export interface CriarDisponibilidadeDTO {
  diaSemana: DiaSemana;
  disponivel: boolean;
  professorId: string;
}

export interface ListarAulasFilterDTO {
  professorId?: string;
  cursoId?: string;
  diaSemana?: DiaSemana;
  disciplinaId?: string;
  limit?: number;
  offset?: number;
}

export interface CursoResponseDTO extends Curso {}

export interface DisciplinaResponseDTO extends Disciplina {}

export interface ProfessorResponseDTO extends Professor {}

export interface DisponibilidadeResponseDTO extends Disponibilidade {}

export interface AulaResponseDTO extends Aula {}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export enum ValidationErrorCode {
  INVALID_INPUT = 'INVALID_INPUT',
  PROFESSOR_UNAVAILABLE = 'PROFESSOR_UNAVAILABLE',
  PROFESSOR_CONFLICT = 'PROFESSOR_CONFLICT',
  COURSE_CONFLICT = 'COURSE_CONFLICT',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  INVALID_ENUM = 'INVALID_ENUM',
}

export interface ValidationError {
  code: ValidationErrorCode;
  message: string;
  field?: string;
  value?: any;
}

export interface EstatisticasAulaDTO {
  totalAulas: number;
  aulaPorProfessor: Record<string, number>;
  aulaPorCurso: Record<string, number>;
  aulaPorDia: Record<string, number>;
}

export interface DisponibilidadeProfessorDTO {
  professorId: string;
  disponibilidades: {
    diaSemana: DiaSemana;
    disponivel: boolean;
  }[];
}

export interface RelatorioConflitosDTO {
  conflitosDeProf: Array<{
    professorId: string;
    diaSemana: DiaSemana;
    aulas: string[];
  }>;
  conflitosDesCurso: Array<{
    cursoId: string;
    diaSemana: DiaSemana;
    aulas: string[];
  }>;
}
