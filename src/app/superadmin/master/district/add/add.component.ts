import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormService } from '../../../../services/form.service';
import { AppService } from '../../../../services/app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastService } from '../../../../services/toast.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-district-add',
  templateUrl: './add.component.html',
  styleUrls: ['../../../../common.css', './add.component.css']
})
export class AddComponent {
  states: any = [];

    districtForm = new FormGroup({
      state: new FormControl('', [Validators.required]),
      district_name: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')]),
      district_status: new FormControl('', [Validators.required])
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

    ngOnInit() {
      this.fetchStates();
    }

    fetchStates(){
      const token = this.authService.authToken;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.httpClient.get(`${this.appService.baseUrl}statelist?country_id=99&status=1`, { headers })
      .subscribe(
        (response: any) => {
          this.states = response.data;
        },
        error => {
          this.states = [];
        }
      );
    }

    dataDistrictSubmit()
    {
      if (this.districtForm.status === 'INVALID') {
        this.formService.triggerFormValidation(this.districtForm);
        return;
      }
      this.isFormSubmitInProgress = true;
      const token = this.authService.authToken;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.httpClient.post(`${this.appService.baseUrl}district`, {
        state_id: this.districtForm.value.state?.trim(),
        district_name: this.districtForm.value.district_name?.trim()
      }, {headers}
      ).subscribe(
        (response: any) => {
          this.isFormSubmitInProgress = false;
          this.toastService.success(response.message);
          this.router.navigate(['superadmin/portal/master/district']);
        },
        error => {
          this.isFormSubmitInProgress = false;
          this.toastService.error(error.error.message);
        }
      );
    }
}
