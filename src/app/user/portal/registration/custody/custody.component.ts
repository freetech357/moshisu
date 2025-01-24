import { Component } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { ToastService } from '../../../../services/toast.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from '../../../../services/app.service';
import { FormService } from '../../../../services/form.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { delay } from 'rxjs';

@Component({
  selector: 'app-custody',
  templateUrl: './custody.component.html',
  styleUrl: './custody.component.css'
})
export class CustodyComponent {

  states: any = [];
  districts: any = [];
  blocks: any = [];
  
  pdistricts: any = [];
  pblocks: any = [];

  isFormSubmitInProgress: boolean = false;
  isChecked:boolean = false;
  

  /**
   * Component constructor
   * @param router Angular's Router for navigation
   * @param route Angular's ActivatedRoute to get the current route's parameters
   * @param formService Service to get the form data
   * @param appService General application service
   * @param httpClient Angular's HttpClient for making API calls
   * @param toastService Service to show toast notifications
   * @param authService Service to perform authentication
   */
  constructor(
      private router: Router,
      private route: ActivatedRoute,
      private formService: FormService,
      private appService: AppService,
      private httpClient: HttpClient,
      private toastService: ToastService,
      private authService:  AuthService
  ){}

  formData = new FormGroup({
    name: new FormControl('',[Validators.required]),
    /* Present Address */
    state_id: new FormControl('',[Validators.required]),
    district_id: new FormControl('',[Validators.required]),
    block_id: new FormControl('',[Validators.required]),
    policeStation: new FormControl('',[Validators.required]),
    village: new FormControl('',[Validators.required]),
    locality: new FormControl('',[Validators.required]),
    building: new FormControl('',[Validators.required]),
    postalCode: new FormControl('',[Validators.required]),
    houseno: new FormControl('',[Validators.required]),
    street: new FormControl('',[Validators.required]),
    /* Permanent Address */
    pstate_id: new FormControl('',[Validators.required]),
    pdistrict_id: new FormControl('',[Validators.required]),
    pblock_id: new FormControl('',[Validators.required]),
    ppoliceStation: new FormControl('',[Validators.required]),
    pvillage: new FormControl('',[Validators.required]),
    plocality: new FormControl('',[Validators.required]),
    pbuilding: new FormControl('',[Validators.required]),
    ppostalCode: new FormControl('',[Validators.required]),
    phouseno: new FormControl('',[Validators.required]),
    pstreet: new FormControl('',[Validators.required]),
    /* Other Details */
    childName: new FormControl('',[Validators.required]),
    jjbName: new FormControl('',[Validators.required]),
    dob: new FormControl(''),
    age: new FormControl(''),
  })

  ngOnInit() {
    this.fetchStates();
  }

/**
 * Fetches the list of states from the server.
 * 
 * This method sends an HTTP GET request to retrieve states with a specific
 * country ID and status. The response data is assigned to the `states` property.
 * If an error occurs, the `states` property is set to an empty array.
 */

  fetchStates(){
    
    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.httpClient.get(`${this.appService.baseUrl}statelist?country_id=99&status=1`, { headers })
    .subscribe(
      (response: any) => {
        this.states = response.data;
      },
      error => {
        this.states = [];
      }
    );
  }

  /**
   * Retrieves the list of districts from the server when the state selection changes.
   * 
   * This method takes a single string parameter `type` which can be either 'present'
   * or 'permanent'. Depending on the value of `type`, the selectedStateId is
   * determined and used to send an HTTP GET request to retrieve the list of districts
   * with the given state ID and status. The response data is assigned to either the
   * `districts` or `pdistricts` property depending on the value of `type`. If an error
   * occurs, the respective property is set to an empty array.
   */
  onStateChange(type: string) {
      const selectedStateId =  (type === 'present') ? this.formData.value.state_id : this.formData.value.pstate_id;
  
      const token   = this.authService.authToken;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
      this.httpClient.get(`${this.appService.baseUrl}districtlist?state_id=${selectedStateId}&status=1`, { headers })
      .subscribe(
        (response: any) => {
          if(this.isChecked){
            this.pdistricts = this.districts = response.data;
           
          }else if(type=== 'present'){
            this.districts = response.data;
          } else {
            this.pdistricts = response.data;
          } 
        },
        error => {
          if(type=== 'present'){
            this.districts = [];
          } else {
            this.pdistricts = [];
          } 
        }
      );
    }
  
  
  /**
   * Retrieves the list of blocks from the server when the district selection changes.
   * 
   * This method takes a single string parameter `type` which can be either 'present'
   * or 'permanent'. Depending on the value of `type`, the selectedDistrictId is
   * determined and used to send an HTTP GET request to retrieve the list of blocks
   * with the given district ID and status. The response data is assigned to either the
   * `blocks` or `pblocks` property depending on the value of `type`. If an error
   * occurs, the respective property is set to an empty array.
   * @param type The type of address. Can be either 'present' or 'permanent'
   */
    onDistrictChange(type: string) {
      const selectedDistId =  (type === 'present') ? this.formData.value.district_id : this.formData.value.pdistrict_id;
      const token   = this.authService.authToken;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
      this.httpClient.get(`${this.appService.baseUrl}blocklist?district_id=${selectedDistId}&status=1`, { headers })
      .subscribe(
        (response: any) => {
          if(this.isChecked){
            this.pblocks = this.blocks = response.data;
          }else if(type=== 'present'){
            this.blocks = response.data;
          } else {
            this.pblocks = response.data;
          }
        },
        error => {
          if(type=== 'present'){
            this.blocks = [];
          } else {
            this.pblocks = [];
          }
        }
      );
    }

    onSubmit(){
      this.isFormSubmitInProgress = true;
    }

  /**
   * Handles the present address change event.
   * 
   * This method toggles the `isChecked` property and updates the permanent address
   * form fields based on the value of `isChecked`. If `isChecked` is true, it will
   * populate the permanent address fields with the values from the present address
   * fields. If `isChecked` is false, it will clear the permanent address fields.
   * 
   * The method also calls the `onStateChange` and `onDistrictChange` methods to
   * update the state and district dropdowns for the permanent address.
   */
    onPresentAddressChange(){
      this.isChecked = !this.isChecked;
      if(this.isChecked){
        
        this.onStateChange('present');
        this.onDistrictChange('present');
        this.formData.value.pstate_id = this.formData.value.state_id;
        this.formData.value.pdistrict_id = this.formData.value.district_id;
        this.formData.value.pblock_id = this.formData.value.block_id;
        this.formData.value.ppoliceStation = this.formData.value.policeStation;
        this.formData.value.pvillage = this.formData.value.village;
        this.formData.value.plocality = this.formData.value.locality;
        this.formData.value.pbuilding = this.formData.value.building;
        this.formData.value.ppostalCode = this.formData.value.postalCode;
        this.formData.value.phouseno = this.formData.value.houseno;
        this.formData.value.pstreet = this.formData.value.street;
        this.onStateChange('permanent');
        this.onDistrictChange('permanent');
   
      }else{
        this.formData.value.pstate_id = '';
        this.formData.value.pdistrict_id = '';
        this.formData.value.pblock_id = '';
        this.formData.value.ppoliceStation = '';
        this.formData.value.pvillage = '';
        this.formData.value.plocality = '';
        this.formData.value.pbuilding = '';
        this.formData.value.ppostalCode = '';
        this.formData.value.phouseno = '';
        this.formData.value.pstreet = '';
      }
      
    }
}
