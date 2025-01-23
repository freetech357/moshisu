import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormService } from '../../../../services/form.service';
import { AppService } from '../../../../services/app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastService } from '../../../../services/toast.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-jjb-add',
  templateUrl: './add.component.html',
  styleUrls: ['../../../../common.css', './add.component.css']
})
export class AddComponent {

  states: any = [];
  districts: any = [];

  JjbForm = new FormGroup({
    state: new FormControl('', [Validators.required]),
    district: new FormControl('', [Validators.required]),
    jjb_name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
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

  ngOnInit() {
    this.fetchStates();
  }

  fetchStates(){
    const token   = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient.get(`${this.appService.baseUrl}statelist?country_id=99`, { headers })
    .subscribe(
      (response: any) => {
        this.states = response.data;
      },
      error => {
        this.states = [];
      }
    );
  }

  onStateChange(){
    const selectedStateId = this.JjbForm.value.state;

    const token   = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient.get(`${this.appService.baseUrl}districtlist?state_id=${selectedStateId}&status=1`, { headers })
    .subscribe(
      (response: any) => {
        this.districts = response.data;
      },
      error => {
        this.districts = [];
      }
    );
  }

  JjbSubmit()
  {
    if (this.JjbForm.status === 'INVALID') {
      this.formService.triggerFormValidation(this.JjbForm);
      return;
    }
    this.isFormSubmitInProgress = true;

    const token   = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const postData = {
      jjb_name: this.JjbForm.value.jjb_name?.trim(),
      dist_id: this.JjbForm.value.district?.toString().trim(),
      state_id: this.JjbForm.value.state?.toString().trim()
    }
    
    this.httpClient.post(`${this.appService.baseUrl}jjp`, postData , { headers }
    ).subscribe(
      (response: any) => {
        this.isFormSubmitInProgress = false;
        this.toastService.success(response.message);
        this.router.navigate(['superadmin/portal/master/jjb']);
      },
      error => {
        this.isFormSubmitInProgress = false;
        this.toastService.error(error.error.message);
      }
    );
  }


}
