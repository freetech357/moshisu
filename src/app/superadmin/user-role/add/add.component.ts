import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../../services/toast.service';
import { FormService } from '../../../services/form.service';
import { AppService } from '../../../services/app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-user-role-add',
  templateUrl: './add.component.html',
  styleUrls: ['../../../common.css', './add.component.css']
})
export class AddComponent {

  organizations: any = [];
  roles: any = [];
  
  userRoleForm = new FormGroup({
    // user_level: new FormControl('', [Validators.required]),
    organization: new FormControl('', [Validators.required]),
    role_name: new FormControl('', [Validators.required]),
    reporting_to: new FormControl('')
  });

  isFormSubmitInProgress: boolean = false;
  
  constructor(
    private router: Router,
    private formService: FormService,
    private appService: AppService,
    private httpClient: HttpClient,
    private toastService: ToastService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.fetchOrganization();
    this.fetchRole();
  }

  fetchRole(){  

    const token   = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient.get(`${this.appService.baseUrl}roles`, { headers })
    .subscribe(
      (response: any) => {
        this.roles = response.data;
      },
      error => {
        this.roles = [];
      }
    );

  }

  fetchOrganization(){

    const token   = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient.get(`${this.appService.baseUrl}organisation`, { headers })
    .subscribe(
      (response: any) => {
        this.organizations = response.data;
        console.log(this.organizations)
      },
      error => {
        this.organizations = [];
      }
    );
  }

  roleSubmit()
  {
    if (this.userRoleForm.status === 'INVALID') {
      this.formService.triggerFormValidation(this.userRoleForm);
      return;
    }
    this.isFormSubmitInProgress = true;

    const token   = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient.post(`${this.appService.baseUrl}createRole`, {
      org_id: this.userRoleForm.value.organization?.trim(),
      reporting_to: this.userRoleForm.value.reporting_to?.trim(),
      role_name: this.userRoleForm.value.role_name?.trim(),
    }, { headers }
    ).subscribe(
      (response: any) => {
        this.isFormSubmitInProgress = false;
        this.toastService.success(response.message);
        this.router.navigate(['superadmin/portal/user-role']);
      },
      error => {
        this.isFormSubmitInProgress = false;
        this.toastService.error(error.error.message);
      }
    );
  }
}
