// ===== DADOS EM MEMÓRIA (substituir por chamadas de API depois) =====
let cursos = [];

// ===== UTILITÁRIOS =====

function showFeedback(mensagem, tipo = 'success') {
  const el = document.getElementById('msg-feedback');
  el.textContent = mensagem;
  el.className = 'msg-feedback ' + tipo;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 3500);
}

// ===== CARREGAR CURSOS =====
async function carregarCursos() {
  // TODO: Substituir por chamada GET /cursos quando o backend estiver pronto
  renderizarCursos();
}

// ===== SALVAR CURSO =====
async function salvarCurso() {
  const nome = document.getElementById('nome-curso').value.trim();
  const descricao = document.getElementById('descricao-curso').value.trim();
  const cargaHorariaRaw = document.getElementById('carga-horaria').value.trim();

  if (!nome) {
    showFeedback('Por favor, informe o nome do curso.', 'error');
    return;
  }

  const curso = {
    id: 'curso-' + Date.now(),
    nome,
    descricao: descricao || '—',
    cargaHoraria: cargaHorariaRaw ? parseInt(cargaHorariaRaw) : null
  };

  // TODO: Substituir por chamada POST /cursos quando o backend estiver pronto
  cursos.push(curso);

  document.getElementById('curso-form').reset();
  renderizarCursos();
  showFeedback('✓ Curso cadastrado com sucesso!', 'success');
}

// ===== REMOVER CURSO =====
async function removerCurso(id) {
  if (!confirm('Tem certeza que deseja remover este curso?')) return;

  // TODO: Substituir por chamada DELETE /cursos/:id quando o backend estiver pronto
  cursos = cursos.filter(c => c.id !== id);

  renderizarCursos();
  showFeedback('Curso removido com sucesso.', 'success');
}

// ===== ABRIR MODAL DE EDIÇÃO =====
function abrirEdicao(id) {
  const curso = cursos.find(c => c.id === id);
  if (!curso) return;

  document.getElementById('edit-id').value = curso.id;
  document.getElementById('edit-nome').value = curso.nome;
  document.getElementById('edit-descricao').value = curso.descricao === '—' ? '' : curso.descricao;
  document.getElementById('edit-carga').value = curso.cargaHoraria || '';

  document.getElementById('modal-edicao').classList.add('open');
}

// ===== FECHAR MODAL =====
function fecharModal() {
  document.getElementById('modal-edicao').classList.remove('open');
}

// ===== SALVAR EDIÇÃO =====
async function salvarEdicao() {
  const id = document.getElementById('edit-id').value;
  const nome = document.getElementById('edit-nome').value.trim();
  const descricao = document.getElementById('edit-descricao').value.trim();
  const cargaHorariaRaw = document.getElementById('edit-carga').value.trim();

  if (!nome) {
    showFeedback('Por favor, informe o nome do curso.', 'error');
    return;
  }

  const index = cursos.findIndex(c => c.id === id);
  if (index === -1) return;

  // TODO: Substituir por chamada PUT /cursos/:id quando o backend estiver pronto
  cursos[index] = {
    ...cursos[index],
    nome,
    descricao: descricao || '—',
    cargaHoraria: cargaHorariaRaw ? parseInt(cargaHorariaRaw) : null
  };

  fecharModal();
  renderizarCursos();
  showFeedback('✓ Curso atualizado com sucesso!', 'success');
}

// ===== RENDERIZAÇÃO =====
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

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${curso.id}</td>
      <td><strong>${curso.nome}</strong></td>
      <td><span class="descricao-cell" title="${curso.descricao}">${curso.descricao}</span></td>
      <td>${cargaLabel}</td>
      <td class="acoes-cell">
        <button class="btn-icon btn-edit" onclick="abrirEdicao('${curso.id}')" title="Editar Curso">
          <i data-lucide="pencil"></i>
        </button>
        <button class="btn-icon btn-danger" onclick="removerCurso('${curso.id}')" title="Remover Curso">
          <i data-lucide="trash-2"></i>
        </button>
      </td>
    `;
    tabela.appendChild(row);
  });

  // Reativar ícones Lucide após renderizar dinamicamente
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ===== LOGOUT =====
function logout() {
  if (confirm('Tem certeza que deseja sair do sistema?')) {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  }
}

// ===== FECHAR MODAL AO CLICAR FORA =====
document.addEventListener('click', function(e) {
  const modal = document.getElementById('modal-edicao');
  if (e.target === modal) fecharModal();
});

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
  const userName = localStorage.getItem('userName') || 'Usuário';
  document.getElementById('user-name').textContent = userName;

  carregarCursos();
});