import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../../guards/auth.guard';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [
  {
    path: 'superadmin/portal/master/district',
    component: ListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'superadmin/portal/master/district/add',
    component: AddComponent,
    canActivate: [authGuard]
  },
  {
    path: 'superadmin/portal/master/district/edit/:id',
    component: EditComponent,
    canActivate: [authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DistrictRoutingModule { }
