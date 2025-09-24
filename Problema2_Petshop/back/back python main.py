from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import Optional
import models
import schemas
from database import SessionLocal, engine, get_db

# Criar tabelas se não existirem
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Petshop API")

# CORS para Angular
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/health")
def health():
    return {"status": "OK"}

# Endpoints para Pets
@app.get("/pets", response_model=list[schemas.Pet])
def listar_pets(
    db: Session = Depends(get_db),
    busca: Optional[str] = Query(None, description="Busca por nome"),
    especie: Optional[str] = Query(None, description="Filtro por espécie")
):
    query = db.query(models.Pet)
    if busca:
        query = query.filter(or_(models.Pet.nome.ilike(f"%{busca}%")))
    if especie:
        query = query.filter(models.Pet.especie == especie)
    return query.all()

@app.post("/pets", response_model=schemas.Pet)
def criar_pet(pet: schemas.PetCreate, db: Session = Depends(get_db)):
    db_pet = models.Pet(**pet.dict())
    db.add(db_pet)
    db.commit()
    db.refresh(db_pet)
    return db_pet

@app.delete("/pets/{pet_id}")
def deletar_pet(pet_id: int, db: Session = Depends(get_db)):
    db_pet = db.query(models.Pet).filter(models.Pet.id == pet_id).first()
    if not db_pet:
        raise HTTPException(status_code=404, detail="Pet não encontrado")
    db.delete(db_pet)
    db.commit()
    return {"message": "Pet excluído com sucesso"}

# Endpoints para Serviços
@app.post("/pets/{pet_id}/servicos", response_model=schemas.Servico)
def adicionar_servico(pet_id: int, servico: schemas.ServicoCreate, db: Session = Depends(get_db)):
    db_pet = db.query(models.Pet).filter(models.Pet.id == pet_id).first()
    if not db_pet:
        raise HTTPException(status_code=404, detail="Pet não encontrado")
    db_servico = models.Servico(**servico.dict(), pet_id=pet_id)
    db.add(db_servico)
    db.commit()
    db.refresh(db_servico)
    return db_servico

@app.get("/pets/{pet_id}/servicos", response_model=list[schemas.Servico])
def listar_servicos_pet(
    pet_id: int,
    limite: int = Query(5, description="Limite de serviços recentes"),
    db: Session = Depends(get_db)
):
    db_pet = db.query(models.Pet).filter(models.Pet.id == pet_id).first()
    if not db_pet:
        raise HTTPException(status_code=404, detail="Pet não encontrado")
    return db.query(models.Servico).filter(models.Servico.pet_id == pet_id).order_by(models.Servico.data.desc()).limit(limite).all()