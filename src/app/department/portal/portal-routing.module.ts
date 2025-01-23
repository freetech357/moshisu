import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import { departmentAuthGuard } from '../../guards/department-auth.guard';
import { HomeComponent } from '../../superadmin/account/home/home.component';

const routes: Routes = [
  {
    path:'department/portal/dashboard',
    component:DashboardComponent,
    canActivate:[departmentAuthGuard]
  },
  {
    path:'department/portal/account',
    component:HomeComponent,
    canActivate:[departmentAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortalRoutingModule { }
