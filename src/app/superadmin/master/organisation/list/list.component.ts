import { Component } from '@angular/core';
import { AppService } from '../../../../services/app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastService } from '../../../../services/toast.service';
import { AuthService } from '../../../../services/auth.service';
import Swal from 'sweetalert2';
import { FormControl, FormGroup } from '@angular/forms';
import { FormService } from '../../../../services/form.service';

@Component({
  selector: 'app-organisation-list',
  templateUrl: './list.component.html',
  styleUrls: ['../../../../common.css', './list.component.css']
})
export class ListComponent {

  searchForm = new FormGroup({
    status: new FormControl('', [])
  });
  isFormSearchInProgress: boolean = false;

  isOrganisationLoading: boolean = false;
  organisation_list: any = [];
  page: number = 1; // Current page


  constructor(
    private appService: AppService,
    private httpClient: HttpClient,
    private formService: FormService,
    private toastService: ToastService,
    private authService:  AuthService
  ) {}

  ngOnInit() {
    this.fetchorganisation_list();
  }

  fetchorganisation_list(){
    this.isOrganisationLoading = true;
    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient.get(`${this.appService.baseUrl}organisation`, { headers })
    .subscribe(
      (response: any) => {
         this.isOrganisationLoading = false;
         this.organisation_list = response.data;
        //  console.log(this.organisation_list)
      },
      error => {
        this.isOrganisationLoading = false;
        this.organisation_list = [];
      }
    );
  }

  // Fetch state when the status is selected 
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
    this.organisation_list = [];
    // Set headers for API request
    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient.get(`${this.appService.baseUrl}organisation${searchParams}`, {headers})
    .subscribe(
      (response: any) => {
        this.isFormSearchInProgress= false;
        this.organisation_list = response.data;
      },
      error => {
        this.isFormSearchInProgress= false;
        this.organisation_list = [];
      }
    );
  }


}
