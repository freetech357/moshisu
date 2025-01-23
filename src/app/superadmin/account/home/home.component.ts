import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../../../services/app.service';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { FormService } from '../../../services/form.service';
import { ToastService } from '../../../services/toast.service';
import { DateService } from '../../../services/date.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../../../common.css', './home.component.css']
})
export class HomeComponent {

  changePasswordForm = new FormGroup({
    current_password: new FormControl('', [Validators.required]),
    new_password: new FormControl('', [Validators.required]),
    new_password_confirm: new FormControl('', [Validators.required]),
  });

  isChangePasswordFormInProgress: boolean = false;
  isActiveSessionFetchInProgress: boolean = false;

  activeSessions: any = [];

  constructor(
    private appService: AppService,
    public authService: AuthService,
    private httpClient: HttpClient,
    private formService: FormService,
    private toastService: ToastService,
    public dateService: DateService
  ) {}

  ngOnInit() {
    this.fetchActiveSessions();
  }

  changePassword() {
    if (this.changePasswordForm.status === 'INVALID') {
      this.formService.triggerFormValidation(this.changePasswordForm);
      return;
    }
    const currentPassword = this.changePasswordForm.value.current_password?.trim();
    const newPassword = this.changePasswordForm.value.new_password?.trim();
    const newPasswordConfirm = this.changePasswordForm.value.new_password_confirm?.trim();

    if (newPassword !== newPasswordConfirm) {
      this.toastService.warning('New password and Confirm new password does not match.');
      return;
    }

    this.isChangePasswordFormInProgress = true;

    this.httpClient.post(this.appService.baseUrl + '/account/update-password', {
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirm: newPasswordConfirm
    }, {
      headers: {
        Authorization: `Bearer ${this.authService.authToken}`
      }
    }).subscribe(
      (response: any) => {
        this.isChangePasswordFormInProgress = false;
        this.toastService.success(response.message);
      },
      error => {
        this.isChangePasswordFormInProgress = false;
        this.toastService.error(error.error.message);
      }
    );
  }

  fetchActiveSessions() {
    this.isActiveSessionFetchInProgress = true;
    this.httpClient.get(this.appService.baseUrl + '/account/active-devices', {
      headers: {
        Authorization: `Bearer ${this.authService.authToken}`
      }
    }).subscribe(
      (response: any) => {
        this.isActiveSessionFetchInProgress = false;
        this.activeSessions = response.data;
      },
      error => {
        this.isActiveSessionFetchInProgress = false;
        this.toastService.error(error.error.message);
      }
    );
  }

  removeDevice(tokenID: any) {
    Swal.fire({
      title: 'Remove Device?',
      text: 'Are you sure you want to remove the device? This action will sign out the active session on the selected device.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Remove it!',
      confirmButtonColor: '#16a34a',
      cancelButtonText: 'Cancel',
      cancelButtonColor: '#1f2937'
    }).then((result) => {
      if (result.isConfirmed) {
        this.httpClient.post(this.appService.baseUrl + '/account/remove-device', {
          token_id: tokenID
        }, {
          headers: {
            Authorization: `Bearer ${this.authService.authToken}`
          }
        }).subscribe(
          (response: any) => {
            this.fetchActiveSessions();
            this.toastService.success(response.message);
          },
          error => {
            this.toastService.error(error.error.message);
          }
        );
      }
    });
  }

  removeAllDevices() {
    Swal.fire({
      title: 'Remove All Devices?',
      text: 'Are you absolutely certain you want to remove all devices except the one currently in use? This action will sign out all active sessions except for the one on this device.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Remove All!',
      confirmButtonColor: '#16a34a',
      cancelButtonText: 'Cancel',
      cancelButtonColor: '#1f2937'
    }).then((result) => {
      if (result.isConfirmed) {
        this.httpClient.post(this.appService.baseUrl + '/account/remove-all-devices', {}, {
          headers: {
            Authorization: `Bearer ${this.authService.authToken}`
          }
        }).subscribe(
          (response: any) => {
            this.fetchActiveSessions();
            this.toastService.success(response.message);
          },
          error => {
            this.toastService.error(error.error.message);
          }
        );
      }
    });
  }

}
