import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from '../../../../services/form.service';
import { AppService } from '../../../../services/app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastService } from '../../../../services/toast.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-cwc-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['../../../../common.css', './edit.component.css']
})
export class EditComponent {

  states: any = [];
  districts: any = [];
  cwc_details: any =[];

  cwcFormEdit = new FormGroup({
      state: new FormControl('', [Validators.required]),
      district: new FormControl('', [Validators.required]),
      cwc_name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      status: new FormControl('', [Validators.required])

  });

  // status: new FormControl('', [Validators.required])

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
      this.fetchCwcById(id);
    });
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
    const selectedStateId = this.cwcFormEdit.value.state;

    const token = this.authService.authToken;
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

  ///get block details from respected api.
  fetchCwcById(id: string){
    //console.log(id);

    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.httpClient.get(`${this.appService.baseUrl}cwclist?cwc_id=${id}`, { headers })
      .subscribe(
        (response: any) => {
          this.cwc_details = response.data[0];
          console.log(this.cwc_details);
          this.cwcFormEdit.patchValue({
            state: this.cwc_details.state_id,
            district: this.cwc_details.dist_id,
            cwc_name: this.cwc_details.cwc_name,
            status: this.cwc_details.status

          });
          this.formService.triggerFormValidation(this.cwcFormEdit);
          this.onStateChange();
        },
        error => {
          this.cwc_details = [];
        }
      );

    }

    cwcEdit(){
      if (this.cwcFormEdit.status === 'INVALID') {
      this.formService.triggerFormValidation(this.cwcFormEdit);
      return;
      }
      this.isFormSubmitInProgress = true;

      const token = this.authService.authToken;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      const postData = {
        cwc_name: this.cwcFormEdit.value.cwc_name?.trim(),
        state_id: '19',
        dist_id: this.cwcFormEdit.value.district,
        status: this.cwcFormEdit.value.status
      }
      // this.cwc_details.id
      this.httpClient.post(`${this.appService.baseUrl}cwc/${ this.cwc_details.id }`, postData, { headers }
      ).subscribe(
        (response: any) => {
          this.isFormSubmitInProgress = false;
          this.toastService.success(response.message);
          this.router.navigate(['superadmin/portal/master/cwc']);
        },
        error => {
          this.isFormSubmitInProgress = false;
          this.toastService.error(error.error.message);
        }
      );
    }


}
