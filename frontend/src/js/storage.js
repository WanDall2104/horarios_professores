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

function getNomeCursoPeriodo(cursoId, cursos) {
  const curso = findById(cursos, cursoId);
  if (!curso) return '—';
  return curso.periodo ? `${curso.nome} — ${curso.periodo}` : curso.nome;
}

function getNomeProfessor(professorId, professores) {
  const professor = findById(professores, professorId);
  return professor ? professor.nome : '—';
}

function getNomeDisciplina(disciplinaId, disciplinas) {
  const disciplina = findById(disciplinas, disciplinaId);
  return disciplina ? disciplina.nome : '—';
}

function showConfirm(mensagem) {
  return new Promise(resolve => {
    let modal = document.getElementById('confirm-modal-global');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'confirm-modal-global';
      modal.innerHTML = `
        <div class="confirm-overlay"></div>
        <div class="confirm-box">
          <p class="confirm-msg"></p>
          <div class="confirm-actions">
            <button class="btn-confirm-ok">Sim</button>
            <button class="btn-confirm-cancel">Não</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector('.btn-confirm-ok').addEventListener('click', () => {
        modal.style.display = 'none';
        resolve(true);
      });
      modal.querySelector('.btn-confirm-cancel').addEventListener('click', () => {
        modal.style.display = 'none';
        resolve(false);
      });
      modal.querySelector('.confirm-overlay').addEventListener('click', () => {
        modal.style.display = 'none';
        resolve(false);
      });
    }

    modal.querySelector('.confirm-msg').textContent = mensagem;
    modal.style.display = 'flex';
  });
}
