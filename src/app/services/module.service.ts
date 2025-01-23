import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  constructor() { }

  readonly MODULE_VENDOR: number = 1;
  readonly MODULE_MSG: number = 2;
  readonly MODULE_TULIP_INTERN: number = 3;
  readonly MODULE_PROJECT: number = 4; // not used now.
  readonly MODULE_DPR: number = 5;
  readonly MODULE_DPR_PROGRESS: number = 6;
  readonly MODULE_WORK_ORDER: number = 7;
  readonly MODULE_PHYSICAL_PROGRESS: number = 8;
  readonly MODULE_PAYMENT: number = 9;
  readonly MODULE_INSPECTION: number = 10;
  readonly MODULE_CAPACITY_BUILDING: number = 11;
  readonly MODULE_WATER_BODY: number = 12;
  readonly MODULE_ONBOARDING: number = 13;

}
