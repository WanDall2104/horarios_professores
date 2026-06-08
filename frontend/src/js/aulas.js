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

function preencherSelect(selectId, items, labelKey, placeholder, labelFormatter) {
  const select = document.getElementById(selectId);
  select.innerHTML = `<option value="">${placeholder}</option>`;

  items.forEach(item => {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = labelFormatter ? labelFormatter(item) : item[labelKey];
    select.appendChild(option);
  });
}

function carregarDropdowns() {
  professores = loadData(StorageKeys.PROFESSORES);
  cursos = loadData(StorageKeys.CURSOS);
  disciplinas = loadData(StorageKeys.DISCIPLINAS);

  preencherSelect('professor', professores, 'nome', 'Selecione um professor...');
  preencherSelect('curso', cursos, 'nome', 'Selecione um curso...', (c) => c.periodo ? `${c.nome} — ${c.periodo}` : c.nome);
  atualizarDisciplinasPorCurso();
}

function carregarDropdownsEdit() {
  professores = loadData(StorageKeys.PROFESSORES);
  cursos = loadData(StorageKeys.CURSOS);
  disciplinas = loadData(StorageKeys.DISCIPLINAS);

  preencherSelect('edit-aula-professor', professores, 'nome', 'Selecione um professor...');
  preencherSelect('edit-aula-curso', cursos, 'nome', 'Selecione um curso...', (c) => c.periodo ? `${c.nome} — ${c.periodo}` : c.nome);
  atualizarDisciplinasEdit();
}

function atualizarDisciplinasEdit() {
  const cursoId = document.getElementById('edit-aula-curso').value;
  const selectDisciplina = document.getElementById('edit-aula-disciplina');
  const periodoTurmaInput = document.getElementById('edit-aula-periodo');

  const curso = findById(cursos, cursoId);
  if (curso && curso.periodo) {
    periodoTurmaInput.value = curso.periodo;
  }

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

function atualizarDisciplinasPorCurso() {
  const cursoId = document.getElementById('curso').value;
  const selectDisciplina = document.getElementById('disciplina');
  const periodoTurmaInput = document.getElementById('periodo-turma');

  const curso = findById(cursos, cursoId);
  if (curso && curso.periodo) {
    periodoTurmaInput.value = curso.periodo;
  } else {
    periodoTurmaInput.value = '';
  }

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

function validarConflitosLocal(professorId, cursoId, diaSemana, periodoTurma, ignoreAulaId) {
  const conflitoProfessor = aulas.some(
    a => a.id !== ignoreAulaId && a.professorId === professorId && a.diaSemana === diaSemana
  );

  if (conflitoProfessor) {
    return 'Este professor já possui aula neste dia da semana.';
  }

  const conflitoPeriodo = aulas.some(
    a => a.id !== ignoreAulaId && a.cursoId === cursoId && a.diaSemana === diaSemana && a.periodoTurma === periodoTurma
  );

  if (conflitoPeriodo) {
    return 'Este período/turma já possui aula neste dia da semana.';
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

  const erroLocal = validarConflitosLocal(professorId, cursoId, diaSemana, periodoTurma);
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
  carregarFiltrosGrade();
  renderizarGradeSemanal();
  showFeedback('Aula vinculada com sucesso!', 'success');
}

async function removerAula(id) {
  if (!await showConfirm('Tem certeza que deseja remover esta aula?')) return;

  aulas = aulas.filter(a => a.id !== id);
  saveData(StorageKeys.AULAS, aulas);

  renderizarAulas();
  carregarFiltrosGrade();
  renderizarGradeSemanal();
  showFeedback('Aula removida com sucesso.', 'success');
}

// ===== EDIÇÃO DE AULA =====
function showModalFeedback(mensagem, tipo = 'error') {
  const el = document.getElementById('edit-aula-msg');
  el.textContent = mensagem;
  el.className = 'msg-feedback ' + tipo;
  el.style.display = 'block';
}

function limparModalFeedback() {
  const el = document.getElementById('edit-aula-msg');
  el.style.display = 'none';
}

function abrirEdicaoAula(id) {
  const aula = aulas.find(a => a.id === id);
  if (!aula) return;

  limparModalFeedback();
  document.getElementById('edit-aula-id').value = aula.id;
  carregarDropdownsEdit();

  document.getElementById('edit-aula-professor').value = aula.professorId;
  document.getElementById('edit-aula-curso').value = aula.cursoId;
  atualizarDisciplinasEdit();
  document.getElementById('edit-aula-disciplina').value = aula.disciplinaId;
  document.getElementById('edit-aula-dia').value = aula.diaSemana;
  document.getElementById('edit-aula-periodo').value = aula.periodoTurma || '';
  document.getElementById('edit-aula-campus').value = aula.campus || '';

  document.getElementById('modal-edicao-aula').classList.add('open');
}

function fecharModalAula() {
  document.getElementById('modal-edicao-aula').classList.remove('open');
}

async function salvarEdicaoAula() {
  const id = document.getElementById('edit-aula-id').value;
  const professorId = document.getElementById('edit-aula-professor').value;
  const cursoId = document.getElementById('edit-aula-curso').value;
  const disciplinaId = document.getElementById('edit-aula-disciplina').value;
  const diaSemana = document.getElementById('edit-aula-dia').value;
  const periodoTurma = document.getElementById('edit-aula-periodo').value.trim();
  const campus = document.getElementById('edit-aula-campus').value;

  limparModalFeedback();

  if (!professorId || !cursoId || !disciplinaId || !diaSemana || !periodoTurma || !campus) {
    showModalFeedback('Preencha todos os campos obrigatórios.');
    return;
  }

  const disciplina = findById(disciplinas, disciplinaId);
  if (disciplina && disciplina.cursoId !== cursoId) {
    showModalFeedback('A disciplina selecionada não pertence ao curso escolhido.');
    return;
  }

  const erroLocal = validarConflitosLocal(professorId, cursoId, diaSemana, periodoTurma, id);
  if (erroLocal) {
    showModalFeedback(erroLocal);
    return;
  }

  const index = aulas.findIndex(a => a.id === id);
  if (index === -1) return;

  aulas[index] = { ...aulas[index], professorId, cursoId, disciplinaId, diaSemana, periodoTurma, campus };
  saveData(StorageKeys.AULAS, aulas);

  fecharModalAula();
  renderizarAulas();
  carregarFiltrosGrade();
  renderizarGradeSemanal();
  showFeedback('Aula atualizada com sucesso!', 'success');
}

document.addEventListener('click', function (e) {
  const modal = document.getElementById('modal-edicao-aula');
  if (e.target === modal) fecharModalAula();
});

// ===== GRADE SEMANAL =====
function extrairPeriodo(periodoTurma) {
  if (!periodoTurma) return '';
  const partes = periodoTurma.split(/[-–]/);
  return partes[0] ? partes[0].trim() : periodoTurma;
}

function extrairTurma(periodoTurma) {
  if (!periodoTurma) return '';
  const partes = periodoTurma.split(/[-–]/);
  return partes[1] ? partes[1].trim() : '';
}

function carregarFiltrosGrade() {
  aulas = loadData(StorageKeys.AULAS);
  cursos = loadData(StorageKeys.CURSOS);
  professores = loadData(StorageKeys.PROFESSORES);
  disciplinas = loadData(StorageKeys.DISCIPLINAS);

  preencherSelect('grade-filtro-curso', cursos, 'nome', 'Todos os cursos', (c) => c.periodo ? `${c.nome} — ${c.periodo}` : c.nome);
  preencherSelect('grade-filtro-professor', professores, 'nome', 'Todos os professores');
  preencherSelect('grade-filtro-campus', [...new Set(aulas.map(a => a.campus).filter(Boolean))].sort().map(n => ({ id: n, nome: n })), 'nome', 'Todos os campus');

  atualizarFiltrosDependentes();
}

function atualizarFiltrosDependentes() {
  aulas = loadData(StorageKeys.AULAS);
  cursos = loadData(StorageKeys.CURSOS);
  disciplinas = loadData(StorageKeys.DISCIPLINAS);

  const cursoId = document.getElementById('grade-filtro-curso').value;
  let aulasBase = cursoId ? aulas.filter(a => a.cursoId === cursoId) : aulas;

  const periodos = [...new Set(aulasBase.map(a => extrairPeriodo(a.periodoTurma)).filter(Boolean))].sort();
  const turmas = [...new Set(aulasBase.map(a => extrairTurma(a.periodoTurma)).filter(Boolean))].sort();
  let disciplinasBase = cursoId ? disciplinas.filter(d => d.cursoId === cursoId) : disciplinas;

  manterValorAnterior('grade-filtro-periodo', periodos, 'Todos os períodos');
  manterValorAnterior('grade-filtro-turma', turmas, 'Todas as turmas');

  const selectDisc = document.getElementById('grade-filtro-disciplina');
  const valorDiscAnterior = selectDisc.value;
  selectDisc.innerHTML = '<option value="">Todas as disciplinas</option>';
  disciplinasBase.forEach(d => {
    const option = document.createElement('option');
    option.value = d.id;
    option.textContent = d.nome;
    selectDisc.appendChild(option);
  });
  if (disciplinasBase.some(d => d.id === valorDiscAnterior)) {
    selectDisc.value = valorDiscAnterior;
  }
}

function manterValorAnterior(selectId, valores, placeholder) {
  const select = document.getElementById(selectId);
  const valorAnterior = select.value;
  select.innerHTML = `<option value="">${placeholder}</option>`;
  valores.forEach(v => {
    const option = document.createElement('option');
    option.value = v;
    option.textContent = v;
    select.appendChild(option);
  });
  if (valores.includes(valorAnterior)) {
    select.value = valorAnterior;
  }
}

function renderizarGradeSemanal() {
  const container = document.getElementById('grade-container');
  const cursoId = document.getElementById('grade-filtro-curso').value;
  const periodoFiltro = document.getElementById('grade-filtro-periodo').value;
  const turmaFiltro = document.getElementById('grade-filtro-turma').value;
  const professorId = document.getElementById('grade-filtro-professor').value;
  const disciplinaId = document.getElementById('grade-filtro-disciplina').value;
  const campusFiltro = document.getElementById('grade-filtro-campus').value;
  const diaFiltro = document.getElementById('grade-filtro-dia').value;

  aulas = loadData(StorageKeys.AULAS);
  professores = loadData(StorageKeys.PROFESSORES);
  cursos = loadData(StorageKeys.CURSOS);
  disciplinas = loadData(StorageKeys.DISCIPLINAS);

  let aulasFiltradas = aulas;

  if (cursoId) aulasFiltradas = aulasFiltradas.filter(a => a.cursoId === cursoId);
  if (periodoFiltro) aulasFiltradas = aulasFiltradas.filter(a => extrairPeriodo(a.periodoTurma) === periodoFiltro);
  if (turmaFiltro) aulasFiltradas = aulasFiltradas.filter(a => extrairTurma(a.periodoTurma) === turmaFiltro);
  if (professorId) aulasFiltradas = aulasFiltradas.filter(a => a.professorId === professorId);
  if (disciplinaId) aulasFiltradas = aulasFiltradas.filter(a => a.disciplinaId === disciplinaId);
  if (campusFiltro) aulasFiltradas = aulasFiltradas.filter(a => a.campus === campusFiltro);
  if (diaFiltro) aulasFiltradas = aulasFiltradas.filter(a => a.diaSemana === diaFiltro);

  const diasOrdem = ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA'];
  const diasNomes = { SEGUNDA: 'Segunda', TERCA: 'Terça', QUARTA: 'Quarta', QUINTA: 'Quinta', SEXTA: 'Sexta' };

  if (aulasFiltradas.length === 0) {
    container.innerHTML = '<div class="grade-empty"><p>Nenhuma aula encontrada com os filtros selecionados.</p></div>';
    return;
  }

  const periodos = [...new Set(aulasFiltradas.map(a => a.periodoTurma))].sort();

  let html = '<table class="grade-table"><thead><tr><th>Dia da Semana</th>';
  periodos.forEach(p => {
    const periodo = extrairPeriodo(p);
    const turma = extrairTurma(p);
    html += `<th><span class="th-periodo">${periodo}</span>${turma ? `<span class="th-turma">${turma}</span>` : ''}</th>`;
  });
  if (periodos.length === 0) {
    html += '<th>Horários</th>';
  }
  html += '</tr></thead><tbody>';

  diasOrdem.forEach(dia => {
    html += `<tr><td class="grade-dia-label">${diasNomes[dia]}</td>`;
    if (periodos.length > 0) {
      periodos.forEach(periodo => {
        const aulasNoDia = aulasFiltradas.filter(a => a.diaSemana === dia && a.periodoTurma === periodo);
        if (aulasNoDia.length > 0) {
          html += '<td>';
          aulasNoDia.forEach(aula => {
            const profNome = getNomeProfessor(aula.professorId, professores);
            const discNome = getNomeDisciplina(aula.disciplinaId, disciplinas);
            const cursoObj = findById(cursos, aula.cursoId);
            const cursoNome = cursoObj ? cursoObj.nome : '—';
            const cursoPeriodo = cursoObj && cursoObj.periodo ? cursoObj.periodo : '';
            const periodoLabel = extrairPeriodo(aula.periodoTurma);
            const turmaLabel = extrairTurma(aula.periodoTurma);
            html += `<div class="grade-cell">
              <span class="grade-cell-disciplina">${discNome}</span>
              <span class="grade-cell-professor"><i class="fas fa-chalkboard-user"></i> ${profNome}</span>
              <span class="grade-cell-periodo"><i class="fas fa-clock"></i> ${periodoLabel}</span>
              <span class="grade-cell-turma"><i class="fas fa-layer-group"></i> ${cursoNome}${cursoPeriodo ? ' — ' + cursoPeriodo : ''}${turmaLabel ? ' — ' + turmaLabel : ''}</span>
            </div>`;
          });
          html += '</td>';
        } else {
          html += '<td><div class="grade-cell-empty">—</div></td>';
        }
      });
    } else {
      const aulasNoDia = aulasFiltradas.filter(a => a.diaSemana === dia);
      if (aulasNoDia.length > 0) {
        html += '<td>';
        aulasNoDia.forEach(aula => {
          const profNome = getNomeProfessor(aula.professorId, professores);
          const discNome = getNomeDisciplina(aula.disciplinaId, disciplinas);
          const cursoObj = findById(cursos, aula.cursoId);
          const cursoNome = cursoObj ? cursoObj.nome : '—';
          const cursoPeriodo = cursoObj && cursoObj.periodo ? cursoObj.periodo : '';
          const periodoLabel = extrairPeriodo(aula.periodoTurma);
          const turmaLabel = extrairTurma(aula.periodoTurma);
          html += `<div class="grade-cell">
            <span class="grade-cell-disciplina">${discNome}</span>
            <span class="grade-cell-professor"><i class="fas fa-chalkboard-user"></i> ${profNome}</span>
            <span class="grade-cell-periodo"><i class="fas fa-clock"></i> ${periodoLabel}</span>
            <span class="grade-cell-turma"><i class="fas fa-layer-group"></i> ${cursoNome}${cursoPeriodo ? ' — ' + cursoPeriodo : ''}${turmaLabel ? ' — ' + turmaLabel : ''}</span>
          </div>`;
        });
        html += '</td>';
      } else {
        html += '<td><div class="grade-cell-empty">—</div></td>';
      }
    }
    html += '</tr>';
  });

  html += '</tbody></table>';
  container.innerHTML = html;
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
      <td>${getNomeCursoPeriodo(aula.cursoId, cursos)}</td>
      <td><span class="dia-badge">${diasSemana[aula.diaSemana] || aula.diaSemana}</span></td>
      <td>${aula.periodoTurma || '—'}</td>
      <td>${aula.campus || '—'}</td>
      <td class="acoes-cell">
        <button class="btn-icon btn-edit" onclick="abrirEdicaoAula('${aula.id}')" title="Editar Aula">
          <i class="fas fa-pen"></i>
        </button>
        <button class="btn-icon btn-danger" onclick="removerAula('${aula.id}')" title="Remover Aula">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    tabela.appendChild(row);
  });
}

async function logout() {
  if (await showConfirm('Tem certeza que deseja sair do sistema?')) {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const userName = localStorage.getItem('userName') || 'Usuário';
  document.getElementById('user-name').textContent = userName;

  carregarDropdowns();
  carregarAulas();
  carregarFiltrosGrade();
  renderizarGradeSemanal();
});
