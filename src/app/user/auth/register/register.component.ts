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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm = new FormGroup({
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    mobile_no: new FormControl('', [Validators.required]),
  });

  getMobileNoErrorMessage() {
    const mobileNoControl: any = this.registerForm.get('mobile_no');
    if (mobileNoControl.hasError('required')) {
      return 'Mobile number is required';
    } else if (mobileNoControl.hasError('pattern')) {
      return 'Please enter a valid 10-digit mobile number starting with 6-9';
    }
    return '';
  }


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
      this.registerForm.patchValue({
        first_name: '',
        last_name: '',
        mobile_no: '',
      });
      this.formService.unTriggerFormValidation(this.registerForm);
    }, 1000);
    this.storageService.deleteAllItems();
  }
  submitForm() {
    if (this.registerForm.status === 'INVALID') {
      this.formService.triggerFormValidation(this.registerForm);
      return;
    }
    this.isFormSubmitInProgress = true;

    this.httpClient.post(`${this.appService.baseUrl}/auth/signup`, {
      first_name: this.registerForm.value.first_name?.toString().trim(),
      last_name: this.registerForm.value.last_name?.toString().trim(),
      mobile_number: this.registerForm.value.mobile_no?.toString().trim(),
    }).subscribe(
      (response: any) => {
        this.isFormSubmitInProgress = false;
        this.storageService.deleteAllItems();
        this.storageService.addItem('otp_token', response.otp_token);
        this.storageService.addItem('otp_expires_at', response.otp_expires_at);
        this.storageService.addItem('mobile_number', response.mobile_number);
        this.toastService.success(response.message);
        this.router.navigate(['/otp']);
      },
      error => {
        this.isFormSubmitInProgress = false;
        this.toastService.error(error.error.message);
      }
    );
  }
}
