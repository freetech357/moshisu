import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { authGuard } from '../../guards/auth.guard';
import { PermissionComponent } from './permission/permission.component';

const routes: Routes = [
  {
    path: 'superadmin/portal/user-role',
    component: ListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'superadmin/portal/user-role/add',
    component: AddComponent,
    canActivate: [authGuard]
  },
  {
    path: 'superadmin/portal/user-role/edit/:id',
    component: EditComponent,
    canActivate: [authGuard]
  },
  {
    path: 'superadmin/portal/user-role/permission/:id',
    component: PermissionComponent,
    canActivate: [authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoleRoutingModule { }
