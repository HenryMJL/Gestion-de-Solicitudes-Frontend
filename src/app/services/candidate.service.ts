import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private apiUrl = environment.apiUrl + 'candidatos';

  constructor(private http: HttpClient) { }

  getCandidatos(page: number = 1, pageSize: number = 5): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}&pageSize=${pageSize}`);
  }

  showCandidato(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createCandidato(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateCandidato(id: number, data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteCandidato(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
