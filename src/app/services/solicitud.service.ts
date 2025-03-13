import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  private apiUrl = environment.apiUrl + 'solicitudes';
  private conteoUrl = environment.apiUrl + 'solicitud';

  constructor(private http: HttpClient) { }

  getSolicitudes(estado?: string, tipoEstudio?: number) {
    let params: any = {};
    if (estado) params.estado = estado;
    if (tipoEstudio) params.tipoEstudio = tipoEstudio;

    return this.http.get<any[]>(this.apiUrl, { params });
  }

  showSolicitud(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createSolicitud(solicitud: any): Observable<any> {
    return this.http.post(this.apiUrl, solicitud);
  }

  updateSolicitud(id: number, solicitud: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, solicitud);
  }

  updateEstado(id: number, estado: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/estado`, { estado });
  }

  deleteSolicitud(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getConteoPorEstado(): Observable<any> {
    return this.http.get(`${this.conteoUrl}/conteo`);
  }
}
