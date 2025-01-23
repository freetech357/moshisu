import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from '../../../services/form.service';
import { AppService } from '../../../services/app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastService } from '../../../services/toast.service';
import { AuthService } from '../../../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import 'select2';
// import * as $ from 'jquery';

@Component({
  selector: 'app-manage-user-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['../../../common.css', './edit.component.css']
})

export class EditComponent {
  roles: any = [];
  districts:any =[];
  user_details:any =[];
  


  isBusinessUnit: boolean = false;

  userManageFormEdit: any = new FormGroup({
    district: new FormControl(''),
    user_role: new FormControl('', [Validators.required]),
    user_name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
    password: new FormControl('',[Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)]),
    confirm_password: new FormControl('',[Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)]),
    status: new FormControl('', [Validators.required])
  });

  isFormSubmitInProgress: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formService: FormService,
    private appService: AppService,
    private httpClient: HttpClient,
    private toastService: ToastService,
    public authService:  AuthService
  ) {}

  

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id']; // 'id' should match the parameter name in your route
      //console.log('ID from URL:', id);
      this.fetchUserById(id);
      this.fetchUserRole();
      this.fetchAllDistricts();
    });
  }  

  fetchAllDistricts() {
    this.districts = [];
    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient.get(`${this.appService.baseUrl}districtlist?state_id=19`, { headers })
    .subscribe(
      (response: any) => {
       
        this.districts = response.data;
      },
      error => {
        this.districts = [];
      }
    );
  }

  fetchUserRole() {
    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.httpClient.get(`${this.appService.baseUrl}roles`, {headers})
      .subscribe(
        (response: any) => {
          this.roles = response.data;
          console.log(this.roles)
        },
        error => {
          this.roles = [];
        }
      );
  }

  ///get user details from respected api.
  fetchUserById(id: string){
    
      const token = this.authService.authToken;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      
      this.httpClient.get(`${this.appService.baseUrl}users/${id}`, {headers}  )
      .subscribe(
        (response: any) => {
          this.user_details = response.data;
          console.log(this.user_details)
          this.userManageFormEdit.patchValue({
            district: (this.user_details.district_id)?this.user_details.district_id:0,
            user_role: (this.user_details.role_name)?this.user_details.role_name:"",
            user_name: this.user_details.name,
            email: this.user_details.email,
            phone: this.user_details.mobile_no,
            username: this.user_details.username,
            status: this.user_details.is_active,
          });
          this.formService.triggerFormValidation(this.userManageFormEdit);
        },
        error => {
          this.user_details = [];
        }
      );

    }


    dataUserEditSubmit(){
      if (this.userManageFormEdit.status === 'INVALID') {
      this.formService.triggerFormValidation(this.userManageFormEdit);
      return;
      }

       // Check if passwords match
       const password = this.userManageFormEdit.value.password?.trim();
       const confirmPassword = this.userManageFormEdit.value.confirm_password?.trim();
 
       if (password !== confirmPassword) {
        console.log("hello susu")
         this.toastService.error('Passwords do not match.');
         return;
       }

      this.isFormSubmitInProgress = true;

      let dataToUpdate: any = {
        // user_id: this.user_details.id,
        district_id: this.userManageFormEdit.value.district,
        roles: this.userManageFormEdit.value.user_role,
        name: this.userManageFormEdit.value.user_name?.trim(),
        mobile_no: this.userManageFormEdit.value.phone?.trim(),
        email: this.userManageFormEdit.value.email?.trim(),
        password: this.userManageFormEdit.value.password?.trim(),
        is_active: this.userManageFormEdit.value.status
      };

      // const updated_password = this.userManageFormEdit.value.password?.trim();
      // if (updated_password && updated_password.length > 0) {
      //   dataToUpdate.password = updated_password;
      // }

      

      const token = this.authService.authToken;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.httpClient.put(`${this.appService.baseUrl}users/${this.user_details.id}`, dataToUpdate, {headers}
      ).subscribe(
        (response: any) => {
          this.isFormSubmitInProgress = false;
          this.toastService.success(response.message);
          
            this.router.navigate(['superadmin/portal/manage-users']);
        },
        error => {
          this.isFormSubmitInProgress = false;
          this.toastService.error(error.error.message);
        }
      );
    }

}
