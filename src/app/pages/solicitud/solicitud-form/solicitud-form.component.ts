import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CandidateService } from '../../../services/candidate.service';
import { TipoEstudioService } from '../../../services/tipo-estudio.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { SolicitudService } from '../../../services/solicitud.service';

@Component({
  selector: 'app-solicitud-form',
  standalone: true,
  templateUrl: './solicitud-form.component.html',
  styleUrls: ['./solicitud-form.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class SolicitudFormComponent implements OnInit {
  @Input() isVisible = false;
  @Input() solicitud: any = null;
  @Output() saveSolicitud = new EventEmitter<any>();
  @Output() closeModal = new EventEmitter<void>();

  solicitudForm!: FormGroup;
  candidatos: any[] = [];
  tiposEstudio: any[] = [];
  validationErrors: any = {};
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private solicitudService: SolicitudService,
    private candidateService: CandidateService,
    private tipoEstudioService: TipoEstudioService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.cargarCandidatos();
    this.cargarTiposEstudio();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['solicitud'] && this.solicitud) {
      this.solicitudForm.patchValue(this.solicitud);
    }
  }

  private initForm(): void {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');

    this.solicitudForm = this.fb.group({
      id: [null],
      candidato_id: [null],
      tipo_estudio_id: [null],
      estado: ['pendiente'],
      fecha_solicitud: [formattedDate, Validators.required]
    });

  }

  cargarCandidatos(): void {
    this.candidateService.getCandidatos().subscribe({
      next: (data) => {
        this.candidatos = data;
      },
      error: (err) => {
        console.error('Error al obtener candidatos:', err);
        this.errorMessage = 'No se pudieron cargar los candidatos.';
      }
    });
  }

  cargarTiposEstudio(): void {
    this.tipoEstudioService.getTiposEstudio().subscribe({
      next: (data) => {
        this.tiposEstudio = data;
      },
      error: (err) => {
        console.error('Error al obtener tipos de estudio:', err);
        this.errorMessage = 'No se pudieron cargar los tipos de estudio.';
      }
    });
  }

  submit() {
    if (this.solicitud?.id) {
      this.updateSolicitud();
    } else {
      this.createSolicitud();
    }
  }

  createSolicitud() {
    if (this.solicitudForm.invalid) {
      this.solicitudForm.markAllAsTouched();
      this.errorMessage = 'Por favor, completa todos los campos requeridos.';
      return;
    }

    this.solicitudForm.disable();
    this.solicitudService.createSolicitud(this.solicitudForm.value).subscribe({
      next: (response) => {
        this.validationErrors = {};
        this.cerrarModal();
        Swal.fire({
          icon: 'success',
          title: 'Solicitud Creada',
          text: 'La solicitud ha sido creada correctamente.',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.saveSolicitud.emit(response);
          this.resetForm();

        });
      },
      error: (error) => {
        if (error?.error?.errors) {
          this.validationErrors = error.error.errors;
        }
        this.solicitudForm.enable();
      },
    });
  }

  updateSolicitud() {
    if (this.solicitudForm.invalid) {
      this.solicitudForm.markAllAsTouched();
      this.errorMessage = 'Por favor, completa todos los campos requeridos.';
      return;
    }

    this.solicitudForm.disable();
    this.solicitudService.updateSolicitud(this.solicitudForm.value.id, this.solicitudForm.value).subscribe({
      next: (response) => {
        this.validationErrors = {};
        this.cerrarModal();
        Swal.fire({
          icon: 'success',
          title: 'Solicitud Actualizada',
          text: 'La solicitud ha sido actualizada correctamente.',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.saveSolicitud.emit(response);
          this.resetForm();
        });
      },
      error: (error) => {
        if (error?.error?.errors) {
          this.validationErrors = error.error.errors;
        }
        this.solicitudForm.enable();
      },
    });
  }

  resetForm() {
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    this.solicitudForm.reset();
    this.solicitudForm.patchValue({ fecha_solicitud: currentDate, estado: 'pendiente' });
    this.solicitudForm.enable();
  }

  cerrarModal() {
    this.validationErrors = {};
    this.errorMessage = '';
    this.closeModal.emit();
  }
}
