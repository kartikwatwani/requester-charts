import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestersAnalysis } from './components/requesters-analysis/requesters-analysis';
import { RequesterBaseComponent } from './components/requester-base/requester-base.component';

const routes: Routes = [
  {
    path:'requester-analysis',
    component:RequestersAnalysis
  },

  {
    path:'',
    redirectTo:'requester-analysis',
    pathMatch:'full'
  },
  {
    path:'**',
    component:RequesterBaseComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
