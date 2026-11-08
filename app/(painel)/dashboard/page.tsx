  "use client";
  import { useEffect, useState } from "react";
  import Link from "next/link";
  import { Icon } from "../../../components/Icons";
  import { projetos, entregasPorMes } from "../../../lib/dados";
  import { Usuario, listarUsuarios } from "../../../lib/api";
  import { corAvatar, iniciais } from "../../../lib/util";

  export default function Dashboard() {
    const [usuarios, setUsuarios] = useState<Usuario[] | null>(null);

    useEffect(() => {
      listarUsuarios().then(setUsuarios).catch(() => setUsuarios([]));
    }, []);

    const total = projetos.length;
    const concluidos = projetos.filter((p) => p.status === "Concluído").length;
    const andamento = projetos.filter((p) => p.status === "Em andamento").length;
    const pendentes = projetos.filter((p) => p.status === "Pendente").length;
    const media = (projetos.reduce((s, p) => s + p.nota, 0) / total).toFixed(1);

    const maxEntrega = Math.max(...entregasPorMes.map((m) => m.valor));

    const pctConcluido = (concluidos / total) * 100;
    const pctAndamento = (andamento / total) * 100;
    const donut = `conic-gradient(#22c55e 0 ${pctConcluido}%, #6366f1 ${pctConcluido}% ${
      pctConcluido + pctAndamento
    }%, #f59e0b ${pctConcluido + pctAndamento}% 100%)`;

    const destaques = [...projetos].sort((a, b) => b.nota - a.nota).slice(0, 4);
    const recentes = usuarios ? [...usuarios].sort((a, b) => (b.id ?? 0) - (a.id ?? 0)).slice(0, 4) : [];

    const kpis = [
      { titulo: "Usuários", valor: usuarios ? usuarios.length : "—", icone: "usuarios", cor: "roxo", info: "cadastrados" },
      { titulo: "Total de projetos", valor: total, icone: "projetos", cor: "azul", info: `${pendentes} pendentes` },
      { titulo: "Concluídos", valor: concluidos, icone: "check", cor: "verde", info: `${Math.round(pctConcluido)}% do total` },
      { titulo: "Nota média", valor: media, icone: "estrela", cor: "amarelo", info: "de 0 a 10" },
    ];

    return (
      <>
        <section className="hero">
          <div>
            <h2>Olá, Aluno 👋</h2>
            <p>Gerencie os usuários do sistema e acompanhe o andamento dos projetos do hackathon.</p>
          </div>
          <div className="hero-acoes">
            <Link href="/usuarios/novo" className="btn-claro">
              <Icon nome="mais" tamanho={18} /> Novo usuário
            </Link>
            <Link href="/projetos" className="btn-vidro">
              Ver projetos <Icon nome="seta" tamanho={18} />
            </Link>
          </div>
        </section>

        <section className="kpis">
          {kpis.map((k) => (
            <div className="card kpi" key={k.titulo}>
              <div className={`kpi-icone ${k.cor}`}><Icon nome={k.icone} /></div>
              <div>
                <p className="texto-suave">{k.titulo}</p>
                <strong>{k.valor}</strong>
                <small>{k.info}</small>
              </div>
            </div>
          ))}
        </section>

        <section className="grade-2">
          <div className="card">
            <h3>Entregas por mês</h3>
            <p className="texto-suave">Projetos entregues nos últimos 6 meses</p>
            <div className="grafico">
              {entregasPorMes.map((m) => (
                <div className="barra-col" key={m.mes}>
                  <span className="barra-valor">{m.valor}</span>
                  <div className="barra" style={{ height: `${(m.valor / maxEntrega) * 100}%` }} />
                  <span className="barra-mes">{m.mes}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3>Status dos projetos</h3>
            <p className="texto-suave">Distribuição atual</p>
            <div className="donut-area">
              <div className="donut" style={{ background: donut }}>
                <div className="donut-centro">
                  <strong>{total}</strong>
                  <span>projetos</span>
                </div>
              </div>
              <ul className="legenda">
                <li><i style={{ background: "#22c55e" }} /> Concluídos <b>{concluidos}</b></li>
                <li><i style={{ background: "#6366f1" }} /> Em andamento <b>{andamento}</b></li>
                <li><i style={{ background: "#f59e0b" }} /> Pendentes <b>{pendentes}</b></li>
              </ul>
            </div>
          </div>
        </section>

        <section className="grade-2">
          <div className="card">
            <div className="card-cab">
              <div>
                <h3>Usuários recentes</h3>
                <p className="texto-suave">Últimos cadastros</p>
              </div>
              <Link href="/usuarios" className="link-ver">Ver todos</Link>
            </div>
            {recentes.length > 0 ? (
              <ul className="ranking">
                {recentes.map((u) => (
                  <li key={u.id}>
                    <span className={`avatar pequeno ${corAvatar(u.nome)}`}>{iniciais(u.nome)}</span>
                    <div className="ranking-info">
                      <b>{u.nome}</b>
                      <small>{u.email}</small>
                    </div>
                    <span className="chip">{u.cidade}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="vazio-mini">
                {usuarios === null ? "Carregando..." : "Nenhum usuário para mostrar. Verifique se a API está rodando (npm run api)."}
              </div>
            )}
          </div>

          <div className="card">
            <h3>Melhores notas</h3>
            <p className="texto-suave">Top 4 projetos</p>
            <ul className="ranking">
              {destaques.map((p, i) => (
                <li key={p.id}>
                  <span className="posicao">{i + 1}</span>
                  <div className="ranking-info">
                    <b>{p.nome}</b>
                    <small>{p.equipe}</small>
                  </div>
                  <span className="nota">{p.nota.toFixed(1)}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </>
    );
  }
