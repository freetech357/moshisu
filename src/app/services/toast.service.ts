import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private toastr: ToastrService
  ) { }

  success(message: any) {
    this.toastr.success(message);
  }

  error(message: any) {
    this.toastr.error((message) || 'Server Error');
  }

  info(message: any) {
    this.toastr.info(message);
  }

  warning(message: any) {
    this.toastr.warning(message);
  }
}
