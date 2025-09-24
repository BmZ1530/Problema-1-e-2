import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PetService } from './pet.service';
import { Pet, Servico, PetCreate, ServicoCreate } from './pet.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  pets: Pet[] = [];
  servicos: Servico[] = [];
  selectedPetId?: number;
  mostrarCadastro = false;
  mostrarAdicionarServico = false;
  mostrarHistorico = false;
  mensagem?: string;

  formCadastro: FormGroup;
  formServico: FormGroup;

  especies = ['Cachorro', 'Gato', 'Outro'];

  constructor(private petService: PetService, private fb: FormBuilder) {
    this.formCadastro = this.fb.group({
      nome: ['', Validators.required],
      especie: ['', Validators.required],
      tutor: ['', Validators.required]
    });

    this.formServico = this.fb.group({
      descricao: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.carregarPets();
  }

  carregarPets(busca: string = '', especie: string = '') {
    this.petService.listarPets(busca, especie).subscribe({
      next: (data) => this.pets = data,
      error: (err) => this.mensagem = 'Erro ao carregar pets: ' + err.message
    });
  }

  onBuscar() {
    const busca = (document.getElementById('busca') as HTMLInputElement).value;
    const especie = (document.getElementById('filtro-especie') as HTMLSelectElement).value;
    this.carregarPets(busca, especie);
  }

  cadastrarPet() {
    if (this.formCadastro.valid) {
      const pet: PetCreate = this.formCadastro.value;
      this.petService.criarPet(pet).subscribe({
        next: () => {
          this.mensagem = 'Pet cadastrado com sucesso!';
          this.formCadastro.reset();
          this.mostrarCadastro = false;
          this.carregarPets();
        },
        error: (err) => this.mensagem = 'Erro ao cadastrar: ' + err.error.detail
      });
    }
  }

  excluirPet(id: number) {
    if (confirm('Confirma exclusão do pet?')) {
      this.petService.deletarPet(id).subscribe({
        next: () => {
          this.mensagem = 'Pet excluído!';
          this.carregarPets();
        },
        error: (err) => this.mensagem = 'Erro ao excluir: ' + err.error.detail
      });
    }
  }

  adicionarServico() {
    if (this.selectedPetId && this.formServico.valid) {
      const servico: ServicoCreate = { descricao: this.formServico.value