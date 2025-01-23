import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterRoutingModule } from './master-routing.module';
import { HomeComponent } from './home/home.component';
import { StateModule } from './state/state.module';
import { DistrictModule } from './district/district.module';
import { BlockModule } from './block/block.module';
import { AuthModule } from '../auth/auth.module';
import { CwcModule } from './cwc/cwc.module';
import { JjbModule } from './jjb/jjb.module';
import { OrganisationModule } from './organisation/organisation.module';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    MasterRoutingModule,
    AuthModule,
    StateModule,
    DistrictModule,
    BlockModule,
    CwcModule,
    JjbModule,
    OrganisationModule,
    NgxPaginationModule
  ]
})
export class MasterModule { }
