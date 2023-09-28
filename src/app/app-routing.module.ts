import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestersPresenceComponent } from './components/requesters-presence/requesters-presence';
import { RequestersBaseComponent } from './components/requesters-base/requesters-base.component';

const routes: Routes = [
  {
    path:'requester-analysis',
    component:RequestersPresenceComponent
  },

  {
    path:'',
    redirectTo:'requester-analysis',
    pathMatch:'full'
  },
  {
    path:'**',
    component:RequestersBaseComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
