import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from '../../../../services/form.service';
import { AppService } from '../../../../services/app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastService } from '../../../../services/toast.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-form-17-d',
  templateUrl: './form-17-d.component.html',
  styleUrl: './form-17-d.component.css'
})
export class Form17DComponent {

  states: any = [];
  districts: any = [];
  blocks: any = [];
  draftId: any;
  draft_details: any = [];
  displayErrors: string[] = []; // Holds the error messages for Step 3

  form17_d = new FormGroup({

    if_guardians_available: new FormControl(''),
    grd_photo: new FormControl(''),
    grd_name: new FormControl(''),
    grd_age: new FormControl('',[Validators.pattern('^[0-9]*$'), Validators.min(1),Validators.max(120)]),
    grd_aadhar_availabliity: new FormControl(''),
    grd_aadhar_number: new FormControl('', [ Validators.pattern('^[0-9]{12}$')]),
    grd_aadhar_copy: new FormControl(''),
    grd_pr_state: new FormControl(''),
    grd_pr_district: new FormControl(''),
    grd_pr_block: new FormControl(''),
    grd_pr_police_station: new FormControl(''),
    grd_pr_village: new FormControl(''),
    grd_pr_area: new FormControl(''),
    grd_pr_street: new FormControl(''),
    grd_pr_pin: new FormControl(''),
    isPermanentAddressSame: new FormControl(false),
    grd_pm_state: new FormControl(''),
    grd_pm_dist: new FormControl(''),
    grd_pm_block: new FormControl(''),
    grd_pm_police_station: new FormControl(''),
    grd_pm_village: new FormControl(''),
    grd_pm_area: new FormControl(''),
    grd_pm_street: new FormControl(''),
    grd_pm_pin: new FormControl(''),
    grd_occupation: new FormControl(''),
    grd_mobile_number: new FormControl('', [ Validators.pattern('^[0-9]{10}$')])

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

  onAgeInput(event: any): void {
    const input = event.target.value;
    event.target.value = input.replace(/[^0-9]/g, '');
  }

  ngOnInit() {
    this.fetchStates();
    this.route.params.subscribe(params => {
    this.draftId = params['draftId']; // 'id' should match the parameter name in your route
    // console.log('ID from URL:', this.draftId);

    if(this.draftId !== null){
      this.fetchDraftData(this.draftId);
      this.loadErrorsFromLocalStorage();
    }
    
    });
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

  onStateChange(addressType: string){
    const selectedStateId = addressType === 'present' ? this.form17_d.value.grd_pr_state : this.form17_d.value.grd_pm_state;
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

  onDistrictChange(addressType: string){
    const selectedDistId = addressType === 'present' ? this.form17_d.value.grd_pr_district : this.form17_d.value.grd_pm_dist;

    const token   = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient.get(`${this.appService.baseUrl}blocklist?district_id=${selectedDistId}&status=1`, { headers })
    .subscribe(
      (response: any) => {
        this.blocks = response.data;
      },
      error => {
        this.blocks = [];
      }
    );
  }

  loadErrorsFromLocalStorage() {
    const formErrors: any = JSON.parse(localStorage.getItem(`Draft_${this.draftId}`) || '{}');
    const errors = formErrors[3] ?? null;

    if (errors) {
      this.displayErrors = this.extractErrorMessages(errors);
    }
  }

  extractErrorMessages(errors: any): string[] {
    const errorMessages: string[] = [];

    for (const field in errors) {
      if (errors.hasOwnProperty(field)) {
        errorMessages.push(...errors[field]);
      }
    }

    return errorMessages;
  }
  
  saveAsDraft(){

    if (this.form17_d.status === 'INVALID') {
      this.formService.triggerFormValidation(this.form17_d);
      return;
    }
    this.isFormSubmitInProgress = true;

    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    const formData = new FormData();
      formData.append('if_guardians_available', this.form17_d.value.if_guardians_available?.toString().trim() ?? '');
      // Guardian Photo Upload
      const guardianPhoto: any = document.getElementById('grd_photo');
      if (guardianPhoto && guardianPhoto.files && guardianPhoto.files.length > 0) {
        formData.append('grd_photo', guardianPhoto.files[0]);
      }
      formData.append('grd_name', this.form17_d.value.grd_name?.trim() ?? '');
      formData.append('grd_age', this.form17_d.value.grd_age?.toString().trim() ?? '');
      formData.append('grd_aadhar_availabliity', this.form17_d.value.grd_aadhar_availabliity?.toString().trim() ?? '');
      formData.append('grd_aadhar_number', this.form17_d.value.grd_aadhar_number?.toString().trim() ?? '');
      // Guardian Aadhar Upload
      const guardianAadhar: any = document.getElementById('grd_aadhar_copy');
      if (guardianAadhar && guardianAadhar.files && guardianAadhar.files.length > 0) {
        formData.append('grd_aadhar_copy', guardianAadhar.files[0]);
      }
      // Present Address
      formData.append('grd_pr_state', this.form17_d.value.grd_pr_state?.toString().trim() ?? '');
      formData.append('grd_pr_district', this.form17_d.value.grd_pr_district?.trim() ?? '');
      formData.append('grd_pr_block', this.form17_d.value.grd_pr_block?.toString().trim() ?? '');
      formData.append('grd_pr_police_station', this.form17_d.value.grd_pr_police_station?.toString().trim() ?? '');
      formData.append('grd_pr_village', this.form17_d.value.grd_pr_village?.trim() ?? '');
      formData.append('grd_pr_area', this.form17_d.value.grd_pr_area?.trim() ?? '');
      formData.append('grd_pr_street', this.form17_d.value.grd_pr_street?.trim() ?? '');
      formData.append('grd_pr_pin', this.form17_d.value.grd_pr_pin?.toString().trim() ?? '');
      // Permanent Address
      if (!this.form17_d.value.isPermanentAddressSame) {
        formData.append('grd_pm_state', this.form17_d.value.grd_pr_state?.toString().trim() ?? '');
        formData.append('grd_pm_dist', this.form17_d.value.grd_pr_district?.toString().trim() ?? '');
        formData.append('grd_pm_block', this.form17_d.value.grd_pr_block?.toString().trim() ?? '');
        formData.append('grd_pm_police_station', this.form17_d.value.grd_pr_police_station?.toString().trim() ?? '');
        formData.append('grd_pm_village', this.form17_d.value.grd_pr_village?.trim() ?? '');
        formData.append('grd_pm_area', this.form17_d.value.grd_pr_area?.trim() ?? '');
        formData.append('grd_pm_street', this.form17_d.value.grd_pr_street?.trim() ?? '');
        formData.append('grd_pm_pin', this.form17_d.value.grd_pr_pin?.toString().trim() ?? '');
      } else {
        formData.append('grd_pm_state', this.form17_d.value.grd_pm_state?.toString().trim() ?? '');
        formData.append('grd_pm_dist', this.form17_d.value.grd_pm_dist?.toString().trim() ?? '');
        formData.append('grd_pm_block', this.form17_d.value.grd_pm_block?.toString().trim() ?? '');
        formData.append('grd_pm_police_station', this.form17_d.value.grd_pm_police_station?.toString().trim() ?? '');
        formData.append('grd_pm_village', this.form17_d.value.grd_pm_village?.trim() ?? '');
        formData.append('grd_pm_area', this.form17_d.value.grd_pm_area?.trim() ?? '');
        formData.append('grd_pm_street', this.form17_d.value.grd_pm_street?.trim() ?? '');
        formData.append('grd_pm_pin', this.form17_d.value.grd_pm_pin?.toString().trim() ?? '');
      }
      
      formData.append('grd_occupation', this.form17_d.value.grd_occupation?.trim() ?? '');
      formData.append('grd_mobile_number', this.form17_d.value.grd_mobile_number?.toString().trim() ?? '');
      formData.append('draft_id', this.draftId);

    this.httpClient.post(`${this.appService.baseUrl}SaveCwcDraft?step_no=3`, formData, { headers })
    .subscribe(
      (response: any) => {
        this.isFormSubmitInProgress = false;
        this.toastService.success(response.message);

        const draftId = response.data.draft_id;
        this.router.navigate(['portal/registration/form-ef', draftId]);
      },
      error => {
        this.isFormSubmitInProgress = false;
        this.toastService.error(error.error.message);
      }
    );

  }

  fetchDraftData(draftId: any){

    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient.get(`${this.appService.baseUrl}fetchDraft?draft_id=${draftId}`, { headers })
      .subscribe(
        (response: any) => {
          const draftData = response.data['3'];
          if (draftData){
            this.draft_details = draftData

            this.form17_d.patchValue({
              if_guardians_available: this.draft_details.if_guardians_available || '',
              grd_name: this.draft_details.grd_name || '',
              grd_age: this.draft_details.grd_age || '',
              grd_aadhar_availabliity: this.draft_details.grd_aadhar_availabliity || '',
              grd_aadhar_number: this.draft_details.grd_aadhar_number || '',
              grd_pr_state: this.draft_details.grd_pr_state || '',
              grd_pr_district: this.draft_details.grd_pr_district || '',
              grd_pr_block: this.draft_details.grd_pr_block || '',
              grd_pr_police_station: this.draft_details.grd_pr_police_station || '',
              grd_pr_village: this.draft_details.grd_pr_village || '',
              grd_pr_area: this.draft_details.grd_pr_area || '',
              grd_pr_street: this.draft_details.grd_pr_street || '',
              grd_pr_pin: this.draft_details.grd_pr_pin || '',
              grd_pm_state: this.draft_details.grd_pm_state || '',
              grd_pm_dist: this.draft_details.grd_pm_dist || '',
              grd_pm_block: this.draft_details.grd_pm_block || '',
              grd_pm_police_station: this.draft_details.grd_pm_police_station || '',
              grd_pm_village: this.draft_details.grd_pm_village || '',
              grd_pm_area: this.draft_details.grd_pm_area || '',
              grd_pm_street: this.draft_details.grd_pm_street || '',
              grd_pm_pin: this.draft_details.grd_pm_pin || '',
              grd_occupation: this.draft_details.grd_occupation || '',
              grd_mobile_number: this.draft_details.grd_mobile_number || ''
              // isPermanentAddressSame: true
            });

            this.formService.triggerFormValidation(this.form17_d);
            this.onStateChange('present');
            this.onDistrictChange('present');
          } else {
            this.draft_details = [];
          }
        },
        error => {
          this.draft_details = [];
        }
      );
  }

}
