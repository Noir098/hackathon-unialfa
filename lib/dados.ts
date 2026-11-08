export type Projeto = {
  id: number;
  nome: string;
  equipe: string;
  responsavel: string;
  status: "Concluído" | "Em andamento" | "Pendente";
  progresso: number;
  nota: number;
  entrega: string;
};

export const projetos: Projeto[] = [
  { id: 1, nome: "Portal de Estágios", equipe: "Equipe Alpha", responsavel: "Murilo Santos", status: "Concluído", progresso: 100, nota: 9.5, entrega: "12/09/2026" },
  { id: 2, nome: "Pokedex CRUD", equipe: "Equipe Beta", responsavel: "Ana Beatriz", status: "Em andamento", progresso: 70, nota: 8.0, entrega: "10/10/2026" },
  { id: 3, nome: "Controle Financeiro", equipe: "Equipe Gama", responsavel: "Carlos Eduardo", status: "Em andamento", progresso: 55, nota: 8.5, entrega: "20/10/2026" },
  { id: 4, nome: "Kanban Dev Web", equipe: "Equipe Delta", responsavel: "Juliana Prado", status: "Concluído", progresso: 100, nota: 9.0, entrega: "08/09/2026" },
  { id: 5, nome: "Gestão de Ativos", equipe: "Equipe Alpha", responsavel: "Rafael Lima", status: "Pendente", progresso: 15, nota: 7.0, entrega: "30/10/2026" },
  { id: 6, nome: "Changelog Automático", equipe: "Equipe Beta", responsavel: "Fernanda Costa", status: "Concluído", progresso: 100, nota: 9.2, entrega: "16/10/2026" },
  { id: 7, nome: "API de Vagas", equipe: "Equipe Gama", responsavel: "Lucas Almeida", status: "Em andamento", progresso: 40, nota: 7.5, entrega: "25/10/2026" },
  { id: 8, nome: "Landing Page Hackathon", equipe: "Equipe Delta", responsavel: "Mariana Rocha", status: "Pendente", progresso: 10, nota: 6.5, entrega: "05/11/2026" },
  { id: 9, nome: "Painel de Notas", equipe: "Equipe Alpha", responsavel: "Pedro Henrique", status: "Em andamento", progresso: 85, nota: 8.8, entrega: "22/10/2026" },
  { id: 10, nome: "Chat da Turma", equipe: "Equipe Beta", responsavel: "Camila Souza", status: "Concluído", progresso: 100, nota: 9.4, entrega: "01/10/2026" },
];

export const entregasPorMes = [
  { mes: "Mai", valor: 3 },
  { mes: "Jun", valor: 5 },
  { mes: "Jul", valor: 4 },
  { mes: "Ago", valor: 7 },
  { mes: "Set", valor: 9 },
  { mes: "Out", valor: 6 },
];

export const atividades = [
  { id: 1, texto: "Equipe Beta entregou o Changelog Automático", tempo: "há 3 dias", cor: "verde" },
  { id: 2, texto: "Pokedex CRUD avançou para 70%", tempo: "há 5 dias", cor: "azul" },
  { id: 3, texto: "Nova equipe cadastrada: Equipe Delta", tempo: "há 1 semana", cor: "roxo" },
  { id: 4, texto: "Gestão de Ativos aguardando início", tempo: "há 2 semanas", cor: "amarelo" },
];
