# Frontend - Interface Web

Interface web para o Sistema de Gestão de Horários de Professores.

## 📁 Estrutura

```
src/
├── index.html       # Página principal (login)
├── css/             # Estilos globais e componentes
│   └── style.css    
├── js/              # Scripts JavaScript
│   └── auth.js      # Lógica de autenticação
└── assets/          # Imagens, ícones, etc.
```

## 🚀 Como Rodar

### Opção 1: Servidor Python

```bash
cd src
python -m http.server 8000
```

Acesse em `http://localhost:8000`

### Opção 2: Servidor Node (http-server)

```bash
npm install -g http-server
cd src
http-server
```

### Opção 3: VS Code Live Server

1. Instale a extensão "Live Server"
2. Clique direito em `index.html`
3. Selecione "Open with Live Server"

## 🛠️ Desenvolvimento

### Estrutura de Componentes

- **HTML**: Estrutura semântica
- **CSS**: Responsivo, mobile-first
- **JavaScript**: Vanilla JS ou framework conforme necessário

### Conectar com Backend

Atualize a URL da API em `js/config.js`:

```javascript
const API_URL = 'http://localhost:3000/api';
```

## 📝 Features

- [ ] Login
- [ ] Dashboard
- [ ] Gerenciamento de Aulas
- [ ] Visualização de Horários

## 🚀 Build/Deploy

Se usar build tools (Vite, Webpack), configure conforme necessário.
