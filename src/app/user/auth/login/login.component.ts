import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormService } from '../../../services/form.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from '../../../services/app.service';
import { ToastService } from '../../../services/toast.service';
import { StorageService } from '../../../services/storage.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../../common.css', './login.component.css']
})
export class LoginComponent {

  hidePassword: boolean = true;

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  isFormSubmitInProgress: boolean = false;

  clientIpAddress: any = null;

  constructor(
    private router: Router,
    public formService: FormService,
    private httpClient: HttpClient,
    private appService: AppService,
    private toastService: ToastService,
    private storageService: StorageService,
    private authService: AuthService
  ) {}

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
  
  ngOnInit() {
    setTimeout(() => {
      this.loginForm.patchValue({
        username: '',
        password: ''
      });
      this.formService.unTriggerFormValidation(this.loginForm);
    }, 1000);
    this.storageService.deleteAllItems();
  }

  submitForm() {
    if (this.loginForm.status === 'INVALID') {
      this.formService.triggerFormValidation(this.loginForm);
      return;
    }
    const loginData = {
      username: this.loginForm.value.username?.trim(),
      password: this.loginForm.value.password?.trim()
    };
    //console.log(this.appService.baseUrl);
    this.isFormSubmitInProgress = true;
    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient.post(`${this.appService.baseUrl}login`, loginData, { headers }).subscribe(
      (response: any) => {
        // console.log(response);
        this.isFormSubmitInProgress = false;
        this.authService.storeUserDetails(response.token, response.data);
        this.storageService.deleteAllItems();
        this.storageService.addItem('token', response.token);
        this.storageService.addItem('user', response.data);
        this.router.navigate(['/portal/dashboard']);
      },
      error => {
        this.isFormSubmitInProgress = false;
        this.toastService.error(error.error.message);
      }
    );
  }

}



// import { Component } from '@angular/core';
// import {FormControl, FormGroup, Validators} from "@angular/forms";
// import {Router} from "@angular/router";
// import {FormService} from "../../../services/form.service";
// import {HttpClient} from "@angular/common/http";
// import {AppService} from "../../../services/app.service";
// import {ToastService} from "../../../services/toast.service";
// import {StorageService} from "../../../services/storage.service";
// import {AuthService} from "../../../services/auth.service";
// import { EncryptionService } from '../../../services/encryption.service';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['../../../common.css','./login.component.css']
// })
// export class LoginComponent {
//   loginForm = new FormGroup({
//     mobile_no: new FormControl('', [Validators.required]),
//   });

//   getMobileNoErrorMessage() {
//     const mobileNoControl: any = this.loginForm.get('mobile_no');
//     if (mobileNoControl.hasError('required')) {
//       return 'Mobile number is required';
//     } else if (mobileNoControl.hasError('pattern')) {
//       return 'Please enter a valid 10-digit mobile number starting with 6-9';
//     }
//     return '';
//   }

//   isFormSubmitInProgress: boolean = false;
//   clientIpAddress: any = null;
//   hidePassword: boolean = true;

//   constructor(
//     private router: Router,
//     public formService: FormService,
//     private httpClient: HttpClient,
//     private appService: AppService,
//     private toastService: ToastService,
//     private storageService: StorageService,
//     private authService: AuthService,
//     private encryptionService: EncryptionService
//   ) {}

//   togglePasswordVisibility(): void {
//     this.hidePassword = !this.hidePassword;
//   }
  
//   forgotPassword(){
//     this.router.navigate(['/forgot-password']);
//   }
//   ngOnInit() {
//     setTimeout(() => {
//       this.loginForm.patchValue({
//         mobile_no: '',
//       });
//       this.formService.unTriggerFormValidation(this.loginForm);
//     }, 1000);
//     this.storageService.deleteAllItems();
//   }
//   submitForm() {
//     if (this.loginForm.status === 'INVALID') {
//       this.formService.triggerFormValidation(this.loginForm);
//       return;
//     }
//     this.isFormSubmitInProgress = true;

//     this.httpClient.post(`${this.appService.baseUrl}/auth/login`, {
//       mobile_number: this.loginForm.value.mobile_no?.toString().trim(),
//     }).subscribe(
//       (response: any) => {
//         this.isFormSubmitInProgress = false;
//         this.storageService.deleteAllItems();
//         this.storageService.addItem('otp_token', response.otp_token);
//         this.storageService.addItem('otp_expires_at', response.otp_expires_at);
//         this.storageService.addItem('mobile_number', response.mobile_number);
//         this.toastService.success(response.message);
//         this.router.navigate(['/otp']);
//       },
//       error => {
//         this.isFormSubmitInProgress = false;
//         this.toastService.error(error.error.message);
//       }
//     );
//   }



// }
