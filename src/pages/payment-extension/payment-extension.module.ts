import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentExtensionPage } from './payment-extension';

@NgModule({
  declarations: [
    PaymentExtensionPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentExtensionPage),
  ],
})
export class PaymentExtensionPageModule {}
