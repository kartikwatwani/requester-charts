import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'requester-analysis',
    loadChildren: () =>
      import('./requester-analysis/requester-analysis.module').then(
        (m) => m.RequesterAnalysisModule
      ),
  },
  {
    path:'',
    redirectTo:'requester-analysis',
    pathMatch:'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
