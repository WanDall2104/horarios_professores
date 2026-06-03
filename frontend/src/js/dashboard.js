function logout() {
  if (confirm('Tem certeza que deseja sair do sistema?')) {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    window.location.href = 'login.html';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const userName = localStorage.getItem('userName') || 'Usuário';
  document.getElementById('user-name').textContent = userName;

  const professores = loadData(StorageKeys.PROFESSORES);
  const cursos = loadData(StorageKeys.CURSOS);
  const disciplinas = loadData(StorageKeys.DISCIPLINAS);
  const aulas = loadData(StorageKeys.AULAS);

  document.getElementById('total-professores').textContent = professores.length;
  document.getElementById('total-cursos').textContent = cursos.length;
  document.getElementById('total-disciplinas').textContent = disciplinas.length;
  document.getElementById('total-aulas').textContent = aulas.length;
});
