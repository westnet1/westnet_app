import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ModalController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginProvider } from '../../providers/login/login';
import { ValidateModal } from '../../components/validate-modal/validate-modal';
import { MsgProvider } from '../../providers/msg/msg';

/**
 * Generated class for the AddCustomerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-add-customer',
    templateUrl: 'add-customer.html',
})
export class AddCustomerPage {

    customerForm: FormGroup;
    customer: any;
    user_app_id: any;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public loadingCtrl: LoadingController,
        public formBuilder: FormBuilder,
        public alertCtrl: AlertController,
        public loginProvider: LoginProvider,
        private msgProvider: MsgProvider,
        public modalCtrl: ModalController,
    ) {
        this.customerForm = this.formBuilder.group({
            code: ['', Validators.compose([Validators.required, Validators.minLength(4)])]
        });
    }


    addCustomer(_customer_nro?: number) {
        let loading = this.loadingCtrl.create();
        loading.present();
        this.loginProvider.addCustomer(this.customerForm.value).subscribe(
            data => {
                loading.dismiss();
                if (data['status'] == 'success') {
                    this.msgProvider.presentAlert("Cliente agregado", "Ya puedes administrar el cliente ingresado con este mismo dispositivo", "Ok").present();
                } else {
                    this.msgProvider.presentToast(
                        "Credenciales incorrectas. Ingrese nuevamente las mismas.",
                        "bottom"
                    );
                }

            },
            error => {
                loading.dismiss();
                this.msgProvider.manageError(error);
            }
        );

        /* Compomiento deprecated(desde el 03/04/2019): se deja comentado momentaneamente por si desde Westnet 
        quiere volver para atras y realivar la validacion por SMS o email al agregar un nuevo cliente  
        let loading = this.loadingCtrl.create();
        loading.present();

        let email: string;
        let customer_nro: number;
        if (_email) {
            email = _email;
        } else {
            email = this.customerForm.value.email;
        }
        if (_customer_nro) {
            customer_nro = _customer_nro;
        } else {
            customer_nro = this.customerForm.value.customer_nro;
        }

        this.loginProvider.addCustomer(email, customer_nro).subscribe(
            data => {
                loading.dismiss();
                if (data) {
                    this.user_app_id = data['user']['user_app_id'];
                    this.selectAccount(data['destinataries']);
                } else {
                    this.msgProvider.presentToast(
                        "Credenciales incorrectas. Ingrese nuevamente las mismas.",
                        "bottom"
                    );
                }

            },
            error => {
                loading.dismiss();
                this.msgProvider.manageError(error);
            }
        );*/

    }

    /* Fc deprecated(desde el 03/04/2019): se deja comentado momentaneamente por si desde Westnet 
        quiere volver para atras y realivar la validacion por SMS o email al agregar un nuevo cliente */
    selectAccount(destinataries) {
        let alert = this.alertCtrl.create({
            title: 'Cuenta',
            message: 'Le enviaremos un código para poder validar su cuenta. Por favor seleccione el teléfono donde desea recibirlo.',
        });

        for (const destinatary of destinataries) {
            alert.addInput({
                type: 'radio',
                label: destinatary.value,
                value: destinatary.value,
            });
        }

        alert.addButton({
            text: 'Cancel',
            handler: data => {
                //this.navCtrl.setRoot('LoginPage');
            }
        });
        alert.addButton({
            text: 'OK',
            handler: result => {
                this.validate(this.customerForm.value);
                console.log(result);
                this.sendNotification(result, this.customerForm.value.customer_nro, this.user_app_id);
            }
        });
        alert.present();
    }


    /* FC deprecated(desde el 03/04/2019): se deja comentado momentaneamente por si desde Westnet 
        quiere volver para atras y realivar la validacion por SMS o email al agregar un nuevo cliente */
    validate(data) {
        let profileModal = this.modalCtrl.create(ValidateModal, { data: data });
        profileModal.present();
    }


    /* FC deprecated(desde el 03/04/2019): se deja comentado momentaneamente por si desde Westnet 
        quiere volver para atras y realivar la validacion por SMS o email al agregar un nuevo cliente */
    sendNotification(attr, customer_nro, user_app_id) {

        let loading = this.loadingCtrl.create();
        loading.present();

        this.loginProvider.sendNotification(attr, customer_nro, user_app_id).subscribe(
            data => {
                loading.dismiss();
            },
            error => {
                loading.dismiss();
                let alert = this.alertCtrl.create({
                    message: error.message,
                    buttons: [
                        {
                            text: "Ok",
                            role: 'cancel',
                            handler: data => {
                                this.navCtrl.setRoot('LoginPage');
                            }
                        }
                    ]
                });
                alert.present();

            }
        );


    }

}
