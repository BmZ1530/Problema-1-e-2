export interface Pet {
  id: number;
  nome: string;
  especie: string;
  tutor: string;
  criado_em: string;
}

export interface Servico {
  id: number;
  descricao: string;
  data: string;
  pet_id: number;
}

export interface PetCreate {
  nome: string;
  especie: string;
  tutor: string;
}

export interface ServicoCreate {
  descricao: string;
}