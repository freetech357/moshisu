import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from '../../../../../services/app.service';
import { FormService } from '../../../../../services/form.service';
import { ToastService } from '../../../../../services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form-1',
  templateUrl: './form-1.component.html',
  styleUrl: './form-1.component.css'
})
export class Form1Component {

  states: any = [];
  districts: any = [];
  blocks: any = [];
  jjb_list: any = [];
  draftId: any; 
  draft_details: any = [];
  displayErrors: string[] = []; // Holds the error messages for Step 4


  form1 = new FormGroup({
      fir_ddno: new FormControl('',[ Validators.required ]),
      u_sections: new FormControl(''),
      police_station: new FormControl('',[ Validators.required ]),
      name_of_investigation_officer: new FormControl(''),
      cwpo_name: new FormControl(''),
      date: new FormControl(''),
      time: new FormControl(''),
      Jjb_id: new FormControl('',[ Validators.required ]),
      cd_photo: new FormControl(''),
      child_name_known: new FormControl('1'),
      name: new FormControl(''),
      guardian_name: new FormControl(''),
      cd_dob: new FormControl(''),
      dob_proof: new FormControl(''),
      cd_age: new FormControl('',[ Validators.pattern('^[0-9]*$'), Validators.min(1),Validators.max(18) ]),
      present_state: new FormControl(''),
      present_district: new FormControl(''),
      present_block: new FormControl(''),
      present_police_station: new FormControl(''),
      present_village: new FormControl(''),
      present_area: new FormControl(''),
      present_street: new FormControl(''),
      present_pin_code: new FormControl(''),
      customCheckbox: new FormControl(''),
      religion: new FormControl(''),
      religion_others: new FormControl(''),
      physically_handicapped: new FormControl(''),
      disability_type: new FormControl(''),
      if_others: new FormControl(''),
      addressCheckbox:new FormControl (false),

      // Permanent address fields
      permanent_state: new FormControl(''),
      permanent_district: new FormControl(''),
      permanent_block: new FormControl(''),
      permanent_police_station: new FormControl(''),
      permanent_village: new FormControl(''),
      permanent_area: new FormControl(''),
      permanent_street: new FormControl(''),
      permanent_pin_code: new FormControl(''),
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
    this.fetchJjbList();
    this.route.params.subscribe(params => {
        const draftIdParam = params['draftId']; // 'id' should match the parameter name in your route
        this.draftId = draftIdParam ? +draftIdParam : null; 
        if(this.draftId !== null){
          this.fetchDraftData(this.draftId);
          this.loadErrorsFromLocalStorage();
        }
    });
  }
  onAgeInput(event: any): void {
    const input = event.target.value;
    event.target.value = input.replace(/[^0-9]/g, '');
  }

  onDobChange() {
    const dob = this.form1.get('cd_dob')?.value;
    if (dob) {
      const calculatedAge = this.calculateAge(dob);
      this.form1.patchValue({ cd_age: calculatedAge.toString() });
    } else {
      this.form1.patchValue({ cd_age: '' });
    }
  }

  calculateAge(dob: string): number {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
  
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
  
    return age;
  }

  onAgeChange(event: any): void {
    const input = event.target.value;
    event.target.value = input.replace(/[^0-9]/g, '');
    const ageControl = this.form1.get('cd_age');
    const dobControl = this.form1.get('cd_dob');
    const dobProofControl = this.form1.get('dob_proof');
  
    if (ageControl?.value) {
      dobControl?.disable(); // Disable DOB field
      dobProofControl?.disable(); // Disable Proof of DOB field
    } else {
      dobControl?.enable(); // Enable DOB field if age is cleared
      dobProofControl?.enable(); // Enable Proof of DOB field if age is cleared
    }
  }


  fetchDraftData(draftId: any) {
    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.httpClient.get(`${this.appService.baseUrl}fetchJjbDraft?draft_id=${draftId}`, { headers })
      .subscribe(
          (response: any) => {
            const draftData = response.data['1'];
            if (draftData) {
              this.draft_details = draftData ;
              this.form1.patchValue({
                fir_ddno: this.draft_details.fir_ddno || '',
                u_sections: this.draft_details.u_sections || '',
                police_station: this.draft_details.police_station || '',
                name_of_investigation_officer: this.draft_details.name_of_investigation_officer || '',
                cwpo_name: this.draft_details.cwpo_name || '',
                date: this.draft_details.date || '',
                time: this.draft_details.time || '',
                // cd_photo: draftData.cd_photo || '',
                child_name_known: this.draft_details.child_name_known || '',
                name: this.draft_details.name || '',
                guardian_name: this.draft_details.guardian_name || '',
                cd_dob: this.draft_details.cd_dob || '',
                dob_proof: this.draft_details.dob_proof || '',
                cd_age: this.draft_details.cd_age || '',
                present_state: this.draft_details.present_state || '',
                present_district: this.draft_details.present_district || '',
                present_block: this.draft_details.present_block || '',
                present_police_station: this.draft_details.present_police_station || '',
                present_village: this.draft_details.present_village || '',
                present_area: this.draft_details.present_area || '',
                present_street: this.draft_details.present_street || '',
                present_pin_code: this.draft_details.present_pin_code || '',
                customCheckbox: this.draft_details.customCheckbox || '',
                religion: this.draft_details.religion || '',
                religion_others: this.draft_details.religion_others || '',
                physically_handicapped: this.draft_details.physically_handicapped || '',
                disability_type: this.draft_details.disability_type || '',
                if_others: this.draft_details.if_others || '',
                addressCheckbox: this.draft_details.addressCheckbox || false,
                permanent_state: this.draft_details.permanent_state || '',
                permanent_district: this.draft_details.permanent_district || '',
                permanent_block: this.draft_details.permanent_block || '',
                permanent_police_station: this.draft_details.permanent_police_station || '',
                permanent_village: this.draft_details.permanent_village || '',
                permanent_area: this.draft_details.permanent_area || '',
                permanent_street: this.draft_details.permanent_street || '',
                permanent_pin_code: this.draft_details.permanent_pin_code || '',
                Jjb_id: this.draft_details.Jjb_id
              });
              this.formService.triggerFormValidation(this.form1);
              this.onStateChange('present');
              this.onDistrictChange('present');
            } else {
              console.log('No draft details found.', draftData);
            }
          },
          error => {
            console.error('Error fetching draft data:', error);
          }
        );
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
  fetchJjbList(){
    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.httpClient.get(`${this.appService.baseUrl}jjplist?status=1&dist_id=${this.authService.userDetail.dist_id}`, { headers })
    .subscribe(
      (response: any) => {
        this.jjb_list = response.data;
      },
      error => {
        this.jjb_list = [];
      }
    );
  }

  onStateChange(addressType: string){
    const selectedStateId = addressType === 'present' ? this.form1.value.present_state : this.form1.value.permanent_state;

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
    const selectedDistId = addressType === 'present' ? this.form1.value.present_district : this.form1.value.permanent_district;
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

  saveAsDraft() {
    if (this.form1.status === 'INVALID') {
      this.formService.triggerFormValidation(this.form1);
      return;
    }
  
    this.isFormSubmitInProgress = true;
  
    // Create a FormData object
    const formData = new FormData();
    
    // Append each field to FormData
    formData.append('fir_ddno', this.form1.value.fir_ddno?.trim() ?? '');
    formData.append('u_sections', this.form1.value.u_sections?.trim() ?? '');
    formData.append('police_station', this.form1.value.police_station?.toString() ?? '');
    formData.append('name_of_investigation_officer', this.form1.value.name_of_investigation_officer?.trim() ?? '');
    formData.append('cwpo_name', this.form1.value.cwpo_name?.trim() ?? '');
    formData.append('date', this.form1.value.date?.trim() ?? '');
    formData.append('time', this.form1.value.time?.trim() ?? '');
    formData.append('Jjb_id', this.form1.value.Jjb_id?.trim() ?? '');
    formData.append('child_name_known', this.form1.value.child_name_known?.trim() ?? '');
    formData.append('name', this.form1.value.name?.trim() ?? '');
    formData.append('guardian_name', this.form1.value.guardian_name?.trim() ?? '');
    formData.append('cd_dob', this.form1.value.cd_dob?.trim() ?? '');
    formData.append('dob_proof', this.form1.value.dob_proof?.trim() ?? '');
    formData.append('cd_age', this.form1.value.cd_age?.toString() ?? '');
    formData.append('present_state', this.form1.value.present_state?.trim() ?? '');
    formData.append('present_district', this.form1.value.present_district?.trim() ?? '');
    formData.append('present_block', this.form1.value.present_block?.trim() ?? '');
    formData.append('present_police_station', this.form1.value.present_police_station?.trim() ?? '');
    formData.append('present_village', this.form1.value.present_village?.trim() ?? '');
    formData.append('present_area', this.form1.value.present_area?.trim() ?? '');
    formData.append('present_street', this.form1.value.present_street?.trim() ?? '');
    formData.append('present_pin_code', this.form1.value.present_pin_code?.toString().trim() ?? '');
    formData.append('customCheckbox', this.form1.value.customCheckbox?.trim() ?? '');
    formData.append('religion', this.form1.value.religion?.trim() ?? '');
    formData.append('religion_others', this.form1.value.religion_others?.trim() ?? '');
    formData.append('physically_handicapped', this.form1.value.physically_handicapped?.trim() ?? '');
    formData.append('disability_type', this.form1.value.disability_type?.trim() ?? '');
    formData.append('if_others', this.form1.value.if_others?.trim() ?? '');
  
    // Handle permanent address based on the checkbox state
    if (this.form1.value.addressCheckbox) {
      // Permanent address fields are manually filled
      formData.append('permanent_state', this.form1.value.permanent_state?.trim() ?? '');
      formData.append('permanent_district', this.form1.value.permanent_district?.trim() ?? '');
      formData.append('permanent_block', this.form1.value.permanent_block?.trim() ?? '');
      formData.append('permanent_police_station', this.form1.value.permanent_police_station?.trim() ?? '');
      formData.append('permanent_village', this.form1.value.permanent_village?.trim() ?? '');
      formData.append('permanent_area', this.form1.value.permanent_area?.trim() ?? '');
      formData.append('permanent_street', this.form1.value.permanent_street?.trim() ?? '');
      formData.append('permanent_pin_code', this.form1.value.permanent_pin_code?.toString().trim() ?? '');
    } else {
      // Copy present address to permanent address
      formData.append('permanent_state', this.form1.value.present_state?.trim() ?? '');
      formData.append('permanent_district', this.form1.value.present_district?.trim() ?? '');
      formData.append('permanent_block', this.form1.value.present_block?.trim() ?? '');
      formData.append('permanent_police_station', this.form1.value.present_police_station?.trim() ?? '');
      formData.append('permanent_village', this.form1.value.present_village?.trim() ?? '');
      formData.append('permanent_area', this.form1.value.present_area?.trim() ?? '');
      formData.append('permanent_street', this.form1.value.present_street?.trim() ?? '');
      formData.append('permanent_pin_code', this.form1.value.present_pin_code?.toString().trim() ?? '');
    }

    const cd_photo: any = document.getElementById('cd_photo');
    if (cd_photo && cd_photo.files && cd_photo.files.length > 0) {
      formData.append('cd_photo', cd_photo.files[0]);
    }

    if (this.draftId !== null) {
      formData.append('draft_id', this.draftId.toString());
    }

  
    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    this.httpClient.post(`${this.appService.baseUrl}SaveJjpDraft?step_no=1`, formData, { headers })
      .subscribe(
        (response: any) => {
          this.isFormSubmitInProgress = false;
          const draftId = response.data.draft_id;
          this.router.navigate(['portal/jjb/jjb-registration/form-2', draftId]);
        },
        error => {
          this.isFormSubmitInProgress = false;
          console.error('Error response:', error);
          this.toastService.error(error.error?.message || 'An error occurred');
        }
      );
  }
  
  loadErrorsFromLocalStorage() {
    const formErrors: any = JSON.parse(localStorage.getItem(`Draft_${this.draftId}`) || '{}');
    const errors = formErrors[1] ?? null;
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


}