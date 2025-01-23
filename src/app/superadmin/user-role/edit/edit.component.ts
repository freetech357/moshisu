import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../services/toast.service';
import { AuthService } from '../../../services/auth.service';
import { AppService } from '../../../services/app.service';
import { FormService } from '../../../services/form.service';

@Component({
  selector: 'app-user-role-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['../../../common.css', './edit.component.css']
})
export class EditComponent {
  role_details: any = [];

  userRoleFormEdit = new FormGroup({
    role_name: new FormControl('', [Validators.required]),
    role_status: new FormControl('', [Validators.required])
  });

  isFormSubmitInProgress: boolean = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formService: FormService,
    private httpClient: HttpClient,    
    private toastService: ToastService,
    private authService:  AuthService,
    private appService: AppService
  ) {}



  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id']; // 'id' should match the parameter name in your route
      //console.log('ID from URL:', id);
      this.fetchRoleById(id);
    });
  }

  
  fetchRoleById(id: string){
  //console.log(id);
    this.httpClient.get(`${this.appService.baseUrl}/superadmin/user-role/detail?role_id=${id}`, {
      headers: {
        Authorization: this.authService.authToken
      }
    })
    .subscribe(
      (response: any) => {
        this.role_details = response.data;
        this.userRoleFormEdit.patchValue({
          role_name: this.role_details.role_name,
          role_status: this.role_details.status
        });        
        this.formService.triggerFormValidation(this.userRoleFormEdit);        
      },
      error => {
        this.role_details = [];
      }
    );

  }

  roleEditSubmit()
  {
    if (this.userRoleFormEdit.status === 'INVALID') {
      this.formService.triggerFormValidation(this.userRoleFormEdit);
      return;
    }
    this.isFormSubmitInProgress = true;
    this.httpClient.post(`${this.appService.baseUrl}/superadmin/user-role/edit`, {
      role_id: this.role_details.id,
      name: this.userRoleFormEdit.value.role_name?.trim(),
      status: this.userRoleFormEdit.value.role_status?.trim(),
    }, {
      headers: {
        Authorization: this.authService.authToken
      }
    }
    ).subscribe(
      (response: any) => {
        this.isFormSubmitInProgress = false;
        this.toastService.success(response.message);
        this.router.navigate(['superadmin/portal/user-role']);
      },
      error => {
        this.isFormSubmitInProgress = false;
        this.toastService.error(error.error.message);
      }
    );
  }
}
