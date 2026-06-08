// ===== DADOS EM MEMÓRIA (substituir por chamadas de API depois) =====
let professores = loadData(StorageKeys.PROFESSORES);

function showFeedback(mensagem, tipo = 'success') {
  const el = document.getElementById('msg-feedback');
  el.textContent = mensagem;
  el.className = 'msg-feedback ' + tipo;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 3500);
}

const diasSemana = {
  SEGUNDA: 'Segunda-feira',
  TERCA: 'Terça-feira',
  QUARTA: 'Quarta-feira',
  QUINTA: 'Quinta-feira',
  SEXTA: 'Sexta-feira'
};

// ===== FUNÇÃO PARA CARREGAR DADOS =====
async function carregarProfessores() {
  // TODO: Substituir por chamada GET /professores quando o backend estiver pronto
  professores = loadData(StorageKeys.PROFESSORES);
  renderizarProfessores();
}

// ===== FUNÇÃO PARA SALVAR PROFESSOR =====
async function salvarProfessor() {
  const nome = document.getElementById('nome-professor').value.trim();
  const email = document.getElementById('email-professor').value.trim();
  const disponibilidadeCheckboxes = document.querySelectorAll('input[name="disponibilidade"]:checked');
  
  // Validação
  if (!nome || !email) {
    showFeedback('Por favor, preencha todos os campos obrigatórios.', 'error');
    return;
  }

  if (disponibilidadeCheckboxes.length === 0) {
    showFeedback('Por favor, selecione pelo menos um dia de disponibilidade.', 'error');
    return;
  }

  const disponibilidade = Array.from(disponibilidadeCheckboxes).map(cb => cb.value);

  const professor = {
    id: 'prof-' + Date.now(),
    nome,
    email,
    disponibilidade
  };

  // TODO: Substituir por chamada POST /professores quando o backend estiver pronto
  professores.push(professor);
  saveData(StorageKeys.PROFESSORES, professores);

  // Limpar formulário
  document.getElementById('professor-form').reset();
  
  // Atualizar interface
  renderizarProfessores();
  showFeedback('Professor cadastrado com sucesso!', 'success');
}

// ===== FUNÇÃO PARA REMOVER PROFESSOR =====
async function removerProfessor(id) {
  if (!await showConfirm('Tem certeza que deseja remover este professor?')) return;

  // TODO: Substituir por chamada DELETE /professores/:id quando o backend estiver pronto
  professores = professores.filter(p => p.id !== id);
  saveData(StorageKeys.PROFESSORES, professores);
  
  renderizarProfessores();
  showFeedback('Professor removido com sucesso!', 'success');
}

// ===== EDIÇÃO DE PROFESSOR =====
function abrirEdicaoProfessor(id) {
  const professor = professores.find(p => p.id === id);
  if (!professor) return;

  document.getElementById('edit-prof-id').value = professor.id;
  document.getElementById('edit-prof-nome').value = professor.nome;
  document.getElementById('edit-prof-email').value = professor.email;

  const checkboxes = document.querySelectorAll('#edit-prof-disponibilidade input[type="checkbox"]');
  checkboxes.forEach(cb => {
    cb.checked = professor.disponibilidade.includes(cb.value);
  });

  document.getElementById('modal-edicao-professor').classList.add('open');
}

function fecharModalProfessor() {
  document.getElementById('modal-edicao-professor').classList.remove('open');
}

async function salvarEdicaoProfessor() {
  const id = document.getElementById('edit-prof-id').value;
  const nome = document.getElementById('edit-prof-nome').value.trim();
  const email = document.getElementById('edit-prof-email').value.trim();
  const disponibilidadeCheckboxes = document.querySelectorAll('#edit-prof-disponibilidade input[type="checkbox"]:checked');

  if (!nome || !email) {
    showFeedback('Por favor, preencha todos os campos obrigatórios.', 'error');
    return;
  }

  if (disponibilidadeCheckboxes.length === 0) {
    showFeedback('Por favor, selecione pelo menos um dia de disponibilidade.', 'error');
    return;
  }

  const disponibilidade = Array.from(disponibilidadeCheckboxes).map(cb => cb.value);
  const index = professores.findIndex(p => p.id === id);
  if (index === -1) return;

  professores[index] = { ...professores[index], nome, email, disponibilidade };
  saveData(StorageKeys.PROFESSORES, professores);

  fecharModalProfessor();
  renderizarProfessores();
  showFeedback('Professor atualizado com sucesso!', 'success');
}

document.addEventListener('click', function(e) {
  const modal = document.getElementById('modal-edicao-professor');
  if (e.target === modal) fecharModalProfessor();
});

// ===== RENDERIZAÇÃO =====

// Renderizar lista de professores
function renderizarProfessores() {
  const tabela = document.getElementById('tabela-professores');
  const emptyState = document.getElementById('empty-state');
  const badge = document.getElementById('total-professores-table');

  tabela.innerHTML = '';
  badge.textContent = professores.length;

  if (professores.length === 0) {
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  professores.forEach(prof => {
    const diasDisponiveis = prof.disponibilidade
      .map(d => diasSemana[d])
      .join(', ');

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${prof.id}</td>
      <td>${prof.nome}</td>
      <td>${prof.email}</td>
      <td>
        <div class="disponibilidade-badges">
          ${prof.disponibilidade.map(d => `<span class="badge-dia">${d.substring(0, 3)}</span>`).join('')}
        </div>
      </td>
      <td class="acoes-cell">
        <button class="btn-icon btn-edit" onclick="abrirEdicaoProfessor('${prof.id}')" title="Editar Professor">
          <i class="fas fa-pen"></i>
        </button>
        <button class="btn-icon btn-danger" onclick="removerProfessor('${prof.id}')" title="Remover Professor">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    tabela.appendChild(row);
  });
}

// ===== FUNÇÃO PARA LOGOUT =====
async function logout() {
  if (await showConfirm('Tem certeza que deseja sair do sistema?')) {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
  // Carregar nome do usuário
  const userName = localStorage.getItem('userName') || 'Usuário';
  document.getElementById('user-name').textContent = userName;

  // Carregar professores
  carregarProfessores();
});
