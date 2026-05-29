import { DiaSemana } from './enums';

export interface CriarAulaDTO {
  diaSemana: DiaSemana;
  professorId: string;
  disciplinaId: string;
  cursoId: string;
}

export interface CriarAulaResponse {
  id: string;
  diaSemana: DiaSemana;
  professorId: string;
  disciplinaId: string;
  cursoId: string;
  createdAt: Date;
  updatedAt: Date;
}
