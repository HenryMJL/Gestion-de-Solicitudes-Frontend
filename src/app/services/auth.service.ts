import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environment/environment';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'auth_token';
  private userKey = 'user_name';

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { email, password };

    return this.http.post<{ access_token: string; user: { name: string } }>(
      this.apiUrl + 'login',
      body,
      { headers }
    ).pipe(
      tap(response => {
        if (response.access_token) {
          this.storeUserData(response.access_token, response.user.name);
          this.router.navigate(['/dashboard']);
        } else {
          console.warn('No se recibió un access_token en la respuesta.');
        }
      }),
      catchError(error => {
        console.error('Error en el login:', error);
        return throwError(() => new Error('Error en el inicio de sesión'));
      })
    );
  }

  private storeUserData(token: string, userName: string): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, userName);
  }

  getUserName(): string | null {
    return localStorage.getItem(this.userKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(`${this.apiUrl}logout`, {}, { headers }).pipe(
      tap(() => {
        this.clearSession();
      }),
      catchError(error => {
        console.error('Error al cerrar sesión:', error);
        return throwError(() => new Error('Error en el cierre de sesión'));
      })
    );
  }

  cerrarSesionConConfirmacion(): void {
    Swal.fire({
      title: 'Cerrar sesión',
      text: '¿Estás seguro de que deseas cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.logout().subscribe({
          next: () => {
            Swal.fire('Sesión cerrada', 'Has cerrado sesión correctamente.', 'success');
            this.router.navigate(['/']);
          },
          error: () => {
            Swal.fire('Error', 'No se pudo cerrar sesión.', 'error');
          }
        });
      }
    });
  }

  clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.router.navigate(['/']);
  }
}
