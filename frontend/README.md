# Frontend - Interface Web

Interface web para o Sistema de Gestão de Horários de Professores.

## 📁 Estrutura

```
src/
├── login.html          # Página de login
├── dashboard.html      # Dashboard com indicadores
├── professores.html    # CRUD de professores
├── cursos.html         # CRUD de cursos
├── disciplinas.html    # CRUD de disciplinas
├── aulas.html          # CRUD de aulas + grade semanal
├── css/
│   └── style.css
├── js/
│   ├── auth.js         # Autenticação (login/registro)
│   ├── dashboard.js    # Dashboard
│   ├── professores.js  # CRUD professores via API
│   ├── cursos.js       # CRUD cursos via API
│   ├── disciplinas.js  # CRUD disciplinas via API
│   ├── aulas.js        # CRUD aulas + grade via API
│   └── storage.js      # Utilitários
└── assets/
```

## 🚀 Como Rodar

### Pré-requisitos

- Backend rodando em `http://localhost:3000` (ver README principal)

### Servidor HTTP local

```bash
cd frontend\src
python -m http.server 8080
```

Acesse `http://localhost:8080`

### Criar primeiro usuário

Com o backend rodando:

```powershell
Invoke-RestMethod -Uri http://localhost:3000/usuarios -Method Post -ContentType "application/json" -Body '{"email":"admin@email.com","senha":"123456"}'
```

### Alternativas para servidor HTTP

- **Node (http-server):** `npx http-server -p 8080`
- **VS Code Live Server:** clicar com direito no `index.html` > "Open with Live Server"

## 🔗 API

O frontend se comunica com o backend em `http://localhost:3000`. Certifique-se de que o backend esteja rodando antes de usar o sistema.
