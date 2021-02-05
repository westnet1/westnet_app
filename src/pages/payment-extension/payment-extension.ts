import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { LoginProvider } from "../../providers/login/login";
import { DataProvider } from '../../providers/data/data';
import { MsgProvider } from '../../providers/msg/msg';

@IonicPage()
@Component({
  selector: 'page-payment-extension',
  templateUrl: 'payment-extension.html',
  //styleUrls: ['./payment-extension.scss']
})
export class PaymentExtensionPage {

  accounts: any;
  customer_code: any;
  show_more: any;
  error: boolean;

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public login: LoginProvider,
      public loadingCtrl: LoadingController,
      public dataProvider: DataProvider,
      public msgProvider: MsgProvider,
      public alert: AlertController,
      public toast: ToastController
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentExtensionPage');
  }

    onClick(customer_code) {
        if (this.customer_code == customer_code) {
            this.show_more = !this.show_more;
        } else {
            this.show_more = true;
        }
        this.customer_code = customer_code;
    }

    showMore(customer_code) {
        if (this.accounts.length == 1) {
            return true;
        }

        if (this.show_more && this.customer_code == customer_code) {
            return true;
        }
        return false;
    }

   confirmExtensionPayment(contract_id) {
    this.alert.create({
      //header: "Prompt!",
      message: '¿Está seguro que desea realizar una extensión de pago?. Indique el motivo de la misma',
      inputs: [
        {
          name: 'reason',
          type: 'text',
          placeholder: 'Motivo de la extensión de pago'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Confirmar',
          handler: option => {
            let loading = this.loadingCtrl.create();
            loading.present();

            let data = {
              contract_id: contract_id,
              reason: option.reason 
            }

            this.dataProvider.createExtensionPayment(data).subscribe(response => {
                if(response['status'] === 'success'){
                    loading.dismiss();
                  this.alert.create({
                    title: response['title'],
                    message: response['msj'],
                    buttons: [
                      {
                        text: 'OK',
                        handler: () => {
                          this.navCtrl.setRoot('InitPage')
                        }
                      }
                    ]
                  }).present()
                } else {
                    loading.dismiss();
                }
            }, error => {
                loading.dismiss();
                let message= 'Algo salió mal.';
              if (error.error.error){
                 message = error.error.error; 
              }
              this.alert.create({
                message: message,
                buttons: [
                  {
                    text: 'OK',
                    handler: () => {
                      this.navCtrl.setRoot('InitPage')
                    }
                  }
                ]
              }).present()
            });
          }
        }
      ]
    }).present();
   }
}