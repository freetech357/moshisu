import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../../services/app.service';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../services/toast.service';
import { DateService } from '../../services/date.service';
import { FormService } from '../../services/form.service';

@Component({
  selector: 'app-app-logs',
  templateUrl: './app-logs.component.html',
  styleUrls: ['../../common.css','./app-logs.component.css']
})
export class AppLogsComponent {
  isPassEnter: boolean = false;
  isFormSearchInProgress: boolean = false;
  isLoadMoreInProgress: boolean = false;
  isFormSubmitInProgress: boolean = false;
  appLogs: any = [];

  appPassForm = new FormGroup({
    pass: new FormControl('',[Validators.required])
  });

  searchForm = new FormGroup({
    level: new FormControl('',[Validators.required])
  });

  constructor(
    private appService: AppService,
    private authService: AuthService,
    private httpClient: HttpClient,
    private toastService: ToastService,
    public dateService: DateService,
    private formService: FormService,
    
  ) {} 

  resetForm() {
    location.reload();
  } 

  appPassSubmit(){
    if (this.appPassForm.status === 'INVALID') {
      this.formService.triggerFormValidation(this.appPassForm);
      return;
    }
    const pass = this.appPassForm.value.pass?.trim();
    let searchParams = '?filter=1';

    if (pass && pass != '') {
      searchParams += `&pass=${pass}`;
    }
    this.appLogsList(searchParams);
    
    this.isFormSubmitInProgress = true;
    
  }

  

  submitForm(){
    if (this.searchForm.status === 'INVALID') {
      this.formService.triggerFormValidation(this.searchForm);
      return;
    }
    this.isFormSearchInProgress= true;
    const level = this.searchForm.value.level?.trim();
    const pass = this.appPassForm.value.pass?.trim();
    let searchParams = '?filter=1';

    if (level && level != '') {
      searchParams += `&level=${level}`;
    }
    if (pass && pass != '') {
      searchParams += `&pass=${pass}`;
    }

    
    this.appLogsList(searchParams);

  } 

  appLogsList(searchParams: any){
    //console.log(searchParams);
    this.httpClient.get(`${this.appService.baseUrl}/superadmin/app-logs/list` + searchParams, {
      headers: {
        Authorization: this.authService.authToken
      }
    })
    .subscribe(
      (response: any) => {
        this.appLogs = response.data;
        this.isPassEnter = true;
        this.isFormSearchInProgress= false;
        this.isFormSubmitInProgress= false;
      },
      error => {
        this.appLogs = [];
        this.isFormSearchInProgress= false;
        this.toastService.error(error.error.message);
        this.isFormSubmitInProgress= false;
      }
    );
  }



}
