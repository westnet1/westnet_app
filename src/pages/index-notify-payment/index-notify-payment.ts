import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { MsgProvider } from '../../providers/msg/msg';

@IonicPage()
@Component({
  selector: 'page-index-notify-payment',
  templateUrl: 'index-notify-payment.html',
  //styleUrls: ['./index-notify-payment.scss']
})
export class IndexNotifyPaymentPage {

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

  loadAccounts() {
    let loading = this.loadingCtrl.create();
    loading.present();

    this.dataProvider.getCustomersExpands('paymentExtensionInfo').subscribe(
        data => {

          loading.dismiss();
          this.error = false;
          this.accounts = data['paymentExtensionInfo'];
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

  notifyPayment(customerId, contractId) {
    this.navCtrl.push('NotifyPaymentPage', { customerId: customerId, contractId: contractId});
  }
}
