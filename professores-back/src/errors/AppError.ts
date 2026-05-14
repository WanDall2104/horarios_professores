export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class DisponibilidadeError extends AppError {
  constructor(professorId: string, diaSemana: string) {
    super(
      `Professor com ID ${professorId} não está disponível para ${diaSemana}`,
      409
    );
    this.name = 'DisponibilidadeError';
    Object.setPrototypeOf(this, DisponibilidadeError.prototype);
  }
}

export class ConflitoProfessorError extends AppError {
  constructor(professorId: string, diaSemana: string) {
    super(
      `Professor com ID ${professorId} já possui aula agendada para ${diaSemana}`,
      409
    );
    this.name = 'ConflitoProfessorError';
    Object.setPrototypeOf(this, ConflitoProfessorError.prototype);
  }
}

export class ConflitoCursoError extends AppError {
  constructor(cursoId: string, diaSemana: string) {
    super(
      `Curso com ID ${cursoId} já possui aula agendada para ${diaSemana}`,
      409
    );
    this.name = 'ConflitoCursoError';
    Object.setPrototypeOf(this, ConflitoCursoError.prototype);
  }
}
