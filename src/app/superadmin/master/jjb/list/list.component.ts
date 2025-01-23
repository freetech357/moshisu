import { Component } from '@angular/core';
import { AppService } from '../../../../services/app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastService } from '../../../../services/toast.service';
import { AuthService } from '../../../../services/auth.service';
import Swal from 'sweetalert2';
import { FormControl, FormGroup } from '@angular/forms';
import { FormService } from '../../../../services/form.service';

@Component({
  selector: 'app-jjb-list',
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

  isJjbLoading: boolean = false;
  jjb_list: any = [];
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
    this.fetchjjb_list();
  }

  fetchjjb_list(){
    this.isJjbLoading = true;
    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient.get(`${this.appService.baseUrl}jjplist`, { headers })
    .subscribe(
      (response: any) => {
         this.isJjbLoading = false;
         this.jjb_list = response.data;
        //  console.log(this.jjb_list)
      },
      error => {
        this.isJjbLoading = false;
        this.jjb_list = [];
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

    // Clear previous data
    this.jjb_list = [];
    // Set headers for API request
    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient.get(`${this.appService.baseUrl}jjplist${searchParams}`, {headers})
    .subscribe(
      (response: any) => {
        this.isFormSearchInProgress= false;
        this.jjb_list = response.data;
      },
      error => {
        this.isFormSearchInProgress= false;
        this.jjb_list = [];
      }
    );
  }


}
