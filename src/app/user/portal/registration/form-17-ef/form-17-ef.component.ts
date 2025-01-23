import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from '../../../../services/form.service';
import { AppService } from '../../../../services/app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastService } from '../../../../services/toast.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-form-17-ef',
  templateUrl: './form-17-ef.component.html',
  styleUrl: './form-17-ef.component.css'
})
export class Form17EfComponent {

  states: any = [];
  districts: any = [];
  blocks: any = [];
  draftId: any;
  draft_details: any = [];
  displayErrors: string[] = []; // Holds the error messages for Step 4

  form17_ef = new FormGroup({

    // Place where the child was found
    pwcf_state: new FormControl(''),
    pwcf_district_id: new FormControl(''),
    pwcf_block_id: new FormControl(''),
    pwcf_police_station: new FormControl(''),
    pwcf_village: new FormControl(''),
    pwcf_area: new FormControl(''),
    pwcf_street: new FormControl(''),
    pwcf_pin: new FormControl(''),
    place_details: new FormControl(''),

    // Details of the person with whom the child was found
    accompanying_person_details: new FormControl(''),
    pwcf_photo: new FormControl(''),
    pwcf_name: new FormControl(''),
    pwcf_age: new FormControl(''),
    pwcf_gender: new FormControl(''),
    pwcf_aadhar_availabliity: new FormControl(''),
    pwcf_aadhar_number: new FormControl('', [ Validators.pattern('^[0-9]{12}$')]),
    pwcf_aadhar_copy: new FormControl(''),

    // Present Address
    pwcf_pr_state: new FormControl(''),
    pwcf_pr_district: new FormControl(''),
    pwcf_pr_block: new FormControl(''),
    pwcf_pr_police_station: new FormControl(''),
    pwcf_pr_village: new FormControl(''),
    pwcf_pr_area: new FormControl(''),
    pwcf_pr_street: new FormControl(''),
    pwcf_pr_pin: new FormControl(''),
    isPermanentAddressSame: new FormControl(false),

    // Permanent Address
    pwcf_pm_state: new FormControl(''),
    pwcf_pm_district: new FormControl(''),
    pwcf_pm_block: new FormControl(''),
    pwcf_pm_police_station: new FormControl(''),
    pwcf_pm_village: new FormControl(''),
    pwcf_pm_area: new FormControl(''),
    pwcf_pm_street: new FormControl(''),
    pwcf_pm_pin: new FormControl(''),

    // Additional Information
    pwcf_occupation: new FormControl(''),
    pwcf_mobile_number: new FormControl('', [ Validators.pattern('^[0-9]{10}$')]),

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

    let selectedStateId: any | null = null;
    
    // Determine the selected District ID based on addressType
    if (addressType === 'present') {
      selectedStateId = this.form17_ef.value.pwcf_pr_state;
    } else if (addressType === 'permanent') {
      selectedStateId = this.form17_ef.value.pwcf_pm_state;
    } else {
      selectedStateId = this.form17_ef.value.pwcf_state;
    }

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

    let selectedDistId: any | null = null;
    
    // Determine the selected state ID based on addressType
    if (addressType === 'present') {
      selectedDistId = this.form17_ef.value.pwcf_pr_district;
    } else if (addressType === 'permanent') {
      selectedDistId = this.form17_ef.value.pwcf_pm_district;
    } else {
      selectedDistId = this.form17_ef.value.pwcf_district_id;
  
    }

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
    const errors = formErrors[4] ?? null;

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

    if (this.form17_ef.status === 'INVALID') {
      this.formService.triggerFormValidation(this.form17_ef);
      return;
    }
    this.isFormSubmitInProgress = true;

    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    const formData = new FormData();
      // Place where the child was found
      formData.append('pwcf_state', this.form17_ef.value.pwcf_state?.toString().trim() ?? '');
      formData.append('pwcf_district_id', this.form17_ef.value.pwcf_district_id?.toString().trim() ?? '');
      formData.append('pwcf_block_id', this.form17_ef.value.pwcf_block_id?.toString().trim() ?? '');
      formData.append('pwcf_police_station', this.form17_ef.value.pwcf_police_station?.toString().trim() ?? '');
      formData.append('pwcf_village', this.form17_ef.value.pwcf_pr_village?.trim() ?? '');
      formData.append('pwcf_area', this.form17_ef.value.pwcf_area?.trim() ?? '');
      formData.append('pwcf_street', this.form17_ef.value.pwcf_street?.trim() ?? '');
      formData.append('pwcf_pin', this.form17_ef.value.pwcf_pin?.toString().trim() ?? '');
      formData.append('place_details', this.form17_ef.value.place_details?.trim() ?? '');
      
      // Details of the person with whom the child was found
      formData.append('accompanying_person_details', this.form17_ef.value.accompanying_person_details?.toString().trim() ?? '');
      const personPhoto: any = document.getElementById('pwcf_photo');
      if (personPhoto && personPhoto.files && personPhoto.files.length > 0) {
        formData.append('pwcf_photo', personPhoto.files[0]);
      }
      formData.append('pwcf_name', this.form17_ef.value.pwcf_name?.trim() ?? '');
      formData.append('pwcf_age', this.form17_ef.value.pwcf_age?.toString().trim() ?? '');
      formData.append('pwcf_gender', this.form17_ef.value.pwcf_gender?.toString().trim() ?? '')
      formData.append('pwcf_aadhar_availabliity', this.form17_ef.value.pwcf_aadhar_availabliity?.toString().trim() ?? '');
      formData.append('pwcf_aadhar_number', this.form17_ef.value.pwcf_aadhar_number?.toString().trim() ?? '');

      // Person Aadhar Upload
      const personAadhar: any = document.getElementById('pwcf_aadhar_copy');
      if (personAadhar && personAadhar.files && personAadhar.files.length > 0) {
        formData.append('pwcf_aadhar_copy', personAadhar.files[0]);
      }
      // Present Address
      formData.append('pwcf_pr_state', this.form17_ef.value.pwcf_pr_state?.toString().trim() ?? '');
      formData.append('pwcf_pr_district', this.form17_ef.value.pwcf_pr_district?.toString().trim() ?? '');
      formData.append('pwcf_pr_block', this.form17_ef.value.pwcf_pr_block?.toString().trim() ?? '');
      formData.append('pwcf_pr_police_station', this.form17_ef.value.pwcf_pr_police_station?.toString().trim() ?? '');
      formData.append('pwcf_pr_village', this.form17_ef.value.pwcf_pr_village?.trim() ?? '');
      formData.append('pwcf_pr_area', this.form17_ef.value.pwcf_pr_area?.trim() ?? '');
      formData.append('pwcf_pr_street', this.form17_ef.value.pwcf_pr_street?.trim() ?? '');
      formData.append('pwcf_pr_pin', this.form17_ef.value.pwcf_pr_pin?.toString().trim() ?? '');
      
      // Permanent Address
      if (!this.form17_ef.value.isPermanentAddressSame) {
        formData.append('pwcf_pm_state', this.form17_ef.value.pwcf_pr_state?.toString().trim() ?? '');
        formData.append('pwcf_pm_district', this.form17_ef.value.pwcf_pr_district?.toString().trim() ?? '');
        formData.append('pwcf_pm_block', this.form17_ef.value.pwcf_pr_block?.toString().trim() ?? '');
        formData.append('pwcf_pm_police_station', this.form17_ef.value.pwcf_pr_police_station?.toString().trim() ?? '');
        formData.append('pwcf_pm_village', this.form17_ef.value.pwcf_pr_village?.trim() ?? '');
        formData.append('pwcf_pm_area', this.form17_ef.value.pwcf_pr_area?.trim() ?? '');
        formData.append('pwcf_pm_street', this.form17_ef.value.pwcf_pr_street?.trim() ?? '');
        formData.append('pwcf_pm_pin', this.form17_ef.value.pwcf_pr_pin?.toString().trim() ?? '');
      } else {
        formData.append('pwcf_pm_state', this.form17_ef.value.pwcf_pm_state?.toString().trim() ?? '');
        formData.append('pwcf_pm_district', this.form17_ef.value.pwcf_pm_district?.toString().trim() ?? '');
        formData.append('pwcf_pm_block', this.form17_ef.value.pwcf_pm_block?.toString().trim() ?? '');
        formData.append('pwcf_pm_police_station', this.form17_ef.value.pwcf_pm_police_station?.toString().trim() ?? '');
        formData.append('pwcf_pm_village', this.form17_ef.value.pwcf_pm_village?.trim() ?? '');
        formData.append('pwcf_pm_area', this.form17_ef.value.pwcf_pm_area?.trim() ?? '');
        formData.append('pwcf_pm_street', this.form17_ef.value.pwcf_pm_street?.trim() ?? '');
        formData.append('pwcf_pm_pin', this.form17_ef.value.pwcf_pm_pin?.toString().trim() ?? '');
      }
      
      formData.append('pwcf_occupation', this.form17_ef.value.pwcf_occupation?.trim() ?? '');
      formData.append('pwcf_mobile_number', this.form17_ef.value.pwcf_mobile_number?.toString().trim() ?? '');
      formData.append('draft_id', this.draftId);

    this.httpClient.post(`${this.appService.baseUrl}SaveCwcDraft?step_no=4`, formData, { headers })
    .subscribe(
      (response: any) => {
        this.isFormSubmitInProgress = false;
        this.toastService.success(response.message);

        const draftId = response.data.draft_id;
        this.router.navigate(['portal/registration/form-ghijklmn', draftId]);
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
          const draftData = response.data['4'];
          if (draftData){
            this.draft_details = draftData;

            this.form17_ef.patchValue({
              pwcf_state: this.draft_details.pwcf_state || '',
              pwcf_district_id: this.draft_details.pwcf_district_id || '',
              pwcf_block_id: this.draft_details.pwcf_block_id || '',
              pwcf_police_station: this.draft_details.pwcf_police_station || '',
              pwcf_village: this.draft_details.pwcf_village || '',
              pwcf_area: this.draft_details.pwcf_area || '',
              pwcf_street: this.draft_details.pwcf_street || '',
              pwcf_pin: this.draft_details.pwcf_pin || '',
              place_details: this.draft_details.place_details || '',
              accompanying_person_details: this.draft_details.accompanying_person_details || '',
              pwcf_name: this.draft_details.pwcf_name || '',
              pwcf_age: this.draft_details.pwcf_age || '',
              pwcf_gender: this.draft_details.pwcf_gender || '',
              pwcf_aadhar_availabliity: this.draft_details.pwcf_aadhar_availabliity || '',
              pwcf_aadhar_number: this.draft_details.pwcf_aadhar_number || '',
              pwcf_pr_state: this.draft_details.pwcf_pr_state || '',
              pwcf_pr_district: this.draft_details.pwcf_pr_district || '',
              pwcf_pr_block: this.draft_details.pwcf_pr_block || '',
              pwcf_pr_police_station: this.draft_details.pwcf_pr_police_station || '',
              pwcf_pr_village: this.draft_details.pwcf_pr_village || '',
              pwcf_pr_area: this.draft_details.pwcf_pr_area || '',
              pwcf_pr_street: this.draft_details.pwcf_pr_street || '',
              pwcf_pr_pin: this.draft_details.pwcf_pr_pin || '',
              pwcf_pm_state: this.draft_details.pwcf_pm_state || '',
              pwcf_pm_district: this.draft_details.pwcf_pm_district || '',
              pwcf_pm_block: this.draft_details.pwcf_pm_block || '',
              pwcf_pm_police_station: this.draft_details.pwcf_pm_police_station || '',
              pwcf_pm_village: this.draft_details.pwcf_pm_village || '',
              pwcf_pm_area: this.draft_details.pwcf_pm_area || '',
              pwcf_pm_street: this.draft_details.pwcf_pm_street || '',
              pwcf_pm_pin: this.draft_details.pwcf_pm_pin || '',
              pwcf_occupation: this.draft_details.pwcf_occupation || '',
              pwcf_mobile_number: this.draft_details.pwcf_mobile_number || ''
              // isPermanentAddressSame: true
            
            });

            this.formService.triggerFormValidation(this.form17_ef);
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
