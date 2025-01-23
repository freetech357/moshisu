import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../../services/toast.service';
import { FormService } from '../../../services/form.service';
import { AppService } from '../../../services/app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-user-add',
  templateUrl: './add.component.html',
  styleUrls: ['../../../common.css', './add.component.css']
})

export class AddComponent {
    roles: any = [];
    districts:any =[];
    blocks:any = [];
    gramPanchayats:any = [];
    unitType:any = [];
    services:any = [];

    isBusinessUnit: boolean = false;

    userManageForm: any = new FormGroup({
      username: new FormControl('', [Validators.required])
    });


    isFormSubmitInProgress: boolean = false;

    constructor(
      private router: Router,
      private formService: FormService,
      private appService: AppService,
      private httpClient: HttpClient,
      private toastService: ToastService,
      public authService:  AuthService
    ) {}

    onRoleChange() {
      if (this.userManageForm.get('user_role').value == '4') {
        this.isBusinessUnit = true;
        this.userManageForm.get('unit_type').setValidators([Validators.required]);
        this.userManageForm.get('unit_name').setValidators([Validators.required]);
      } else {
        this.isBusinessUnit = false;
      }
    }

    ngOnInit() {     

      this.fetchUserRole();
    }




    fetchUserRole() {
        this.httpClient.get(`${this.appService.baseUrl}/superadmin/user-role/list`, {
          headers: {
            Authorization: this.authService.authToken
          }
        })
        .subscribe(
          (response: any) => {
            this.roles = response.data;
          },
          error => {
            this.roles = [];
          }
        );
    }


    dataUserSubmit()
    {
      console.log('submit ');
      if (this.userManageForm.status === 'INVALID') {
        this.formService.triggerFormValidation(this.userManageForm);
        return;
      }

      const selectedServices: any = [];

      if (this.userManageForm.value.user_role == '4') {
        const servicesInputElements: any = document.querySelectorAll('input[name="service"]');
        servicesInputElements.forEach((element: any) => {
          if (element.checked) {
            selectedServices.push(+element.value);
          }
        });
        if (selectedServices.length === 0) {
          this.toastService.warning('Please select at least one service.');
          return;
        }
      }

      this.isFormSubmitInProgress = true;
      const postData = {
          module_alias: this.userManageForm.value.username?.trim()
      }

      const token   = this.authService.authToken;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.httpClient.post(`${this.appService.baseUrl}module`,postData, { headers }
      ).subscribe(
        (response: any) => {
          this.isFormSubmitInProgress = false;
          this.toastService.success(response.message);
          this.router.navigate(['superadmin/portal/module-master']);
        },
        error => {
          this.isFormSubmitInProgress = false;
          this.toastService.error(error.error.message);
        }
      );
    }

    toggleAllServices(event: Event): void {
      const isChecked = (event.target as HTMLInputElement).checked;
        const control = this.userManageForm.get('service');
        if (control) {
          control.setValue(isChecked);
        }else {
          control.setValue(false); // Adjust this to control.setValue(0) if your checkbox handles numeric values
        }
    }

}
