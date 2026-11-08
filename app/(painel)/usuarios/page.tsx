"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "../../../components/Icons";
import { Usuario, excluirUsuario, listarUsuarios } from "../../../lib/api";
import { corAvatar, idade, iniciais } from "../../../lib/util";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [aviso, setAviso] = useState("");
  const [excluindo, setExcluindo] = useState<Usuario | null>(null);
  const [apagando, setApagando] = useState(false);

  function avisar(msg: string) {
    setAviso(msg);
    setTimeout(() => setAviso(""), 4000);
  }

  async function carregar() {
    setCarregando(true);
    setErro("");
    try {
      setUsuarios(await listarUsuarios());
    } catch {
      setErro("Não foi possível carregar os usuários. Verifique se a API está rodando (npm run api).");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    const flash = sessionStorage.getItem("flash");
    if (flash) {
      avisar(flash);
      sessionStorage.removeItem("flash");
    }
    carregar();
  }, []);

  const lista = useMemo(() => {
    const b = busca.toLowerCase();
    return usuarios.filter(
      (u) =>
        u.nome.toLowerCase().includes(b) ||
        u.email.toLowerCase().includes(b) ||
        u.cpf.includes(busca) ||
        u.cidade.toLowerCase().includes(b)
    );
  }, [usuarios, busca]);

  const cidades = new Set(usuarios.map((u) => u.cidade.trim().toLowerCase())).size;
  const idades = usuarios.map((u) => idade(u.dataNascimento)).filter((i): i is number => i !== null);
  const mediaIdade = idades.length ? Math.round(idades.reduce((a, b) => a + b, 0) / idades.length) : null;

  async function confirmarExclusao() {
    if (!excluindo?.id) return;
    setApagando(true);
    try {
      await excluirUsuario(excluindo.id);
      setUsuarios((l) => l.filter((u) => u.id !== excluindo.id));
      avisar("Usuário excluído com sucesso!");
    } catch {
      setErro("Não foi possível excluir o usuário.");
    } finally {
      setApagando(false);
      setExcluindo(null);
    }
  }

  return (
    <>
      <div className="cabecalho-pagina">
        <div>
          <h2>Usuários</h2>
          <p className="texto-suave">Gerencie os usuários cadastrados no sistema.</p>
        </div>
        <Link href="/usuarios/novo" className="btn-primario btn-inline">
          <Icon nome="mais" tamanho={18} /> Novo usuário
        </Link>
      </div>

      {aviso && (
        <div className="toast" role="status">
          <Icon nome="check" tamanho={20} /> {aviso}
        </div>
      )}

      <section className="stats-strip">
        <div className="card stat-mini">
          <div className="kpi-icone roxo"><Icon nome="usuarios" /></div>
          <div><p className="texto-suave">Total de usuários</p><strong>{carregando ? "—" : usuarios.length}</strong></div>
        </div>
        <div className="card stat-mini">
          <div className="kpi-icone azul"><Icon nome="pin" /></div>
          <div><p className="texto-suave">Cidades</p><strong>{carregando ? "—" : cidades}</strong></div>
        </div>
        <div className="card stat-mini">
          <div className="kpi-icone verde"><Icon nome="pessoa" /></div>
          <div><p className="texto-suave">Idade média</p><strong>{mediaIdade !== null ? `${mediaIdade} anos` : "—"}</strong></div>
        </div>
      </section>

      {erro && <div className="alerta-erro" style={{ marginBottom: 16 }}>{erro}</div>}

      <div className="card">
        <div className="filtros filtros-1">
          <div className="busca">
            <Icon nome="busca" tamanho={18} />
            <input
              placeholder="Buscar por nome, e-mail, CPF ou cidade..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>

        <div className="tabela-wrap">
          <table>
            <thead>
              <tr>
                <th>Usuário</th>
                <th>CPF</th>
                <th>Telefone</th>
                <th>Nascimento</th>
                <th>Cidade</th>
                <th className="th-acoes">Ações</th>
              </tr>
            </thead>
            <tbody>
              {carregando &&
                [0, 1, 2, 3].map((i) => (
                  <tr key={i} className="skeleton-linha">
                    {[0, 1, 2, 3, 4, 5].map((j) => (
                      <td key={j}><div className="skeleton" /></td>
                    ))}
                  </tr>
                ))}
              {!carregando && lista.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="pessoa">
                      <span className={`avatar pequeno ${corAvatar(u.nome)}`}>{iniciais(u.nome)}</span>
                      <div>
                        <b>{u.nome}</b>
                        <small className="bloco">{u.email}</small>
                      </div>
                    </div>
                  </td>
                  <td>{u.cpf}</td>
                  <td>{u.telefone}</td>
                  <td>{u.dataNascimento}</td>
                  <td><span className="chip">{u.cidade}/{u.uf}</span></td>
                  <td>
                    <div className="acoes">
                      <Link href={`/usuarios/${u.id}/editar`} className="btn-icone" title="Editar" aria-label="Editar">
                        <Icon nome="editar" tamanho={16} />
                      </Link>
                      <button className="btn-icone perigo" title="Excluir" aria-label="Excluir" onClick={() => setExcluindo(u)}>
                        <Icon nome="lixo" tamanho={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!carregando && !erro && lista.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="vazio-estado">
                      <div className="kpi-icone roxo"><Icon nome="usuarios" tamanho={28} /></div>
                      <h4>{busca ? "Nenhum usuário encontrado" : "Nenhum usuário cadastrado"}</h4>
                      <p className="texto-suave">
                        {busca ? "Tente buscar por outro termo." : "Cadastre o primeiro usuário para começar."}
                      </p>
                      {!busca && (
                        <Link href="/usuarios/novo" className="btn-primario btn-inline">Cadastrar usuário</Link>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {excluindo && (
        <div className="modal-fundo" onClick={() => !apagando && setExcluindo(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icone"><Icon nome="lixo" tamanho={24} /></div>
            <h3>Excluir usuário</h3>
            <p className="texto-suave">
              Tem certeza que deseja excluir <b>{excluindo.nome}</b>? Essa ação não pode ser desfeita.
            </p>
            <div className="form-acoes">
              <button className="btn-secundario btn-inline" onClick={() => setExcluindo(null)} disabled={apagando}>
                Cancelar
              </button>
              <button className="btn-perigo btn-inline" onClick={confirmarExclusao} disabled={apagando}>
                {apagando ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
