export type Usuario = {
  id?: number;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  dataNascimento: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  senha: string;
};

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const URL_USUARIOS = `${BASE}/usuarios`;

async function checar(r: Response, msg: string) {
  if (!r.ok) throw new Error(msg);
  return r;
}

export async function listarUsuarios(): Promise<Usuario[]> {
  const r = await checar(await fetch(URL_USUARIOS, { cache: "no-store" }), "Falha ao listar usuários");
  return r.json();
}

export async function obterUsuario(id: string): Promise<Usuario> {
  const r = await checar(await fetch(`${URL_USUARIOS}/${id}`, { cache: "no-store" }), "Usuário não encontrado");
  return r.json();
}

export async function criarUsuario(u: Usuario): Promise<Usuario> {
  const r = await checar(
    await fetch(URL_USUARIOS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(u),
    }),
    "Falha ao cadastrar usuário"
  );
  return r.json();
}

export async function atualizarUsuario(id: number, u: Usuario): Promise<Usuario> {
  const r = await checar(
    await fetch(`${URL_USUARIOS}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(u),
    }),
    "Falha ao atualizar usuário"
  );
  return r.json();
}

export async function excluirUsuario(id: number): Promise<void> {
  await checar(await fetch(`${URL_USUARIOS}/${id}`, { method: "DELETE" }), "Falha ao excluir usuário");
}
