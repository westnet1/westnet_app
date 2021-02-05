import { Component } from '@angular/core';
import { IonicPage, LoadingController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { MsgProvider } from '../../providers/msg/msg';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
    selector: 'page-place-payment',
    templateUrl: 'place-payment.html',
})
export class PlacePaymentPage {

    places: any;
    places_related: any;
    account_id: any;

    constructor(public dataProvider: DataProvider,
        public loadingCtrl: LoadingController,
        public iab: InAppBrowser,
        private msgProvider: MsgProvider) {
        this.getPlaces();
    }

    getPlaces() {
        let loading = this.loadingCtrl.create();
        loading.present();

        this.dataProvider.getPlaces().subscribe(
            data => {
                loading.dismiss();
                this.places = data['all-ecopagos'] || [];
                this.places_related = data['related_ecopagos'] || [];
            },
            error => {
                loading.dismiss();
                this.msgProvider.presentToast(
                    "Se produjo un error en la conexión. Intente nuevamente es unos instantes.",
                    "bottom"
                );
            }
        )
    }

    viewPagoFacil() {
        this.iab.create('https://www.e-pagofacil.com/','_system');
    }
}
