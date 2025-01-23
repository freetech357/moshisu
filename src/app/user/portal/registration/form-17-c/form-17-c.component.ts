import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from '../../../../services/form.service';
import { AppService } from '../../../../services/app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastService } from '../../../../services/toast.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-form-17-c',
  templateUrl: './form-17-c.component.html',
  styleUrl: './form-17-c.component.css'
})
export class Form17CComponent {

  steps = [
    { label: 'Step 1', link: '/portal/registration/form-ab' },
    { label: 'Step 2', link: '/portal/registration/form-c/:draftId' },
    { label: 'Step 3', link: '/portal/registration/form-d/:draftId' },
    { label: 'Step 4', link: '/portal/registration/form-ef/:draftId' },
    { label: 'Step 5', link: '/portal/registration/form-ghijklmn/:draftId' }
  ];
  currentStep: number;

  draftId: any;
  draft_details: any = [];
  displayErrors: string[] = []; // Holds the error messages for Step 2


  form17_c = new FormGroup({
    child_photo: new FormControl(''),
    if_name_unknown: new FormControl('1'),
    child_name: new FormControl(''),
    child_age: new FormControl('',[ Validators.pattern('^[0-9]*$'), Validators.min(1),Validators.max(18) ]),
    age_according: new FormControl(''),
    child_gender: new FormControl(''),
    child_aadhar_availibility: new FormControl(''),
    child_aadhar_number: new FormControl('', [ Validators.pattern('^[0-9]{12}$')]),
    child_aadhar_copy: new FormControl(''),
    identity_marks: new FormControl(''),
    language: new FormControl(''),
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
    this.currentStep = this.getCurrentStep();
  }

  getCurrentStep(): number {
    // Determine the current step based on the route or other logic
    const url = this.router.url;
    const stepIndex = this.steps.findIndex(step => url.includes(step.link));
    return stepIndex + 1;
  }

  onAgeInput(event: any): void {
    const input = event.target.value;
    event.target.value = input.replace(/[^0-9]/g, '');
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.draftId = params['draftId']; // 'id' should match the parameter name in your route
      // console.log('ID from URL:', this.draftId);

      if(this.draftId !== null){
        this.fetchDraftData(this.draftId);
        this.loadErrorsFromLocalStorage();
      }
    });
  }

  loadErrorsFromLocalStorage() {
    const formErrors: any = JSON.parse(localStorage.getItem(`Draft_${this.draftId}`) || '{}');
    const errors = formErrors[2] ?? null;

    if (errors) {
      this.displayErrors = this.extractErrorMessages(errors);
    }

    // console.log('Errors in Step 2:', this.displayErrors);
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

  fetchDraftData(draftId: any){

    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient.get(`${this.appService.baseUrl}fetchDraft?draft_id=${draftId}`, { headers })
      .subscribe(
        (response: any) => {
          const draftDetails = response.data['2'];
          if (draftDetails) {
            this.draft_details = draftDetails;
            // console.log('dradtdetails step2:',this.draft_details);
            //this.updateFormControls();
            this.form17_c.patchValue({
              if_name_unknown: this.draft_details.if_name_unknown || '',
              child_name: this.draft_details.child_name || '',
              child_age: this.draft_details.child_age || '',
              age_according: this.draft_details.age_according || '',
              child_gender: this.draft_details.child_gender || '',
              child_aadhar_availibility: this.draft_details.child_aadhar_availibility || '',
              child_aadhar_number: this.draft_details.child_aadhar_number || '',
              identity_marks: this.draft_details.identity_marks || '',
              language: this.draft_details.language || ''
            });

            this.formService.triggerFormValidation(this.form17_c);
          } else {
            this.draft_details = [];
            // console.log('No draft details found for step 2.',this.draft_details);
          }
        },
        error => {
          this.draft_details = [];
        }
      );
  }

  saveAsDraft() {

    if (this.form17_c.status === 'INVALID') {
      this.formService.triggerFormValidation(this.form17_c);
      return;
    }
    this.isFormSubmitInProgress = true;

    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const formData = new FormData();

    const fileChildPhoto: any = document.getElementById('child_photo');
    if (fileChildPhoto && fileChildPhoto.files && fileChildPhoto.files.length > 0) {
      formData.append('child_photo', fileChildPhoto.files[0]);
    }
    formData.append('if_name_unknown', this.form17_c.value.if_name_unknown?.toString().trim() ?? '');
    formData.append('child_name', this.form17_c.value.child_name?.trim() ?? '');
    formData.append('child_age', this.form17_c.value.child_age?.toString().trim() ?? '');
    formData.append('age_according', this.form17_c.value.age_according?.toString().trim() ?? '');
    formData.append('child_gender', this.form17_c.value.child_gender?.toString().trim() ?? '');
    formData.append('child_aadhar_availibility', this.form17_c.value.child_aadhar_availibility?.toString().trim() ?? '');
    formData.append('child_aadhar_number', this.form17_c.value.child_aadhar_number?.toString().trim() ?? '');

    const fileChildAadhar: any = document.getElementById('child_aadhar_copy');
    if (fileChildAadhar && fileChildAadhar.files && fileChildAadhar.files.length > 0) {
      formData.append('child_aadhar_copy', fileChildAadhar.files[0]);
    }
    formData.append('identity_marks', this.form17_c.value.identity_marks?.trim() ?? '');
    formData.append('language', this.form17_c.value.language?.trim() ?? '');
    formData.append('draft_id', this.draftId);
    
    this.httpClient.post(`${this.appService.baseUrl}SaveCwcDraft?step_no=2`, formData, { headers })
    .subscribe(
      (response: any) => {
        this.isFormSubmitInProgress = false;
        this.toastService.success(response.message);
        const Id = response.data.draft_id;
        this.router.navigate(['portal/registration/form-d', Id]);
      },
      error => {
        this.isFormSubmitInProgress = false;
        this.toastService.error(error.error.message);
      }
    );
  }

}
