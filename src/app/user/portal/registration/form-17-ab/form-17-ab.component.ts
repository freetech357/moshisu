import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from '../../../../services/form.service';
import { AppService } from '../../../../services/app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastService } from '../../../../services/toast.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-form-17-ab',
  templateUrl: './form-17-ab.component.html',
  styleUrl: './form-17-ab.component.css'
})
export class Form17AbComponent {

  

  states: any = [];
  districts: any = [];
  blocks: any = [];
  cwc_lists: any = [];
  draftId: any; 
  draft_details: any = [];
  displayErrors: string[] = []; // Holds the error messages for Step 1
  steps: any = [];
  // currentStep: number;
  

  form17_ab = new FormGroup({

    case_no: new FormControl('',[Validators.required]),
    childWelfareCommittee: new FormControl('',[Validators.required]),
    dateOfProduction: new FormControl(''),
    timeOfProduction: new FormControl(''),
    placeProduction: new FormControl(''),
    photo: new FormControl(''),
    nameOfthePerson: new FormControl(''),
    age: new FormControl('',[Validators.pattern('^[0-9]*$'), Validators.min(1),Validators.max(120)]),
    gender: new FormControl(''),
    AadharNumber: new FormControl('', [ Validators.pattern('^[0-9]{12}$')]),
    uploadAadhar: new FormControl(''),
    state_id: new FormControl(''),
    district_id: new FormControl(''),
    block_id: new FormControl(''),
    policeStation: new FormControl(''),
    nameOftheVillage: new FormControl(''),
    nameOfthearea: new FormControl(''),
    nameOftheStreet: new FormControl(''),
    postalcode: new FormControl(''),

    pm_state_id: new FormControl(''),
    pm_district_id: new FormControl(''),
    pm_block_id: new FormControl(''),
    pm_policeStation: new FormControl(''),
    pm_nameOftheVillage: new FormControl(''),
    pm_nameOfthearea: new FormControl(''),
    pm_nameOftheStreet: new FormControl(''),
    pm_PostalCode: new FormControl(''),
    addressCheckbox:new FormControl (false),
    nameOftheDesignation: new FormControl(''),
    organisation: new FormControl(''),
    contactNumber: new FormControl('', [ Validators.pattern('^[0-9]{10}$')])

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
  ) {
    // this.currentStep = this.getCurrentStep(); 
     }

  // getCurrentStep(): number {
  //   // Determine the current step based on the route or other logic
  //   const url = this.router.url;
  //   const stepIndex = this.steps.findIndex(step => url.includes(step.link));
  //   return stepIndex + 1;
  // }

  onAgeInput(event: any): void {
    const input = event.target.value;
    event.target.value = input.replace(/[^0-9]/g, '');
  }

  ngOnInit() {
    this.fetchStates();
    this.fetchCwcList();

    this.route.params.subscribe(params => {
    const draftIdParam = params['draftId']; // 'id' should match the parameter name in your route
    this.draftId = draftIdParam ? +draftIdParam : null; 
    // console.log('ID from URL:', this.draftId);

    if(this.draftId !== null){
      this.fetchDraftData(this.draftId);
      this.loadErrorsFromLocalStorage();
    }

    this.steps = [
      { number: '1', label: 'Step 1', link: this.draftId ? `/portal/registration/form-ab/${this.draftId}` : '/portal/registration/form-ab' },
      { number: '2', label: 'Step 2', link: `/portal/registration/form-c/${this.draftId}` },
      { number: '3', label: 'Step 3', link: `/portal/registration/form-d/${this.draftId}` },
      { number: '4', label: 'Step 4', link: `/portal/registration/form-ef/${this.draftId}` },
      { number: '5', label: 'Step 5', link: `/portal/registration/form-ghijklmn/${this.draftId}` }
    ];

    // Set the current step
    // this.currentStep = this.getCurrentStep();
      
    });
  }
  // isActiveStep(step: any): boolean {
  //   return this.currentStep === +step.number;
  // }

  // isLastStep(step: any): boolean {
  //   return this.steps[this.steps.length - 1] === step;
  // }

  // getCurrentStep(): number {
  //   // Determine the current step based on the route or other logic
  //   const url = this.router.url;
  //   console.log(url)
  //   const stepIndex = this.steps.findIndex(step => url.includes(step.link));
  //   return stepIndex + 1;
  // }

  

  fetchCwcList(){
    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.httpClient.get(`${this.appService.baseUrl}cwclist?dist_id=${this.authService.userDetail.dist_id}&status=1`, { headers })
    .subscribe(
      (response: any) => {
        this.cwc_lists = response.data;
        // console.log(this.cwc_lists.cwc_name)
        // this.form17_ab.patchValue({
        //   childWelfareCommittee: this.cwc_lists.cwc_name || ''
        // });
      },
      error => {
        this.cwc_lists = [];
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

  onStateChange(addressType: string){
    const selectedStateId = addressType === 'present' ? this.form17_ab.value.state_id : this.form17_ab.value.pm_state_id;

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
    const selectedDistId = addressType === 'present' ? this.form17_ab.value.district_id : this.form17_ab.value.pm_district_id;
    const token   = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient.get(`${this.appService.baseUrl}blocklist?district_id=${selectedDistId}&status=1`, { headers })
    .subscribe(
      (response: any) => {
        // console.log("Ondistchange" , response);
        this.blocks = response.data;
      },
      error => {
        this.blocks = [];
      }
    );
  }

  loadErrorsFromLocalStorage() {
    const formErrors: any = JSON.parse(localStorage.getItem(`Draft_${this.draftId}`) || '{}');
    const errors = formErrors[1] ?? null;

    if (errors) {
      this.displayErrors = this.extractErrorMessages(errors);
    }

    // console.log('Errors in Step 1:', this.displayErrors);
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

  convertToTimeFormat(time: string): string {
    // If time is in HH:MM format, add ':00' for seconds
    if (time && time.length === 5) {
      return `${time}:00`;
    }
    return time;
  }

  saveAsDraft() {
    if (this.form17_ab.status === 'INVALID') {
      this.formService.triggerFormValidation(this.form17_ab);
      return;
    }
  
    this.isFormSubmitInProgress = true;
  
    const timeOfProduction = this.form17_ab.get('timeOfProduction')?.value ?? '';
    const formattedTime = this.convertToTimeFormat(timeOfProduction);
  
    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    const formData = new FormData();
    formData.append('case_no', this.form17_ab.value.case_no?.trim() ?? '');
    formData.append('cwc_id', this.form17_ab.value.childWelfareCommittee?.toString().trim() ?? '');
    formData.append('dop', this.form17_ab.value.dateOfProduction?.trim() ?? '');
    formData.append('top', formattedTime ?? '');
    formData.append('production_place', this.form17_ab.value.placeProduction?.trim() ?? '');
  
    const filePhoto: any = document.getElementById('photo');
    if (filePhoto && filePhoto.files && filePhoto.files.length > 0) {
      formData.append('photo', filePhoto.files[0]);
    }
  
    formData.append('person_name', this.form17_ab.value.nameOfthePerson?.trim() ?? '');
    formData.append('age', this.form17_ab.value.age?.toString().trim() ?? '');
    formData.append('gender', this.form17_ab.value.gender?.trim() ?? '');
    formData.append('aadhar_number', this.form17_ab.value.AadharNumber?.toString().trim() ?? '');
  
    const fileAadhar: any = document.getElementById('uploadAadhar');
    if (fileAadhar && fileAadhar.files && fileAadhar.files.length > 0) {
      formData.append('aadhar_copy', fileAadhar.files[0]);
    }
  
    formData.append('designation_name', this.form17_ab.value.nameOftheDesignation?.trim() ?? '');
    formData.append('organization_name', this.form17_ab.value.organisation?.trim() ?? '');
    formData.append('mobile_number', this.form17_ab.value.contactNumber?.toString().trim() ?? '');
  
    // Present Address
    formData.append('pr_state_id', this.form17_ab.value.state_id?.toString().trim() ?? '');
    formData.append('pr_district_id', this.form17_ab.value.district_id?.trim() ?? '');
    formData.append('pr_block', this.form17_ab.value.block_id?.toString().trim() ?? '');
    formData.append('pr_police_station', this.form17_ab.value.policeStation?.trim() ?? '');
    formData.append('pr_village', this.form17_ab.value.nameOftheVillage?.trim() ?? '');
    formData.append('pr_area', this.form17_ab.value.nameOfthearea?.trim() ?? '');
    formData.append('pr_street', this.form17_ab.value.nameOftheStreet?.trim() ?? '');
    formData.append('pr_pin', this.form17_ab.value.postalcode?.toString().trim() ?? '');

  
    // Permanent Address - Check if checkbox is not ticked, copy present address
    if (!this.form17_ab.get('addressCheckbox')?.value) {
      formData.append('pm_state_id', this.form17_ab.value.state_id?.toString().trim() ?? '');
      formData.append('pm_district_id', this.form17_ab.value.district_id?.trim() ?? '');
      formData.append('pm_block', this.form17_ab.value.block_id?.toString().trim() ?? '');
      formData.append('pm_police_station', this.form17_ab.value.policeStation?.trim() ?? '');
      formData.append('pm_village', this.form17_ab.value.nameOftheVillage?.trim() ?? '');
      formData.append('pm_area', this.form17_ab.value.nameOfthearea?.trim() ?? '');
      formData.append('pm_street', this.form17_ab.value.nameOftheStreet?.trim() ?? '');
      formData.append('pm_pin', this.form17_ab.value.postalcode?.toString().trim() ?? '');
    } else {
      // Permanent address is filled manually
      formData.append('pm_state_id', this.form17_ab.value.pm_state_id?.toString().trim() ?? '');
      formData.append('pm_district_id', this.form17_ab.value.pm_district_id?.trim() ?? '');
      formData.append('pm_block', this.form17_ab.value.pm_block_id?.toString().trim() ?? '');
      formData.append('pm_police_station', this.form17_ab.value.pm_policeStation?.trim() ?? '');
      formData.append('pm_village', this.form17_ab.value.pm_nameOftheVillage?.trim() ?? '');
      formData.append('pm_area', this.form17_ab.value.pm_nameOfthearea?.trim() ?? '');
      formData.append('pm_street', this.form17_ab.value.pm_nameOftheStreet?.trim() ?? '');
      formData.append('pm_pin', this.form17_ab.value.pm_PostalCode?.toString().trim() ?? '');
    }

    if (this.draftId !== null) {
      formData.append('draft_id', this.draftId.toString());
    }
  
    this.httpClient.post(`${this.appService.baseUrl}SaveCwcDraft?step_no=1`, formData, { headers })
      .subscribe(
        (response: any) => {
          this.isFormSubmitInProgress = false;
          // console.log('Success response:', response);
          this.toastService.success(response.message);
  
          const draftId = response.data.draft_id;
          this.router.navigate(['portal/registration/form-c', draftId]);
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
          const draftData = response.data['1'];
          if (draftData) {
            this.draft_details = draftData ;
            // console.log('Draft details step 1',this.draft_details);

            this.form17_ab.patchValue({
              case_no: this.draft_details.case_no || '',
              childWelfareCommittee: this.draft_details.cwc_id || '',
              dateOfProduction: this.draft_details.dop || '',
              timeOfProduction: this.draft_details.top || '',
              placeProduction: this.draft_details.production_place || '',
              nameOfthePerson: this.draft_details.person_name || '',
              age: this.draft_details.age || '',
              gender: this.draft_details.gender || '',
              AadharNumber: this.draft_details.aadhar_number || '',
              nameOftheDesignation: this.draft_details.designation_name || '',
              organisation: this.draft_details.organization_name || '',
              contactNumber: this.draft_details.mobile_number || '',
              state_id: this.draft_details.pr_state_id || '',
              district_id: this.draft_details.pr_district_id || '',
              block_id: this.draft_details.pr_block || '',
              policeStation: this.draft_details.pr_police_station || '',
              nameOftheVillage: this.draft_details.pr_village || '',
              nameOfthearea: this.draft_details.pr_area || '',
              nameOftheStreet: this.draft_details.pr_street || '',
              postalcode: this.draft_details.pr_pin || '',
              pm_state_id: this.draft_details.pm_state_id || '',
              pm_district_id: this.draft_details.pm_district_id || '',
              pm_block_id: this.draft_details.pm_block || '',
              pm_policeStation: this.draft_details.pm_police_station || '',
              pm_nameOftheVillage: this.draft_details.pm_village || '',
              pm_nameOfthearea: this.draft_details.pm_area || '',
              pm_nameOftheStreet: this.draft_details.pm_street || '',
              pm_PostalCode: this.draft_details.pm_pin || '',
              // isPermanentAddressSame: true
            });
            this.formService.triggerFormValidation(this.form17_ab);
            this.onStateChange('present');
            this.onDistrictChange('present');
          } else {
            this.draft_details = [];
            // console.log('No draft details found for step 1.',this.draft_details);
          }
        },
        error => {
          this.draft_details = [];
        }
      );
  }
}

  


