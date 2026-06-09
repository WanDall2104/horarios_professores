const API = 'http://localhost:3000';

async function logout() {
  if (await showConfirm('Tem certeza que deseja sair do sistema?')) {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    window.location.href = 'login.html';
  }
}

document.addEventListener('DOMContentLoaded', async function() {
  const userName = localStorage.getItem('userName') || 'Usuário';
  document.getElementById('user-name').textContent = userName;

  try {
    const [resProf, resCursos, resDisc, resAulas] = await Promise.all([
      fetch(API + '/professores'),
      fetch(API + '/cursos'),
      fetch(API + '/disciplinas'),
      fetch(API + '/aulas')
    ]);

    if (resProf.ok) {
      const data = await resProf.json();
      document.getElementById('total-professores').textContent = data.length;
    }

    if (resCursos.ok) {
      const data = await resCursos.json();
      document.getElementById('total-cursos').textContent = data.length;
    }

    if (resDisc.ok) {
      const data = await resDisc.json();
      document.getElementById('total-disciplinas').textContent = data.length;
    }

    if (resAulas.ok) {
      const data = await resAulas.json();
      document.getElementById('total-aulas').textContent = data.length;
    }
  } catch {}
});
