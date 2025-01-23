import { Component, ElementRef } from '@angular/core';
import {AuthService} from "../../../../services/auth.service";
import { StorageService } from '../../../../services/storage.service';
import { EncryptionService } from '../../../../services/encryption.service';
import { ModuleService } from '../../../../services/module.service';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../../../../services/app.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-user-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css','../../../../common.css']
})
export class SidebarComponent {

  userDetail: any = null;
  currentYear: any = '';
  allowedModules: any = [];
  isFormSubmitInProgress: boolean = false;
  states: any = [];
  districts: any = [];
  app_details: any= [];

  constructor(
    public authService: AuthService,
    private storageService: StorageService,
    private encryptionService: EncryptionService,
    public moduleService: ModuleService,
    private httpClient: HttpClient,
    private elementRef: ElementRef,
    private appService: AppService,
    private toastService: ToastService
  ) {}

  ngOnInit()
  {
    //this.fetchIsfinalSubmitted();
    this.userDetail = this.authService.userDetail;
    console.log("User Details",this.userDetail)
    this.currentYear = (new Date()).getFullYear();
    let permissions = this.storageService.getItem('permissions');
    permissions = this.encryptionService.decryptData(permissions);
    if (permissions && permissions.length > 0) {
      this.allowedModules = permissions.map((item: any) => +item.module_id);
    }
    this.refreshPermissions();
  }

  hasRoleId(roleId: number): boolean {
    return this.userDetail?.role?.some((role: any) => role.id === roleId);
  }

  ngAfterViewInit() {
    const sidebarMenus = this.elementRef.nativeElement.querySelectorAll('.nav-link');
    sidebarMenus.forEach((element: any) => {
      element.addEventListener('click', this.refreshPermissions.bind(this));
    });
  }

  refreshPermissions() {
    this.authService.validateUserToken();
    setTimeout(() => {
      let permissions = this.storageService.getItem('permissions');
      permissions = this.encryptionService.decryptData(permissions);
      //console.log(permissions);
      if (permissions && permissions.length > 0) {
        this.allowedModules = permissions.map((item: any) => +item.module_id);
      }
    }, 500);
  }

  // fetchIsfinalSubmitted(){
  //     this.httpClient.get(`${this.appService.baseUrl}/application//is-final-submitted`, {
  //       headers: {
  //         Authorization: this.authService.authToken
  //       }
  //     })
  //     .subscribe(
  //       (response: any) => {
  //         this.app_details = response.data;
  //       },
  //       error => {
  //         this.app_details = [];
  //         this.toastService.error(error.error.message);
  //       }
  //     );

  //   }
}
