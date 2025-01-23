import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastService } from '../../../../../services/toast.service';
import { AuthService } from '../../../../../services/auth.service';
import { AppService } from '../../../../../services/app.service';
import { FormService } from '../../../../../services/form.service';

@Component({
  selector: 'app-form-3',
  templateUrl: './form-3.component.html',
  styleUrls: ['./form-3.component.css']
})
export class Form3Component implements OnInit {

  draftId: any;
  draft_details: any = [];
  form_3: FormGroup;
  isFormSubmitInProgress: boolean = false;
  displayErrors: string[] = []; // Holds the error messages for Step 4


  use_for = [
    { id: 'dressMaterials', value: 1, label: 'Dress Materials' },
    { id: 'gambling', value: 2, label: 'Gambling' },
    { id: 'alcohol', value: 3, label: 'Alcohol' },
    { id: 'drug', value: 4, label: 'Drug' },
    { id: 'smoking', value: 5, label: 'Smoking' },
    { id: 'savings', value: 6, label: 'Savings' }, // Fixed duplicate value
  ];

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
    this.form_3 = this.fb.group({
      employed: [''],
      specify_details: [''],
      sent_to_family: [''],
      used_by_self: [''],
      education_level: [null],
      reason_for_leaving_school: [null],
      other_reason: [''],
      school_type: [null],
      vocational_training_details: [''],
      use_for: this.fb.control([]),
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const draftIdParam = params['draftId'];
      this.draftId = draftIdParam ? +draftIdParam : null; 
      // console.log('ID from URL:', this.draftId);
        if(this.draftId !== null){
          this.fetchDraftData(this.draftId);
          this.loadErrorsFromLocalStorage();
        }
    });
  }

  onUseForCheckboxChange(event: any): void {
    const checkbox = event.target;
    const useForArray = this.form_3.get('use_for') as FormArray;
    let selectedUsedFor: number[] = useForArray.value || [];
    if (checkbox.checked) {
      selectedUsedFor.push(Number(checkbox.value));
    } else {
      selectedUsedFor = selectedUsedFor.filter(value => value !== Number(checkbox.value));
    }
    useForArray.setValue(selectedUsedFor);
  }

  isUseForChecked(value: number): boolean {
    const selectedUsedFor: number[] = this.form_3.get('use_for')?.value || [];
    return selectedUsedFor.includes(value);
  }

  saveAsDraft(): void {
    if (this.form_3.invalid) {
      this.formService.triggerFormValidation(this.form_3);
      return;
    }
    this.isFormSubmitInProgress = true;
    const formData = this.form_3.value;
    const formattedData = {
      employed: formData.employed,
      specify_details: formData.specify_details,
      sent_to_family: formData.sent_to_family,
      used_by_self: formData.used_by_self,
      used_for: Array.isArray(formData.use_for) ? formData.use_for : [],
      education_level: formData.education_level,
      reason_for_leaving_school: formData.reason_for_leaving_school,
      school_type: formData.school_type,
      other_reason: formData.other_reason,
      vocational_training_details: formData.vocational_training_details,
      draft_id: this.draftId || '',
    };
    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient.post(`${this.appService.baseUrl}SaveJjpDraft?step_no=3`, formattedData, { headers })
      .subscribe(
        (response: any) => {
          this.isFormSubmitInProgress = false;
          this.toastService.success(response.message);
          const draftId = response.data.draft_id;
          this.router.navigate(['portal/jjb/jjb-registration/form-4', draftId]);
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
          const draftData = response.data['3'];
          if (draftData) {
            this.draft_details = draftData;
            this.form_3.patchValue({
              employed: this.draft_details.employed || '',
              specify_details: this.draft_details.specify_details || '',
              sent_to_family: this.draft_details.sent_to_family || '',
              used_by_self: this.draft_details.used_by_self || '',
              education_level: this.draft_details.education_level || null,
              reason_for_leaving_school: this.draft_details.reason_for_leaving_school || null,
              other_reason: this.draft_details.other_reason|| null,
              school_type: this.draft_details.school_type || null,
              vocational_training_details: this.draft_details.vocational_training_details || '',
              use_for: this.draft_details.used_for || [],
              good_habits: this.draft_details.good_habits || [],
            });

            this.formService.triggerFormValidation(this.form_3);
          } else {
            console.log('No draft details found.', draftData);
          }
        },
        error => {
          console.error('Error fetching draft data:', error);
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
  resetUseForCheckboxes(): void {
    this.form_3.get('use_for')?.setValue([]); // Reset the 'use_for' form control to an empty array
  }
}
