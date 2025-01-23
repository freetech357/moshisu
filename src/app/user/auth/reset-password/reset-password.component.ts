import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormService } from '../../../services/form.service';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../../../services/app.service';
import { ToastService } from '../../../services/toast.service';
import { StorageService } from '../../../services/storage.service';
import { AuthService } from '../../../services/auth.service';
import { EncryptionService } from '../../../services/encryption.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {

  resetPasswordForm = new FormGroup({
    otp: new FormControl('', [Validators.required]),
    new_password: new FormControl('', [Validators.required]),
    new_password_confirm: new FormControl('', [Validators.required]),
  });
  isFormSubmitInProgress: boolean = false;
  clientIpAddress: any = null;

  
  otpExpiresAt: string = this.storageService.getItem('otp_expires_at'); // Assign the API response's otp_expires_at here
  remainingTime: string = '';


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
    //console.log(this.storageService.getItem('otp_token'));
    setTimeout(() => {
      this.resetPasswordForm.patchValue({
        otp: '',
        new_password: '',
        new_password_confirm: ''
      });
      this.formService.unTriggerFormValidation(this.resetPasswordForm);
    }, 1000);

    this.updateRemainingTime(); // Call the function initially

    // Set up an interval to update the remaining time every second
    const timer$ = interval(1000);
    timer$.subscribe(() => {
      this.updateRemainingTime();
    });

  }

  updateRemainingTime() {
    // Parse the API response's otp_expires_at into a Date object
    const otpExpiresDate = new Date(this.otpExpiresAt);

    // Get the current time
    const currentTime = new Date();

    // Calculate the time difference in milliseconds
    const timeDifference = otpExpiresDate.getTime() - currentTime.getTime();

    if (timeDifference > 0) {
      // Convert the time difference to seconds
      const remainingSeconds = Math.floor(timeDifference / 1000);

      // Convert seconds to minutes and seconds
      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;

      // Display the remaining time
      this.remainingTime = `Expire in ${minutes} min : ${seconds} sec`;
    } else {
      // OTP has expired
      this.remainingTime = 'OTP has expired';
    }
  }

  submitResetPasswordForm() {

    if (this.resetPasswordForm.status === 'INVALID') {
      this.formService.triggerFormValidation(this.resetPasswordForm);
      return;
    }
    this.isFormSubmitInProgress = true;

    this.httpClient.post(`${this.appService.baseUrl}/auth/reset-password`, {
      reset_token: this.storageService.getItem('reset_token'),
      otp: this.resetPasswordForm.value.otp?.toString().trim(),
      new_password: this.resetPasswordForm.value.new_password?.toString().trim(),
      new_password_confirm: this.resetPasswordForm.value.new_password_confirm?.toString().trim()
    }).subscribe(
      (response: any) => {
        this.isFormSubmitInProgress = false;
        this.router.navigate(['/login']);
        this.toastService.success(response.message);
      },
      error => {
        this.isFormSubmitInProgress = false;
        this.toastService.error(error.error.message);
      }
    );

  }

}
