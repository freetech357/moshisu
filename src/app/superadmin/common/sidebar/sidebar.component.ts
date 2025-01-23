import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from '../../../services/app.service';

@Component({
  selector: 'app-superadmin-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['../../../common.css', './sidebar.component.css']
})
export class SidebarComponent {

  user: any = {};
  currentYear: any = '';
  userAccess: any = [];

  constructor(
    private httpClient: HttpClient,
    private appService: AppService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.user = {
      name: 'Super Admin User',
      email: 'superadmin@example.com'
    }
    this.currentYear = (new Date()).getFullYear();
    this.fetchUserPermission();
    console.log('Super Admin Sidebar')
  }

  fetchUserPermission() {
    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient.get(`${this.appService.baseUrl}getUserDetails`, { headers })
    .subscribe(
      (response: any) => {
        this.userAccess =  response.data[0];
        console.log('roles');
        console.log(this.userAccess.permissions);
      },
      error => {
  
      }
    );
  }


}
