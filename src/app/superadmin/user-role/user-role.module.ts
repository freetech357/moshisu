import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoleRoutingModule } from './user-role-routing.module';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { PermissionComponent } from './permission/permission.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    ListComponent,
    AddComponent,
    EditComponent,
    PermissionComponent
  ],
  imports: [
    CommonModule,
    UserRoleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule
  ]
})
export class UserRoleModule { }
