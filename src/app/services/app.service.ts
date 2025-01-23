import { Injectable } from '@angular/core';
import moment from 'moment';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  baseUrl: string = environment.base_url;
  
  odishaId: number = 19;

  constructor() {}

  dateFormat(date: any, showTime: boolean = false) {
    if (!date) {
      return '';
    }
    return moment(date).format(showTime ? 'DD-MM-YYYY hh:mm A' : 'DD-MM-YYYY');
  }

}
