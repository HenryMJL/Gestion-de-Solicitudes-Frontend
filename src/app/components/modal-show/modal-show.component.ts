import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-show',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-show.component.html',
  styleUrl: './modal-show.component.css'
})
export class ModalShowComponent {
  @Input() data: Record<string, unknown> = {};
  @Input() columnConfig: Record<string, string> = {};
  @Input() columnOrder: string[] = [];
  @Input() isVisible: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Input() title: string = 'Detalles';

  cerrarModal() {
    this.closeModal.emit();
  }
}
