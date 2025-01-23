import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appValidationFormat]'
})
export class ValidationFormatDirective {

  constructor(
    private el:ElementRef
  ) { }
  @HostListener('input', ['$event']) onInput(event: any) {
    const value = event.target.value;

    // Aadhar number formatting
    if (value.length <= 14) {
      const formattedValue = value.replace(/\D/g, '').match(new RegExp('.{1,4}', 'g'))?.join(' ') || '';
      this.el.nativeElement.value = formattedValue;
    }
  }

}
