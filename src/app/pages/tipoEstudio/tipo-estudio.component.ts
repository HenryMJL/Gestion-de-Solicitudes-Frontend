import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TipoEstudioService } from '../../services/tipo-estudio.service';
import { SwalDeleteService } from '../../services/swal-delete.service';
import { TipoEstudioFormComponent } from './tipo-estudio-form/tipo-estudio-form.component';
import { ModalShowComponent } from '../../components/modal-show/modal-show.component';

@Component({
  selector: 'app-tipo-estudio',
  standalone: true,
  templateUrl: './tipo-estudio.component.html',
  styleUrls: ['./tipo-estudio.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    FormsModule,
    TipoEstudioFormComponent,
    ModalShowComponent
  ]
})
export class TipoEstudioComponent implements OnInit {
  displayedColumns: string[] = ['nombre', 'descripcion', 'precio', 'acciones'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  isLoading = false;
  dataSeleccionada: any = null;
  modalVisible: boolean = false;
  modalTitle: string = '';
  tipoEstudioSeleccionado: any = null;
  isModalCreateVisible = false;
  columnConfig: Record<string, string> = {
    nombre: 'Nombre',
    descripcion: 'Descripcion',
    precio: 'Precio',
  };
  columnOrder: string[] = Object.keys(this.columnConfig);

  constructor(
    private tipoEstudioService: TipoEstudioService,
    private cd: ChangeDetectorRef,
    private swalDeleteService: SwalDeleteService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.cargarTiposEstudio();
  }

  cargarTiposEstudio(): void {
    this.isLoading = true;
    this.tipoEstudioService.getTiposEstudio()
      .subscribe({
        next: (data) => {
          this.dataSource.data = data;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (error) => console.error('Error al cargar tipos de estudio:', error),
        complete: () => this.isLoading = false
      });
  }

  actualizarSolicitud(tipoEstudio: any): void {
    this.dataSeleccionada = { ...tipoEstudio };
    this.isModalCreateVisible = true;
    this.cd.detectChanges();
  }

  nuevoTipoEstudio(): void {
    this.tipoEstudioSeleccionado = null;
    this.isModalCreateVisible = true;
    this.cd.detectChanges();
  }

  onSaveTipoEstudio(tipoEstudio: any): void {
    this.cargarTiposEstudio();
    this.cerrarModal();
  }

  editarTipoEstudio(tipoEstudio: any): void {
    this.tipoEstudioSeleccionado = { ...tipoEstudio };
    this.isModalCreateVisible = true;
    this.cd.detectChanges();
  }

  abrirModal(tipoEstudio?: any): void {
    this.dataSeleccionada = tipoEstudio ? { ...tipoEstudio } : { candidato_id: null, tipo_estudio_id: null, estado: 'pendiente' };
    this.isModalCreateVisible = true;
    this.cd.detectChanges();
  }

  verTipoEstudio(tipoEstudioId: number): void {
    this.modalVisible = true;
    this.modalTitle = 'Detalles del tipo Estudio';
    this.dataSeleccionada = null;

    this.tipoEstudioService.showTipoEstudio(tipoEstudioId).subscribe({
      next: (tipoEstudio) => {
        this.dataSeleccionada = {
          ...tipoEstudio,
          candidato: tipoEstudio.candidato || { nombre: 'Desconocido', apellido: '' }
        };
      },
      error: (err) => {
        console.error('Error al obtener detalles de la tipoEstudio:', err);
        this.cerrarModal();
      }
    });
  }

  eliminarTipoEstudio(tipoEstudio: any): void {
    this.swalDeleteService.confirmarEliminacion(`Se eliminará el tipo de estudio ${tipoEstudio.nombre}. ¡Esta acción no se puede deshacer!`)
      .then((confirmado) => {
        if (confirmado) {
          this.tipoEstudioService.deleteTipoEstudio(tipoEstudio.id).subscribe({
            next: () => {
              this.dataSource.data = this.dataSource.data.filter((t: any) => t.id !== tipoEstudio.id);
              this.swalDeleteService.mostrarExito('Tipo de estudio eliminado.');
            },
            error: () => this.swalDeleteService.mostrarError('Error al eliminar el tipo de estudio.')
          });
        }
      });
  }

  actualizarTabla(): void {
    this.cargarTiposEstudio();
    this.cerrarModal();
  }

  cerrarModal(): void {
    this.isModalCreateVisible = false;
    this.cd.detectChanges();
  }
}
