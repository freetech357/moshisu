import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuperadminRoutingModule } from './superadmin-routing.module';
import { AuthModule } from './auth/auth.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MasterModule } from './master/master.module';
import { AccountModule } from './account/account.module';
import { UserRoleModule } from './user-role/user-role.module';
import { ManageUsersModule } from './manage-users/manage-users.module';
import { ActivityLogModule } from './activity-log/activity-log.module';
import { AppLogsComponent } from './app-logs/app-logs.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RbacComponent } from './rbac/rbac.component';
import { ModuleMaster } from './module-master/module-master.module';

@NgModule({
  declarations: [
    DashboardComponent,
    AppLogsComponent,
  ],
  imports: [
    CommonModule,
    SuperadminRoutingModule,
    AuthModule,
    MasterModule,
    UserRoleModule,
    ManageUsersModule,
    AccountModule,
    UserRoleModule,
    ActivityLogModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ModuleMaster
  ]
})
export class SuperadminModule { }
