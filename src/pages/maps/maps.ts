import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as _ from 'lodash';

declare var google;

@Component({
  selector: 'maps-page',
  templateUrl: 'maps.html'
})
export class MapsPage implements OnInit {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  listeMarker: FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, public geolocation: Geolocation, public modalCtrl: ModalController, public db: AngularFireDatabase) {
  }

  ngOnInit() {
    this.listeMarker = this.db.list('/listeMarker');
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

      this.listeMarker.forEach((items => {
        items.forEach(marker => {

          let str = marker.position.substr(1).slice(0, -1);
          str = str.split(',')
          let latLng = new google.maps.LatLng(parseFloat(str[0]),parseFloat(str[1]));//);
          let currentMarker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: latLng,
            draggable: true
          });

          let content = marker.title;
          this.addInfoWindow(currentMarker, content);
        })
      }));
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
      position: marker.getPosition().toString(),
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