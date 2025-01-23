import { Component } from '@angular/core';
import { AppService } from '../../../../services/app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastService } from '../../../../services/toast.service';
import { AuthService } from '../../../../services/auth.service';
import Swal from 'sweetalert2';
import { FormControl, FormGroup } from '@angular/forms';
import { FormService } from '../../../../services/form.service';

@Component({
  selector: 'app-state-list',
  templateUrl: './list.component.html',
  styleUrls: ['../../../../common.css', './list.component.css']
})
export class ListComponent {

  searchForm = new FormGroup({
    status: new FormControl('', [])
  });
  isFormSearchInProgress: boolean = false;

  isStatesLoading: boolean = false;
  states: any = [];
  page: number = 1; // Current page

  constructor(
    private appService: AppService,
    private httpClient: HttpClient,
    private formService: FormService,
    private toastService: ToastService,
    private authService:  AuthService
  ) {}

  ngOnInit() {
    this.fetchStates();
  }

  fetchStates(){
    this.isStatesLoading = true;
    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient.get(`${this.appService.baseUrl}statelist?country_id=99`, { headers })
    .subscribe(
      (response: any) => {
         this.isStatesLoading = false;
         this.states = response.data;
         console.log(this.states)
      },
      error => {
        this.isStatesLoading = false;
        this.states = [];
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
    let searchParams = '?country_id=99';

    // Append status if it exist
    if (selectedStatus && selectedStatus !== '') {
      searchParams += `&status=${selectedStatus}`;
    }
    console.log(searchParams)
    // Clear previous states
    this.states = [];
    // Set headers for API request
    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient.get(`${this.appService.baseUrl}statelist${searchParams}`, {headers})
    .subscribe(
      (response: any) => {
        this.isFormSearchInProgress= false;
        this.states = response.data;
      },
      error => {
        this.isFormSearchInProgress= false;
        this.states = [];
      }
    );
  }

  ///Delete state start

  confirmDelete(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this state!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.value) {
        // User confirmed deletion
        this.deleteSector(id);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // User canceled the action
        Swal.fire('Cancelled', 'Your state is safe :)', 'info');
      }
    });
  }

  deleteSector(id: number): void {
    this.httpClient.post(`${this.appService.baseUrl}/superadmin/state/delete`, {
      id: id
    }, {
      headers: {
        Authorization: this.authService.authToken
      }
    }
    ).subscribe(
      (response: any) => {
        this.toastService.success(response.message);
        this.fetchStates();
      },
      error => {
        this.toastService.error(error.error.message);
      }
    );
  }

}
