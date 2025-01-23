import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from '../../../../../services/form.service';
import { AppService } from '../../../../../services/app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastService } from '../../../../../services/toast.service';
import { AuthService } from '../../../../../services/auth.service';

// Define the interface for FamilyMember
interface FamilyMember {
  name: string;
  relation_with_child: string;
  fd_age: number;
  gender: string;
  education: string;
  occupation: string;
  monthly_income: number;
  health_status: string;
  mental_illness_history: string;
  addiction_history: string;
}

@Component({
  selector: 'app-form-2',
  templateUrl: './form-2.component.html',
  styleUrls: ['./form-2.component.css']  // Corrected styleUrl to styleUrls
})
export class Form2Component {

  form2: FormGroup;
  draftId: any;
  draft_details: any = [];
  displayErrors: string[] = []; // Holds the error messages for Step 2
  isFormSubmitInProgress: boolean = false;
  


  good_habit = [
    { id: 'watchingTv', value: 1, label: 'Watching TV/movies' },
    { id: 'playingGames', value: 2, label: 'Playing Games' },
    { id: 'readingBooks', value: 3, label: 'Reading Books' },
    { id: 'drawing', value: 4, label: 'Drawing' },
    { id: 'painting', value: 5, label: 'Painting' },
    { id: 'acting', value: 6, label: 'Acting' },
    { id: 'singing', value: 7, label: 'Singing' },
    { id: 'others', value: 8, label: 'Others' }
  ];

  bad_habit = [
    { id: 'smoking', value: 1, label: 'Smoking' },
    { id: 'alcoholConsumption', value: 2, label: 'Alcohol Consumption' },
    { id: 'gambling', value: 3, label: 'Gambling' },
    { id: 'begging', value: 4, label: 'Begging' },
    { id: 'drugUse', value: 5, label: 'Drug Use' },
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
    this.form2 = this.fb.group({
      family_availibility: [null, Validators.required],
      leftHome: new FormControl(''),
      reason_for_leaving_home: new FormControl(''),
      family_involvement_in_offences: new FormControl(''),
      details_of_offences: new FormControl(''),
      drug_use_specify: new FormControl(''),
      bad_habits_specify: new FormControl(''),
      good_habits_others: new FormControl(''),
      bad_habits: this.fb.control([]),
      good_habits: this.fb.control([]),
      familyDetails: this.fb.array([
        this.createFamilyMember()  // Initialize with one family member form
      ]),
    });
  }

  onGoodHabitsCheckboxChange(event: any): void {
    const checkbox = event.target;
    const goodHabitsControl = this.form2.get('good_habits') as FormControl;
    let selectedHabits: number[] = goodHabitsControl.value || [];
    if (checkbox.checked) {
      selectedHabits.push(Number(checkbox.value));
    } else {
      selectedHabits = selectedHabits.filter(value => value !== Number(checkbox.value));
    }
    goodHabitsControl.setValue(selectedHabits);
  }

  onBadHabitsCheckboxChange(event: any): void {
    const checkbox = event.target;
    const badHabitsControl = this.form2.get('bad_habits') as FormControl;
    let selectedHabits: number[] = badHabitsControl.value || [];
    if (checkbox.checked) {
      selectedHabits.push(Number(checkbox.value));
    } else {
      selectedHabits = selectedHabits.filter(value => value !== Number(checkbox.value));
    }
    badHabitsControl.setValue(selectedHabits);
  }

  isGoodHabitsChecked(value: number): boolean {
    const selectedHabits: number[] = this.form2.get('good_habits')?.value || [];
    return selectedHabits.includes(value);
  }

  isBadHabitsChecked(value: number): boolean {
    const selectedHabits: number[] = this.form2.get('bad_habits')?.value || [];
    return selectedHabits.includes(value);
  }

  get isDrugUseChecked(): boolean {
    const badHabits = this.form2.get('bad_habits')?.value;
    return badHabits.includes(5); // Assuming drugUse has a value of 5
  }

  get isGoodHabitsOthers(): boolean {
    const goodHabits = this.form2.get('good_habits')?.value;
    return goodHabits.includes(8); // Assuming drugUse has a value of 5
  }

  createFamilyMember(): FormGroup {
    return this.fb.group({
      name: [''],
      relation_with_child: [null],
      fd_age: [null],
      gender: [null],
      education: [null],
      occupation: [''],
      monthly_income: [''],
      health_status: [''],
      mental_illness_history: [''],
      addiction_history: ['']
    });
  }

  ngOnInit() {
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

  onAgeInput(event: any): void {
    const input = event.target.value;
    event.target.value = input.replace(/[^0-9]/g, '');
  }

  fetchDraftData(draftId: any) {
    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.httpClient.get(`${this.appService.baseUrl}fetchJjbDraft?draft_id=${draftId}`, { headers })
      .subscribe(
        (response: any) => {
          const draftData = response.data['2'];
          if (draftData) {
            this.draft_details = draftData;
            this.form2.patchValue({
              family_availibility: this.draft_details.family_availibility || '',
              leftHome: this.draft_details.left_home || '',
              reason_for_leaving_home: this.draft_details.reason_for_leaving_home || '',
              family_involvement_in_offences: this.draft_details.family_involvement_in_offences || '',
              details_of_offences: this.draft_details.details_of_offences || '',
              drug_use_specify: this.draft_details.drug_use_specify || '',
              bad_habits_specify: this.draft_details.bad_habits_specify || '',
              good_habits_others: this.draft_details.good_habits_others || '',
              bad_habits: this.draft_details.bad_habits || [],
              good_habits: this.draft_details.good_habits || [],
            });

            const familyDetailsFormArray = this.form2.get('familyDetails') as FormArray;
            familyDetailsFormArray.clear();
            draftData.family_details.forEach((member: any) => {
              familyDetailsFormArray.push(this.fb.group({
                name: [member.name || ''],
                relation_with_child: [member.relation_with_child || null],
                fd_age: [member.fd_age || ''],
                gender: [member.gender || ''],
                education: [member.education || null],
                occupation: [member.occupation || ''],
                monthly_income: member.monthly_income !== null && member.monthly_income !== undefined ? member.monthly_income : '', // Check for null or undefined
                health_status: [member.health_status || ''],
                mental_illness_history: [member.mental_illness_history || ''],
                addiction_history: [member.addiction_history || '']
              }));
            });

            this.formService.triggerFormValidation(this.form2);
          } else {
            console.log('No draft details found.', draftData);
          }
        },
        error => {
          console.error('Error fetching draft data:', error);
        }
      );
  }

  get familyDetails(): FormArray {
    return this.form2.get('familyDetails') as FormArray;
  }

  removeFamilyMember(index: number): void {
    // console.log('Removing index:', index);
    if (this.familyDetails.length > 1) {
      this.familyDetails.removeAt(index);
    } else {
      this.toastService.error('At least one family member detail must be present.');
    }
  }

  addFamilyMember(): void {
    this.familyDetails.push(this.createFamilyMember());
  }

  onAvailabilityChange(event: any): void {
    const selectedValue = event.target.value;
  
    if (selectedValue === '0') { // When "No" is selected
      this.familyDetails.clear();  // Clears all family member form controls
      // Reset each family member to its default state
      this.form2.get('familyDetails')?.reset();
    } else if (selectedValue === '1') { // When "Yes" is selected
      if (this.familyDetails.length === 0) {
        this.addFamilyMember();  // Add a new family member form group
      }
    }
  }
  

  saveAsDraft() {
    // if (this.form2.status === 'INVALID') {
    //   this.formService.triggerFormValidation(this.form2);
    //   return;
    // }
    this.isFormSubmitInProgress = true;
    const formData = this.form2.value;
    const formattedData = {
      family_availibility: formData.family_availibility,
      family_details: (formData.familyDetails as FamilyMember[]).map((member: FamilyMember) => ({
        name: member.name,
        relation_with_child: member.relation_with_child,
        fd_age: member.fd_age,
        gender: member.gender,
        education: member.education,
        occupation: member.occupation,
        monthly_income: member.monthly_income,
        health_status: member.health_status,
        mental_illness_history: member.mental_illness_history,
        addiction_history: member.addiction_history
      })),
      bad_habits: Array.isArray(formData.bad_habits) ? formData.bad_habits : [],
      good_habits: Array.isArray(formData.good_habits) ? formData.good_habits : [],
      left_home: formData.leftHome,
      reason_for_leaving_home: formData.reason_for_leaving_home,
      family_involvement_in_offences: formData.family_involvement_in_offences,
      details_of_offences: formData.details_of_offences,
      bad_habits_specify: formData.bad_habits_specify,
      drug_use_specify: formData.drug_use_specify,
      good_habits_others: formData.good_habits_others,
      draft_id: this.draftId || '',
    };


    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient.post(`${this.appService.baseUrl}SaveJjpDraft?step_no=2`, formattedData, { headers })
      .subscribe(
        (response: any) => {
          this.isFormSubmitInProgress = false;
          this.toastService.success(response.message);
          const draftId = response.data.draft_id;
          this.router.navigate(['portal/jjb/jjb-registration/form-3', draftId]);
        },
        error => {
          this.isFormSubmitInProgress = false;
          this.toastService.error(error.error.message);
        }
      );
  }

  loadErrorsFromLocalStorage() {
    const formErrors: any = JSON.parse(localStorage.getItem(`Draft_${this.draftId}`) || '{}');
    const errors = formErrors[2] ?? null;
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
