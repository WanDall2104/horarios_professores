const API = 'http://localhost:3000';

function showMsg(id, tipo, texto) {
  const el = document.getElementById(id);
  el.className = 'msg ' + tipo;
  el.textContent = texto;
}

function limparMensagens() {
  const el = document.getElementById('msg-login');
  if (el) {
    el.className = 'msg';
    el.textContent = '';
  }
}

function entrarNoSistema(email) {
  localStorage.setItem('token', localStorage.getItem('token') || 'offline');
  localStorage.setItem('userName', email.split('@')[0] || 'Usuário');
  window.location.href = 'dashboard.html';
}

async function fazerLogin() {
  const email = document.getElementById('login-email').value.trim();
  const senha = document.getElementById('login-senha').value;
  const btn = document.getElementById('btn-login');

  if (!email || !senha) {
    showMsg('msg-login', 'error', 'Preencha e-mail e senha.');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Entrando...';

  try {
    const res = await fetch(API + '/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });
    const data = await res.json();

    if (!res.ok) {
      showMsg('msg-login', 'error', data.error || 'Erro ao fazer login.');
    } else {
      localStorage.setItem('token', data.token);
      entrarNoSistema(email);
      return;
    }
  } catch {
    localStorage.setItem('token', 'offline');
    entrarNoSistema(email);
    return;
  }

  btn.disabled = false;
  btn.textContent = 'Entrar no Sistema';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') fazerLogin();
});
