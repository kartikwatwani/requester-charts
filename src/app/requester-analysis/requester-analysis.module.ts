import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { NgChartsModule } from 'ng2-charts';
import { ChartComponent } from './components/chart/chart.component';
import { RequesterBaseComponent } from './components/requester-base/requester-base.component';
import { RequestersAnalysisComponent } from './components/requesters-analysis/requesters-analysis';
import { RequestersPresenceComponent } from './components/requesters-presence/requesters-presence.component';
import { RequestersReactionsComponent } from './components/requesters-reactions/requesters-reactions.component';
import { RequestersWageRateComponent } from './components/requesters-wage-rate/requesters-wage-rate.component';
import { RequestersPresenceTableComponent } from './components/requesters-presence-table/requesters-presence-table.component';
import { RequesterAnalysisRoutingModule } from './requester-analysis-routing.module';
import { RequesterDetailComponent } from './components/requester-detail/requester-detail.component';
import {MatSliderModule} from '@angular/material/slider'

@NgModule({
  declarations: [
    ChartComponent,
    RequestersAnalysisComponent,
    RequestersAnalysisComponent,
    RequesterBaseComponent,
    RequestersWageRateComponent,
    RequestersReactionsComponent,
    RequestersPresenceComponent,
    RequestersPresenceTableComponent,
    RequesterDetailComponent,
    RequestersAnalysisComponent,
  ],
  imports: [
    FormsModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    AngularFirestoreModule,
    NgChartsModule,
    MatSliderModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    MatFormFieldModule,
    MatSelectModule,
    RequesterAnalysisRoutingModule,
    CommonModule,
  ],
})
export class RequesterAnalysisModule {}
