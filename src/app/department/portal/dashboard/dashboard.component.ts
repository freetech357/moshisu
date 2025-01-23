import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../../../services/app.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['../../../common.css', './dashboard.component.css']
})
export class DashboardComponent {

  userDetail: any = null;
  dashboardStats: any = null;

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient,
    private appService: AppService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.userDetail = this.authService.userDetail;
    this.fetchDashboardStats();
  }

  fetchDashboardStats() {
    this.httpClient.get(this.appService.baseUrl + '/dashboard/stats', {
      headers: {
        Authorization: `Bearer ${this.authService.authToken}`
      }
    }).subscribe(
      (response: any) => {
        this.dashboardStats = response.data;
      },
      error => {
        this.toastService.error(error.error.message);
      }
    )
  }

}
