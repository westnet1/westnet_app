import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { MsgProvider } from '../../providers/msg/msg';

@IonicPage()
@Component({
  selector: 'page-bills',
  templateUrl: 'bills.html',
  //styleUrls: ['./bills.scss']
})
export class BillsPage {

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

    this.dataProvider.getCustomersExpands('bills').subscribe(
        data => {
          loading.dismiss();
          this.error = false;
          this.accounts = data['bills'];
          this.customers = data['customers'];
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

  sendPDF(pdfkey) {
    let alert = this.alertCtrl.create({
        title: 'Enviar comprobante',
        message: 'Seleccione el email en el que quiere recibir el comprobante de pago.',
    });

    for (const item of this.customers) {
        if (item['email']) {
            alert.addInput({
                type: 'radio',
                label: item['email'],
                value: item['email'],
            });
        }
        if (item['email2']) {
            alert.addInput({
                type: 'radio',
                label: item['email2'],
                value: item['email2'],
            });
        }
    }

    alert.addButton({
        text: 'Cancelar',
        handler: data => {
            console.log("Presiono cancelar");
        }
    });
    alert.addButton({
        text: 'Enviar',
        handler: result => {
            this.send(pdfkey, result)
        }
    });
    alert.present();
  }

    send(pdfKey, email) {
        if(email) {
            let loading = this.loadingCtrl.create();
            loading.present();
            this.dataProvider.sendPdfByEmail(pdfKey, email).subscribe(
                data => {
                    loading.dismiss();
                    if (data) {
                        this.msgProvider.presentToast(
                            data['message'],
                            "bottom"
                        );
                    } else {
                        this.msgProvider.presentToast(
                            "Algo salió mal. No se pudo enviar el comprobante de pago al email solicitado. Por favor intentelo nuevamente.",
                            "bottom"
                        );
                    }
                },
                error => {
                    loading.dismiss();
                    this.msgProvider.manageError(error);
                }
            );
        } else {
            this.alertCtrl.create({
                title: 'Enviar comprobante',
                message: 'Por favor seleccione el email en el que desea recibir el comprobante de pago.',
            }).present();
        }

    }
}
