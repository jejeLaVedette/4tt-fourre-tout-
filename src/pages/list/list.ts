import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ActionSheetController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  selectedMenu: any;
  selectedItem: any;
  icons: string[];
  ListeMenu: FirebaseListObservable<any>;
  MonSousMenu: FirebaseListObservable<any>;
  db: AngularFireDatabase;
  isSousMenu : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, db: AngularFireDatabase) {
    // If we navigated to this page, we will have an item available as a nav param
    this.isSousMenu = false;
    console.log("1 : "+this.isSousMenu);
    this.selectedMenu = navParams.get('menu');
    this.selectedItem = navParams.get('item2');
    this.ListeMenu = db.list('/ListeMenu');
    this.db = db;
  }

  addTodoMenu() {
    console.log("2 : "+this.isSousMenu);
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
            this.ListeMenu.push({
              title: data.title,
              isSousMenu: this.isSousMenu
            });
          }
        }
      ]
    });
    prompt.present();
  }

  testJBR(itemId, itemTitle, isSousMenu) {
    console.log("3 : "+this.isSousMenu);
    this.isSousMenu=true;
    console.log("4 : "+this.isSousMenu);
    if (isSousMenu) {
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
    } else {
      this.MonSousMenu = this.db.list('/ListeMenu/' + itemId + '/SousMenus');
    }
    this.ListeMenu = this.MonSousMenu;
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
    this.ListeMenu.remove(itemId);
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
            this.ListeMenu.update(itemId, {
              title: data.title
            });
          }
        }
      ]
    });
    prompt.present();
  }
}
