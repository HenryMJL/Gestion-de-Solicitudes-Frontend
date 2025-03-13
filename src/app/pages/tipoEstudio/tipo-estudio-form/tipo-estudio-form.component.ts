import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TipoEstudioService } from '../../../services/tipo-estudio.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-estudio-form',
  standalone: true,
  templateUrl: './tipo-estudio-form.component.html',
  styleUrls: ['./tipo-estudio-form.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class TipoEstudioFormComponent implements OnInit {
  @Input() isModalOpen = false;
  @Input() tipoEstudio: any = null;
  @Output() saveTipoEstudio = new EventEmitter<any>();
  @Output() closeModal = new EventEmitter<void>();

  tipoEstudioForm!: FormGroup;
  validationErrors: any = {};

  constructor(
    private fb: FormBuilder,
    private tipoEstudioService: TipoEstudioService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.tipoEstudioForm.reset();
  }

  ngOnChanges(): void {
    if (this.tipoEstudio) {
      this.tipoEstudioForm.patchValue(this.tipoEstudio);
    }
    this.initForm()
  }

  private initForm(): void {
    this.tipoEstudioForm = this.fb.group({
      id: [null],
      nombre: [''],
      descripcion: [''],
      precio: ['']
    });

    if (this.tipoEstudio) {
      this.tipoEstudioForm.patchValue(this.tipoEstudio);
    }
  }

  submit() {
    if (this.tipoEstudio?.id) {
      this.updateTipoEstudio();
    } else {
      this.createTipoEstudio();
    }
  }

  createTipoEstudio() {
    console.log();

    this.tipoEstudioService.createTipoEstudio(this.tipoEstudioForm.value).subscribe({
      next: (response) => {
        this.validationErrors = {};
        this.close();
        Swal.fire({
          icon: 'success',
          title: 'Solicitud Creada',
          text: 'La solicitud ha sido creada correctamente.',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.saveTipoEstudio.emit(response);
        });

      },
      error: (error) => {
        if (error?.error?.errors) {
          this.validationErrors = error.error.errors;
        }
        this.tipoEstudioForm.enable();
      },
    });
  }

  validarEntero(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  updateTipoEstudio() {
    const id = this.tipoEstudio?.id;
    const data = this.tipoEstudioForm.value;

    if (id) {
      this.tipoEstudioService.updateTipoEstudio(id, data).subscribe({
        next: (response) => {
          this.validationErrors = {};
          this.close();
          this.tipoEstudioForm.reset();
          Swal.fire({
            icon: 'success',
            title: 'Solicitud Actualizada',
            text: 'La solicitud ha sido actualizada correctamente.',
            confirmButtonColor: '#3085d6',
          }).then(() => {
            this.saveTipoEstudio.emit(response);
          });
        },
        error: (error) => {
          if (error?.error?.errors) {
            this.validationErrors = error.error.errors;
          }
          this.tipoEstudioForm.enable();
        },
      });
    }
  }


  close() {
    this.tipoEstudioForm.reset();
    this.tipoEstudioForm.enable();
    this.closeModal.emit();
  }
}
