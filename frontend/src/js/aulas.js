const API = 'http://localhost:3000';

let aulas = [];
let professores = [];
let cursos = [];
let disciplinas = [];

const diasSemana = {
  SEGUNDA: 'Segunda-feira',
  TERCA: 'Terça-feira',
  QUARTA: 'Quarta-feira',
  QUINTA: 'Quinta-feira',
  SEXTA: 'Sexta-feira'
};

function showFeedback(mensagem, tipo = 'success') {
  const el = document.getElementById('msg-feedback');
  el.textContent = mensagem;
  el.className = 'msg-feedback ' + tipo;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 3500);
}

function preencherSelect(selectId, items, labelKey, placeholder) {
  const select = document.getElementById(selectId);
  select.innerHTML = `<option value="">${placeholder}</option>`;

  items.forEach(item => {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = item[labelKey];
    select.appendChild(option);
  });
}

function carregarDropdowns() {
  professores = loadData(StorageKeys.PROFESSORES);
  cursos = loadData(StorageKeys.CURSOS);
  disciplinas = loadData(StorageKeys.DISCIPLINAS);

  preencherSelect('professor', professores, 'nome', 'Selecione um professor...');
  preencherSelect('curso', cursos, 'nome', 'Selecione um curso...');
  atualizarDisciplinasPorCurso();
}

function atualizarDisciplinasPorCurso() {
  const cursoId = document.getElementById('curso').value;
  const selectDisciplina = document.getElementById('disciplina');

  const filtradas = cursoId
    ? disciplinas.filter(d => d.cursoId === cursoId)
    : disciplinas;

  selectDisciplina.innerHTML = '<option value="">Selecione uma disciplina...</option>';

  filtradas.forEach(disciplina => {
    const option = document.createElement('option');
    option.value = disciplina.id;
    option.textContent = disciplina.nome;
    selectDisciplina.appendChild(option);
  });
}

async function carregarAulas() {
  aulas = loadData(StorageKeys.AULAS);
  professores = loadData(StorageKeys.PROFESSORES);
  cursos = loadData(StorageKeys.CURSOS);
  disciplinas = loadData(StorageKeys.DISCIPLINAS);
  renderizarAulas();
}

function validarConflitosLocal(professorId, cursoId, diaSemana) {
  const conflitoProfessor = aulas.some(
    a => a.professorId === professorId && a.diaSemana === diaSemana
  );

  if (conflitoProfessor) {
    return 'Este professor já possui aula neste dia da semana.';
  }

  const conflitoCurso = aulas.some(
    a => a.cursoId === cursoId && a.diaSemana === diaSemana
  );

  if (conflitoCurso) {
    return 'Este curso já possui aula neste dia da semana.';
  }

  const professor = findById(professores, professorId);
  if (professor && professor.disponibilidade && !professor.disponibilidade.includes(diaSemana)) {
    return 'O professor não está disponível neste dia da semana.';
  }

  return null;
}

async function criarAula() {
  const professorId = document.getElementById('professor').value;
  const cursoId = document.getElementById('curso').value;
  const disciplinaId = document.getElementById('disciplina').value;
  const diaSemana = document.getElementById('dia-semana').value;
  const periodoTurma = document.getElementById('periodo-turma').value.trim();
  const campus = document.getElementById('campus').value;

  if (!professorId || !cursoId || !disciplinaId || !diaSemana || !periodoTurma || !campus) {
    showFeedback('Preencha todos os campos obrigatórios.', 'error');
    return;
  }

  const disciplina = findById(disciplinas, disciplinaId);
  if (disciplina && disciplina.cursoId !== cursoId) {
    showFeedback('A disciplina selecionada não pertence ao curso escolhido.', 'error');
    return;
  }

  const erroLocal = validarConflitosLocal(professorId, cursoId, diaSemana);
  if (erroLocal) {
    showFeedback(erroLocal, 'error');
    return;
  }

  const aula = {
    id: 'aula-' + Date.now(),
    professorId,
    cursoId,
    disciplinaId,
    diaSemana,
    periodoTurma,
    campus
  };

  try {
    const res = await fetch(API + '/aulas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        professorId,
        cursoId,
        disciplinaId,
        diaSemana
      })
    });

    if (res.ok) {
      const data = await res.json();
      aula.id = data.id || aula.id;
    } else {
      const data = await res.json().catch(() => ({}));
      showFeedback(data.error || 'Não foi possível vincular a aula na API.', 'error');
      return;
    }
  } catch {
    // Salva localmente quando a API não estiver disponível
  }

  aulas.push(aula);
  saveData(StorageKeys.AULAS, aulas);

  document.getElementById('aula-form').reset();
  carregarDropdowns();
  renderizarAulas();
  showFeedback('Aula vinculada com sucesso!', 'success');
}

async function removerAula(id) {
  if (!confirm('Tem certeza que deseja remover esta aula?')) return;

  aulas = aulas.filter(a => a.id !== id);
  saveData(StorageKeys.AULAS, aulas);

  renderizarAulas();
  showFeedback('Aula removida com sucesso.', 'success');
}

function renderizarAulas() {
  const tabela = document.getElementById('tabela-aulas');
  const emptyState = document.getElementById('empty-state');
  const badge = document.getElementById('total-aulas-table');

  tabela.innerHTML = '';
  badge.textContent = aulas.length;

  if (aulas.length === 0) {
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  aulas.forEach(aula => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${getNomeProfessor(aula.professorId, professores)}</td>
      <td><strong>${getNomeDisciplina(aula.disciplinaId, disciplinas)}</strong></td>
      <td>${getNomeCurso(aula.cursoId, cursos)}</td>
      <td><span class="dia-badge">${diasSemana[aula.diaSemana] || aula.diaSemana}</span></td>
      <td>${aula.periodoTurma || '—'}</td>
      <td>${aula.campus || '—'}</td>
      <td class="acoes-cell">
        <button class="btn-icon btn-danger" onclick="removerAula('${aula.id}')" title="Remover Aula">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    tabela.appendChild(row);
  });
}

function logout() {
  if (confirm('Tem certeza que deseja sair do sistema?')) {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const userName = localStorage.getItem('userName') || 'Usuário';
  document.getElementById('user-name').textContent = userName;

  carregarDropdowns();
  carregarAulas();
});
