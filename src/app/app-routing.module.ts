import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChartComponent } from './components/chart/chart.component';
import { RequesterChartComponent } from './components/requester-chart/requester-chart.component';
import { BaseComponent } from './components/base/base.component';

const routes: Routes = [
  {
    path:'base',
    component:BaseComponent
  },
  {
    path:'requester-chart/:id',
    component:RequesterChartComponent
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
