import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { userAuthGuard } from '../../../../guards/user-auth.guard';
import { Form1Component } from './form-1/form-1.component';
import { Form2Component } from './form-2/form-2.component';
import { Form3Component } from './form-3/form-3.component';
import { Form4Component } from './form-4/form-4.component';
import { Form5Component } from './form-5/form-5.component';

const routes: Routes = [
  {
    path:'portal/jjb/jjb-registration',
    component:ListComponent,
    canActivate:[userAuthGuard]
  },
  {
    path:'portal/jjb/jjb-registration/form-1',
    component:Form1Component,
    canActivate:[userAuthGuard]
  },
  {
    path: 'portal/jjb/jjb-registration/form-1/:draftId',
    component: Form1Component,
    canActivate: [userAuthGuard]
  },
  {
    path: 'portal/jjb/jjb-registration/form-2/:draftId',
    component: Form2Component,
    canActivate: [userAuthGuard]
  },
  {
    path: 'portal/jjb/jjb-registration/form-3/:draftId',
    component: Form3Component,
    canActivate: [userAuthGuard]
  },
  {
    path: 'portal/jjb/jjb-registration/form-4/:draftId',
    component: Form4Component,
    canActivate: [userAuthGuard]
  },
  {
    path: 'portal/jjb/jjb-registration/form-5/:draftId',
    component: Form5Component,
    canActivate: [userAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JjbRegistrationRoutingModule { }
