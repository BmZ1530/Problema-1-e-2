import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pet, Servico, PetCreate, ServicoCreate } from './pet.model';

@Injectable({
  providedIn: 'root'
})
export class PetService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  listarPets(busca?: string, especie?: string): Observable<Pet[]> {
    let params = new HttpParams();
    if (busca) params = params.set('busca', busca);
    if (especie) params = params.set('especie', especie);
    return this.http.get<Pet[]>(`${this.apiUrl}/pets`, { params });
  }

  criarPet(pet: PetCreate): Observable<Pet> {
    return this.http.post<Pet>(`${this.apiUrl}/pets`, pet);
  }

  deletarPet(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/pets/${id}`);
  }

  adicionarServico(petId: number, servico: ServicoCreate): Observable<Servico> {
    return this.http.post<Servico>(`${this.apiUrl}/pets/${petId}/servicos`, servico);
  }

  listarServicosPet(petId: number, limite: number = 5): Observable<Servico[]> {
    return this.http.get<Servico[]>(`${this.apiUrl}/pets/${petId}/servicos?limite=${limite}`);
  }
}