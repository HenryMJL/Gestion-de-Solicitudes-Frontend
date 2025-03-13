import { Component, OnInit } from '@angular/core';
import { ChartData, ChartType, ChartOptions } from 'chart.js';
import { SolicitudService } from '../../services/solicitud.service';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, NgChartsModule]
})
export class DashboardComponent implements OnInit {
  conteoSolicitudes: any[] = [];

  pieChartLabels: string[] = ['Pendiente', 'En Proceso', 'Completado'];
  pieChartData: ChartData<'pie'> = {
    labels: this.pieChartLabels,
    datasets: [{ data: [0, 0, 0] }]
  };
  pieChartType: 'pie' = 'pie';

  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Solicitudes por Estado',
        font: { size: 16 }
      }
    }
  };

  lineChartLabels: string[] = ['Pendiente', 'En Proceso', 'Completado'];
  lineChartData: ChartData<'line'> = {
    labels: this.lineChartLabels,
    datasets: [
      {
        label: 'Solicitudes por Estado',
        data: [0, 0, 0],
        borderColor: '#3e95cd',
        backgroundColor: 'rgba(62, 149, 205, 0.2)',
        pointBackgroundColor: '#3e95cd',
        fill: true
      }
    ]
  };
  lineChartType: 'line' = 'line';

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Solicitudes por Estado',
        font: { size: 16 }
      }
    }
  };

  constructor(private solicitudService: SolicitudService) { }

  ngOnInit(): void {
    this.solicitudService.getConteoPorEstado().subscribe(data => {
      if (!Array.isArray(data)) {
        console.error('Error: Se esperaba un array pero se recibió', data);
        return;
      }

      this.conteoSolicitudes = data;

      // Gráfico de Pastel
      this.pieChartData = {
        labels: this.pieChartLabels,
        datasets: [{
          data: this.pieChartLabels.map(label => {
            const item = data.find(d => d.estado_legible.toLowerCase() === label.toLowerCase());
            return item ? item.total : 0;
          }),
          backgroundColor: ['#ffc107', '#007bff', '#28a745']
        }]
      };

      // Gráfico de Líneas
      this.lineChartData = {
        labels: this.lineChartLabels,
        datasets: [{
          label: 'Solicitudes por Estado',
          data: this.lineChartLabels.map(label => {
            const item = data.find(d => d.estado_legible.toLowerCase() === label.toLowerCase());
            return item ? item.total : 0;
          }),
          borderColor: '#3e95cd',
          backgroundColor: 'rgba(62, 149, 205, 0.2)',
          pointBackgroundColor: '#3e95cd',
          fill: true
        }]
      };
    });
  }

  getCardClass(estado: string): string {
    const colores: { [key: string]: string } = {
      'pendiente': 'bg-warning',
      'en_proceso': 'bg-primary',
      'completado': 'bg-success'
    };
    return colores[estado] || 'bg-secondary';
  }

  onChartClick(event: any): void {
    console.log('Gráfico actualizado:', event);
  }
}
