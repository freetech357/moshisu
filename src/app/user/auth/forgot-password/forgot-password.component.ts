import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormService } from '../../../services/form.service';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../services/toast.service';
import { AppService } from '../../../services/app.service';
import { StorageService } from '../../../services/storage.service';
import { AuthService } from '../../../services/auth.service';
import { EncryptionService } from '../../../services/encryption.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  forgotPasswordForm = new FormGroup({
    phone: new FormControl('', [Validators.required])
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
    private authService: AuthService,
    private encryptionService: EncryptionService
  ) {}
  
  ngOnInit() {
    setTimeout(() => {
      this.forgotPasswordForm.patchValue({
        phone: ''
      });
      this.formService.unTriggerFormValidation(this.forgotPasswordForm);
    }, 1000);
    this.storageService.deleteAllItems();
  }
  submitForm() {
    if (this.forgotPasswordForm.status === 'INVALID') {
      this.formService.triggerFormValidation(this.forgotPasswordForm);
      return;
    }
    this.isFormSubmitInProgress = true;

    this.httpClient.post(`${this.appService.baseUrl}/auth/forgot-password`, {
      mobile_number: this.forgotPasswordForm.value.phone?.toString().trim(),
    }).subscribe(
      (response: any) => {
        this.isFormSubmitInProgress = false;
        this.storageService.deleteAllItems();
        this.storageService.addItem('reset_token', response.reset_token);
        this.storageService.addItem('otp_expires_at', response.otp_expires_at);
        this.router.navigate(['/reset-password']);
      },
      error => {
        this.isFormSubmitInProgress = false;
        this.toastService.error(error.error.message);
      }
    );
  }

}
