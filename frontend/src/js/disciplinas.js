const API = 'http://localhost:3000';

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

async function carregarCursosDropdown(selectId = 'curso-disciplina') {
  try {
    const res = await fetch(API + '/cursos');
    if (res.ok) cursos = await res.json();
  } catch {}

  const select = document.getElementById(selectId);
  select.innerHTML = '<option value="">Selecione um curso...</option>';
  cursos.forEach(curso => {
    const option = document.createElement('option');
    option.value = curso.id;
    option.textContent = curso.nome;
    select.appendChild(option);
  });
}

function carregarCursosDropdownEdit() {
  carregarCursosDropdown('edit-disc-curso');
}

async function carregarDisciplinas() {
  try {
    const res = await fetch(API + '/disciplinas');
    if (res.ok) {
      const data = await res.json();
      disciplinas = data.map(d => ({
        id: d.id,
        nome: d.nome,
        cursoId: d.cursoId
      }));
    }
  } catch {}

  try {
    const res = await fetch(API + '/cursos');
    if (res.ok) cursos = await res.json();
  } catch {}

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

  try {
    const res = await fetch(API + '/disciplinas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, cursoId })
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      showFeedback(data.error || 'Erro ao cadastrar disciplina', 'error');
      return;
    }

    document.getElementById('disciplina-form').reset();
    await carregarDisciplinas();
    await carregarCursosDropdown();
    showFeedback('Disciplina cadastrada com sucesso!', 'success');
  } catch {
    showFeedback('Erro ao conectar com o servidor', 'error');
  }
}

async function removerDisciplina(id) {
  if (!await showConfirm('Tem certeza que deseja remover esta disciplina?')) return;

  try {
    const res = await fetch(API + '/disciplinas/' + id, { method: 'DELETE' });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      showFeedback(data.error || 'Erro ao remover disciplina', 'error');
      return;
    }

    await carregarDisciplinas();
    showFeedback('Disciplina removida com sucesso.', 'success');
  } catch {
    showFeedback('Erro ao conectar com o servidor', 'error');
  }
}

function abrirEdicaoDisciplina(id) {
  const disciplina = disciplinas.find(d => d.id === id);
  if (!disciplina) return;

  document.getElementById('edit-disc-id').value = disciplina.id;
  document.getElementById('edit-disc-nome').value = disciplina.nome;

  carregarCursosDropdownEdit();
  document.getElementById('edit-disc-curso').value = disciplina.cursoId;

  document.getElementById('modal-edicao-disciplina').classList.add('open');
}

function fecharModalDisciplina() {
  document.getElementById('modal-edicao-disciplina').classList.remove('open');
}

async function salvarEdicaoDisciplina() {
  const id = document.getElementById('edit-disc-id').value;
  const nome = document.getElementById('edit-disc-nome').value.trim();
  const cursoId = document.getElementById('edit-disc-curso').value;

  if (!nome) {
    showFeedback('Por favor, informe o nome da disciplina.', 'error');
    return;
  }

  if (!cursoId) {
    showFeedback('Por favor, selecione um curso.', 'error');
    return;
  }

  try {
    const res = await fetch(API + '/disciplinas/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, cursoId })
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      showFeedback(data.error || 'Erro ao atualizar disciplina', 'error');
      return;
    }

    fecharModalDisciplina();
    await carregarDisciplinas();
    showFeedback('Disciplina atualizada com sucesso!', 'success');
  } catch {
    showFeedback('Erro ao conectar com o servidor', 'error');
  }
}

document.addEventListener('click', function(e) {
  const modal = document.getElementById('modal-edicao-disciplina');
  if (e.target === modal) fecharModalDisciplina();
});

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
        <button class="btn-icon btn-edit" onclick="abrirEdicaoDisciplina('${disciplina.id}')" title="Editar Disciplina">
          <i class="fas fa-pen"></i>
        </button>
        <button class="btn-icon btn-danger" onclick="removerDisciplina('${disciplina.id}')" title="Remover Disciplina">
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

document.addEventListener('DOMContentLoaded', function() {
  const userName = localStorage.getItem('userName') || 'Usuário';
  document.getElementById('user-name').textContent = userName;

  carregarCursosDropdown();
  carregarDisciplinas();
});
