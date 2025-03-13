import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  userName: string | null = '';
  sidebarCollapsed = false;
  sections: { [key: string]: boolean } = {
    dashboard: true,
    solicitudes: false,
    parametros: false
  };

  constructor(private router: Router, private authService: AuthService) {
    this.userName = localStorage.getItem('user_name');
  }

  logout() { this.authService.cerrarSesionConConfirmacion(); }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleSection(section: string) {
    if (this.sections.hasOwnProperty(section)) {
      this.sections[section] = !this.sections[section];
    }
  }
}
