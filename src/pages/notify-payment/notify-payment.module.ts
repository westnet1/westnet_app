import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotifyPaymentPage } from './notify-payment';

@NgModule({
  declarations: [
    NotifyPaymentPage,
  ],
  imports: [
    IonicPageModule.forChild(NotifyPaymentPage),
  ],
})
export class NotifyPaymentPageModule {}
