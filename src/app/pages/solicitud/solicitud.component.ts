import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SolicitudService } from '../../services/solicitud.service';
import { SwalDeleteService } from '../../services/swal-delete.service';
import { ModalShowComponent } from '../../components/modal-show/modal-show.component';
import { SolicitudFormComponent } from './solicitud-form/solicitud-form.component';
import { ChangeEstadoComponent } from './ChangeEstadoComponent/change-estado.component';

@Component({
  selector: 'app-solicitud',
  standalone: true,
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.css'],
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
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    FormsModule,
    SolicitudFormComponent,
    ChangeEstadoComponent
  ]
})
export class SolicitudComponent implements OnInit {
  displayedColumns: string[] = ['candidato', 'tipo_estudio', 'fecha_solicitud', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  isLoading = false;
  dataSeleccionada: any = null;
  isModalCreateVisible = false;
  modalVisible: boolean = false;
  modalTitle: string = '';
  estadosDisponibles: string[] = [];
  tiposEstudioDisponibles: { id: number; nombre: string }[] = [];
  filtroEstado: string = '';
  filtroTipoEstudio: number | null = null;
  validationErrors: any = null;
  errorMessage: string = '';
  columnConfig: Record<string, string> = {
    nombre_completo: 'Candidato',
    nombre_tipo_estudio: 'Tipo Estudio',
    estado_legible: 'Estado',
    fecha_solicitud: 'Fecha Solicitud'
  };
  columnOrder: string[] = Object.keys(this.columnConfig);
  isModalEstadoVisible = false;
  solicitudSeleccionada: any = null;

  constructor(
    private solicitudService: SolicitudService,
    private cd: ChangeDetectorRef,
    private swalDeleteService: SwalDeleteService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.cargarSolicitudes();
    this.configurarFiltroTabla();
  }

  cargarSolicitudes(): void {
    this.isLoading = true;
    this.solicitudService.getSolicitudes(this.filtroEstado, this.filtroTipoEstudio ?? undefined)
      .subscribe({
        next: (data) => {
          this.dataSource.data = data;
          this.estadosDisponibles = [...new Set(data.map((item: any) => item.estado))];
          this.tiposEstudioDisponibles = [
            ...new Map(data.filter((item: any) => item.tipo_estudio)
              .map((item: any) => [item.tipo_estudio.id, item.tipo_estudio])).values()
          ];
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (error) => console.error('Error al cargar solicitudes:', error),
        complete: () => this.isLoading = false
      });
  }

  actualizarSolicitud(solicitud: any): void {
    this.dataSeleccionada = { ...solicitud };
    this.isModalCreateVisible = true;
    this.cd.detectChanges();
  }

  configurarFiltroTabla(): void {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const estadoCoincide = this.filtroEstado ? data.estado === this.filtroEstado : true;
      const tipoEstudioCoincide = this.filtroTipoEstudio ? data.tipo_estudio.nombre === this.filtroTipoEstudio : true;
      return estadoCoincide && tipoEstudioCoincide;
    };
  }

  actualizarFiltro(): void {
    this.dataSource.filter = JSON.stringify({ estado: this.filtroEstado, tipo: this.filtroTipoEstudio });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    this.dataSource.paginator?.firstPage();
  }

  nuevaSolicitud(): void {
    this.dataSeleccionada = null;
    this.dataSeleccionada = this.dataSeleccionada || { candidato_id: null, tipo_estudio_id: null, estado: 'pendiente' };
    this.isModalCreateVisible = true;
    this.cd.detectChanges();
  }

  abrirModal(solicitud?: any): void {
    this.dataSeleccionada = solicitud ? { ...solicitud } : { candidato_id: null, tipo_estudio_id: null, estado: 'pendiente' };
    this.isModalCreateVisible = true;
    this.cd.detectChanges();
  }

  abrirModalEstado(solicitud: any): void {
    this.solicitudSeleccionada = solicitud;
    this.isModalEstadoVisible = true;
    this.cd.detectChanges();
  }

  cerrarModalEstado(): void {
    this.isModalEstadoVisible = false;
    this.solicitudSeleccionada = null;
    this.cd.detectChanges();
  }

  actualizarEstadoSolicitud(event: any): void {
    console.log(event);
    const solicitudActualizada = { ...this.dataSeleccionada, id: event.id, estado: event.estado };
    console.log(solicitudActualizada);

    this.solicitudService.updateEstado(solicitudActualizada.id, solicitudActualizada.estado).subscribe({
      next: () => {
        this.cerrarModalEstado();
        this.cargarSolicitudes();
      },
      error: (err) => {
        console.error('Error al actualizar la solicitud:', err);
      }
    });
  }


  verSolicitud(solicitudId: number): void {
    this.modalVisible = true;
    this.modalTitle = 'Detalles de la Solicitud';
    this.dataSeleccionada = null;

    this.solicitudService.showSolicitud(solicitudId).subscribe({
      next: (solicitud) => {
        this.dataSeleccionada = {
          ...solicitud,
          candidato: solicitud.candidato || { nombre: 'Desconocido', apellido: '' }
        };
      },
      error: (err) => {
        console.error('Error al obtener detalles de la solicitud:', err);
        this.cerrarModal();
      }
    });
  }

  eliminarSolicitud(solicitud: any): void {
    this.swalDeleteService.confirmarEliminacion(`Se eliminará la solicitud ${solicitud.codigo}. ¡Esta acción no se puede deshacer!`)
      .then((confirmado) => {
        if (confirmado) {
          this.solicitudService.deleteSolicitud(solicitud.id).subscribe({
            next: () => {
              this.dataSource.data = this.dataSource.data.filter((s: any) => s.id !== solicitud.id);
              this.swalDeleteService.mostrarExito('Solicitud eliminada.');
            },
            error: () => this.swalDeleteService.mostrarError('Error al eliminar la solicitud.')
          });
        }
      });
  }

  actualizarTabla(): void {
    this.cargarSolicitudes();
    this.cerrarModal();
  }

  cerrarModal(): void {
    this.isModalCreateVisible = false;
    this.cd.detectChanges();
  }

  limpiarFiltros(): void {
    this.filtroEstado = '';
    this.filtroTipoEstudio = null;
    this.actualizarFiltro();
  }
}
