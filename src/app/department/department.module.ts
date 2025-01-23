import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentRoutingModule } from './department-routing.module';
import {AuthModule} from "./auth/auth.module";
import {PortalModule} from "./portal/portal.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DepartmentRoutingModule,
    AuthModule,
    PortalModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class DepartmentModule { }
