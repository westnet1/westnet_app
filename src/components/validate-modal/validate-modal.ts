import { Component } from '@angular/core';
import { NavParams, ViewController, AlertController, NavController, Events, LoadingController } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
import { MsgProvider } from "../../providers/msg/msg";

@Component({
    selector: 'validate-modal',
    templateUrl: 'validate-modal.html'
})
export class ValidateModal {

    data: any;
    validation_code: number;
    customer_code: any;

    constructor(
        public viewCtrl: ViewController,
        public events: Events,
        params: NavParams,
        public navCtrl: NavController,
        public loginProvider: LoginProvider,
        private msgProvider: MsgProvider,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController
    ) {
        this.data = params.data.data;
    }

    validate() {
        if (!this.validation_code) {
            let alert = this.msgProvider.presentAlert(
                'Dato obligatorio',
                'Por favor ingrese el código de validación que le enviamos. Este dato es necesario para continuar',
                'Ok',
            );
            alert.present();
        } else if (String(this.validation_code).length != 4) {
            let alert = this.msgProvider.presentAlert(
                'Código incorrecto',
                'Por favor ingrese el código de validación nuevamente. El código consta de 4 dígitos.',
                'Ok',
            );
            alert.present();
        } else {
            let loading = this.loadingCtrl.create();
            loading.present();
            this.loginProvider.validate(this.validation_code, this.data.customer_nro).subscribe(
                data => {
                    loading.dismiss();
                    localStorage.setItem('customer-token', data['customer']);
                    localStorage.setItem('oauth-token', data['token']);
                    this.events.publish('user:login');    
                    this.viewCtrl.dismiss(true);                
                },
                error => {
                    loading.dismiss();
                    this.msgProvider.manageError(error);
                }
            );
        }
    }

    dismiss() {
        this.viewCtrl.dismiss(false);
    }


}
