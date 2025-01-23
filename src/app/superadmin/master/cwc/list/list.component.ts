import { Component } from '@angular/core';
import { AppService } from '../../../../services/app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastService } from '../../../../services/toast.service';
import { AuthService } from '../../../../services/auth.service';
import Swal from 'sweetalert2';
import { FormControl, FormGroup } from '@angular/forms';
import { FormService } from '../../../../services/form.service';

@Component({
  selector: 'app-cwc-list',
  templateUrl: './list.component.html',
  styleUrls: ['../../../../common.css', './list.component.css']
})
export class ListComponent {

  searchForm = new FormGroup({
    state: new FormControl('', []),
    district: new FormControl('', []),
    status: new FormControl('',[])
  });
  isFormSearchInProgress: boolean = false;

  isCwcLoading: boolean = false;
  cwc_list: any = [];
  districts: any = [];
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
    this.fetchcwc_list();
  }

  fetchcwc_list(){
    this.isCwcLoading = true;
    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient.get(`${this.appService.baseUrl}cwclist`, { headers })
    .subscribe(
      (response: any) => {
         this.isCwcLoading = false;
         this.cwc_list = response.data;
         console.log(this.cwc_list)
      },
      error => {
        this.isCwcLoading = false;
        this.cwc_list = [];
      }
    );
  }

  onStateChange(){
    const selectedStateId = this.searchForm.value.state;
    if (!selectedStateId || selectedStateId == '') {
      this.districts = [];
      this.searchForm.patchValue({
        state: '',
        district: ''
      });
      return;
    }

    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient.get(`${this.appService.baseUrl}districtlist?state_id=19&status=1`, { headers })
    .subscribe(
      (response: any) => {
        console.log(response.data);
        this.districts = response.data;
        console.log(this.districts)
      },
      error => {
        this.districts = [];
      }
    );
  }

  // Fetch block when the state and district is selected and search for block
  onSearch() {
    if (this.searchForm.status === 'INVALID') {
      this.formService.triggerFormValidation(this.searchForm);
      return;
    }
    this.isFormSearchInProgress= true;
    // Retrieve form values
    const selectedStateId = this.searchForm.value.state;
    const selectedDistrictId = this.searchForm.value.district;
    const selectedStatus = this.searchForm.value.status;

    // Initialize search parameters
    let searchParams = '?';

    // Append state_id and district_id if they exist
    if (selectedStateId && selectedStateId !== '') {
      searchParams += `&state_id=${selectedStateId}`;
    }
    if (selectedDistrictId && selectedDistrictId !== '') {
      searchParams += `&dist_id=${selectedDistrictId}`;
    }
    if (selectedStatus && selectedStatus !== '') {
      searchParams += `&status=${selectedStatus}`;
    }

    // Clear previous blocks
    this.cwc_list = [];
    // Set headers for API request
    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient.get(`${this.appService.baseUrl}cwclist${searchParams}`, {headers})
    .subscribe(
      (response: any) => {
        this.isFormSearchInProgress= false;
        this.cwc_list = response.data;
      },
      error => {
        this.isFormSearchInProgress= false;
        this.cwc_list = [];
      }
    );
  }

  ///Delete state start

  // confirmDelete(id: number): void {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'You will not be able to recover this state!',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes, delete it!',
  //     cancelButtonText: 'No, cancel!',
  //   }).then((result) => {
  //     if (result.value) {
  //       // User confirmed deletion
  //       this.deleteSector(id);
  //     } else if (result.dismiss === Swal.DismissReason.cancel) {
  //       // User canceled the action
  //       Swal.fire('Cancelled', 'Your state is safe :)', 'info');
  //     }
  //   });
  // }

  // deleteSector(id: number): void {
  //   this.httpClient.post(`${this.appService.baseUrl}/superadmin/state/delete`, {
  //     id: id
  //   }, {
  //     headers: {
  //       Authorization: this.authService.authToken
  //     }
  //   }
  //   ).subscribe(
  //     (response: any) => {
  //       this.toastService.success(response.message);
  //       this.fetchcwc_list();
  //     },
  //     error => {
  //       this.toastService.error(error.error.message);
  //     }
  //   );
  // }

}
