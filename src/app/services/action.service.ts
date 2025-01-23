import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ActionService {

  constructor() { }

  readonly ACTION_CREATE_ITEM: number = 1;
  readonly ACTION_VIEW_ITEM: number = 2;
  readonly ACTION_UPDATE_ITEM: number = 3;
  readonly ACTION_LIST_ALL_ITEMS: number = 4;
  readonly ACTION_EXPORT_REPORTS: number = 5;
  readonly ACTION_DELETE_ITEM: number = 6;

}
