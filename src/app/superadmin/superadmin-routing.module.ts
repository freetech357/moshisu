import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from '../guards/auth.guard';
import { HomeComponent } from './account/home/home.component';
import { AppLogsComponent } from './app-logs/app-logs.component';
import { RbacComponent } from './rbac/rbac.component';

const routes: Routes = [
  {
    path: 'superadmin/portal/dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'superadmin/portal/account',
    component: HomeComponent,
    canActivate: [authGuard]
  },
  {
    path: 'superadmin/portal/app-logs',
    component: AppLogsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'superadmin/portal/rbac',
    component: RbacComponent,
    canActivate: [authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperadminRoutingModule { }
