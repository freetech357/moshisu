import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JjbRoutingModule } from './jjb-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JjbRegistrationModule } from './jjb-registration/jjb-registration.module';
import { CheckboxModule } from 'primeng/checkbox';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    JjbRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    JjbRegistrationModule,
    CheckboxModule
  ]
})
export class JjbModule { }
