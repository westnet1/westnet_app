import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlacePaymentPage } from './place-payment';

@NgModule({
  declarations: [
    PlacePaymentPage,
  ],
  imports: [
    IonicPageModule.forChild(PlacePaymentPage),
  ],
})
export class PlacePaymentPageModule {}