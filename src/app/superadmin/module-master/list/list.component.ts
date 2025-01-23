import { Component } from '@angular/core';
import { AppService } from '../../../services/app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastService } from '../../../services/toast.service';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-user-list',
  templateUrl: './list.component.html',
  styleUrls: ['../../../common.css', './list.component.css']
})
export class ListComponent {
  users: any = [];

  constructor(
    private appService: AppService,
    private httpClient: HttpClient,
    private toastService: ToastService,
    public authService:  AuthService
  ) {}

  ngOnInit() {
    // console.log(this.authService.userDetail);
    this.fetchUsers();
  }

  fetchUsers(){  

    const token   = this.authService.authToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient.get(`${this.appService.baseUrl}module`, { headers })
    .subscribe(
      (response: any) => {
        console.log("modules :",response.data);
        this.users = response.data;
      },
      error => {
        this.users = [];
      }
    );

  }

  ///Delete role start

  confirmDelete(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this User!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.value) {
        // User confirmed deletion
        this.deleteUser(id);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // User canceled the action
        Swal.fire('Cancelled', 'Your role is safe :)', 'info');
      }
    });
  }

  deleteUser(id: number): void {
    this.httpClient.post(`${this.appService.baseUrl}/superadmin/user/delete`, {
      user_id: id
    }, {
      headers: {
        Authorization: this.authService.authToken
      }
    }
    ).subscribe(
      (response: any) => {
        this.toastService.success(response.message);
        this.fetchUsers();
      },
      error => {
        this.toastService.error(error.error.message);
      }
    );
  }

}
