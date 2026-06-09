const API = 'http://localhost:3000';

let professores = [];

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

async function carregarProfessores() {
  try {
    const res = await fetch(API + '/professores');
    if (res.ok) {
      const data = await res.json();
      professores = data.map(p => ({
        id: p.id,
        nome: p.nome,
        email: p.email,
        disponibilidade: p.disponibilidades
          ? p.disponibilidades.filter(d => d.disponivel).map(d => d.diaSemana)
          : []
      }));
    }
  } catch {}
  renderizarProfessores();
}

async function salvarProfessor() {
  const nome = document.getElementById('nome-professor').value.trim();
  const email = document.getElementById('email-professor').value.trim();
  const disponibilidadeCheckboxes = document.querySelectorAll('input[name="disponibilidade"]:checked');

  if (!nome || !email) {
    showFeedback('Por favor, preencha todos os campos obrigatórios.', 'error');
    return;
  }

  if (disponibilidadeCheckboxes.length === 0) {
    showFeedback('Por favor, selecione pelo menos um dia de disponibilidade.', 'error');
    return;
  }

  const disponibilidade = Array.from(disponibilidadeCheckboxes).map(cb => cb.value);

  try {
    const res = await fetch(API + '/professores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, disponibilidade })
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      showFeedback(data.error || 'Erro ao cadastrar professor', 'error');
      return;
    }

    document.getElementById('professor-form').reset();
    await carregarProfessores();
    showFeedback('Professor cadastrado com sucesso!', 'success');
  } catch {
    showFeedback('Erro ao conectar com o servidor', 'error');
  }
}

async function removerProfessor(id) {
  if (!await showConfirm('Tem certeza que deseja remover este professor?')) return;

  try {
    const res = await fetch(API + '/professores/' + id, { method: 'DELETE' });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      showFeedback(data.error || 'Erro ao remover professor', 'error');
      return;
    }

    await carregarProfessores();
    showFeedback('Professor removido com sucesso!', 'success');
  } catch {
    showFeedback('Erro ao conectar com o servidor', 'error');
  }
}

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

  try {
    const res = await fetch(API + '/professores/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, disponibilidade })
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      showFeedback(data.error || 'Erro ao atualizar professor', 'error');
      return;
    }

    fecharModalProfessor();
    await carregarProfessores();
    showFeedback('Professor atualizado com sucesso!', 'success');
  } catch {
    showFeedback('Erro ao conectar com o servidor', 'error');
  }
}

document.addEventListener('click', function(e) {
  const modal = document.getElementById('modal-edicao-professor');
  if (e.target === modal) fecharModalProfessor();
});

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

async function logout() {
  if (await showConfirm('Tem certeza que deseja sair do sistema?')) {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const userName = localStorage.getItem('userName') || 'Usuário';
  document.getElementById('user-name').textContent = userName;
  carregarProfessores();
});
