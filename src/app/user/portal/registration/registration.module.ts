import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrationRoutingModule } from './registration-routing.module';
import { ListComponent } from './list/list.component';
import { SucessComponent } from './sucess/sucess.component';
import { Form17AbComponent } from './form-17-ab/form-17-ab.component';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Form17CComponent } from './form-17-c/form-17-c.component';
import { Form17DComponent } from './form-17-d/form-17-d.component';
import { Form17EfComponent } from './form-17-ef/form-17-ef.component';
import { Form17GhijklmnComponent } from './form-17-ghijklmn/form-17-ghijklmn.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NavigationComponent } from './navigation/navigation.component';


@NgModule({
  declarations: [
    ListComponent,
    SucessComponent,
    Form17AbComponent,
    Form17CComponent,
    Form17DComponent,
    Form17EfComponent,
    Form17GhijklmnComponent,
    NavigationComponent
  ],
  imports: [
    CommonModule,
    RegistrationRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
  ]
})
export class RegistrationModule { }
