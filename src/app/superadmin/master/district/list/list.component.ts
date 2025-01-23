import { Component, NgZone } from '@angular/core';
import { AppService } from '../../../../services/app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastService } from '../../../../services/toast.service';
import { AuthService } from '../../../../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormService } from '../../../../services/form.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { StorageService } from '../../../../services/storage.service';

@Component({
  selector: 'app-district-list',
  templateUrl: './list.component.html',
  styleUrls: ['../../../../common.css', './list.component.css']
})
export class ListComponent {  

  searchForm = new FormGroup({
    state: new FormControl('', [Validators.required]),
    status: new FormControl('',[])
  });

  isFormSearchInProgress: boolean = false;
  states: any = [];
  page: number = 1; // Current page
  districts: any = [];

  constructor(
    private router: Router,
    private appService: AppService,
    private formService: FormService,
    private httpClient: HttpClient,
    private toastService: ToastService,
    private authService:  AuthService,
    private storageService: StorageService,
    private zone: NgZone
  ) {}

  ngOnInit() {
    // this.fetchStates();
    this.fetchAllDistricts();
  }

  
  // fetchStates(){
  //   const token = this.authService.authToken;
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  //   this.httpClient.get(`${this.appService.baseUrl}statelist?country_id=99&state_id=19&status=1`, { headers })
  //   .subscribe(
  //     (response: any) => {
  //        this.states = response.data;
  //       //  console.log(this.states)
  //     },
  //     error => {
  //       this.states = [];
  //     }
  //   );
  // }

  fetchAllDistricts() {

    this.isFormSearchInProgress = true;
    this.districts = [];

    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient.get(`${this.appService.baseUrl}districtlist?state_id=19`, { headers })
    .subscribe(
      (response: any) => {
        this.isFormSearchInProgress= false;
        this.districts = response.data;
      },
      error => {
        this.isFormSearchInProgress= false;
        this.districts = [];
      }
    );
  }

   // Fetch districts when the state is selected and search for district
   onSearch() {
    if (this.searchForm.status === 'INVALID') {
      this.formService.triggerFormValidation(this.searchForm);
      return;
    }
    this.isFormSearchInProgress= true;
    // Retrieve form values
    const selectedStateId = this.searchForm.value.state;
    const selectedStatus = this.searchForm.value.status;

    // Initialize search parameters
    let searchParams = '?';

    // Append state_id and district_id if they exist
    if (selectedStateId && selectedStateId !== '') {
      searchParams += `&state_id=${selectedStateId}`;
    }
    if (selectedStatus && selectedStatus !== '') {
      searchParams += `&status=${selectedStatus}`;
    }
    // Clear previous districts
    this.districts = [];

      // Set headers for API request
      const token = this.authService.authToken;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.httpClient.get(`${this.appService.baseUrl}districtlist${searchParams}`, { headers })
        .subscribe(
          (response: any) => {
            this.isFormSearchInProgress= false;
            this.districts = response.data;
          },
          error => {
            this.isFormSearchInProgress= false;
            this.districts = [];
          }
        );
  }


  ///Delete District start

  confirmDelete(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this district!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.value) {
        // User confirmed deletion
        this.deleteDistrict(id);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // User canceled the action
        Swal.fire('Cancelled', 'Your district is safe :)', 'info');
      }
    });
  }

  deleteDistrict(id: number): void {
    this.httpClient.post(`${this.appService.baseUrl}/superadmin/district/delete`, {
      id: id
    }, {
      headers: {
        Authorization: this.authService.authToken
      }
    }
    ).subscribe(
      (response: any) => {
        this.toastService.success(response.message);
        this.onSearch();
      },
      error => {
        this.toastService.error(error.error.message);
      }
    );
  }

}
