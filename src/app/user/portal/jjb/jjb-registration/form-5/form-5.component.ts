import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from '../../../../../services/form.service';
import { AppService } from '../../../../../services/app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastService } from '../../../../../services/toast.service';
import { AuthService } from '../../../../../services/auth.service';

@Component({
  selector: 'app-form-5',
  templateUrl: './form-5.component.html',
  styleUrl: './form-5.component.css'
})
export class Form5Component {

  draftId: number | null = null;
  draft_details: any = [];
  form_5: FormGroup;
  isFormSubmitInProgress: boolean = false;
  isDraftSaved: boolean = false; // Flag to track if the draft is saved
  displayErrors: { step: string, messages: string[] }[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private formService: FormService,
    private appService: AppService,
    private httpClient: HttpClient,
    private toastService: ToastService,
    private authService: AuthService
  ) {
    this.form_5 = this.fb.group({
      reason_for_alleged_offence: [''],
      circumstances_of_apprehension: [''],
      details_of_recovered_articles: [''],
      alleged_role_in_offence: [''],
      child_welfare_officer_suggestions: [''],
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const draftIdParam = params['draftId'];
      this.draftId = draftIdParam ? +draftIdParam : null; 
      // console.log('ID from URL from form 4:', this.draftId);
      if(this.draftId !== null){
        this.fetchDraftData(this.draftId);
      }
    });
  }

  saveAsDraft(){
    if (this.form_5.invalid) {
      this.formService.triggerFormValidation(this.form_5);
      return;
    }
    this.isFormSubmitInProgress = true;
    const formData = this.form_5.value;
    const formattedData = {
      reason_for_alleged_offence: formData.reason_for_alleged_offence,
      circumstances_of_apprehension: formData.circumstances_of_apprehension,
      details_of_recovered_articles: formData.details_of_recovered_articles,
      alleged_role_in_offence: formData.alleged_role_in_offence,
      child_welfare_officer_suggestions: formData.child_welfare_officer_suggestions,
      draft_id: this.draftId || '',
    };

    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient.post(`${this.appService.baseUrl}SaveJjpDraft?step_no=5`, formattedData, { headers })
      .subscribe(
        (response: any) => {
          this.isFormSubmitInProgress = false;
          this.toastService.success(response.message);
          this.isDraftSaved = true;
          // const draftId = response.data.draft_id;
          // this.router.navigate(['portal/jjb/jjb-registration/form-5', draftId]);
        },
        error => {
          this.isFormSubmitInProgress = false;
          this.toastService.error(error.error.message);
        }
      );
  }

  fetchDraftData(draftId: any) {
    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.httpClient.get(`${this.appService.baseUrl}fetchJjbDraft?draft_id=${draftId}`, { headers })
      .subscribe(
        (response: any) => {
          const draftData = response.data['5'];
          if (draftData) {
            this.draft_details = draftData;
            // console.log("draft_details", this.draft_details);
            this.form_5.patchValue({
              reason_for_alleged_offence: this.draft_details.reason_for_alleged_offence || '',
              circumstances_of_apprehension: this.draft_details.circumstances_of_apprehension || '',
              details_of_recovered_articles: this.draft_details.details_of_recovered_articles || '',
              alleged_role_in_offence: this.draft_details.alleged_role_in_offence || '',
              child_welfare_officer_suggestions: this.draft_details.child_welfare_officer_suggestions || '',
            });

            this.formService.triggerFormValidation(this.form_5);
          } else {
            console.log('No draft details found.', draftData);
          }
        },
        error => {
          console.error('Error fetching draft data:', error);
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

    this.httpClient.post(`${this.appService.baseUrl}JjbFinalSubmit`, payload, { headers })
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
