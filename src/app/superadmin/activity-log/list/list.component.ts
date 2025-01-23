import { Component } from '@angular/core';
import { AppService } from '../../../services/app.service';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../services/toast.service';
import { DateService } from '../../../services/date.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['../../../common.css', './list.component.css']
})
export class ListComponent {

  activityLogs: any = [];
  total: any = 0;
  isLoadMoreInProgress: boolean = false;
  currentChunkCount: number = 0;
  hideLoadMoreBtn: boolean = false;
  userRoles: any = [];
  modules: any = [];
  actions: any = [];
  isFormSearchInProgress: boolean = false;

  searchForm = new FormGroup({
    role_id: new FormControl(''),
    ip_address: new FormControl(''),
    module_id: new FormControl(''),
    action_id: new FormControl(''),
    date_from: new FormControl(''),
    date_to: new FormControl('')
  });

  constructor(
    private appService: AppService,
    private authService: AuthService,
    private httpClient: HttpClient,
    private toastService: ToastService,
    public dateService: DateService
  ) {}

  ngOnInit() {
    this.fetchActivityLogs();
    this.fetchUserRoles();
    this.fetchModules();
    this.fetchActions();
  }

  resetForm() {
    location.reload();
  }  

  fetchUserRoles() {
    this.httpClient.get(this.appService.baseUrl + '/superadmin/user-role/list', {
      headers: {
        Authorization: `Bearer ${this.authService.authToken}`
      }
    }).subscribe(
      (response: any) => {
        if (response.data) {
          this.userRoles = response.data;
        }
      },
      error => {
        this.toastService.error(error.error.message);
      }
    );
  }

  get userRolesArray() {
    return Object.entries(this.userRoles);
  }

  fetchModules() {
    this.httpClient.get(this.appService.baseUrl + '/superadmin/module/list', {
      headers: {
        Authorization: `Bearer ${this.authService.authToken}`
      }
    }).subscribe(
      (response: any) => {
        this.modules = response.data;
      },
      error => {
        this.toastService.error(error.error.message);
      }
    );
  }

  fetchActions() {
    this.httpClient.get(this.appService.baseUrl + '/superadmin/module-action/list', {
      headers: {
        Authorization: `Bearer ${this.authService.authToken}`
      }
    }).subscribe(
      (response: any) => {
        this.actions = response.data;
      },
      error => {
        this.toastService.error(error.error.message);
      }
    );
  }

  fetchActivityLogs() {
    this.httpClient.get(this.appService.baseUrl + '/activity-logs/list', {
      headers: {
        Authorization: `Bearer ${this.authService.authToken}`
      }
    }).subscribe(
      (response: any) => {
        this.activityLogs = response.data;
        this.total = response.total;
        this.currentChunkCount = response.count;
        if (response.count === 0) {
          this.hideLoadMoreBtn = true;
        }
      },
      error => {
        this.toastService.error(error.error.message);
      }
    );
  }

  loadMoreActivityLogs() {

    const roleID = this.searchForm.value.role_id?.trim();
    const ipAddress = this.searchForm.value.ip_address?.trim();
    const moduleID = this.searchForm.value.module_id?.trim();
    const actionID = this.searchForm.value.action_id?.trim();
    const dateFrom = this.searchForm.value.date_from?.trim();
    const dateTo = this.searchForm.value.date_to?.trim();

    this.isLoadMoreInProgress = true;
    this.httpClient.get(this.appService.baseUrl + '/activity-logs/list?offset=' + this.activityLogs.length + `&search=1&role_id=${roleID}&ip_address=${ipAddress}&module_id=${moduleID}&action_id=${actionID}&date_from=${dateFrom}&date_to=${dateTo}`, {
      headers: {
        Authorization: `Bearer ${this.authService.authToken}`
      }
    }).subscribe(
      (response: any) => {
        this.isLoadMoreInProgress = false;
        let currentActivityLogs = this.activityLogs;
        if (response.data) {
          response.data.forEach((item: any) => {
            currentActivityLogs.push(item);
          });
        }
        this.activityLogs = currentActivityLogs;
        this.total = response.total;
        if (this.currentChunkCount > 0 && (response.count < this.currentChunkCount)) {
          this.hideLoadMoreBtn = true;
        }
      },
      error => {
        this.isLoadMoreInProgress = false;
        this.toastService.error(error.error.message);
      }
    );
  }

  submitForm() {
    const roleID = this.searchForm.value.role_id?.trim();
    const ipAddress = this.searchForm.value.ip_address?.trim();
    const moduleID = this.searchForm.value.module_id?.trim();
    const actionID = this.searchForm.value.action_id?.trim();
    const dateFrom = this.searchForm.value.date_from?.trim();
    const dateTo = this.searchForm.value.date_to?.trim();

    this.isFormSearchInProgress = true;

    this.httpClient.get(this.appService.baseUrl + `/activity-logs/list?search=1&role_id=${roleID}&ip_address=${ipAddress}&module_id=${moduleID}&action_id=${actionID}&date_from=${dateFrom}&date_to=${dateTo}`, {
      headers: {
        Authorization: `Bearer ${this.authService.authToken}`
      }
    }).subscribe(
      (response: any) => {
        this.isFormSearchInProgress = false;
        this.activityLogs = response.data;
        this.total = response.total;
        this.currentChunkCount = response.count;
        if (response.count === 0) {
          this.hideLoadMoreBtn = true;
        }
      },
      error => {
        this.isFormSearchInProgress = false;
        this.toastService.error(error.error.message);
      }
    );
  }

}
