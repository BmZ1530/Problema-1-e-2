from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class PetBase(BaseModel):
    nome: str
    especie: str  # Validado no DB: 'Cachorro', 'Gato', 'Outro'
    tutor: str

class PetCreate(PetBase):
    pass

class Pet(PetBase):
    id: int
    criado_em: datetime

    class Config:
        from_attributes = True

class ServicoBase(BaseModel):
    descricao: str

class ServicoCreate(ServicoBase):
    pass

class Servico(ServicoBase):
    id: int
    data: datetime
    pet_id: int

    class Config:
        from_attributes = True

class PetWithServicos(Pet):
    servicos: Optional[List[Servico]] = []