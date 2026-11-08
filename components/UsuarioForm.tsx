"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "./Icons";
import { Usuario, atualizarUsuario, criarUsuario, listarUsuarios } from "../lib/api";
import { apenasNumeros, mascaraCEP, mascaraCPF, mascaraData, mascaraTelefone } from "../lib/mascaras";
import { Campos, validar } from "../lib/validacoes";
import { forcaSenha } from "../lib/util";

const vazio: Campos = {
  nome: "", email: "", cpf: "", telefone: "", dataNascimento: "",
  cep: "", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "", uf: "",
  senha: "", confirmarSenha: "",
};

function Campo({ id, label, erro, dica, children }: { id: string; label: string; erro?: string; dica?: string; children: React.ReactNode }) {
  return (
    <div className="campo">
      <label htmlFor={id}>{label}</label>
      {children}
      {erro ? <small className="erro-campo">{erro}</small> : dica ? <small>{dica}</small> : null}
    </div>
  );
}

export default function UsuarioForm({ inicial }: { inicial?: Usuario }) {
  const router = useRouter();
  const editando = inicial?.id !== undefined;

  const [dados, setDados] = useState<Campos>(
    inicial ? { ...vazio, ...inicial, senha: "", confirmarSenha: "" } : vazio
  );
  const [tocados, setTocados] = useState<Partial<Record<keyof Campos, boolean>>>({});
  const [tentou, setTentou] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [erroGeral, setErroGeral] = useState("");
  const [verSenha, setVerSenha] = useState(false);
  const [erroServidor, setErroServidor] = useState<Partial<Record<keyof Campos, string>>>({});

  const erros = { ...validar(dados, editando), ...erroServidor };

  function mostrar(c: keyof Campos) {
    return (tentou || tocados[c]) && erros[c] ? erros[c] : "";
  }

  function alterar(c: keyof Campos, valor: string) {
    const mascaras: Partial<Record<keyof Campos, (v: string) => string>> = {
      cpf: mascaraCPF,
      telefone: mascaraTelefone,
      cep: mascaraCEP,
      dataNascimento: mascaraData,
      uf: (v) => v.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase(),
    };
    const novo = mascaras[c] ? mascaras[c]!(valor) : valor;
    setDados((d) => ({ ...d, [c]: novo }));
    if (erroServidor[c]) setErroServidor((s) => ({ ...s, [c]: undefined }));
    if (c === "cep" && apenasNumeros(novo).length === 8) buscarCep(novo);
  }

  async function buscarCep(cep: string) {
    setBuscandoCep(true);
    try {
      const r = await fetch(`https://viacep.com.br/ws/${apenasNumeros(cep)}/json/`);
      const j = await r.json();
      if (!j.erro) {
        setDados((d) => ({
          ...d,
          logradouro: j.logradouro || d.logradouro,
          bairro: j.bairro || d.bairro,
          cidade: j.localidade || d.cidade,
          uf: (j.uf || d.uf).toUpperCase(),
        }));
      }
    } catch {
      // sem internet: o usuário preenche o endereço manualmente
    } finally {
      setBuscandoCep(false);
    }
  }

  function props(c: keyof Campos) {
    return {
      id: c,
      value: dados[c],
      onChange: (e: ChangeEvent<HTMLInputElement>) => alterar(c, e.target.value),
      onBlur: () => setTocados((t) => ({ ...t, [c]: true })),
      className: mostrar(c) ? "invalido" : "",
    };
  }

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setTentou(true);
    setErroGeral("");
    if (Object.keys(validar(dados, editando)).length > 0) return;

    setSalvando(true);
    try {
      const todos = await listarUsuarios();
      const outros = todos.filter((u) => u.id !== inicial?.id);
      const conflitos: Partial<Record<keyof Campos, string>> = {};
      if (outros.some((u) => u.cpf === dados.cpf)) conflitos.cpf = "Já existe um usuário com esse CPF.";
      if (outros.some((u) => u.email.toLowerCase() === dados.email.toLowerCase()))
        conflitos.email = "Já existe um usuário com esse e-mail.";
      if (Object.keys(conflitos).length) {
        setErroServidor(conflitos);
        setSalvando(false);
        return;
      }

      const { confirmarSenha, ...resto } = dados;
      void confirmarSenha;
      const payload: Usuario = { ...resto, senha: dados.senha || inicial?.senha || "" };

      if (editando) await atualizarUsuario(inicial!.id!, payload);
      else await criarUsuario(payload);

      sessionStorage.setItem("flash", editando ? "Usuário atualizado com sucesso!" : "Usuário cadastrado com sucesso!");
      router.push("/usuarios");
    } catch {
      setErroGeral("Não foi possível salvar. Verifique se a API está rodando (npm run api).");
      setSalvando(false);
    }
  }

  const forca = dados.senha ? forcaSenha(dados.senha) : null;
  const tipoSenha = verSenha ? "text" : "password";

  return (
    <form className="form-usuario" onSubmit={enviar} noValidate>
      <div className="secoes">
        <section className="card secao">
          <header className="secao-cab">
            <div className="secao-icone"><Icon nome="pessoa" /></div>
            <div>
              <h3>Dados pessoais</h3>
              <p className="texto-suave">Informações de identificação do usuário.</p>
            </div>
          </header>
          <div className="secao-corpo form-grid">
            <div className="span-2">
              <Campo id="nome" erro={mostrar("nome")} label="Nome completo">
                <input {...props("nome")} placeholder="Ex.: Maria da Silva" />
              </Campo>
            </div>
            <Campo id="email" erro={mostrar("email")} label="E-mail">
              <input {...props("email")} type="email" placeholder="maria@email.com" />
            </Campo>
            <Campo id="cpf" erro={mostrar("cpf")} label="CPF">
              <input {...props("cpf")} inputMode="numeric" placeholder="000.000.000-00" />
            </Campo>
            <Campo id="telefone" erro={mostrar("telefone")} label="Telefone">
              <input {...props("telefone")} inputMode="tel" placeholder="(00) 00000-0000" />
            </Campo>
            <Campo id="dataNascimento" erro={mostrar("dataNascimento")} label="Data de nascimento">
              <input {...props("dataNascimento")} inputMode="numeric" placeholder="dd/mm/aaaa" />
            </Campo>
          </div>
        </section>

        <section className="card secao">
          <header className="secao-cab">
            <div className="secao-icone"><Icon nome="pin" /></div>
            <div>
              <h3>Endereço</h3>
              <p className="texto-suave">Informe o CEP e o restante é preenchido automaticamente.</p>
            </div>
          </header>
          <div className="secao-corpo form-grid">
            <Campo id="cep" erro={mostrar("cep")} label="CEP" dica={buscandoCep ? "Buscando endereço..." : "Ex.: 87501-020"}>
              <input {...props("cep")} inputMode="numeric" placeholder="00000-000" />
            </Campo>
            <div className="span-2">
              <Campo id="logradouro" erro={mostrar("logradouro")} label="Logradouro">
                <input {...props("logradouro")} placeholder="Rua, avenida..." />
              </Campo>
            </div>
            <Campo id="numero" erro={mostrar("numero")} label="Número">
              <input {...props("numero")} placeholder="123" />
            </Campo>
            <Campo id="complemento" erro={mostrar("complemento")} label="Complemento (opcional)">
              <input {...props("complemento")} placeholder="Apto, bloco..." />
            </Campo>
            <Campo id="bairro" erro={mostrar("bairro")} label="Bairro">
              <input {...props("bairro")} />
            </Campo>
            <Campo id="cidade" erro={mostrar("cidade")} label="Cidade">
              <input {...props("cidade")} />
            </Campo>
            <Campo id="uf" erro={mostrar("uf")} label="UF">
              <input {...props("uf")} placeholder="PR" />
            </Campo>
          </div>
        </section>

        <section className="card secao">
          <header className="secao-cab">
            <div className="secao-icone"><Icon nome="cadeado" /></div>
            <div>
              <h3>Acesso</h3>
              <p className="texto-suave">{editando ? "Deixe em branco para manter a senha atual." : "Defina uma senha com no mínimo 6 caracteres."}</p>
            </div>
          </header>
          <div className="secao-corpo form-grid">
            <Campo id="senha" erro={mostrar("senha")} label={editando ? "Nova senha" : "Senha"}>
              <div className="campo-senha">
                <input {...props("senha")} type={tipoSenha} autoComplete="new-password" />
                <button type="button" className="olho" onClick={() => setVerSenha(!verSenha)} aria-label="Mostrar senha">
                  <Icon nome={verSenha ? "olhoOff" : "olho"} tamanho={18} />
                </button>
              </div>
              {forca && (
                <div className={`forca forca-${forca.nivel}`}>
                  <div className="forca-barras"><i /><i /><i /><i /></div>
                  <small>Força da senha: <b>{forca.texto}</b></small>
                </div>
              )}
            </Campo>
            <Campo id="confirmarSenha" erro={mostrar("confirmarSenha")} label="Confirmar senha">
              <input {...props("confirmarSenha")} type={tipoSenha} autoComplete="new-password" />
            </Campo>
          </div>
        </section>
      </div>

      {erroGeral && <p className="alerta-erro" style={{ marginTop: 16 }}>{erroGeral}</p>}

      <div className="barra-acoes">
        <span className="texto-suave">{editando ? "Revise as alterações antes de salvar." : "Todos os campos são obrigatórios, exceto o complemento."}</span>
        <Link href="/usuarios" className="btn-secundario btn-inline">Cancelar</Link>
        <button type="submit" className="btn-primario btn-inline" disabled={salvando}>
          {salvando ? "Salvando..." : editando ? "Salvar alterações" : "Cadastrar usuário"}
        </button>
      </div>
    </form>
  );
}
