import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestersAnalysisComponent } from './components/requesters-analysis/requesters-analysis';
import { RequesterBaseComponent } from './components/requester-base/requester-base.component';

const routes: Routes = [
  {
    path:'',
    component:RequestersAnalysisComponent,

  },
  {
    path:':id',
    component:RequesterBaseComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequesterAnalysisRoutingModule { }
