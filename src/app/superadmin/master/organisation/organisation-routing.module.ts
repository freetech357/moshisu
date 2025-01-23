import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { authGuard } from '../../../guards/auth.guard';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [
  {
    path: 'superadmin/portal/master/organisation',
    component: ListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'superadmin/portal/master/organisation/add',
    component: AddComponent,
    canActivate: [authGuard]
  },
  {
    path: 'superadmin/portal/master/organisation/edit/:id',
    component: EditComponent,
    canActivate: [authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganisationRoutingModule { }
