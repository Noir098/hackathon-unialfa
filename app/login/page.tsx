"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    if (!res.ok) {
      const data = await res.json();
      setErro(data.erro || "Erro ao entrar");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={entrar}>
      <h1>Login</h1>
      <input type="email" placeholder="E-mail" value={email}
        onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Senha" value={senha}
        onChange={(e) => setSenha(e.target.value)} required />
      {erro && <p style={{ color: "red" }}>{erro}</p>}
      <button type="submit">Entrar</button>
    </form>
  );
}