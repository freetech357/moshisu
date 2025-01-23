import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./common.css', './app.component.css']
})
export class AppComponent {

  activeModule: string = '';
  isAdminPortalActive: boolean = false;
  isUserPortalActive: boolean = false;
  isDepartmentPortalActive: boolean = false;

  constructor(
    private router: Router
  ) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentUrl = event.url;
        const currentUrlParts = currentUrl.split('/');
        this.activeModule = currentUrlParts[1];
        if (currentUrlParts[1] === 'superadmin' && currentUrlParts[2] === 'portal') {
          this.isAdminPortalActive = true;
          return;
        }else if (currentUrlParts[1] === 'portal'){
          this.isUserPortalActive = true;
          return;
        }else if (currentUrlParts[1] === 'department' && currentUrlParts[2] === 'portal') {
          this.isDepartmentPortalActive = true;
          return;
        }
        this.isAdminPortalActive = false;
        this.isUserPortalActive = false;
        this.isDepartmentPortalActive = false;
      }
    });

  }
}
