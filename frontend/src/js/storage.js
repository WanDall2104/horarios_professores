const StorageKeys = {
  CURSOS: 'horarios_cursos',
  PROFESSORES: 'horarios_professores',
  DISCIPLINAS: 'horarios_disciplinas',
  AULAS: 'horarios_aulas'
};

function loadData(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function findById(list, id) {
  return list.find(item => item.id === id);
}

function getNomeCurso(cursoId, cursos) {
  const curso = findById(cursos, cursoId);
  return curso ? curso.nome : '—';
}

function getNomeProfessor(professorId, professores) {
  const professor = findById(professores, professorId);
  return professor ? professor.nome : '—';
}

function getNomeDisciplina(disciplinaId, disciplinas) {
  const disciplina = findById(disciplinas, disciplinaId);
  return disciplina ? disciplina.nome : '—';
}
