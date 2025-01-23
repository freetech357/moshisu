import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SuperadminModule } from './superadmin/superadmin.module';
import { HeaderComponent as SuperAdminHeaderComponent } from './superadmin/common/header/header.component';
import { SidebarComponent as SuperAdminSidebarComponent } from './superadmin/common/sidebar/sidebar.component';
import { FooterComponent as SuperAdminFooterComponent } from './superadmin/common/footer/footer.component';
import { WebModule } from './web/web.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AuthService } from './services/auth.service';
import {UserModule} from "./user/user.module";
import {HeaderComponent as UserHeaderComponent} from "./user/portal/common/header/header.component";
import {FooterComponent as UserFooterComponent} from "./user/portal/common/footer/footer.component";
import {SidebarComponent as UserSidebarComponent } from "./user/portal/common/sidebar/sidebar.component";
import {HeaderComponent as DepartmentHeaderComponent} from "./department/portal/common/header/header.component";
import {FooterComponent as DepartmentFooterComponent} from "./department/portal/common/footer/footer.component";
import {SidebarComponent as DepartmentSidebarComponent } from "./department/portal/common/sidebar/sidebar.component";
import { NgSelectModule } from '@ng-select/ng-select';
import { APP_BASE_HREF } from '@angular/common';
import { ValidationFormatDirective } from './directive/validation-format.directive';
import { ReadOnlyDirective } from './directive/read-only.directive';
import { DepartmentModule } from './department/department.module';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    AppComponent,
    SuperAdminHeaderComponent,
    SuperAdminSidebarComponent,
    SuperAdminFooterComponent,
    UserHeaderComponent,
    UserFooterComponent,
    UserSidebarComponent,
    DepartmentHeaderComponent,
    DepartmentFooterComponent,
    DepartmentSidebarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
      countDuplicates: false,
      progressBar: true,
      timeOut: 5000,
      progressAnimation: 'increasing',
      enableHtml: false,
      closeButton: true,
      positionClass: 'toast-top-center'
    }),
    SuperadminModule,
    UserModule,
    DepartmentModule,
    WebModule,
    NgSelectModule,
    NgxPaginationModule
  ],
  providers: [AuthService, {
    provide: APP_BASE_HREF,
    useValue: '/'
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
