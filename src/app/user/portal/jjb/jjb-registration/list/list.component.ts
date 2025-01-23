import { Component } from '@angular/core';
import { AppService } from '../../../../../services/app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastService } from '../../../../../services/toast.service';
import { AuthService } from '../../../../../services/auth.service';
import { FormControl, FormGroup } from '@angular/forms';
import { FormService } from '../../../../../services/form.service';

@Component({
  selector: 'app-jjb-registration-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {

  all_jjb_list: any = [];
  isDataLoading: boolean = false;
  page: number = 1; // Current page

  searchForm = new FormGroup({
    status: new FormControl('', [])
  });
  isFormSearchInProgress: boolean = false;

  constructor(
    private appService: AppService,
    private httpClient: HttpClient,
    private formService: FormService,
    private toastService: ToastService,
    private authService:  AuthService
  ) {}

  ngOnInit() {
    this.fetchAllJjbList();
  }

  fetchAllJjbList(){
    this.isDataLoading = true;
    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient.get(`${this.appService.baseUrl}GetJjbDraftList`, { headers })
    .subscribe(
      (response: any) => {
         this.isDataLoading = false;
         this.all_jjb_list = response.data;
        // console.log('List of All JJB :',this.all_cwc_list)
      },
      error => {
        this.isDataLoading = false;
        this.all_jjb_list = [];
      }
    );
  }
  // Fetch JJB List when the status is selected 
  onSearch() {
    if (this.searchForm.status === 'INVALID') {
      this.formService.triggerFormValidation(this.searchForm);
      return;
    }
    this.isFormSearchInProgress= true;
    // Retrieve form values
    const selectedStatus = this.searchForm.value.status;
    // Initialize search parameters
    let searchParams = '?';
    // Append status if it exist
    if (selectedStatus && selectedStatus !== '') {
      searchParams += `&status=${selectedStatus}`;
    }
    // Clear previous states
    this.all_jjb_list = [];
    // Set headers for API request
    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient.get(`${this.appService.baseUrl}GetJjbDraftList${searchParams}`, { headers })
    .subscribe(
      (response: any) => {
         this.isDataLoading = false;
         this.isFormSearchInProgress= false;
         this.all_jjb_list = response.data;
        console.log('List of All JJB :',this.all_jjb_list)
      },
      error => {
        this.isDataLoading = false;
        this.all_jjb_list = [];
      }
    );
  }

}
