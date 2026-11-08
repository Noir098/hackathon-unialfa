import Link from "next/link";
import { Icon } from "../../../../components/Icons";
import UsuarioForm from "../../../../components/UsuarioForm";

export default function NovoUsuario() {
  return (
    <>
      <div className="cabecalho-pagina">
        <div>
          <h2>Novo usuário</h2>
          <p className="texto-suave">Preencha os dados para cadastrar um usuário.</p>
        </div>
        <Link href="/usuarios" className="btn-secundario btn-inline">
          <Icon nome="esquerda" tamanho={18} /> Voltar para a lista
        </Link>
      </div>
      <UsuarioForm />
    </>
  );
}
