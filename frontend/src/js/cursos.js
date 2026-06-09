const API = 'http://localhost:3000';

let cursos = [];

function showFeedback(mensagem, tipo = 'success') {
  const el = document.getElementById('msg-feedback');
  el.textContent = mensagem;
  el.className = 'msg-feedback ' + tipo;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 3500);
}

async function carregarCursos() {
  try {
    const res = await fetch(API + '/cursos');
    if (res.ok) {
      const data = await res.json();
      cursos = data.map(c => ({
        id: c.id,
        nome: c.nome,
        periodo: c.periodo || '',
        descricao: c.descricao || '—',
        cargaHoraria: c.cargaHoraria
      }));
    }
  } catch {}
  renderizarCursos();
}

async function salvarCurso() {
  const nome = document.getElementById('nome-curso').value.trim();
  const periodo = document.getElementById('periodo-curso').value.trim();
  const descricao = document.getElementById('descricao-curso').value.trim();
  const cargaHorariaRaw = document.getElementById('carga-horaria').value.trim();

  if (!nome) {
    showFeedback('Por favor, informe o nome do curso.', 'error');
    return;
  }

  try {
    const res = await fetch(API + '/cursos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome,
        periodo: periodo || undefined,
        descricao: descricao || undefined,
        cargaHoraria: cargaHorariaRaw ? parseInt(cargaHorariaRaw) : undefined
      })
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      showFeedback(data.error || 'Erro ao cadastrar curso', 'error');
      return;
    }

    document.getElementById('curso-form').reset();
    await carregarCursos();
    showFeedback('Curso cadastrado com sucesso!', 'success');
  } catch {
    showFeedback('Erro ao conectar com o servidor', 'error');
  }
}

async function removerCurso(id) {
  const curso = cursos.find(c => c.id === id);
  if (!curso) return;

  if (!await showConfirm(`Tem certeza que deseja excluir o curso "${curso.nome}"?`)) return;

  try {
    const res = await fetch(API + '/cursos/' + id, { method: 'DELETE' });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      showFeedback(data.error || 'Erro ao remover curso', 'error');
      return;
    }

    await carregarCursos();
    showFeedback('Curso excluído com sucesso.', 'success');
  } catch {
    showFeedback('Erro ao conectar com o servidor', 'error');
  }
}

function abrirEdicao(id) {
  const curso = cursos.find(c => c.id === id);
  if (!curso) return;

  document.getElementById('edit-id').value = curso.id;
  document.getElementById('edit-nome').value = curso.nome;
  document.getElementById('edit-periodo').value = curso.periodo || '';
  document.getElementById('edit-descricao').value = curso.descricao === '—' ? '' : curso.descricao;
  document.getElementById('edit-carga').value = curso.cargaHoraria || '';

  document.getElementById('modal-edicao').classList.add('open');
}

function fecharModal() {
  document.getElementById('modal-edicao').classList.remove('open');
}

async function salvarEdicao() {
  const id = document.getElementById('edit-id').value;
  const nome = document.getElementById('edit-nome').value.trim();
  const periodo = document.getElementById('edit-periodo').value.trim();
  const descricao = document.getElementById('edit-descricao').value.trim();
  const cargaHorariaRaw = document.getElementById('edit-carga').value.trim();

  if (!nome) {
    showFeedback('Por favor, informe o nome do curso.', 'error');
    return;
  }

  try {
    const res = await fetch(API + '/cursos/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome,
        periodo: periodo || undefined,
        descricao: descricao || undefined,
        cargaHoraria: cargaHorariaRaw ? parseInt(cargaHorariaRaw) : undefined
      })
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      showFeedback(data.error || 'Erro ao atualizar curso', 'error');
      return;
    }

    fecharModal();
    await carregarCursos();
    showFeedback('Curso atualizado com sucesso!', 'success');
  } catch {
    showFeedback('Erro ao conectar com o servidor', 'error');
  }
}

function renderizarCursos() {
  const tabela = document.getElementById('tabela-cursos');
  const emptyState = document.getElementById('empty-state');
  const badge = document.getElementById('total-cursos-table');

  tabela.innerHTML = '';
  badge.textContent = cursos.length;

  if (cursos.length === 0) {
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  cursos.forEach(curso => {
    const cargaLabel = curso.cargaHoraria
      ? `<span class="carga-badge">${curso.cargaHoraria}h</span>`
      : '<span style="color:var(--muted);font-size:12px;">—</span>';

    const periodoLabel = curso.periodo
      ? `<span class="periodo-badge">${curso.periodo}</span>`
      : '<span style="color:var(--muted);font-size:12px;">—</span>';

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${curso.id}</td>
      <td><strong>${curso.nome}</strong></td>
      <td>${periodoLabel}</td>
      <td><span class="descricao-cell" title="${curso.descricao}">${curso.descricao}</span></td>
      <td>${cargaLabel}</td>
      <td class="acoes-cell">
        <button class="btn-icon btn-edit" onclick="abrirEdicao('${curso.id}')" title="Editar Curso">
          <i class="fas fa-pen"></i>
        </button>
        <button class="btn-icon btn-danger" onclick="removerCurso('${curso.id}')" title="Excluir Curso">
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

document.addEventListener('click', function(e) {
  const modal = document.getElementById('modal-edicao');
  if (e.target === modal) fecharModal();
});

document.addEventListener('DOMContentLoaded', function() {
  const userName = localStorage.getItem('userName') || 'Usuário';
  document.getElementById('user-name').textContent = userName;
  carregarCursos();
});
