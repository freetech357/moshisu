import { Component, ElementRef } from '@angular/core';
import {AuthService} from "../../../../services/auth.service";
import { StorageService } from '../../../../services/storage.service';
import { EncryptionService } from '../../../../services/encryption.service';
import { ModuleService } from '../../../../services/module.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-department-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css','../../../../common.css']
})
export class SidebarComponent {

  userDetail: any = null;
  currentYear: any = '';
  allowedModules: any = [];

  constructor(
    public authService: AuthService,
    private storageService: StorageService,
    private encryptionService: EncryptionService,
    public moduleService: ModuleService,
    private httpClient: HttpClient,
    private elementRef: ElementRef
  ) {}

  ngOnInit()
  {
    this.userDetail = this.authService.userDetail;
    this.currentYear = (new Date()).getFullYear();
    let permissions = this.storageService.getItem('permissions');
    permissions = this.encryptionService.decryptData(permissions);
    if (permissions && permissions.length > 0) {
      this.allowedModules = permissions.map((item: any) => +item.module_id);
    }
    this.refreshPermissions();
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
}
