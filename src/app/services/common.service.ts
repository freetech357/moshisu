import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  formatCurrency(currency: any) {
    if(!currency){
      return '';
    }
    return new Intl.NumberFormat("en-IN").format(currency);
  }
}
