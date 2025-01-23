import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from '../../../../services/form.service';
import { AppService } from '../../../../services/app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastService } from '../../../../services/toast.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-jjb-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['../../../../common.css', './edit.component.css']
})
export class EditComponent {

  states: any = [];
  districts: any = [];
  jjb_details: any =[];

  jjbFormEdit = new FormGroup({
      state: new FormControl('', [Validators.required]),
      district: new FormControl('', [Validators.required]),
      jjb_name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
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
      this.fetchJjbById(id);
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
    const selectedStateId = this.jjbFormEdit.value.state;

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
  fetchJjbById(id: string){
    //console.log(id);

    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.httpClient.get(`${this.appService.baseUrl}jjplist?jjp_id=${id}`, { headers })
      .subscribe(
        (response: any) => {
          this.jjb_details = response.data[0];
          console.log(this.jjb_details);
          this.jjbFormEdit.patchValue({
            state: "19",
            district: this.jjb_details.dist_id,
            jjb_name: this.jjb_details.jjb_name,
            status: this.jjb_details.status

          });
          this.formService.triggerFormValidation(this.jjbFormEdit);
          this.onStateChange();
        },
        error => {
          this.jjb_details = [];
        }
      );

    }

    jjbEdit(){
      if (this.jjbFormEdit.status === 'INVALID') {
      this.formService.triggerFormValidation(this.jjbFormEdit);
      return;
      }
      this.isFormSubmitInProgress = true;

      const token = this.authService.authToken;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      const postData = {
        jjb_name: this.jjbFormEdit.value.jjb_name?.trim(),
        state_id: '19',
        dist_id: this.jjbFormEdit.value.district,
        status: this.jjbFormEdit.value.status
      }
      // this.jjb_details.id
      this.httpClient.post(`${this.appService.baseUrl}jjp/${ this.jjb_details.id }`, postData, { headers }
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
