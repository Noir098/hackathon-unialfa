"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Icon } from "../../../../../components/Icons";
import UsuarioForm from "../../../../../components/UsuarioForm";
import { Usuario, obterUsuario } from "../../../../../lib/api";

export default function EditarUsuario() {
  const { id } = useParams<{ id: string }>();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    obterUsuario(id)
      .then(setUsuario)
      .catch(() => setErro("Usuário não encontrado ou API fora do ar (npm run api)."));
  }, [id]);

  return (
    <>
      <div className="cabecalho-pagina">
        <div>
          <h2>Editar usuário</h2>
          <p className="texto-suave">Altere os dados e salve.</p>
        </div>
        <Link href="/usuarios" className="btn-secundario btn-inline">
          <Icon nome="esquerda" tamanho={18} /> Voltar para a lista
        </Link>
      </div>
      {erro && <div className="alerta-erro">{erro}</div>}
      {!erro && !usuario && <p className="texto-suave">Carregando...</p>}
      {usuario && <UsuarioForm inicial={usuario} />}
    </>
  );
}
