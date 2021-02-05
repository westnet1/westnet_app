import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Events, ModalController, MenuController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { LoginProvider } from '../../providers/login/login';
import { NativeStorage } from '@ionic-native/native-storage';
import { ValidateModal } from '../../components/validate-modal/validate-modal';
import { MsgProvider } from "../../providers/msg/msg";

@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {

    loginForm: FormGroup;
    user: any;
    user_app_id: any;
    customer_code: any;
    contact_info: string;

    showUser: boolean = false;
    customer_nro_defined: boolean = false;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public formBuilder: FormBuilder,
        public alertCtrl: AlertController,
        public loginProvider: LoginProvider,
        public loadingCtrl: LoadingController,
        public events: Events,
        public modalCtrl: ModalController,
        private msgProvider: MsgProvider,
        public menu: MenuController,
        public nativeStorage: NativeStorage) {

        this.menu.swipeEnable(false); //Se desactiva el menu solo para esta PAGE

        this.loginForm = this.formBuilder.group({
            customer_nro: ['', Validators.required]
        });

        this.loginProvider.getContactInfo().subscribe((data) => {
            this.contact_info = data['info'];
        })

    }


    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPage');
    }

    loginUser(_email?: string, _customer_nro?: number) {

        let loading = this.loadingCtrl.create();
        loading.present();

        this.loginProvider.login(this.loginForm.value.document_number, this.loginForm.value.customer_nro).subscribe(
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
                console.error("Error: ", error);
                loading.dismiss();
                this.msgProvider.manageError(error);
            }
        );
    }


    checkUser() {
        

        if (this.loginForm.value['customer_nro']) {
            let loading = this.loadingCtrl.create();
            loading.present();
            this.loginProvider.checkCustomer(this.loginForm.value['customer_nro']).subscribe(
                data => {
                    loading.dismiss();
                    console.log("Datos recibidos al validar usuario: ", data);
                    if (data['status'] == 'success') {
                        if (data['document_type']['has_document_number']) {
                            this.customer_nro_defined = true; //Seteo el campo para que el usuario tiene el documento en la DB
                            if (data['document_type']['name'] == "CUIT") {
                                this.loginForm.addControl('document_number', new FormControl('', Validators.required));
                                this.loginForm.addControl('type_document', new FormControl('CUIT', Validators.required));
                            } else {
                                this.loginForm.addControl('document_number', new FormControl('', Validators.required));
                                this.loginForm.addControl('type_document', new FormControl('DNI', Validators.required));
                            }
                        } else {
                            console.log("no tiene documento seteado en la DB");
                            this.msgProvider.presentConfirm('Algo salió mal',
                                'Para el número de cliente ingresado no tenemos un número de DNI/CUIT válido. Para ingresar a tu cuenta puedes registrar tu documento luego de una validación con tu email o teléfono.', 'Continuar', 'Cancelar').subscribe(
                                    data => {
                                        if (data) {
                                            this.navCtrl.push('SignupPage', { customer_code: this.loginForm.value.customer_nro });
                                        }
                                    }
                                )
                        }
                    } else {
                        this.msgProvider.manageError(null);
                    }
                },
                error => {
                    loading.dismiss();
                    this.msgProvider.manageError(error);
                }
            )
        } else {
            this.msgProvider.presentAlert("Dato obligatorio", "Ingrese su número de cliente para continuar.", "Ok").present();
        }
    }


    selectAccount(destinataries) {
        let alert = this.alertCtrl.create({
            title: 'Cuenta',
            message: 'Le enviaremos un código para poder validar su cuenta. Por favor seleccione el medio de contacto donde desea recibirlo.',
        });

        for (const destinatary of destinataries) {
            alert.addInput({
                type: 'radio',
                label: destinatary.value,
                value: destinatary.value,
            });
        }

        alert.addButton({
            text: 'Cancelar',
            handler: data => {
                console.log("Presiono cancelar");
            }
        });
        alert.addButton({
            text: 'OK',
            handler: result => {
                this.validate(this.loginForm.value, this.loginForm.value.customer_nro);
                this.sendNotification(result, this.loginForm.value.customer_nro, this.user_app_id);
            }
        });
        alert.present();
    }

    sendNotification(attr, customer_nro, user_app_id) {

        let loading = this.loadingCtrl.create();
        loading.present();

        this.loginProvider.sendNotification(attr, customer_nro, user_app_id).subscribe(
            data => {
                loading.dismiss();
                //this.navCtrl.setRoot('CurrentAccountPage');
            },
            error => {
                loading.dismiss();
                let message = "Se produjo un error en la conexión. Intente nuevamente es unos instantes.";
                if (error) {
                    message = error.error.error;
                }
                let alert = this.msgProvider.presentAlert(
                    'Algo salió mal!',
                    'Por favor vuelva a intentarlo!',
                    {
                        text: "Ok",
                        role: 'cancel',
                        handler: data => {
                            this.navCtrl.setRoot('LoginPage');
                        }
                    },
                    message,
                );
                alert.present();

            }
        );
    }

    validate(data, customer_nro) {
        let profileModal = this.modalCtrl.create(ValidateModal, { data: data, customer_code: customer_nro });
        profileModal.present();
    }

    goToContactPage() {
        this.navCtrl.push('ContactPage');
    }

    deleteCustomer() {
        this.loginForm = this.formBuilder.group({
            customer_nro: ['', Validators.required]
        });
        this.customer_nro_defined = false;
    }
}
