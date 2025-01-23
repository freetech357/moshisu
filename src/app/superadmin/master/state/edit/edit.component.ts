import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from '../../../../services/form.service';
import { ToastService } from '../../../../services/toast.service';
import { AuthService } from '../../../../services/auth.service';
import { AppService } from '../../../../services/app.service';

@Component({
  selector: 'app-state-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['../../../../common.css', './edit.component.css']
})
export class EditComponent {
  state_details: any = [];

  stateFormEdit = new FormGroup({
    state_name: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')]),
    state_status: new FormControl('', [Validators.required, Validators.min(0), Validators.max(1)])
  });

  isFormSubmitInProgress: boolean = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formService: FormService,
    private httpClient: HttpClient,    
    private toastService: ToastService,
    private authService: AuthService,
    private appService: AppService
  ) {}



  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id']; // 'id' should match the parameter name in your route
      //console.log('ID from URL:', id);
      this.fetchStateById(id);
    });
  }
  fetchStateById(id: string){
  //console.log(id);
    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.httpClient.get(`${this.appService.baseUrl}statelist?country_id=99&state_id=${id}`, { headers })
    .subscribe(
      (response: any) => {
        console.log(response.data[0]);
        this.state_details = response.data[0];
        this.stateFormEdit.patchValue({
          state_name: this.state_details.state_name,
          state_status: this.state_details.status
        });        
        this.formService.triggerFormValidation(this.stateFormEdit);        
      },
      error => {
        this.state_details = [];
      }
    );

  }

  stateEditSubmit()
  {
    if (this.stateFormEdit.status === 'INVALID') {
      this.formService.triggerFormValidation(this.stateFormEdit);
      return;
    }
    this.isFormSubmitInProgress = true;
    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const postData = {
      state_name: this.stateFormEdit.value.state_name?.trim(),
      // state_code: "19",
      country_id: "99",
      status: this.stateFormEdit.value.state_status?.trim()
    }

    this.httpClient.post(`${this.appService.baseUrl}state/${ this.state_details.id }`, postData , { headers }
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
