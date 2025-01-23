import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import {AuthModule} from "./auth/auth.module";
import {PortalModule} from "./portal/portal.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { CheckboxModule } from 'primeng/checkbox';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UserRoutingModule,
    AuthModule,
    PortalModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CheckboxModule
  ]
})
export class UserModule { }
