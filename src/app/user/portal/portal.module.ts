import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalRoutingModule } from './portal-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegistrationModule } from './registration/registration.module';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JjbModule } from './jjb/jjb.module';
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    PortalRoutingModule,
    RegistrationModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    JjbModule,
    CheckboxModule
  ]
})
export class PortalModule { }
