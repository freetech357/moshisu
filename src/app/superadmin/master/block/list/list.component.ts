import { Component, NgZone } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '../../../../services/app.service';
import { FormService } from '../../../../services/form.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastService } from '../../../../services/toast.service';
import { AuthService } from '../../../../services/auth.service';
import { StorageService } from '../../../../services/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-block-list',
  templateUrl: './list.component.html',
  styleUrls: ['../../../../common.css', './list.component.css']
})
export class ListComponent {

  searchForm = new FormGroup({
    state: new FormControl('', [Validators.required]),
    district: new FormControl('', [Validators.required]),
    status: new FormControl('',[])
  });
  isFormSearchInProgress: boolean = false;

  states: any = [];
  districts: any = [];
  blocks: any = [];
  chunkedBlocks: any = [];
  page: number = 1; // Current page

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
    this.fetchStates();
    this.fetchAllBlocks();
  }


  fetchStates(){

    this.httpClient.get(`${this.appService.baseUrl}/superadmin/state/list`, {
      headers: {
        Authorization: this.authService.authToken
      }
    })
    .subscribe(
      (response: any) => {
        this.states = response.data;
      },
      error => {
        this.states = [];
      }
    );
  }

  fetchAllBlocks() {
    this.blocks = [];
    this.isFormSearchInProgress= true;

    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient.get(`${this.appService.baseUrl}blocklist`, { headers })
    .subscribe(
      (response: any) => {
        this.isFormSearchInProgress= false;
        this.blocks = response.data;
        
      },
      error => {
        this.isFormSearchInProgress= false;
        this.blocks = [];
        this.chunkedBlocks = [];
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

    // Append state_id, district_id and status if they exist
    if (selectedStateId && selectedStateId !== '') {
      searchParams += `&state_id=${selectedStateId}`;
    }
    if (selectedDistrictId && selectedDistrictId !== '') {
      searchParams += `&district_id=${selectedDistrictId}`;
    }
    if (selectedStatus && selectedStatus !== '') {
      searchParams += `&status=${selectedStatus}`;
    }

    // Clear previous blocks
    this.blocks = [];
    // Set headers for API request
    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient.get(`${this.appService.baseUrl}blocklist${searchParams}`, {headers})
    .subscribe(
      (response: any) => {
        this.isFormSearchInProgress= false;
        this.blocks = response.data;
      },
      error => {
        this.isFormSearchInProgress= false;
        this.blocks = [];
      }
    );
  }


  ///Delete block start

  confirmDelete(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this block!',
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
        Swal.fire('Cancelled', 'Your block is safe :)', 'info');
      }
    });
  }

  deleteSector(id: number): void {
    this.httpClient.post(`${this.appService.baseUrl}/superadmin/block/delete`, {
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
