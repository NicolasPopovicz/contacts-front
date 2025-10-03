# 🌐 Frontend - Contacts App

Frontend em **Vue 3 + Vite + Pinia + Vuetify**, consumindo a API de contatos e oferecendo interface moderna (dark mode).

---

## 🚀 Funcionalidades
- Login, registro, logout, exclusão de conta.
- Recuperação e redefinição de senha (via link recebido por e-mail).
- Gerenciamento de contatos (CRUD completo).
- Integração com Google Maps para exibir localização do contato.
- Busca automática de endereço via API do backend.
- Toasts de feedback (sucesso/erro) com slide e timeout.
- Paginação, ordenação e filtros na tabela de contatos.
- Modal de confirmação para ações destrutivas.
- Proteção de rotas para usuários não autenticados.

---

## ⚙️ Tecnologias
- **Vue 3 + Vite**
- **Pinia** (estado global)
- **Vue Router**
- **Vuetify 3**
- **Google Maps JavaScript API**

---

## 🔑 Estrutura básica
- `src/`
- `api/`
- `components/`
- `layouts/`
- `router/`
- `stores/`
- `utils/`
- `views/`

---

## 🌍 Principais telas
- `/login` → Login
- `/register` → Registro de usuário
- `/forgot-password` → Solicitar recuperação de senha
- `/reset-password` → Redefinir senha usando token
- `/contacts` → Listagem, busca e CRUD de contatos
- `/account` → Excluir conta
- Listagem de contatos com mapa interativo (Google Maps)

---

## ⚡ Configuração
Crie um arquivo `.env.local`:

```env
VITE_API_URL=http://localhost:8000/api
VITE_GOOGLE_MAPS_KEY=sua_chave_google
```

Não versionar .env.local.

## ▶️ Rodando o projeto

```bash
npm install
npm run dev
```

Aplicação estará disponível em http://localhost:5173.

## 📦 Notas

Necessário backend rodando na porta configurada (VITE_API_URL).

API key do Google deve estar restrita a domínios confiáveis.

## 📚 Fluxo geral

- Usuário cadastra-se e faz login.
- Pode criar/editar/excluir contatos.
- Pode recuperar senha via e-mail.
- Ao selecionar contato, mapa mostra sua localização.
- Conta pode ser excluída com confirmação e senha.