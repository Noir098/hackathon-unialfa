"use client";
import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "../../components/Icons";

const menu = [
  { href: "/dashboard", nome: "Dashboard", icone: "dashboard" },
  { href: "/projetos", nome: "Projetos", icone: "lista" },
  { href: "/usuarios", nome: "Usuários", icone: "usuarios" },
];

function titulo(p: string) {
  if (p.startsWith("/usuarios/novo")) return "Novo usuário";
  if (p.includes("/editar")) return "Editar usuário";
  if (p.startsWith("/usuarios")) return "Usuários";
  if (p.startsWith("/projetos")) return "Projetos";
  return "Dashboard";
}

export default function PainelLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    setAberto(false);
  }, [pathname]);

  async function sair() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <div className="app">
      <aside className={`sidebar ${aberto ? "aberta" : ""}`}>
        <div className="logo">
          <span className="logo-icon"><Icon nome="foguete" tamanho={20} /></span>
          Hackathon
        </div>

        <nav>
          <p className="menu-titulo">Menu</p>
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`menu-item ${pathname.startsWith(item.href) ? "ativo" : ""}`}
            >
              <Icon nome={item.icone} /> {item.nome}
            </Link>
          ))}
        </nav>

        <button className="menu-item sair-btn" onClick={sair}>
          <Icon nome="sair" /> Sair
        </button>
      </aside>

      {aberto && <div className="overlay" onClick={() => setAberto(false)} />}

      <div className="conteudo">
        <header className="topbar">
          <button className="hamburguer" onClick={() => setAberto(true)} aria-label="Abrir menu">
            <Icon nome="menu" />
          </button>
          <div className="topbar-titulo">
            <p className="crumb">Painel / {titulo(pathname)}</p>
            <h1>{titulo(pathname)}</h1>
          </div>
          <div className="usuario">
            <div className="usuario-info">
              <b>Aluno UniALFA</b>
              <span>aluno@unialfa.com</span>
            </div>
            <div className="avatar">AU</div>
          </div>
        </header>

        <main className="pagina">{children}</main>
      </div>
    </div>
  );
}