import { Component } from '@angular/core';
import { AppService } from '../../../services/app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../../../common.css', './home.component.css']
})
export class HomeComponent {
  masterStats: any = [];

  constructor(
    private appService: AppService,
    private httpClient: HttpClient,
    private authService:  AuthService,
    private storageService: StorageService,
  ) {}

  ngOnInit() {
    this.fetchMasterStats();
  }

  fetchMasterStats(){

    const token = this.storageService.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.httpClient.get(`${this.appService.baseUrl}getMasterCount`, { headers})
    .subscribe(
      (response: any) => {
        this.masterStats = response.data;
        console.log(this.masterStats)
      },
      error => {
        this.masterStats = [];
        
      }
    );
  }
}
