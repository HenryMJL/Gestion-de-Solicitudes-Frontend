import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LayoutComponent } from './components/layout/layout.component';
import { authGuard } from './guards/auth.guard';
import { CandidatesComponent } from './pages/candidates/candidates.component';
import { SolicitudComponent } from './pages/solicitud/solicitud.component';
import { TipoEstudioComponent } from './pages/tipoEstudio/tipo-estudio.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'candidates', component: CandidatesComponent },
      { path: 'solicitudes', component: SolicitudComponent },
      { path: 'tipo-estudio', component: TipoEstudioComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: '' }
];

