import {
  Component
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
  FormArray
} from '@angular/forms';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  FormService
} from '../../../services/form.service';
import {
  AppService
} from '../../../services/app.service';
import {
  HttpClient, HttpHeaders
} from '@angular/common/http';
import {
  ToastService
} from '../../../services/toast.service';
import {
  AuthService
} from '../../../services/auth.service';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['../../../common.css', './permission.component.css']
})
export class PermissionComponent {
  module_rbac_details: any = [];
  isFormSubmitInProgress: boolean = false;

  moduleRbacFormEdit = new FormGroup({
    
  });
  // action_ids: new FormControl('', [Validators.required]),

  actions: any = [];
  modules: any = [];
  userRoleID: any  = null;
  permissions: any = [];
  myForm!: FormGroup;
  checkboxNames: string[] = ['checkbox_1', 'checkbox_2', 'checkbox_3', 'checkbox_4']; 

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formService: FormService,
    private appService: AppService,
    private httpClient: HttpClient,
    private toastService: ToastService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userRoleID = params['id'];
    });
    this.fetchActions();
    this.myForm = this.fb.group({
      module_rbac: [false],
      checkboxes: this.fb.array([])
    });

    
  
  }

  get checkboxesFormArray(): FormArray {
    return this.myForm.get('checkboxes') as FormArray;
  }

  addCheckbox(name: string): void {
    this.checkboxesFormArray.push(new FormGroup({
      name: new FormControl(name),
      value: new FormControl(false)
    }));
  }

  fetchActions() {
    const token   = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient.get(`${this.appService.baseUrl}module`, { headers })
      .subscribe(
        (response: any) => {
          this.actions = response.data;
          this.fetchModules();
        },
        error => {
          this.toastService.error(error.error.message);
        }
      );
  }

  fetchModules() {

    const token   = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient.get(`${this.appService.baseUrl}module`, { headers })
      .subscribe(
        (response: any) => {
          this.modules = response.data;
          this.fetchPermissionsById(this.userRoleID);
        },
        error => {
          this.toastService.error(error.error.message);
        }
      );
  }

  fetchPermissionsById(id: string) {
    const token   = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.httpClient.get(`${this.appService.baseUrl}showRole?role_id=${id}`, { headers })
      .subscribe(
        (response: any) => {
          //console.log('per');
          console.log(response.data.permissions);
          this.permissions = response.data.permissions;
          // console.log(this.hasPermission('user_update_chal_hat'));
          //this.module_rbac_details = response.data;
          // this.module_rbac_details.forEach((item: any) => {
          //   const moduleID = item.module_id;
          //   const permittedActionIDs = (item.permitted_action_ids) ? item.permitted_action_ids.split(',') : [];
          //   permittedActionIDs.forEach((actionID: any) => {
          //     const checkbox: any = document.querySelector(`#module_rbac_${moduleID}_${actionID}`) as HTMLElement;
          //     checkbox.checked = true;
          //   })
          // });

        },
        error => {
          this.module_rbac_details = [];
        }
      );
  }
  onSubmit() {
    // this.isFormSubmitInProgress = true;
    const accessControl = this.buildAccessControlPayload();
    console.log('module');
    console.log(this.myForm);
    console.log(this.moduleRbacFormEdit.value);
    
    // const selectedValues = this.checkboxesFormArray.controls.map(control => {
    //   const group = control as FormGroup;
    //   return {
    //     name: group.get('name')?.value,
    //     value: group.get('value')?.value
    //   };
    // });

    // console.log('Selected Checkbox Values:', selectedValues);
    const perMissArr: any = [];
    const checkboxes = document.querySelectorAll('table input[type="checkbox"]');
    checkboxes.forEach((checkbox: any) => {
      //console.log(checkbox.name);
      if(checkbox.checked == true){
      perMissArr.push(checkbox.name);
    }
      //checkbox.checked = true;
    });

    //console.log(perMissArr.length);
    let perData: any = [];
        perData = "";
    let co = perMissArr.length;
    let i  = perMissArr.length;
    perMissArr.forEach((item: any) =>{
        if(i == co){
          perData += ""+item +"";
        }else{
          perData += "," +""+item +"" ;
          
        }
        
        i++;
    });

    //console.log(perData);
    // console.log(checkboxes);

    const token   = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    const postData = {
      role_id: this.userRoleID,
      permissions:  perMissArr
    };
    
    this.httpClient.post(`${this.appService.baseUrl}attachPermission`, postData, { headers }).subscribe(
      (response: any) => {
        console.log('Data updated successfully:', response);
        this.isFormSubmitInProgress = false;
        this.toastService.success(response.message);
      },
      error => {
        this.isFormSubmitInProgress = false;
        this.toastService.error(error.error.message);
      }
    );
  }

  removeLeadingAndTrailingCommas(str: any) {
    return str.replace(/^,+|,+$/g, '');
  }

  buildAccessControlPayload(): any[] {
    const accessControl: any[] = [];
    this.modules.forEach((module: any) => {
      const moduleID = module.id;
      const action_ids: number[] = [];
      this.actions.forEach((action: any) => {
        const checkboxId = `module_rbac_${moduleID}_${action.id}`;
        const checkbox: any = document.querySelector(`#${checkboxId}`);
        if (checkbox && checkbox.checked) {
          action_ids.push(+action.id);
        }
      });
      if (action_ids.length > 0) {
        accessControl.push({
          module_id: moduleID,
          action_ids: action_ids
        });
      }
    });
    return accessControl;
  }

  grantAllAccess() {
    const checkboxes = document.querySelectorAll('table input[type="checkbox"]');
    checkboxes.forEach((checkbox: any) => {
        checkbox.checked = true;
    });
  }

  revokeAllAccess() {
    const checkboxes = document.querySelectorAll('table input[type="checkbox"]');
    checkboxes.forEach((checkbox: any) => {
        checkbox.checked = false;
    });
  }

  grantAllAccessForModule(moduleID: any) {
    const checkboxes = document.querySelectorAll(`.table-row-${moduleID} input[type="checkbox"]`);
    checkboxes.forEach((checkbox: any) => {
        checkbox.checked = true;
    });
  }

  revokeAllAccessForModule(moduleID: any) {
    const checkboxes = document.querySelectorAll(`.table-row-${moduleID} input[type="checkbox"]`);
    checkboxes.forEach((checkbox: any) => {
        checkbox.checked = false;
    });
  }

  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }

}
