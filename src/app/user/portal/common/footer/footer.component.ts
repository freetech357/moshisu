import { Component } from '@angular/core';

@Component({
  selector: 'app-user-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  currentYear: any = '';
  ngOnInit() {
    this.currentYear = (new Date()).getFullYear();
  }
}
