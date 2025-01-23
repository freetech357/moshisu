import { ApplicationModule, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalRoutingModule } from './portal-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountModule } from '../../superadmin/account/account.module';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    PortalRoutingModule,
    AccountModule
  ]
})
export class PortalModule { }
