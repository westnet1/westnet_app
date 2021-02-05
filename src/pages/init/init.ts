import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Component } from '@angular/core';
import { DataProvider } from '../../providers/data/data';

/**
 * Generated class for the InitPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-init',
  templateUrl: 'init.html',
  //styleUrls: ['init.scss']
})
export class InitPage {

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public loadingCtrl: LoadingController,
      public dataProvider: DataProvider,
      public alertCtrl: AlertController,
  ) {

  }

  ionViewDidLoad() {}

  showAccountStatus()
  {
      this.navCtrl.push('AccountStatusPage');
  }

  showBills()
  {
      this.navCtrl.push('BillsPage');
  }

  showPayments()
  {
      this.navCtrl.push('PaymentsPage');
  }
}
