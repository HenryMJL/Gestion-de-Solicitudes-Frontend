import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoEstudioService {
  private apiUrl = environment.apiUrl + 'tipo-estudios';

  constructor(private http: HttpClient) {}

  getTiposEstudio(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  showTipoEstudio(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createTipoEstudio(data: { nombre: string; descripcion: string; precio: number }): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateTipoEstudio(id: number, data: { nombre: string; descripcion: string; precio: number }): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteTipoEstudio(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
