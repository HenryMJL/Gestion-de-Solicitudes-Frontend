import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { CandidateService } from '../../services/candidate.service';
import { SwalDeleteService } from '../../services/swal-delete.service';
import { ModalShowComponent } from '../../components/modal-show/modal-show.component';
import { CandidateFormComponent } from './candidate-form/candidate-form.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-candidates',
  standalone: true,
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    ReactiveFormsModule,
    ModalShowComponent,
    CandidateFormComponent,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule
  ]
})
export class CandidatesComponent implements OnInit {
  displayedColumns: string[] = ['nombre', 'apellido', 'documento_identidad', 'correo', 'telefono', 'fecha_creacion', 'acciones'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSeleccionada: any = null;
  modalVisible: boolean = false;
  modalTitle: string = '';
  isModalCreateVisible: boolean = false;
  isLoading = false;
  errorMessage = '';
  columnConfig: Record<string, string> = {
    nombre: 'Nombre',
    apellido: 'Apellido',
    documento_identidad: 'Documento de Identidad',
    correo: 'Correo Electrónico',
    telefono: 'Teléfono',
    fecha_creacion: 'Fecha de Creación'
  };
  columnOrder: string[] = Object.keys(this.columnConfig);
  constructor(
    private candidateService: CandidateService,
    private cd: ChangeDetectorRef,
    private swalDeleteService: SwalDeleteService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.cargarCandidatos();
  }

  cargarCandidatos(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.candidateService.getCandidatos().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  nuevoCandidato(): void {
    this.isModalCreateVisible = true;
    this.dataSeleccionada = null;
    this.cd.detectChanges();
  }

  actualizarTabla(nuevoCandidato: any) {
    this.cargarCandidatos()
  }

  guardarCandidato(data: any) {
    if (data.id) {
      this.candidateService.updateCandidato(data.id, data).subscribe({
        next: (response) => {
          this.isModalCreateVisible = false;
          this.actualizarTabla(response.candidato);
        },
        error: (error) => {
          console.error('Error al actualizar candidato:', error);
          this.errorMessage = error.message;
        }
      });
    } else {
      this.candidateService.createCandidato(data).subscribe({
        next: (response) => {
          this.isModalCreateVisible = false;
          if (response && response.candidato) {
            this.actualizarTabla(response.candidato);
          } else {
            console.error("🚨 Error: Respuesta inesperada del servidor", response);
          }
        },
        error: (error) => {
          console.error('Error al agregar candidato:', error);
          this.errorMessage = error.message;
        }
      });
    }
  }

  actualizarCandidato(candidato: any): void {
    this.dataSeleccionada = { ...candidato };
    this.isModalCreateVisible = true;
    this.cd.detectChanges();
  }


  cerrarModal() {
    this.isModalCreateVisible = false;
    this.cd.detectChanges();
  }

  verCandidato(candidatoId: number): void {
    this.modalVisible = true;
    this.modalTitle = 'Detalles del Candidato';
    this.dataSeleccionada = null;

    this.candidateService.showCandidato(candidatoId).subscribe({
      next: (candidato) => this.dataSeleccionada = candidato,
      error: (err) => {
        console.error('Error al obtener detalles del candidato:', err);
        this.cerrarModal();
      },
    });
  }

  eliminarCandidato(candidato: any): void {
    this.swalDeleteService.confirmarEliminacion(`Se eliminará a ${candidato.nombre}. ¡Esta acción no se puede deshacer!`)
      .then((confirmado) => {
        if (confirmado) {
          this.candidateService.deleteCandidato(candidato.id).subscribe({
            next: () => {
              this.dataSource.data = this.dataSource.data.filter((c: any) => c.id !== candidato.id);
              this.swalDeleteService.mostrarExito('El candidato ha sido eliminado exitosamente.');
            },
            error: (error) => {
              console.error('Error al eliminar candidato:', error);
              this.swalDeleteService.mostrarError('No se pudo eliminar el candidato.');
            },
          });
        }
      });
  }
}
