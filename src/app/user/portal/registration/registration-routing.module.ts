import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { userAuthGuard } from '../../../guards/user-auth.guard';
import { Form17AbComponent } from './form-17-ab/form-17-ab.component';
import { Form17CComponent } from './form-17-c/form-17-c.component';
import { Form17DComponent } from './form-17-d/form-17-d.component';
import { Form17EfComponent } from './form-17-ef/form-17-ef.component';
import { Form17GhijklmnComponent } from './form-17-ghijklmn/form-17-ghijklmn.component';
import { CustodyComponent } from './custody/custody.component';

const routes: Routes = [
  {
    path:'portal/registration',
    component:ListComponent,
    canActivate:[userAuthGuard]
  },
  {
    path:'portal/registration/form-ab',
    component:Form17AbComponent,
    canActivate:[userAuthGuard]
  },
  {
    path: 'portal/registration/form-ab/:draftId',
    component: Form17AbComponent,
    canActivate: [userAuthGuard]
  },
  {
    path:'portal/registration/form-c/:draftId',
    component:Form17CComponent,
    canActivate:[userAuthGuard]
  },
  {
    path:'portal/registration/form-d/:draftId',
    component:Form17DComponent,
    canActivate:[userAuthGuard]
  },
  {
    path:'portal/registration/form-ef/:draftId',
    component:Form17EfComponent,
    canActivate:[userAuthGuard]
  },
  {
    path:'portal/registration/form-ghijklmn/:draftId',
    component:Form17GhijklmnComponent,
    canActivate:[userAuthGuard]
  },
  {
    path:'portal/jjb/custody-registration',
    component:CustodyComponent,
    canActivate:[userAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrationRoutingModule { }
