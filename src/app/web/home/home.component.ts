import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../../common.css', './home.component.css']
})
export class HomeComponent {

  constructor(
    private router: Router
  ) {}

  ngOnInit() {
    this.router.navigate(['/login']);
  }

}
