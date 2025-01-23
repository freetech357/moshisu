import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from '../../../../services/form.service';
import { AppService } from '../../../../services/app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastService } from '../../../../services/toast.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-block-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['../../../../common.css', './edit.component.css']
})
export class EditComponent {

  states: any = [];
  districts: any = [];
  block_details: any =[];

  blockFormEdit = new FormGroup({
      state: new FormControl('', [Validators.required]),
      district: new FormControl('', [Validators.required]),
      block_name: new FormControl('', [Validators.required, Validators.maxLength(255), Validators.pattern('^[a-zA-Z ]*$')]),
      block_status: new FormControl('', [Validators.required])

  });

  // block_status: new FormControl('', [Validators.required])

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
      this.fetchBlockById(id);
    });
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
    const selectedStateId = this.blockFormEdit.value.state;

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
  fetchBlockById(id: string){
    //console.log(id);

    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.httpClient.get(`${this.appService.baseUrl}blocklist?block_id=${id}`, { headers })
      .subscribe(
        (response: any) => {
          this.block_details = response.data[0];
          console.log(this.block_details);
          this.blockFormEdit.patchValue({
            state: "19",
            district: this.block_details.district_id,
            block_name: this.block_details.blockname,
            block_status: this.block_details.status

          });
          this.formService.triggerFormValidation(this.blockFormEdit);
          this.onStateChange();
        },
        error => {
          this.block_details = [];
        }
      );

    }

    dataBlockSubmitEdit(){
      if (this.blockFormEdit.status === 'INVALID') {
      this.formService.triggerFormValidation(this.blockFormEdit);
      return;
      }
      this.isFormSubmitInProgress = true;

      const token = this.authService.authToken;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      const postData = {
        blockname: this.blockFormEdit.value.block_name?.trim(),
        district_id: this.blockFormEdit.value.district,
        status: this.blockFormEdit.value.block_status
      }
      // this.block_details.id
      this.httpClient.post(`${this.appService.baseUrl}block/${ this.block_details.id }`, postData, { headers }
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
