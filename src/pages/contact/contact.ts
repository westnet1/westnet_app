import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MsgProvider } from '../../providers/msg/msg';
import { LoginProvider } from '../../providers/login/login';
import { DataProvider } from '../../providers/data/data';

/**
 * Generated class for the ContactPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-contact',
    templateUrl: 'contact.html',
})
export class ContactPage {

    form: FormGroup;

    constructor(
        public navCtrl: NavController,
        public msg: MsgProvider,
        public auth: LoginProvider,
        public data: DataProvider,
        public loadingCtrl: LoadingController,
        public formBuilder: FormBuilder) {
        this.form = this.getContactForm();
    }

    sendQuery(contact) {
        //Se abre un alert para confirmar el cierre de sesión 
        this.msg.presentConfirm('Confirmar', '¿Esta seguro que quiere enviar la consulta?').subscribe(
            data => {
                if (data) {
                    let _loading = this.loadingCtrl.create();
                    _loading.present();
                    this.data.createContactQuery(contact).subscribe(
                        data => {
                            _loading.dismiss();
                            if (data) {
                                let _alert = this.msg.presentAlert("Gracias", "Gracias por comunicarte con nosotros. En breve un representate de Westnet se contactara para solucionar tu problema.", 'Ok');
                                _alert.present();
                                this.form = this.getContactForm();
                                this.navCtrl.setRoot('LoginPage');
                            } else {
                                this.msg.presentToast(
                                    "Se produjo al registrar la consulta. Intente nuevamente en unos instantes.",
                                    "bottom"
                                );
                            }
                        },
                        error => {
                            console.error(error);
                            _loading.dismiss();
                            this.msg.presentToast(
                                "Se produjo al registrar la consulta. Intente nuevamente en unos instantes.",
                                "bottom"
                            );
                        }
                    );


                }
            }
        );

    }

    getContactForm(): FormGroup {
        return this.formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(4)]],
            document_number: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(11)]],
            phone: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            type: ['register', [Validators.required]]
        });
    }
}
