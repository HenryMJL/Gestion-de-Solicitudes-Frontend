import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-estado',
  standalone: true,
  templateUrl: './change-estado.component.html',
  styleUrls: ['./change-estado.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class ChangeEstadoComponent implements OnInit {
  @Input() isVisible = false;
  @Input() solicitud: any = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() estadoActualizado = new EventEmitter<any>();

  estadoForm!: FormGroup;
  errorMessage = '';

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.estadoForm = this.fb.group({
      estado: [this.solicitud?.estado || 'pendiente', Validators.required]
    });
  }

  submit(): void {
    if (this.estadoForm.invalid) {
      return;
    }
    const estadoActualizado = {
      ...this.solicitud,
      estado: this.estadoForm.value.estado
    };
    this.estadoActualizado.emit(estadoActualizado);
    this.cerrarModal();
  }

  cerrarModal(): void {
      this.closeModal.emit();
  }
}
