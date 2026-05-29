    const API = 'http://localhost:3000';

    function switchTab(tab) {
      document.querySelectorAll('.tab-btn').forEach((b, i) => {
        b.classList.toggle('active', (i === 0 && tab === 'login') || (i === 1 && tab === 'cadastro'));
      });
      document.getElementById('panel-login').classList.toggle('active', tab === 'login');
      document.getElementById('panel-cadastro').classList.toggle('active', tab === 'cadastro');

      const note = document.getElementById('footer-note');
      if (tab === 'login') {
        note.innerHTML = 'Não tem conta? <span onclick="switchTab(\'cadastro\')">Cadastre-se</span>';
      } else {
        note.innerHTML = 'Já tem conta? <span onclick="switchTab(\'login\')">Entrar</span>';
      }
      limparMensagens();
    }

    function showMsg(id, tipo, texto) {
      const el = document.getElementById(id);
      el.className = 'msg ' + tipo;
      el.textContent = texto;
    }

    function limparMensagens() {
      ['msg-login', 'msg-cadastro'].forEach(id => {
        const el = document.getElementById(id);
        el.className = 'msg';
        el.textContent = '';
      });
    }

    async function fazerLogin() {
      const email = document.getElementById('login-email').value.trim();
      const senha = document.getElementById('login-senha').value;
      const btn = document.getElementById('btn-login');
      if (!email || !senha) { showMsg('msg-login', 'error', 'Preencha e-mail e senha.'); return; }
      btn.disabled = true; btn.textContent = 'Entrando...';
      try {
        const res = await fetch(API + '/aulas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, senha }),
        });
        const data = await res.json();
        console.log('Resposta do login:', data);
        if (!res.ok) { showMsg('msg-login', 'error', data.error || 'Erro ao fazer login.'); }
        else { localStorage.setItem('token', data.token); showMsg('msg-login', 'success', '✓ Login realizado com sucesso!'); }
      } catch (e) {
        showMsg('msg-login', 'error', 'Não foi possível conectar à API. Verifique se o servidor está rodando.');
      }
      btn.disabled = false; btn.textContent = 'Entrar no Sistema';
    }

    async function fazerCadastro() {
      const email = document.getElementById('cad-email').value.trim();
      const senha = document.getElementById('cad-senha').value;
      const confirma = document.getElementById('cad-confirma').value;
      const btn = document.getElementById('btn-cadastro');
      if (!email || !senha || !confirma) { showMsg('msg-cadastro', 'error', 'Preencha todos os campos.'); return; }
      if (senha.length < 6) { showMsg('msg-cadastro', 'error', 'A senha deve ter no mínimo 6 caracteres.'); return; }
      if (senha !== confirma) { showMsg('msg-cadastro', 'error', 'As senhas não coincidem.'); return; }
      btn.disabled = true; btn.textContent = 'Cadastrando...';
      try {
        const res = await fetch(API + '/usuarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, senha }),
        });
        const data = await res.json();
        if (!res.ok) { showMsg('msg-cadastro', 'error', data.error || 'Erro ao cadastrar.'); }
        else { showMsg('msg-cadastro', 'success', '✓ Conta criada com sucesso! Redirecionando...'); setTimeout(() => switchTab('login'), 2000); }
      } catch (e) {
        showMsg('msg-cadastro', 'error', 'Não foi possível conectar à API. Verifique se o servidor está rodando.');
      }
      btn.disabled = false; btn.textContent = 'Criar Conta';
    }

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      if (document.getElementById('panel-login').classList.contains('active')) fazerLogin();
      else fazerCadastro();
    });