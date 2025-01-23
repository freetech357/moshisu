import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormService } from '../../../services/form.service';
import { HttpClient } from '@angular/common/http';
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
    email: new FormControl('', [Validators.required, Validators.email]),
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
        email: '',
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
    this.isFormSubmitInProgress = true;

    this.httpClient.post(`${this.appService.baseUrl}/auth/department-login`, {
      email: this.loginForm.value.email?.trim(),
      password: this.loginForm.value.password?.trim()
    }).subscribe(
      (response: any) => {
        this.isFormSubmitInProgress = false;
        this.authService.storeUserDetails(response.token, response.user);
        this.storageService.deleteAllItems();
        this.storageService.addItem('token', response.token);
        this.storageService.addItem('user', response.user);
        this.router.navigate(['/department/portal/dashboard']);
      },
      error => {
        this.isFormSubmitInProgress = false;
        this.toastService.error(error.error.message);
      }
    );
  }

}
