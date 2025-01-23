import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormService } from '../../../services/form.service';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../../../services/app.service';
import { ToastService } from '../../../services/toast.service';
import { StorageService } from '../../../services/storage.service';
import { AuthService } from '../../../services/auth.service';
import { EncryptionService } from '../../../services/encryption.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { interval } from 'rxjs';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['../../../common.css','./otp.component.css']
})
export class OtpComponent {

  otpForm = new FormGroup({
    otp: new FormControl('', [Validators.required]),
  });
  isFormSubmitInProgress: boolean = false;
  isOTPResendInProgress: boolean = false;
  otpExpiresAt: string = this.storageService.getItem('otp_expires_at'); // Assign the API response's otp_expires_at here
  remainingTime: string = '';
  mobileNumber: string = '';
  maskedMobileNumber: string = '';

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
    //console.log(this.storageService.getItem('otp_token'));
    setTimeout(() => {
      this.otpForm.patchValue({
        otp: ''
      });
      this.formService.unTriggerFormValidation(this.otpForm);
    }, 1000);

    this.updateRemainingTime(); // Call the function initially

    // Set up an interval to update the remaining time every second
    const timer$ = interval(1000);
    timer$.subscribe(() => {
      this.updateRemainingTime();
    });

    this.mobileNumber = this.storageService.getItem('mobile_number');
    this.maskedMobileNumber = this.maskMobileNumber(this.mobileNumber);
    
  }

  maskMobileNumber(mobileNumber: string): string {
    if (mobileNumber && mobileNumber.length === 10) {
      return `${mobileNumber.substring(0, 2)}XXXXXX${mobileNumber.substring(8)}`;
    }
    return mobileNumber; // Return the original if it doesn't match the expected length
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


  resendOtp(){
    this.isOTPResendInProgress = true;
    this.httpClient.post(`${this.appService.baseUrl}/auth/resend-otp`, {
      otp_token: this.storageService.getItem('otp_token'),
    }).subscribe(
      (response: any) => {
        this.isOTPResendInProgress = false;
        this.storageService.addItem('otp_token', response.otp_token);
        this.storageService.addItem('otp_expires_at', response.otp_expires_at);
        this.otpExpiresAt = response.otp_expires_at;
        this.toastService.success(response.message);
        this.updateRemainingTime();
      },
      error => {
        this.isFormSubmitInProgress = false;
        this.toastService.error(error.error.message);
      }
    );
  }
  submitOTPForm() {

    if (this.otpForm.status === 'INVALID') {
      this.formService.triggerFormValidation(this.otpForm);
      return;
    }
    this.isFormSubmitInProgress = true;

    this.httpClient.post(`${this.appService.baseUrl}/auth/verify-otp`, {
      otp_token: this.storageService.getItem('otp_token'),
      otp: this.otpForm.value.otp?.toString().trim()
    }).subscribe(
      (response: any) => {
        this.isFormSubmitInProgress = false;
        this.authService.storeUserDetails(response.token, response.user);
        this.storageService.deleteAllItems();
        this.storageService.addItem('token', response.token);
        this.storageService.addItem('user', response.user);
        this.storageService.addItem('permissions', this.encryptionService.encryptData(response.permissions));
        this.router.navigate(['/portal/dashboard']);
      },
      error => {
        this.isFormSubmitInProgress = false;
        this.toastService.error(error.error.message);
      }
    );

  }

}
