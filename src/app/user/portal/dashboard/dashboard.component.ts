import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['../../../common.css', './dashboard.component.css']
})
export class DashboardComponent {

  userDetail: any = null;

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit() {
  }

}
