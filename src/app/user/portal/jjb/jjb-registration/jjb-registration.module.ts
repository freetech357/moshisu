import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JjbRegistrationRoutingModule } from './jjb-registration-routing.module';
import { SharedModule } from '../../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Form1Component } from './form-1/form-1.component';
import { Form2Component } from './form-2/form-2.component';
import { Form3Component } from './form-3/form-3.component';
import { Form4Component } from './form-4/form-4.component';
import { Form5Component } from './form-5/form-5.component';
import { ListComponent } from './list/list.component';
import { SuccessComponent } from './success/success.component';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    Form1Component,
    Form2Component,
    Form3Component,
    Form4Component,
    Form5Component,
    ListComponent,
    SuccessComponent
  ],
  imports: [
    CommonModule,
    JjbRegistrationRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ]
})
export class JjbRegistrationModule { }
