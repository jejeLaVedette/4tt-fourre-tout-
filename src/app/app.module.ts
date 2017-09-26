import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { BlockNote } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { SousListPage } from '../pages/list/souslist/souslist';
import { MapsPage } from '../pages/maps/maps';
import { AuthProvider } from '../providers/auth/auth';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

// AF2 Settings
export const firebaseConfig = {
    apiKey: "AIzaSyDlF9M4YVmuJG7cFmlouQqq0O5OlJUS584",
    authDomain: "test-jbr-65eea.firebaseapp.com",
    databaseURL: "https://test-jbr-65eea.firebaseio.com",
    projectId: "test-jbr-65eea",
    storageBucket: "test-jbr-65eea.appspot.com",
    messagingSenderId: "754195625254"
};

@NgModule({
  declarations: [
    BlockNote,
    HomePage,
    ListPage,
    MapsPage,
    SousListPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(BlockNote),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    BlockNote,
    HomePage,
    ListPage,
    MapsPage,
    SousListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider
  ]
})
export class AppModule { }
