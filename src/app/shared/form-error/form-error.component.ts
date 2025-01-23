import { Component, Input } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-form-error',
  templateUrl: './form-error.component.html',
  styleUrls: ['../../common.css', './form-error.component.css']
})
export class FormErrorComponent {

  @Input() field: AbstractControl < string | null, string | null > | null = null;

  get errorMessage(): string | null {
    if (this.field instanceof AbstractControl && this.field.errors != null) {
      return this.getErrorMessage(this.field.errors);
    }
    return null;
  }

  private getErrorMessage(errors: ValidationErrors): string | null {
    if (errors['required']) {
      return 'This field is required';
    }
    if (errors['email']) {
      return 'Invalid email address';
    }
    if (errors['minlength']) {
      return `Minimum length is ${errors['minlength'].requiredLength} characters`;
    }
    if (errors['maxlength']) {
      return `Maximum length is ${errors['maxlength'].requiredLength} characters`;
    }
    if (errors['min']) {
      return `Value must be greater than or equal to ${errors['min'].min}`;
    }
    if (errors['max']) {
      return `Value must be less than or equal to ${errors['max'].max}`;
    }
    if (errors['pattern']) {
      return 'Invalid input format';
    }
    if (errors['nullValidator']) {
      return 'This field cannot be null';
    }
    if (errors['requiredTrue']) {
      return 'This field must be selected';
    }
    if (errors['compare']) {
      return 'Field value does not match';
    }
    return null;
  }

}
