import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {userAuthGuard} from "../../guards/user-auth.guard";

const routes: Routes = [
  {
    path:'portal/dashboard',
    component:DashboardComponent,
    canActivate:[userAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortalRoutingModule { }
