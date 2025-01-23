import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }

  triggerFormValidation(form: FormGroup) {
    for (const field in form.controls) {
      const control = form.get(field);
      if (control) {
        control.markAsTouched();
      }
    }
  }

  unTriggerFormValidation(form: FormGroup) {
    for (const field in form.controls) {
      const control = form.get(field);
      if (control) {
        control.markAsUntouched();
      }
    }
  }
}
