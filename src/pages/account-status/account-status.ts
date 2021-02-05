import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { MsgProvider } from '../../providers/msg/msg';

@IonicPage()
@Component({
  selector: 'page-account-status',
  templateUrl: 'account-status.html',
  //styleUrls: ['./account-status.scss']
})
export class AccountStatusPage {

  accounts: any;
  error: boolean;

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public loadingCtrl: LoadingController,
      public dataProvider: DataProvider,
      public alertCtrl: AlertController,
      public msgProvider: MsgProvider
  ) {
      this.loadAccounts();
  }

  ionViewDidLoad() {}

  loadAccounts() {
    let loading = this.loadingCtrl.create();
    loading.present();

    this.dataProvider.getCustomersExpands('accounts').subscribe(
        data => {
          loading.dismiss();
          this.error = false;
          this.accounts = data['accounts'];
        },
        error => {
          loading.dismiss();
          this.error = true;
          this.msgProvider.presentToast(
              "Se produjo un error en la conexión. Intente nuevamente es unos instantes.",
              "bottom"
          );
        }
    );
  }

  getBadgetColor(importe) {
      if(importe >= 0) {
          return 'primary';
      } else {
          return 'danger'
      }
  }

  getBadgetMessage(importe) {
      if(importe >= 0) {
          return 'Su cuenta está al día';
      } else {
          return 'Su cuenta presenta deuda'
      }
  }

  getPositiveNumber(number) {
      return Math.abs(number)
  }
}
