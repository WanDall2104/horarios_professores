let disciplinas = [];
let cursos = [];

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

function carregarCursosDropdown() {
  cursos = loadData(StorageKeys.CURSOS);
  const select = document.getElementById('curso-disciplina');

  select.innerHTML = '<option value="">Selecione um curso...</option>';
  cursos.forEach(curso => {
    const option = document.createElement('option');
    option.value = curso.id;
    option.textContent = curso.nome;
    select.appendChild(option);
  });
}

async function carregarDisciplinas() {
  disciplinas = loadData(StorageKeys.DISCIPLINAS);
  cursos = loadData(StorageKeys.CURSOS);
  renderizarDisciplinas();
}

async function salvarDisciplina() {
  const nome = document.getElementById('nome-disciplina').value.trim();
  const cursoId = document.getElementById('curso-disciplina').value;

  if (!nome) {
    showFeedback('Por favor, informe o nome da disciplina.', 'error');
    return;
  }

  if (!cursoId) {
    showFeedback('Por favor, selecione um curso.', 'error');
    return;
  }

  const duplicada = disciplinas.some(
    d => d.nome.toLowerCase() === nome.toLowerCase() && d.cursoId === cursoId
  );

  if (duplicada) {
    showFeedback('Esta disciplina já está cadastrada para o curso selecionado.', 'error');
    return;
  }

  const disciplina = {
    id: 'disc-' + Date.now(),
    nome,
    cursoId
  };

  disciplinas.push(disciplina);
  saveData(StorageKeys.DISCIPLINAS, disciplinas);

  document.getElementById('disciplina-form').reset();
  carregarCursosDropdown();
  renderizarDisciplinas();
  showFeedback('Disciplina cadastrada com sucesso!', 'success');
}

async function removerDisciplina(id) {
  if (!confirm('Tem certeza que deseja remover esta disciplina?')) return;

  disciplinas = disciplinas.filter(d => d.id !== id);
  saveData(StorageKeys.DISCIPLINAS, disciplinas);

  renderizarDisciplinas();
  showFeedback('Disciplina removida com sucesso.', 'success');
}

function renderizarDisciplinas() {
  const tabela = document.getElementById('tabela-disciplinas');
  const emptyState = document.getElementById('empty-state');
  const badge = document.getElementById('total-disciplinas-table');

  tabela.innerHTML = '';
  badge.textContent = disciplinas.length;

  if (disciplinas.length === 0) {
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  disciplinas.forEach(disciplina => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${disciplina.id}</td>
      <td><strong>${disciplina.nome}</strong></td>
      <td><span class="curso-badge">${getNomeCurso(disciplina.cursoId, cursos)}</span></td>
      <td class="acoes-cell">
        <button class="btn-icon btn-danger" onclick="removerDisciplina('${disciplina.id}')" title="Remover Disciplina">
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

  carregarCursosDropdown();
  carregarDisciplinas();
});
