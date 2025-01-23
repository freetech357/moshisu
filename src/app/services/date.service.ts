import { Injectable } from '@angular/core';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() {}

  formatDate(date: string, showTime: boolean = true): string {
    let dateStyle = "DD/MM/YYYY";
    if (!showTime) {
      dateStyle = "DD/MM/YYYY hh:mm A"
    }
    return moment(date).format(dateStyle);
  }
}
