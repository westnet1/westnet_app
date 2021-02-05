import { Component } from '@angular/core';
import { Events, ViewController, NavParams, NavController, LoadingController, AlertController } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
import { MsgProvider } from '../../providers/msg/msg';

/**
 * Generated class for the SetDocumentComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'set-document',
    templateUrl: 'set-document.html'
})
export class SetDocumentComponent {

    data: any;
    validation_code: number;
    customer_code: any;
    document_number: any;

    constructor(
        public viewCtrl: ViewController,
        public events: Events,
        public params: NavParams,
        public navCtrl: NavController,
        public loginProvider: LoginProvider,
        private msgProvider: MsgProvider,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController
    ) {
        this.data = params.data.data;
    }

    setDocument() {
        if (!this.validation_code || !this.document_number) {
            let alert = this.msgProvider.presentAlert(
                'Dato obligatorio',
                'Por favor ingrese los datos solicitados. Ambos datos son necesarios para continuar',
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
            this.loginProvider.setDocumentNumber(this.validation_code, this.data.customer_nro, this.document_number).subscribe(
                data => {
                    loading.dismiss();
                    if(data['status'] == 'success') {
                        this.viewCtrl.dismiss(true);
                    } else {
                        this.msgProvider.manageError();
                    }
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
