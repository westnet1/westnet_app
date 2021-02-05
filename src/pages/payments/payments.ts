import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { MsgProvider } from '../../providers/msg/msg';

@IonicPage()
@Component({
  selector: 'page-payments',
  templateUrl: 'payments.html',
  //styleUrls: ['./payments.scss']
})
export class PaymentsPage {

  accounts: any;
  error: boolean;
  customers: any;

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

    this.dataProvider.getCustomersExpands('payments').subscribe(
        data => {
          loading.dismiss();
          this.error = false;
          this.accounts = data['payments'];
          this.customers = data['customers'];
          console.log(data);
          console.log(data['payments'][0]['payments']);
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

}
