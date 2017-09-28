import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';


declare var google;

@Component({
  selector: 'maps-page',
  templateUrl: 'maps.html'
})
export class MapsPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  listeMarker: FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, public geolocation: Geolocation, public modalCtrl: ModalController, db: AngularFireDatabase) {
    this.listeMarker = db.list('/listeMarker');
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {
    this.geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    }, (err) => {
      console.log(err);
    });
  }

  addMarker() {
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter(),
      draggable: true
    });
    let content = "<h4>TEST CREATION MARKER</h4>";
    this.addInfoWindow(marker, content);
    this.listeMarker.push({
      title: content,
      //si true, alors sous menu, sinon menu principale
      position: marker.getPosition().toString() ,
    });
  }

  addInfoWindow(marker, content) {
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    google.maps.event.addListener(marker, 'click', () => {
      // infoWindow.open(this.map, marker);
      let pageDetails = this.modalCtrl.create(MapsPage);
      infoWindow.open(this.map, marker)
        //  pageDetails.present();
    });

    google.maps.event.addListener(marker, 'dragend', () => {
      alert(marker.getPosition())
    });
  }
}