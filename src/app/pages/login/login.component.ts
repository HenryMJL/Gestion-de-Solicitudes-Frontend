import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  validationErrors: any = {};

  constructor(private authService: AuthService, private router: Router) { }
  login(event?: Event) {
    if (event) {
      event.preventDefault();
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login Exitoso: ', response);
        this.validationErrors = {};
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error en Login: ', error);
        if (error.status === 422) {
          this.validationErrors = error.error.errors;
        } else {
          this.errorMessage = 'Error en el inicio de sesión.';
        }
      }
    });
  }

}
