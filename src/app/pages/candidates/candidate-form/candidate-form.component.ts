import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CandidateService } from '../../../services/candidate.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './candidate-form.component.html',
  styleUrls: ['./candidate-form.component.css'],
})
export class CandidateFormComponent {
  @Input() isVisible: boolean = false;
  @Input() title: string = 'Nuevo Candidato';
  @Input() candidato: any = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() candidatoGuardado = new EventEmitter<any>();
  candidatoForm: FormGroup;
  validationErrors: any = {};
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private candidateService: CandidateService) {
    this.candidatoForm = this.fb.group({
      id: [''],
      nombre: [''],
      apellido: [''],
      documento_identidad: [''],
      correo: [''],
      telefono: [''],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['candidato'] && this.candidato) {
      this.candidatoForm.patchValue(this.candidato);
      this.title = this.candidato.id ? 'Actualizar Candidato' : 'Nuevo Candidato';
    }
  }

  submit() {
    if (this.candidato?.id) {
      this.updateCandidato();
    } else {
      this.createCandidato();
    }
  }

  createCandidato() {
    this.candidateService.createCandidato(this.candidatoForm.value).subscribe({
      next: (response) => {
        this.validationErrors = {};
        this.cerrarModal();
        Swal.fire({
          icon: 'success',
          title: 'Candidato Creado',
          text: 'El candidato ha sido agregado correctamente.',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.candidatoGuardado.emit(response);
        });
      },
      error: (error) => this.handleError(error),
    });
  }

  updateCandidato() {
    this.candidateService.updateCandidato(this.candidatoForm.value.id, this.candidatoForm.value).subscribe({
      next: (response) => {
        this.validationErrors = {};
        this.cerrarModal();
        Swal.fire({
          icon: 'success',
          title: 'Candidato Actualizado',
          text: 'La información del candidato ha sido actualizada.',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.candidatoGuardado.emit(response);
        });
      },
      error: (error) => this.handleError(error),
    });
  }

  handleError(error: any) {
    console.error('Error en el formulario', error);
    if (error.status === 422) {
      this.validationErrors = error.error.errors;
    } else {
      this.errorMessage = 'Ocurrió un error inesperado.';
    }
  }

  cerrarModal() {
    this.candidatoForm.reset();
    this.validationErrors = {};
    this.errorMessage = '';
    this.title = 'Nuevo Candidato';
    this.closeModal.emit();

  }
}
