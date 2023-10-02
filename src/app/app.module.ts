import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    MatToolbarModule,
    MatSidenavModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp({
      apiKey: 'AIzaSyAbFTGQVFiXJyCOamXgrxKHDu5ErJeaNJg',
      authDomain: 'requester-chart.firebaseapp.com',
      projectId: 'requester-chart',
      storageBucket: 'requester-chart.appspot.com',
      messagingSenderId: '1075840410131',
      appId: '1:1075840410131:web:9ee586a9a6c97a884095e6',
      measurementId: 'G-B9KKBMEZSS',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
