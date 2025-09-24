from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from database import Base

class Pet(Base):
    __tablename__ = "pets"
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    especie = Column(String, nullable=False)
    tutor = Column(String, nullable=False)
    criado_em = Column(DateTime(timezone=True), server_default=func.now())

class Servico(Base):
    __tablename__ = "servicos"
    
    id = Column(Integer, primary_key=True, index=True)
    pet_id = Column(Integer, ForeignKey("pets.id", ondelete="CASCADE"), nullable=False)
    descricao = Column(Text, nullable=False)
    data = Column(DateTime(timezone=True), server_default=func.now())