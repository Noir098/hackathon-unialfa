export function iniciais(nome: string) {
  return nome.split(" ").filter(Boolean).map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

export function corAvatar(nome: string) {
  let h = 0;
  for (const c of nome) h = (h * 31 + c.charCodeAt(0)) % 6;
  return `av-${h}`;
}

export function idade(data: string) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(data);
  if (!m) return null;
  const hoje = new Date();
  let a = hoje.getFullYear() - Number(m[3]);
  const mes = hoje.getMonth() + 1 - Number(m[2]);
  if (mes < 0 || (mes === 0 && hoje.getDate() < Number(m[1]))) a--;
  return a;
}

export function forcaSenha(s: string) {
  let pts = 0;
  if (s.length >= 6) pts++;
  if (s.length >= 10) pts++;
  if (/[a-z]/.test(s) && /[A-Z]/.test(s)) pts++;
  if (/\d/.test(s)) pts++;
  if (/[^A-Za-z0-9]/.test(s)) pts++;
  const nivel = Math.min(4, Math.max(1, pts));
  return { nivel, texto: ["", "Fraca", "Média", "Boa", "Forte"][nivel] };
}
