// import { Component } from '@angular/core';
// import { IonicPage, NavController, NavParams, LoadingController, AlertController, Events, ModalController, MenuController } from 'ionic-angular';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { LoginProvider } from '../../providers/login/login';
// import { NativeStorage } from '@ionic-native/native-storage';
// import { Facebook } from '@ionic-native/facebook';
// import { GooglePlus } from '@ionic-native/google-plus';
// import { ValidateModal } from '../../components/validate-modal/validate-modal';
// import { MsgProvider } from "../../providers/msg/msg";
// import { CONFIG } from '../../app/app-config';
// import { SetDocumentComponent } from '../../components/set-document/set-document';


// @IonicPage()
// @Component({
//     selector: 'page-signup',
//     templateUrl: 'signup.html',
// })
// export class SignupPage {

//     loginForm: FormGroup;
//     user: any;
//     user_app_id: any;
//     customer_code: any;

//     showUser: boolean = false;

//     constructor(public navCtrl: NavController,
//         public navParams: NavParams,
//         public formBuilder: FormBuilder,
//         public alertCtrl: AlertController,
//         public loginProvider: LoginProvider,
//         public loadingCtrl: LoadingController,
//         private facebook: Facebook,
//         private googlePlus: GooglePlus,
//         public events: Events,
//         public modalCtrl: ModalController,
//         private msgProvider: MsgProvider,
//         public menu: MenuController,
//         public nativeStorage: NativeStorage) {

//         this.menu.swipeEnable(false); //Se desactiva el menu solo para esta PAGE

//         let _customer_code_tmp = '';

//         if(this.navParams.data.customer_code) {
//             _customer_code_tmp = this.navParams.data.customer_code;
//         }

//         this.loginForm = this.formBuilder.group({
//             email: ['', [Validators.required, Validators.email]],
//             customer_nro: [_customer_code_tmp , Validators.required]
//         });
//     }

//     ionViewDidLoad() {
//         console.log('ionViewDidLoad SignupPage');
//     }

//     loginUser(_email?: string, _customer_nro?: number) {

//         let loading = this.loadingCtrl.create();
//         loading.present();

//         let email: string;
//         let customer_nro: number;
//         if (_email) {
//             email = _email;
//         } else {
//             email = this.loginForm.value.email;
//         }
//         if (_customer_nro) {
//             customer_nro = _customer_nro;
//         } else {
//             customer_nro = this.loginForm.value.customer_nro;
//         }

//         this.loginProvider.customerData(email, customer_nro).subscribe(
//             data => {
//                 console.log("retorno del customer data: ", data);
//                 loading.dismiss();
//                 if (data) {
//                     // this.user_app_id = data['user']['user_app_id'];
//                     this.selectAccount(data['destinataries']);
//                 } else {
//                     this.msgProvider.presentToast(
//                         "Credenciales incorrectas. Ingrese nuevamente las mismas.",
//                         "bottom"
//                     );

//                 }
//             },
//             error => {
//                 console.error("Error en customer-data: ", error);
//                 loading.dismiss();
//                 this.msgProvider.manageError(error);
//             }
//         );

//     }

//     selectAccount(destinataries) {
//         let alert = this.alertCtrl.create({
//             title: 'Cuenta',
//             message: 'Le enviaremos un código para poder validar su cuenta. Por favor seleccione el teléfono donde desea recibirlo.',
//         });

//         for (const destinatary of destinataries) {
//             alert.addInput({
//                 type: 'radio',
//                 label: destinatary.value,
//                 value: destinatary.value,
//             });
//         }

//         alert.addButton({
//             text: 'Cancelar',
//             handler: data => {
//                 console.log("Presiono cancelar");
//             }
//         });
//         alert.addButton({
//             text: 'OK',
//             handler: result => {
//                 this.sendNotification(result, this.loginForm.value.customer_nro);
//             }
//         });
//         alert.present();
//     }


//     loginFacebook() {
//         this.facebook.logout(); //Eliminamos la sesión previa de facebok
//         this.facebook.login(['public_profile', 'email'])
//             .then(rta => {
//                 console.log(rta);
//                 if (rta.status == 'connected') {
//                     this.getInfoFacebook();
//                 };
//             })
//             .catch(error => {
//                 console.error(error);
//                 let message = "Se produjo un error en la conexión. Intente nuevamente es unos instantes.";
//                 if (error) {
//                     message = error;
//                 }
//                 this.msgProvider.presentToast(
//                     message,
//                     "bottom"
//                 );
//             });
//     }

//     loginGoogle() {
//         this.googlePlus.login({
//             'webClientId': CONFIG.webClientGoogle,
//         }).then(res => console.log(res))
//             .catch(err => console.error(err));
//     }

//     getInfoFacebook() {
//         this.facebook.api('/me?fields=id,name,email,first_name,picture,last_name,gender', ['public_profile', 'email'])
//             .then(data => {
//                 //console.log(data);
//                 if (data['email']) {
//                     this.presentPromptCustomerID(data['email']);
//                 } else {
//                     this.facebook.logout(); //Eliminamos la sesión previa de facebok
//                     let alert = this.msgProvider.presentAlert(
//                         'Algo salió mal',
//                         'Debes compartirnos el email para poder registrarte en la aplicación.',
//                         'OK'
//                     );
//                     alert.present();
//                 }
//             })
//             .catch(error => {
//                 console.error(error);
//             });
//     }


//     sendNotification(attr, customer_nro) {

//         let loading = this.loadingCtrl.create();
//         loading.present();

//         this.loginProvider.verifyData(attr, customer_nro).subscribe(
//             data => {
//                 loading.dismiss();
//                 this.validate(this.loginForm.value, this.loginForm.value.customer_nro);
//             },
//             error => {
//                 loading.dismiss();
//                 let message = "Se produjo un error en la conexión. Intente nuevamente es unos instantes.";
//                 if (error) {
//                     message = error.error.error;
//                 }
//                 let alert = this.msgProvider.presentAlert(
//                     'Algo salió mal!',
//                     'Por favor vuelva a intentarlo!',
//                     {
//                         text: "Ok",
//                         role: 'cancel',
//                         handler: data => {
//                             //this.navCtrl.setRoot('LoginPage');
//                         }
//                     },
//                     message,
//                 );
//                 alert.present();

//             }
//         );


//     }

//     validate(data, customer_nro) {
//         let profileModal = this.modalCtrl.create(SetDocumentComponent, { data: data, customer_code: customer_nro });
        
//         profileModal.onDidDismiss(
//             data => {
//                 if(data) {
//                     this.msgProvider.presentAlert("Bienvenido", "Gracias por realizar la validación de tus datos. Ahora ya puedes ingresar con tu número de documento o cuit.","Ok").present();
//                     this.navCtrl.setRoot('LoginPage');
//                 }
//             } );

//         profileModal.present();
        
//     }

//     presentPromptCustomerID(email: string) {
//         let alert = this.alertCtrl.create({
//             title: 'Número de cliente',
//             subTitle: 'Ingrese su número de cliente para continuar con su registro',
//             inputs: [
//                 {
//                     name: 'customer_nro',
//                     placeholder: 'Número de cliente'
//                 }
//             ],
//             buttons: [
//                 {
//                     text: 'Cancel',
//                     role: 'cancel',
//                     handler: data => {
//                         console.log('Cancel clicked');
//                     }
//                 },
//                 {
//                     text: 'Continuar',
//                     handler: data => {
//                         if (data.customer_nro) {
//                             this.loginUser(email, data.customer_nro);
//                         }
//                     }
//                 }
//             ]
//         });
//         alert.present();
//     }

//     goToContactPage(ev) {
//         ev.preventDefault();
//         this.navCtrl.push('ContactPage');
//     }

// }
