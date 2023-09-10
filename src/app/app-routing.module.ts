import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChartComponent } from './components/chart/chart.component';
import { RequesterChartComponent } from './components/requester-chart/requester-chart.component';
import { BaseComponent } from './components/base/base.component';
import { RequestersBaseComponent } from './components/requesters-base/requesters-base.component';

const routes: Routes = [
  {
    path:'base',
    component:BaseComponent
  },
  {
    path:'requester-base/:id',
    component:RequestersBaseComponent
  },
  {
    path:'',
    redirectTo:'base',
    pathMatch:'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
