import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from '../../../../services/form.service';
import { AppService } from '../../../../services/app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastService } from '../../../../services/toast.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-form-17-ghijklmn',
  templateUrl: './form-17-ghijklmn.component.html',
  styleUrl: './form-17-ghijklmn.component.css'
})
export class Form17GhijklmnComponent {

  draftId: any;
  draft_details: any = [];
  displayErrors: { step: string, messages: string[] }[] = [];
  isDraftSaved: boolean = false; // Flag to track if the draft is saved
  // displayErrors: string[] = [];

  form17_ghijklmn = new FormGroup({

    circumstances_under_child_found: new FormControl(''),
    offence_commited_on_child: new FormControl(''),
    physical_condition: new FormControl(''),
    belongings_of_the_child: new FormControl(''),
    date_and_time_child_came: new FormControl(''),
    immediate_efforts_to_trace_family: new FormControl(''),
    medical_treatment_provided: new FormControl(''),
    specify_medical_details: new FormControl(''),
    medical_supported_document: new FormControl(''),
    police_informed: new FormControl(''),
    specify_police_details: new FormControl(''),
    police_supported_document: new FormControl('')
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
    this.route.params.subscribe(params => {
      this.draftId = params['draftId']; // 'id' should match the parameter name in your route
      // console.log('ID from URL:', this.draftId);

      if(this.draftId !== null){
        this.fetchDraftData(this.draftId);
      }
    });
  }

  saveAsDraft(){

    if (this.form17_ghijklmn.status === 'INVALID') {
      this.formService.triggerFormValidation(this.form17_ghijklmn);
      return;
    }
    this.isFormSubmitInProgress = true;

    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    const formData = new FormData();
      formData.append('draft_id', this.draftId);
      formData.append('circumstances_under_child_found', this.form17_ghijklmn.value.circumstances_under_child_found?.trim() ?? '');
      formData.append('offence_commited_on_child', this.form17_ghijklmn.value.offence_commited_on_child?.trim() ?? '');
      formData.append('physical_condition', this.form17_ghijklmn.value.physical_condition?.trim() ?? '');
      formData.append('belongings_of_the_child', this.form17_ghijklmn.value.belongings_of_the_child?.trim() ?? '');
      formData.append('date_and_time_child_came', this.form17_ghijklmn.value.date_and_time_child_came?.trim() ?? '');
      formData.append('immediate_efforts_to_trace_family', this.form17_ghijklmn.value.immediate_efforts_to_trace_family?.trim() ?? '');
      formData.append('medical_treatment_provided', this.form17_ghijklmn.value.medical_treatment_provided?.toString().trim() ?? '');
      formData.append('specify_medical_details', this.form17_ghijklmn.value.specify_medical_details?.trim() ?? '');
      const medicalDocument: any = document.getElementById('medical_supported_document');
      if (medicalDocument && medicalDocument.files && medicalDocument.files.length > 0) {
        formData.append('medical_supported_document', medicalDocument.files[0]);
      }
      formData.append('police_informed', this.form17_ghijklmn.value.police_informed?.toString().trim() ?? '');
      formData.append('specify_police_details', this.form17_ghijklmn.value.specify_police_details?.trim() ?? '');
      const policeDocument: any = document.getElementById('police_supported_document');
      if (policeDocument && policeDocument.files && policeDocument.files.length > 0) {
        formData.append('police_supported_document', policeDocument.files[0]);
      }
      

    this.httpClient.post(`${this.appService.baseUrl}SaveCwcDraft?step_no=5`, formData, { headers })
    .subscribe(
      (response: any) => {
        this.isFormSubmitInProgress = false;
        this.isDraftSaved = true;
        this.toastService.success(response.message);

        if(this.draftId !== null){
          this.fetchDraftData(this.draftId);
        }
        // this.router.navigate(['portal/registration']);
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
          const draftData = response.data['5'];
          this.draft_details = draftData ;
          if (draftData) {
            this.draft_details = draftData ;

            this.form17_ghijklmn.patchValue({
              circumstances_under_child_found: this.draft_details.circumstances_under_child_found || '',
              physical_condition: this.draft_details.physical_condition || '',
              offence_commited_on_child: this.draft_details.offence_commited_on_child || '',
              belongings_of_the_child: this.draft_details.belongings_of_the_child || '',
              date_and_time_child_came: this.draft_details.date_and_time_child_came || '',
              immediate_efforts_to_trace_family: this.draft_details.immediate_efforts_to_trace_family || '',
              medical_treatment_provided: this.draft_details.medical_treatment_provided || '',
              specify_medical_details: this.draft_details.specify_medical_details || '',
              police_informed: this.draft_details.police_informed || '',
              specify_police_details: this.draft_details.specify_police_details || ''
            });
            this.formService.triggerFormValidation(this.form17_ghijklmn);
          } else {
            this.draft_details = [];
          }
        },
        error => {
          this.draft_details = [];
        }
      );
  }

  onFinalSubmit(){

    if (!this.isDraftSaved) {
      return; // Prevent submission if the draft isn't saved
    }
    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const payload = {
      draft_id: this.draftId
    }

    this.httpClient.post(`${this.appService.baseUrl}cwcChildFinalSubmit`, payload, { headers })
    .subscribe(
      (response: any) => {
        this.toastService.success(response.message);

        // Remove the draft ID from localStorage if it exists
        localStorage.removeItem(`Draft_${this.draftId}`);
        
        this.router.navigate(['portal/registration']);
      },
      error => {
        this.toastService.error(error.error.message);

        // Store error messages in localStorage
        const errors = error.error.errors;
        if (errors) {
          // const apiErrors = `Draft_${this.draftId}`;
          localStorage.setItem(`Draft_${this.draftId}`, JSON.stringify(errors));
          // Trigger a method to show errors in the red box
          this.showErrorMessages();
        }
      }
    );
  }

  showErrorMessages() {
    const errors = JSON.parse(localStorage.getItem(`Draft_${this.draftId}`) || '{}');
  const groupedErrors: { step: string, messages: string[] }[] = [];

  for (const step in errors) {
    if (errors.hasOwnProperty(step)) {
      const stepErrors = errors[step];
      const stepMessages: string[] = [];

      for (const field in stepErrors) {
        if (stepErrors.hasOwnProperty(field)) {
          stepMessages.push(...stepErrors[field]);
        }
      }

      groupedErrors.push({
        step: `Errors in Step ${step}`,
        messages: stepMessages
      });
    }
  }

  this.displayErrors = groupedErrors;
  }

}
