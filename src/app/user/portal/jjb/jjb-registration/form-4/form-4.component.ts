import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastService } from '../../../../../services/toast.service';
import { AuthService } from '../../../../../services/auth.service';
import { AppService } from '../../../../../services/app.service';
import { FormService } from '../../../../../services/form.service';

@Component({
  selector: 'app-form-4',
  templateUrl: './form-4.component.html',
  styleUrl: './form-4.component.css'
})
export class Form4Component {

  draftId: number | null = null;
  draft_details: any = [];
  form_4: FormGroup;
  isFormSubmitInProgress: boolean = false;
  displayErrors: string[] = []; // Holds the error messages for Step 4

  majority_of_friends = [
    { id: 'Educated', value: 1, label: 'Educated' },
    { id: 'Illiterate', value: 2, label: 'Illiterate' },
    { id: 'Older_in_age', value: 3, label: 'Older in age' },
    { id: 'The_same_age_group', value: 4, label: 'The same age group' },
    { id: 'Younger_in_age', value: 5, label: 'Younger in age' },
    { id: 'Same_sex', value: 6, label: 'Same sex' }, 
    { id: 'Opposite_sex', value: 7, label: 'Opposite sex' },
    { id: 'With_criminal_background', value: 8, label: 'With criminal background' },
    { id: 'Addicts', value: 9, label: 'Addicts' }// Fixed duplicate value
  ]


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
    this.form_4 = this.fb.group({
      verbal_abuse: [''],
      verbal_abuse_by_whom: [''],
      physical_abuse: [''],
      physical_abuse_by_whom: [''],
      sexual_abuse: [''],
      sexual_abuse_by_whom: [''],
      other_abuse_details: [''],
      victim_of_offence: [''],
      offence_details: [''],
      involvement_in_gangs: [''],
      gang_involvement_details: [''],
      majority_of_friends: this.fb.control([]),
    })
  }


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const draftIdParam = params['draftId'];
      this.draftId = draftIdParam ? +draftIdParam : null; 
      // console.log('ID from URL from form 4:', this.draftId);
      if(this.draftId !== null){
        this.fetchDraftData(this.draftId);
        this.loadErrorsFromLocalStorage();
      }
    });
  }

  onCheckboxChange(event: any): void {
    const checkbox = event.target;
    const majorityOfFriendsArray = this.form_4.get('majority_of_friends') as FormArray;
    let selected: number[] = majorityOfFriendsArray.value || [];
    if (checkbox.checked) {
      selected.push(Number(checkbox.value));
    } else {
      selected = selected.filter(value => value !== Number(checkbox.value));
    }
    majorityOfFriendsArray.setValue(selected);
  }

  isChecked(value: number): boolean {
    const selected: number[] = this.form_4.get('majority_of_friends')?.value || [];
    return selected.includes(value);
  }

  saveAsDraft(): void{
    if (this.form_4.invalid) {
      this.formService.triggerFormValidation(this.form_4);
      return;
    }
    this.isFormSubmitInProgress = true;
    const formData = this.form_4.value;
    const formattedData = {
      majority_of_friends: Array.isArray(formData.majority_of_friends) ? formData.majority_of_friends : [],
      verbal_abuse: formData.verbal_abuse,
      verbal_abuse_by_whom: formData.verbal_abuse_by_whom,
      physical_abuse: formData.physical_abuse,
      physical_abuse_by_whom: formData.physical_abuse_by_whom,
      sexual_abuse: formData.sexual_abuse,
      sexual_abuse_by_whom: formData.sexual_abuse_by_whom,
      other_abuse_details: formData.other_abuse_details,
      victim_of_offence: formData.victim_of_offence,
      offence_details: formData.offence_details,
      involvement_in_gangs: formData.involvement_in_gangs,
      gang_involvement_details: formData.gang_involvement_details,
      draft_id: this.draftId || '',
    };

    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient.post(`${this.appService.baseUrl}SaveJjpDraft?step_no=4`, formattedData, { headers })
      .subscribe(
        (response: any) => {
          this.isFormSubmitInProgress = false;
          this.toastService.success(response.message);
          const draftId = response.data.draft_id;
          this.router.navigate(['portal/jjb/jjb-registration/form-5', draftId]);
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
          const draftData = response.data['4'];
          if (draftData) {
            this.draft_details = draftData;
            this.form_4.patchValue({
              verbal_abuse: this.draft_details.verbal_abuse || '',
              verbal_abuse_by_whom: this.draft_details.verbal_abuse_by_whom || '',
              physical_abuse: this.draft_details.physical_abuse || '',
              physical_abuse_by_whom: this.draft_details.physical_abuse_by_whom || '',
              sexual_abuse: this.draft_details.sexual_abuse || '',
              sexual_abuse_by_whom: this.draft_details.sexual_abuse_by_whom || '',
              other_abuse_details: this.draft_details.other_abuse_details|| '',
              victim_of_offence: this.draft_details.victim_of_offence || '',
              offence_details: this.draft_details.offence_details || '',
              involvement_in_gangs: this.draft_details.involvement_in_gangs || '',
              gang_involvement_details: this.draft_details.gang_involvement_details || '',
              majority_of_friends: this.draft_details.majority_of_friends || [],
            });

            this.formService.triggerFormValidation(this.form_4);
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

}
