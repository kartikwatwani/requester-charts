import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DaywiseComponent } from './components/daywise/daywise.component';
import { RequesterChartComponent } from './components/requester-chart/requester-chart.component';

const routes: Routes = [
  {
    path:'charts-data',
    component:DaywiseComponent
  },
  {
    path:'requester-chart/:id',
    component:RequesterChartComponent
  },
  {
    path:'',
    redirectTo:'charts-data',
    pathMatch:'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
