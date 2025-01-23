import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from '../../../services/form.service';
import { AppService } from '../../../services/app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastService } from '../../../services/toast.service';
import { AuthService } from '../../../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-user-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['../../../common.css', './edit.component.css']
})

export class EditComponent {
  roles: any = [];
  user_details: any =[];
  status: any;

  districts:any =[];
  blocks:any = [];
  gramPanchayats:any = [];
  unitType:any = [];
  services:any = [];

  isBusinessUnit: boolean = false;

  userManageFormEdit: any = new FormGroup({
    username: new FormControl('', [Validators.required]),
    modulestatus: new FormControl('', [Validators.required])
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
    });
  }  

    fetchUserRole() {
        this.httpClient.get(`${this.appService.baseUrl}/superadmin/user-role/list`, {
            headers: {
              Authorization: this.authService.authToken
            }
          })
          .subscribe(
            (response: any) => {
              this.roles = response.data;
            },
            error => {
              this.roles = [];
            }
          );

    }

  ///get user details from respected api.
  fetchUserById(id: string){
    //console.log(id);

    const token   = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.httpClient.get(`${this.appService.baseUrl}module?mod_id=${id}`, { headers })
      .subscribe(
        (response: any) => {
          this.user_details = response.data[0];
          console.log(this.user_details.status);
          this.userManageFormEdit.patchValue({
            username: this.user_details.module_alias
            
          });
          this.status = this.user_details.status
          //this.formService.triggerFormValidation(this.userManageFormEdit);
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

      this.isFormSubmitInProgress = true;

      // let dataToUpdate: any = {
      //   user_id: this.user_details.id,
      //   role_id: this.userManageFormEdit.value.user_role,
      //   first_name: this.userManageFormEdit.value.first_name?.trim(),
      //   last_name: this.userManageFormEdit.value.last_name?.trim(),
      //   mobile_number: this.userManageFormEdit.value.phone?.trim(),
      //   email: this.userManageFormEdit.value.email?.trim(),
      //   username: this.userManageFormEdit.value.username?.trim(),
      //   status: this.userManageFormEdit.value.status
      // };

      const password = this.userManageFormEdit.value.password?.trim();

      // if (password && password.length > 0) {
      //   dataToUpdate.password = password;
      // }
      this.userManageFormEdit.value.modulestatus
      const postData = {
        module_alias: this.userManageFormEdit.value.username?.trim(),
        status: this.userManageFormEdit.value.modulestatus
      }
      
      const token   = this.authService.authToken;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.httpClient.put(`${this.appService.baseUrl}module/${ this.user_details.id }`, postData, { headers }
      ).subscribe(
        (response: any) => {
          this.isFormSubmitInProgress = false;
          this.toastService.success(response.message);
          
            this.router.navigate(['superadmin/portal/module-master']);
        },
        error => {
          this.isFormSubmitInProgress = false;
          this.toastService.error(error.error.message);
        }
      );
    }

}
