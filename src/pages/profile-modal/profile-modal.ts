import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MsgProvider } from '../../providers/msg/msg';

@IonicPage()
@Component({
    selector: 'page-profile-modal',
    templateUrl: 'profile-modal.html',
})
export class ProfileModalPage {

    profileForm: FormGroup;
    customer: any;

    constructor(public navCtrl: NavController, 
        public navParams: NavParams, 
        public dataProvider: DataProvider, 
        public alertCtrl: AlertController,
        public formBuilder: FormBuilder,
        private msg: MsgProvider,
        public viewCtrl: ViewController ) {

            this.profileForm = this.formBuilder.group({
                email: ['', [Validators.required, Validators.email]],
                phone: ['', Validators.required],
              });

            this.customer = navParams.get('customer');
    }



    updateCustomer(customer_code) {
        this.dataProvider.updateCustomer(customer_code, this.profileForm.value.email, this.profileForm.value.phone).subscribe(
            data => {
                this.viewCtrl.dismiss(true);
            },
            error => {
                console.error(error);
                this.msg.presentToast("Se produjo un error al actualizar los datos. Intente nuevamente en unos momentos.","center");
                
            }
        );
    }

    dismiss() {
        this.viewCtrl.dismiss(false);
    }

}
