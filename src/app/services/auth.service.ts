import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from './app.service';
import { ToastService } from './toast.service';
import { EncryptionService } from './encryption.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authToken: any = '';
  userDetail: any = {};
  isAuthenticated: boolean = false;
  permissions: any = null;

  constructor(
    private router: Router,
    private storageService: StorageService,
    private httpClient: HttpClient,
    private appService: AppService,
    private toastService: ToastService,
    private encryptionService: EncryptionService
  ) {}

  storeUserDetails(token:any, userDetail: any) {
    this.authToken = token;
    this.userDetail = userDetail;
    this.isAuthenticated = true;
    console.log("user details:",this.userDetail)
  }

  isLoggedIn() {
    const authToken = this.storageService.getItem('token');
    const user = this.storageService.getItem('user');
    if (!authToken || !user) {
      this.redirectToLogin();
      return false;
    }
    if (authToken.trim().length === 0 || Object.keys(user).length === 0) {
      this.redirectToLogin();
      return false;
    }
    this.authToken = authToken;
    this.userDetail = user;
    this.isAuthenticated = true;
    this.validateToken();
    return true;
  }

  isUserLoggedIn() {
    const authToken = this.storageService.getItem('token');
    const user = this.storageService.getItem('user');
    if (!authToken || !user) {
      this.redirectToUserLogin();
      return false;
    }
    if (authToken.trim().length === 0 || Object.keys(user).length === 0) {
      this.redirectToUserLogin();
      return false;
    }
    this.authToken = authToken;
    this.userDetail = user;
    this.isAuthenticated = true;
    this.validateUserToken();
    return true;
  }

  validateToken() {
    this.isAuthenticated = true;
    // this.httpClient.post(`${this.appService.baseUrl}/superadmin/auth/validate-token`, {}, {
    //   headers: {
    //     Authorization: this.authToken
    //   }
    // }).subscribe(
    //   (response:any) => {
    //     if (response.user && Object.keys(response.user).length > 0) {
    //       this.isAuthenticated = true;
    //       return;
    //     }
    //     this.isAuthenticated = false;
    //     this.userDetail = {};
    //     this.authToken = '';
    //     this.toastService.error(response.message);
    //     this.redirectToLogin();
    //   },
    //   (error: any) => {
    //     this.isAuthenticated = false;
    //     this.userDetail = {};
    //     this.authToken = '';
    //     this.toastService.error(error.error.message);
    //     this.redirectToLogin();
    //   }
    // );
  }


  validateUserToken(){
    this.isAuthenticated = true;
    // this.httpClient.post(`${this.appService.baseUrl}/auth/validate-token`, {}, {
    //   headers: {
    //     Authorization: this.authToken
    //   }
    // }).subscribe(
    //   (response:any) => {
    //     if (response.permissions) {
    //       this.permissions = response.permissions;
    //       const encryptedPermissions = this.encryptionService.encryptData(response.permissions);
    //       this.storageService.addItem('permissions', encryptedPermissions);
    //     }
    //     if (response.user && Object.keys(response.user).length > 0) {
    //       this.isAuthenticated = true;
    //       return;
    //     }
    //     this.isAuthenticated = false;
    //     this.userDetail = {};
    //     this.authToken = '';
    //     this.toastService.error(response.message);
    //     this.redirectToUserLogin();
    //   },
    //   (error: any) => {
    //     this.isAuthenticated = false;
    //     this.userDetail = {};
    //     this.authToken = '';
    //     this.toastService.error(error.error.message);
    //     this.redirectToUserLogin();
    //   }
    // );
  }

  redirectToLogin() {
    const token = this.storageService.getItem('token');
    console.log(token)
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient.post(`${this.appService.baseUrl}logout`,{headers}).subscribe(
      (response: any) => {
        this.toastService.success(response.message);
      },
      error => {
        this.toastService.error(error.error.message);
      }
    );
    this.userDetail = {};
    this.authToken = '';
    this.storageService.deleteAllItems();
    return this.router.navigate(['/superadmin/login']);
  }

  redirectToUserLogin() {

    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}}`);
     console.log(headers)
     this.httpClient.post(`${this.appService.baseUrl}logout`, { headers })
    .subscribe(
      (response: any) => {
        this.toastService.success(response.message);
      },
      error => {
        this.toastService.error(error.error.message);
      }
    );
    this.userDetail = {};
    this.authToken = '';
    this.storageService.deleteAllItems();
    return this.router.navigate(['/login']);
  }

  
  isDepartmentLoggedIn() {
    const authToken = this.storageService.getItem('token');
    const user = this.storageService.getItem('user');
    if (!authToken || !user) {
      this.redirectToDepartmentLogin();
      return false;
    }
    if (authToken.trim().length === 0 || Object.keys(user).length === 0) {
      this.redirectToDepartmentLogin();
      return false;
    }
    this.authToken = authToken;
    this.userDetail = user;
    this.isAuthenticated = true;
    this.validateDepartmentToken();
    return true;
  }


  validateDepartmentToken() {
    this.httpClient.post(`${this.appService.baseUrl}/auth/validate-token`, {}, {
      headers: {
        Authorization: this.authToken
      }
    }).subscribe(
      (response:any) => {
        if (response.user && Object.keys(response.user).length > 0) {
          this.isAuthenticated = true;
          return;
        }
        this.isAuthenticated = false;
        this.userDetail = {};
        this.authToken = '';
        this.toastService.error(response.message);
        this.redirectToDepartmentLogin();
      },
      (error: any) => {
        this.isAuthenticated = false;
        this.userDetail = {};
        this.authToken = '';
        this.toastService.error(error.error.message);
        this.redirectToDepartmentLogin();
      }
    );
  }

  redirectToDepartmentLogin() {
    this.httpClient.post(`${this.appService.baseUrl}/auth/logout`, {}, {
      headers: {
        Authorization: `Bearer ${this.authToken}`
      }
    }).subscribe(
      (response: any) => {
        this.toastService.success(response.message);
      },
      error => {
        this.toastService.error(error.error.message);
      }
    );
    this.userDetail = {};
    this.authToken = '';
    this.storageService.deleteAllItems();
    return this.router.navigate(['/department/login']);
  }


}
