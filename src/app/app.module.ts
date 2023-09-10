import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ChartComponent } from './components/chart/chart.component';
import { NgChartsModule } from 'ng2-charts';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { RequesterChartComponent } from './components/requester-chart/requester-chart.component';
import { BaseComponent } from './components/base/base.component';

@NgModule({
  declarations: [AppComponent, ChartComponent, RequesterChartComponent, BaseComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    FormsModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    AngularFirestoreModule,
    NgChartsModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    MatFormFieldModule,
    MatSelectModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp({
      apiKey: 'AIzaSyCF50qlY3PLzCBWLq8ZFNgHcIiTR_2_gzs',
      authDomain: 'angular-charts-9032b.firebaseapp.com',
      databaseURL:
        'https://angular-charts-9032b-default-rtdb.asia-southeast1.firebasedatabase.app',
      projectId: 'angular-charts-9032b',
      storageBucket: 'angular-charts-9032b.appspot.com',
      messagingSenderId: '784020506751',
      appId: '1:784020506751:web:d1d4c1b223ca495171974a',
      measurementId: 'G-ZZ0F3CN5H2',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
