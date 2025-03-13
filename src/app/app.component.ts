import { Component } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { CustomMatPaginatorIntl } from '../environment/custom-mat-paginator-intl';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule,ReactiveFormsModule],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl }
  ],
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent { }
