import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from '../../../../services/form.service';
import { AppService } from '../../../../services/app.service';
import { ToastService } from '../../../../services/toast.service';
import { AuthService } from '../../../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-district-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['../../../../common.css', './edit.component.css']
})
export class EditComponent {
  states: any = [];
  district_details: any =[];

  districtEditForm = new FormGroup({
    state: new FormControl('', [Validators.required]),
    district_name: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')]),
    district_status: new FormControl('', [Validators.required])
  });

  isFormSubmitInProgress: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formService: FormService,
    private appService: AppService,
    private httpClient: HttpClient,
    private toastService: ToastService,
    private authService:  AuthService
  ) {}

  ngOnInit() {
    this.fetchStates();
    this.route.params.subscribe(params => {
      const id = params['id']; // 'id' should match the parameter name in your route
      //console.log('ID from URL:', id);
      this.fetchDistrictById(id);
    });
  }
  fetchStates(){
    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient.get(`${this.appService.baseUrl}statelist?country_id=99&status=1`, { headers })
    .subscribe(
      (response: any) => {
         this.states = response.data;
        //  console.log(this.states)
      },
      error => {
        this.states = [];
      }
    );
  }


  ///get district details from respected api.
  fetchDistrictById(id: string){
    //console.log(id);
      const token = this.authService.authToken;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.httpClient.get(`${this.appService.baseUrl}districtlist?state_id=19&dist_id=${id}`, { headers })
      .subscribe(
        (response: any) => {
          //console.log(response.data[0])
          this.district_details = response.data[0];
          this.districtEditForm.patchValue({
            state: this.district_details.state_id,
            district_name: this.district_details.district_name,
            district_status: this.district_details.status
          });
          this.formService.triggerFormValidation(this.districtEditForm);
        },
        error => {
          this.district_details = [];
        }
      );

    }

    dataDistrictEditSubmit(){
      if (this.districtEditForm.status === 'INVALID') {
      this.formService.triggerFormValidation(this.districtEditForm);
      return;
    }
      this.isFormSubmitInProgress = true;

      const token = this.authService.authToken;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      const postData = {
        district_name: this.districtEditForm.value.district_name?.trim(),
        state_id: this.districtEditForm.value.state?.toString().trim(),
        status: this.districtEditForm.value.district_status?.trim()
      }

      this.httpClient.post(`${this.appService.baseUrl}district/${ this.district_details.id }`,postData,{ headers } 
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
