import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ActionSheetController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  selectedItem: any;
  icons: string[];
  ListeItems: FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, db: AngularFireDatabase) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item2');
    this.ListeItems = db.list('/ListeMenu');
  }

  addTodoMenu() {
    let prompt = this.alertCtrl.create({
      title: 'Todo Name',
      message: "Enter a name for this new todo you're so keen on adding",
      inputs: [
        {
          name: 'title',
          placeholder: 'title'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            // console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.ListeItems.push({
              title: data.title
            });
          }
        }
      ]
    });
    prompt.present();
  }

  testJBR(itemId, itemTitle) {
  }

  showOptions(itemId, itemTitle) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'What do you want to do?',
      buttons: [
        {
          text: 'Delete Todo',
          role: 'destructive',
          handler: () => {
            this.removeTodo(itemId);
          }
        }, {
          text: 'Update Todo',
          handler: () => {
            this.updateTodo(itemId, itemTitle);
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  removeTodo(itemId: string) {
    this.ListeItems.remove(itemId);
  }

  updateTodo(itemId, itemTitle) {
    let prompt = this.alertCtrl.create({
      title: 'Todo Name',
      message: "Update the name for this todo",
      inputs: [
        {
          name: 'title',
          placeholder: 'title',
          value: itemTitle
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            // console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.ListeItems.update(itemId, {
              title: data.title
            });
          }
        }
      ]
    });
    prompt.present();
  }
}
