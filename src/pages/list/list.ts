import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ActionSheetController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  //menu principale
  ListeMenu: FirebaseListObservable<any>;
  //sous menu
  MonSousMenu: FirebaseListObservable<any>;
  db: AngularFireDatabase;
  isSousMenu: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, db: AngularFireDatabase) {
    // If we navigated to this page, we will have an item available as a nav param
    // a chaque fois que l'on arrive sur cette page, on est sur le menu classique donc pas de sous menu
    this.isSousMenu = false;
    this.ListeMenu = db.list('/ListeMenu');
    this.db = db;
  }

  /**
   * Méthode qui ajoute un élément a une liste
   */
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
            this.ListeMenu.push({
              title: data.title,
              //si true, alors sous menu, sinon menu principale
              isSousMenu: this.isSousMenu
            });
          }
        }
      ]
    });
    prompt.present();
  }

  /**
   * méthode appelé lorsque l'on clique sur un sousMenu <br/>
   * Affiche les différents options : modifié/supprimé/Annuler
   * @param itemId  : id de l'item
   * @param itemTitle : titre de l'item
   * @param isSousMenu : boolean qui définis si oui ou non c'est un sous menu
   */
  showOptions(itemId, itemTitle, isSousMenu) {
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

  goToSubMenu(itemId, itemTitle, isSousMenu) {
    this.isSousMenu = true;
    if (!isSousMenu) {
      this.MonSousMenu = this.db.list('/ListeMenu/' + itemId + '/SousMenus');
    }
    this.ListeMenu = this.MonSousMenu;
    //this.ListeMenu.push({ListPage});
  }

  /**
   * supprime l'item de la listeMenu
   * @param itemId : id de l'item
   */
  removeTodo(itemId: string) {
    this.ListeMenu.remove(itemId);
  }

  /**
   * Met a jour un item de la liste
   * @param itemId : id de l'item
   * @param itemTitle : titre de l'item
   */
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
