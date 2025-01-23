import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from '../../../../services/form.service';
import { AppService } from '../../../../services/app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastService } from '../../../../services/toast.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-organisation-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['../../../../common.css', './edit.component.css']
})
export class EditComponent {
  organisation_details: any =[];

  organisationFormEdit = new FormGroup({
      user: new FormControl('', [Validators.required]),
      organisation_name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
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
    private authService:  AuthService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id']; 
      this.fetchOrganisationById(id);
    });
  }
  fetchOrganisationById(id: string){
    const token = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.httpClient.get(`${this.appService.baseUrl}organisation?org_id=${id}`, { headers })
      .subscribe(
        (response: any) => {
          this.organisation_details = response.data[0];
          this.organisationFormEdit.patchValue({
            user: this.organisation_details.user_level,
            organisation_name: this.organisation_details.organization_name,
            status: this.organisation_details.status

          });
          this.formService.triggerFormValidation(this.organisationFormEdit);
        },
        error => {
          this.organisation_details = [];
        }
      );
    }

    organisationEdit(){
      if (this.organisationFormEdit.status === 'INVALID') {
      this.formService.triggerFormValidation(this.organisationFormEdit);
      return;
      }
      this.isFormSubmitInProgress = true;

      const token = this.authService.authToken;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      const postData = {
        organization_name: this.organisationFormEdit.value.organisation_name?.trim(),
        user_level: this.organisationFormEdit.value.user,
        status: this.organisationFormEdit.value.status
      }
      this.httpClient.put(`${this.appService.baseUrl}organisation/${ this.organisation_details.id }`, postData, { headers }
      ).subscribe(
        (response: any) => {
          this.isFormSubmitInProgress = false;
          this.toastService.success(response.message);
          this.router.navigate(['superadmin/portal/master/organisation']);
        },
        error => {
          this.isFormSubmitInProgress = false;
          this.toastService.error(error.error.message);
        }
      );
    }


}
