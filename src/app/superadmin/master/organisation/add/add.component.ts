import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormService } from '../../../../services/form.service';
import { AppService } from '../../../../services/app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastService } from '../../../../services/toast.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-organisation-add',
  templateUrl: './add.component.html',
  styleUrls: ['../../../../common.css', './add.component.css']
})
export class AddComponent {

  organisationForm = new FormGroup({
    user: new FormControl('', [Validators.required]),
    organization_name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    status: new FormControl('', [Validators.required])
  });

  isFormSubmitInProgress: boolean = false;

  constructor(
    private router: Router,
    private formService: FormService,
    private appService: AppService,
    private httpClient: HttpClient,
    private toastService: ToastService,
    private authService:  AuthService
  ) {}

  organizationSubmit()
  {
    if (this.organisationForm.status === 'INVALID') {
      this.formService.triggerFormValidation(this.organisationForm);
      return;
    }
    this.isFormSubmitInProgress = true;

    const token   = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const postData = {
      organization_name: this.organisationForm.value.organization_name?.trim(),
      user_level: this.organisationForm.value.user?.trim(),
    }
    
    this.httpClient.post(`${this.appService.baseUrl}organisation`, postData , { headers }
    ).subscribe(
      (response: any) => {
        this.isFormSubmitInProgress = false;
        this.toastService.success(response.message);
        this.router.navigate(['superadmin/portal/master/organisation']);
      },
      error => {
        this.isFormSubmitInProgress = false;
        this.toastService.error(error.error.message);
      }
    );
  }
}
