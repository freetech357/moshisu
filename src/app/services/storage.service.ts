import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  storagePrefix: string = 'mo_sishu_avKT2K387IOWgQe_'.toLowerCase();

  constructor() {}

  addItem(key: any, data: any) {
    localStorage.setItem(this.storagePrefix + key, JSON.stringify(data));
  }

  getItem(key: any) {
    const data: any = localStorage.getItem(this.storagePrefix + key);
    return JSON.parse(data);
  }

  deleteItem(key: any) {
    localStorage.removeItem(this.storagePrefix + key);
  }

  deleteAllItems() {
    localStorage.clear();
  }
}
