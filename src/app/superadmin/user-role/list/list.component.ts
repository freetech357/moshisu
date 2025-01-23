import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormService } from '../../../services/form.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from '../../../services/app.service';
import { ToastService } from '../../../services/toast.service';
import { StorageService } from '../../../services/storage.service';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-role-list',
  templateUrl: './list.component.html',
  styleUrls: ['../../../common.css', './list.component.css']
})
export class ListComponent {

  roles: any = [];
  page: number = 1; // Current page
  searchTerm: string = ''; // Holds the search term entered by the user


  constructor(
    private appService: AppService,
    private httpClient: HttpClient,
    private toastService: ToastService,
    private authService:  AuthService
  ) {}

  ngOnInit() {
    this.fetchRole();
  }

  fetchRole(){  

    const token   = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient.get(`${this.appService.baseUrl}roles`, { headers })
    .subscribe(
      (response: any) => {
        this.roles = response.data;
      },
      error => {
        this.roles = [];
      }
    );

  }
  // Method to filter roles based on the search term
  filteredRoles() {
    if (!this.searchTerm) {
      return this.roles;
    }

    return this.roles.filter((role: any) =>
      role.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }


  ///Delete role start

  confirmDelete(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this role!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.value) {
        // User confirmed deletion
        this.deleteRole(id);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // User canceled the action
        Swal.fire('Cancelled', 'Your role is safe :)', 'info');
      }
    });
  }

  deleteRole(id: number): void {
    this.httpClient.post(`${this.appService.baseUrl}/superadmin/user-role/delete`, {
      role_id: id
    }, {
      headers: {
        Authorization: this.authService.authToken
      }
    }
    ).subscribe(
      (response: any) => {
        this.toastService.success(response.message);
        this.fetchRole();
      },
      error => {
        this.toastService.error(error.error.message);
      }
    );
  }

}
