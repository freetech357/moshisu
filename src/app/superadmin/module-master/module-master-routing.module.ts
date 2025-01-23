import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { authGuard } from '../../guards/auth.guard';

const routes: Routes = [
  {
    path: 'superadmin/portal/module-master',
    component: ListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'superadmin/portal/module-master/add',
    component: AddComponent,
    canActivate: [authGuard]
  },
  {
    path: 'superadmin/portal/module-master/edit/:id',
    component: EditComponent,
    canActivate: [authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuleMasrterRoutingModule { }
