import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appReadOnly]'
})
export class ReadOnlyDirective {

  constructor() { }

  @HostListener('mousedown', ['$event'])
  @HostListener('keydown', ['$event'])
  preventDefault(event: Event) {
    event.preventDefault();
  }
  
}
