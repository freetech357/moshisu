import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageUsersRoutingModule } from './manage-users-routing.module';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    ListComponent,
    AddComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    ManageUsersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgSelectModule
  ]
})
export class ManageUsersModule { }
