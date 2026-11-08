import { apenasNumeros } from "./mascaras";

export type Campos = {
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
  confirmarSenha: string;
};

export type Erros = Partial<Record<keyof Campos, string>>;

export function cpfValido(cpf: string) {
  const d = apenasNumeros(cpf);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  for (const t of [9, 10]) {
    let soma = 0;
    for (let i = 0; i < t; i++) soma += Number(d[i]) * (t + 1 - i);
    const resto = (soma * 10) % 11;
    if ((resto === 10 ? 0 : resto) !== Number(d[t])) return false;
  }
  return true;
}

export function dataValida(v: string) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v);
  if (!m) return false;
  const dia = Number(m[1]);
  const mes = Number(m[2]);
  const ano = Number(m[3]);
  const dt = new Date(ano, mes - 1, dia);
  if (dt.getFullYear() !== ano || dt.getMonth() !== mes - 1 || dt.getDate() !== dia) return false;
  return ano >= 1900 && dt <= new Date();
}

export function validar(d: Campos, editando: boolean): Erros {
  const e: Erros = {};

  if (d.nome.trim().length < 3) e.nome = "Informe o nome completo (mín. 3 letras).";
  else if (!d.nome.trim().includes(" ")) e.nome = "Informe nome e sobrenome.";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) e.email = "E-mail inválido.";

  if (!cpfValido(d.cpf)) e.cpf = "CPF inválido.";

  const tel = apenasNumeros(d.telefone);
  if (tel.length < 10 || tel.length > 11) e.telefone = "Telefone inválido. Use DDD + número.";

  if (!dataValida(d.dataNascimento)) e.dataNascimento = "Data inválida. Use dd/mm/aaaa (não pode ser futura).";

  if (apenasNumeros(d.cep).length !== 8) e.cep = "CEP inválido (8 dígitos).";
  if (!d.logradouro.trim()) e.logradouro = "Informe o logradouro.";
  if (!d.numero.trim()) e.numero = "Informe o número.";
  if (!d.bairro.trim()) e.bairro = "Informe o bairro.";
  if (!d.cidade.trim()) e.cidade = "Informe a cidade.";
  if (!/^[A-Za-z]{2}$/.test(d.uf)) e.uf = "UF com 2 letras.";

  const precisaSenha = !editando || d.senha !== "" || d.confirmarSenha !== "";
  if (precisaSenha) {
    if (d.senha.length < 6) e.senha = "A senha deve ter no mínimo 6 caracteres.";
    if (d.confirmarSenha !== d.senha) e.confirmarSenha = "As senhas não coincidem.";
  }

  return e;
}
