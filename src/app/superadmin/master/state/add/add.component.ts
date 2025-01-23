import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormService } from '../../../../services/form.service';
import { AppService } from '../../../../services/app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastService } from '../../../../services/toast.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-state-add',
  templateUrl: './add.component.html',
  styleUrls: ['../../../../common.css', './add.component.css']
})
export class AddComponent {
  stateForm = new FormGroup({
    state_name: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')]),
    state_status: new FormControl('', [Validators.required, Validators.min(0), Validators.max(1)]),
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

  stateSubmit()
  {
    if (this.stateForm.status === 'INVALID') {
      this.formService.triggerFormValidation(this.stateForm);
      return;
    }
    this.isFormSubmitInProgress = true;
    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const postData = {
      state_name: this.stateForm.value.state_name?.trim(),
      state_code: '1',
      country_id: 99,
      status: this.stateForm.value.state_status?.trim()
    }


    this.httpClient.post(`${this.appService.baseUrl}state`,postData, {headers}
    ).subscribe(
      (response: any) => {
        this.isFormSubmitInProgress = false;
        this.toastService.success(response.message);
        this.router.navigate(['superadmin/portal/master/state']);
      },
      error => {
        this.isFormSubmitInProgress = false;
        this.toastService.error(error.error.message);
      }
    );
  }
}
