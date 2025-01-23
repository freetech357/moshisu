import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormService } from '../../../../services/form.service';
import { AppService } from '../../../../services/app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastService } from '../../../../services/toast.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-block-add',
  templateUrl: './add.component.html',
  styleUrls: ['../../../../common.css', './add.component.css']
})
export class AddComponent {

  states: any = [];
  districts: any = [];

  blockForm = new FormGroup({
    state: new FormControl('', [Validators.required]),
    district: new FormControl('', [Validators.required]),
    block_name: new FormControl('', [Validators.required, Validators.maxLength(255), Validators.pattern('^[a-zA-Z ]*$')]),
    block_status: new FormControl('', [Validators.required])
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

    this.httpClient.get(`${this.appService.baseUrl}/superadmin/state/list`, {
      headers: {
        Authorization: this.authService.authToken
      }
    })
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
    const selectedStateId = this.blockForm.value.state;

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

  dataBlockSubmit()
  {
    if (this.blockForm.status === 'INVALID') {
      this.formService.triggerFormValidation(this.blockForm);
      return;
    }
    this.isFormSubmitInProgress = true;

    const token   = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const postData = {
      blockname: this.blockForm.value.block_name?.trim(),
      district_id: this.blockForm.value.district?.toString().trim()
    }
    
    this.httpClient.post(`${this.appService.baseUrl}block`, postData , { headers }
    ).subscribe(
      (response: any) => {
        this.isFormSubmitInProgress = false;
        this.toastService.success(response.message);
        this.router.navigate(['superadmin/portal/master/block']);
      },
      error => {
        this.isFormSubmitInProgress = false;
        this.toastService.error(error.error.message);
      }
    );
  }


}
