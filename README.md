Desafio – Autenticação e Rotas Protegidas

Sistema em Next.js com cadastro de usuários (CRUD), login com token de acesso e rotas protegidas.

## Como funciona a autenticação

- **Login:** a tela inicial (`/`) envia e-mail e senha para `POST /api/login`, que consulta o usuário no JSON Server.
- **Token:** se as credenciais estiverem corretas, a API gera um **JWT** (biblioteca `jose`, validade de 1 hora) e grava num cookie `httpOnly` chamado `token`.
- **Rotas protegidas:** o `middleware.ts` valida o token em todas as páginas. Sem token válido, qualquer tentativa de acessar uma página interna (ex: `/dashboard`) redireciona para o login.
- **Logout:** o botão **Sair** chama `POST /api/logout`, que apaga o cookie.

## Arquivos principais

| Arquivo | Função |
|---|---|
| `lib/auth.ts` | Cria e valida o token JWT |
| `app/api/login/route.ts` | Confere o usuário e grava o cookie com o token |
| `app/api/logout/route.ts` | Remove o cookie |
| `middleware.ts` | Protege as rotas internas |
| `app/page.tsx` | Tela de login |
| `app/(painel)/layout.tsx` | Layout das páginas internas e botão Sair |

## Como rodar

1. Instale as dependências:

```bash
npm install
```

2. Crie na raiz um arquivo `.env.local` com:

```env
JWT_SECRET=uma-frase-grande-e-aleatoria-aqui
```

3. Suba a API (JSON Server) em um terminal:

```bash
npm run api
```

4. Suba o sistema em outro terminal:

```bash
npm run dev
```

5. Acesse `http://localhost:3000`.

## Login de teste

Use um usuário que exista na lista `usuarios` do `db.json`.

- E-mail: `aluno@unialfa.com`
- Senha: `123456`

## Tecnologias

Next.js, React, TypeScript, JSON Server e JWT (`jose`).

## Autor

Nikolas Lodi Monteiro 
