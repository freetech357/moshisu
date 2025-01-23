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

    isBusinessUnit: boolean = false;

    userManageForm: any = new FormGroup({
      district: new FormControl(0),
      user_role: new FormControl('', [Validators.required]),
      user_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)]),
      confirm_password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)]),
      status: new FormControl('', [Validators.required])
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

    ngOnInit() {     

      this.fetchUserRole();
      this.fetchAllDistricts();
    }


    fetchAllDistricts() {
      this.districts = [];
      const token = this.authService.authToken;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
      this.httpClient.get(`${this.appService.baseUrl}districtlist?state_id=19`, { headers })
      .subscribe(
        (response: any) => {
          console.log('district');
          console.log(response);
          this.districts = response.data;
        },
        error => {
          this.districts = [];
        }
      );
    }


    fetchUserRole() {
      const token = this.authService.authToken;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        this.httpClient.get(`${this.appService.baseUrl}roles`, {headers})
        .subscribe(
          (response: any) => {
            this.roles = response.data;
            console.log(this.roles)
          },
          error => {
            this.roles = [];
          }
        );
    }

    dataUserSubmit()
    {
      if (this.userManageForm.status === 'INVALID') {
        this.formService.triggerFormValidation(this.userManageForm);
        return;
      }

      // Check if passwords match
      const password = this.userManageForm.value.password?.trim();
      const confirmPassword = this.userManageForm.value.confirm_password?.trim();

      if (password !== confirmPassword) {
        this.toastService.error('Passwords do not match.');
        return;
      }

      this.isFormSubmitInProgress = true;
      const token = this.authService.authToken;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.httpClient.post(`${this.appService.baseUrl}users`, {

        district_id: this.userManageForm.value.district,
        roles: this.userManageForm.value.user_role,
        name: this.userManageForm.value.user_name?.trim(),
        email: this.userManageForm.value.email?.trim(),
        mobile_no: this.userManageForm.value.phone?.trim(),
        password: this.userManageForm.value.password?.trim(),
        is_active: this.userManageForm.value.status?.trim()
      }, {headers}
      ).subscribe(
        (response: any) => {
          this.isFormSubmitInProgress = false;
          this.toastService.success(response.message);
          this.router.navigate(['superadmin/portal/manage-users']);
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
