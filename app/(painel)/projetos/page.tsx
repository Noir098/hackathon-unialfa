"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "../../../components/Icons";
import { projetos } from "../../../lib/dados";

const POR_PAGINA = 5;

export default function Projetos() {
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("Todos");
  const [ordem, setOrdem] = useState("nota");
  const [pagina, setPagina] = useState(1);

  const lista = useMemo(() => {
    const filtrada = projetos.filter(
      (p) =>
        (p.nome.toLowerCase().includes(busca.toLowerCase()) ||
          p.equipe.toLowerCase().includes(busca.toLowerCase()) ||
          p.responsavel.toLowerCase().includes(busca.toLowerCase())) &&
        (status === "Todos" || p.status === status)
    );
    return filtrada.sort((a, b) => {
      if (ordem === "nota") return b.nota - a.nota;
      if (ordem === "progresso") return b.progresso - a.progresso;
      return a.nome.localeCompare(b.nome);
    });
  }, [busca, status, ordem]);

  const totalPaginas = Math.max(1, Math.ceil(lista.length / POR_PAGINA));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const visiveis = lista.slice((paginaAtual - 1) * POR_PAGINA, paginaAtual * POR_PAGINA);

  function iniciais(nome: string) {
    return nome.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  }

  function classeStatus(s: string) {
    if (s === "Concluído") return "verde";
    if (s === "Em andamento") return "roxo";
    return "amarelo";
  }

  return (
    <>
      <div className="cabecalho-pagina">
        <div>
          <h2>Projetos do Hackathon</h2>
          <p className="texto-suave">{lista.length} projeto(s) encontrado(s)</p>
        </div>
        <Link href="/dashboard" className="btn-secundario btn-inline">
          <Icon nome="esquerda" tamanho={18} /> Voltar ao dashboard
        </Link>
      </div>

      <div className="card">
        <div className="filtros">
          <div className="busca">
            <Icon nome="busca" tamanho={18} />
            <input
              placeholder="Buscar por projeto, equipe ou responsável..."
              value={busca}
              onChange={(e) => { setBusca(e.target.value); setPagina(1); }}
            />
          </div>
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPagina(1); }}>
            <option>Todos</option>
            <option>Concluído</option>
            <option>Em andamento</option>
            <option>Pendente</option>
          </select>
          <select value={ordem} onChange={(e) => setOrdem(e.target.value)}>
            <option value="nota">Ordenar: Nota</option>
            <option value="progresso">Ordenar: Progresso</option>
            <option value="nome">Ordenar: Nome</option>
          </select>
        </div>

        <div className="tabela-wrap">
          <table>
            <thead>
              <tr>
                <th>Projeto</th>
                <th>Responsável</th>
                <th>Status</th>
                <th>Progresso</th>
                <th>Entrega</th>
                <th>Nota</th>
              </tr>
            </thead>
            <tbody>
              {visiveis.map((p) => (
                <tr key={p.id}>
                  <td>
                    <b>{p.nome}</b>
                    <small className="bloco">{p.equipe}</small>
                  </td>
                  <td>
                    <div className="pessoa">
                      <span className="avatar pequeno">{iniciais(p.responsavel)}</span>
                      {p.responsavel}
                    </div>
                  </td>
                  <td><span className={`badge ${classeStatus(p.status)}`}>{p.status}</span></td>
                  <td>
                    <div className="progresso">
                      <div className="progresso-barra"><div style={{ width: `${p.progresso}%` }} /></div>
                      <span>{p.progresso}%</span>
                    </div>
                  </td>
                  <td>{p.entrega}</td>
                  <td><span className="nota">{p.nota.toFixed(1)}</span></td>
                </tr>
              ))}
              {visiveis.length === 0 && (
                <tr><td colSpan={6} className="vazio">Nenhum projeto encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="paginacao">
          <span className="texto-suave">Página {paginaAtual} de {totalPaginas}</span>
          <div>
            <button className="btn-pag" disabled={paginaAtual === 1} onClick={() => setPagina(paginaAtual - 1)}>
              <Icon nome="esquerda" tamanho={16} />
            </button>
            <button className="btn-pag" disabled={paginaAtual === totalPaginas} onClick={() => setPagina(paginaAtual + 1)}>
              <Icon nome="direita" tamanho={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
