import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, LoadingController } from 'ionic-angular';
import { FormBuilder } from '@angular/forms';
import { LoginProvider } from '../../providers/login/login';
import { DataProvider } from '../../providers/data/data';
import { MsgProvider } from '../../providers/msg/msg';

@IonicPage()
@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html',
    //styleUrls: ['./profile.scss']
})
export class ProfilePage {

    customers: any;
    customer: any;
    customer_code: any;
    show_more: any;

    constructor(public navCtrl: NavController,
        private msgProvider: MsgProvider,
        public navParams: NavParams,
        public formBuilder: FormBuilder,
        public alertCtrl: AlertController,
        public loginProvider: LoginProvider,
        public dataProvider: DataProvider,
        public loadingCtrl: LoadingController,
        public modalCtrl: ModalController
    ) {}

    ionViewDidLoad() {
        this.getCustomers();
    }
    
    getCustomers() {

        let loading = this.loadingCtrl.create();
        loading.present();

        this.dataProvider.getCustomers().subscribe(
            data => {
                loading.dismiss();
                console.log(data);
                if (data) {
                    this.customers = data['customers'];
                    console.log(this.customers);
                } else {
                    this.msgProvider.presentToast(
                        "Se produjo un error en la conexión. Intente nuevamente es unos instantes.",
                        "bottom"
                    );
                }
            },
            error => {
                loading.dismiss();
                console.error(error);
                this.msgProvider.presentToast(
                    "Se produjo un error en la conexión. Intente nuevamente es unos instantes.",
                    "bottom"
                );
            }
        );
    }

    updateOnClick(customer) {
        this.customer_code = customer.code;
        this.presentModal(customer);
    }

    presentModal(customer) {
        let modal = this.modalCtrl.create('ProfileModalPage', { customer: customer });
        modal.onDidDismiss(data => {
            console.log('Modal cerrado');
            console.log(data);
            if (data) {
                let alert = this.alertCtrl.create({
                    message: 'Se actualizaron sus datos!',
                    buttons: [
                        {
                            text: "Ok",
                            role: 'cancel',
                            handler: data => {
                                this.navCtrl.setRoot('ProfilePage');
                            }
                        }
                    ]
                });
                alert.present();
            }
        });
        modal.present();
    }

    goContactEditData(customer) {
        this.navCtrl.push("ContactEditPage", customer);
    }
}
