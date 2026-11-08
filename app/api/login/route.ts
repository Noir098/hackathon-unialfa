import { NextResponse } from "next/server";
import { criarToken, COOKIE_NAME } from "@/lib/auth";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function POST(req: Request) {
  const { email, senha } = await req.json();

  const resp = await fetch(
    `${BASE}/usuarios?email=${encodeURIComponent(email)}`,
    { cache: "no-store" }
  );

  if (!resp.ok) {
    return NextResponse.json({ erro: "Erro ao consultar usuários" }, { status: 500 });
  }

  const lista = await resp.json();
  const user = lista[0];

  if (!user || user.senha !== senha) {
    return NextResponse.json({ erro: "E-mail ou senha incorretos. Tente novamente." }, { status: 401 });
  }

  const token = await criarToken({ id: user.id, email: user.email });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });
  return res;
} 