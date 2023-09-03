import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DaywiseComponent } from './components/daywise/daywise.component';

const routes: Routes = [
  {
    path:'day-wise',
    component:DaywiseComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
