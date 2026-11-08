"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "../components/Icons";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar(e: FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErro(data.erro || "E-mail ou senha incorretos. Tente novamente.");
        setCarregando(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setErro("Não foi possível conectar ao servidor.");
      setCarregando(false);
    }
  }

  return (
    <main className="login-wrap">
      <section className="login-brand">
        <div className="logo">
          <span className="logo-icon"><Icon nome="foguete" tamanho={22} /></span>
          Hackathon UniALFA
        </div>
        <div>
          <h1>Gerencie os projetos do hackathon em um só lugar.</h1>
          <p>Acompanhe o andamento das equipes, entregas e notas com um painel simples e objetivo.</p>
          <ul className="brand-lista">
            <li><Icon nome="check" tamanho={18} /> Visão geral com indicadores</li>
            <li><Icon nome="check" tamanho={18} /> Listagem com busca e filtros</li>
            <li><Icon nome="check" tamanho={18} /> Acompanhamento de progresso</li>
            <li><Icon nome="check" tamanho={18} /> Cadastro de usuários com máscaras e validações</li>
          </ul>
          <div className="brand-card">
            <div><b>10</b><span>projetos</span></div>
            <div><b>4</b><span>equipes</span></div>
            <div><b>CRUD</b><span>de usuários</span></div>
          </div>
        </div>
        <small>© 2026 Hackathon UniALFA</small>
      </section>

      <section className="login-lado">
        <form className="login-form" onSubmit={entrar}>
          <h2>Bem-vindo de volta 👋</h2>
          <p className="texto-suave">Entre com suas credenciais para acessar o painel.</p>

          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            placeholder="aluno@unialfa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="senha">Senha</label>
          <div className="campo-senha">
            <input
              id="senha"
              type={mostrar ? "text" : "password"}
              placeholder="••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <button type="button" className="olho" onClick={() => setMostrar(!mostrar)} aria-label="Mostrar senha">
              <Icon nome={mostrar ? "olhoOff" : "olho"} tamanho={18} />
            </button>
          </div>

          {erro && <p className="alerta-erro">{erro}</p>}

          <button type="submit" className="btn-primario" disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar"}
          </button>

          <p className="dica-login">
            Acesso de teste: <b>aluno@unialfa.com</b> / <b>123456</b>
          </p>
        </form>
      </section>
    </main>
  );
}