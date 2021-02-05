import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentsPage } from './payments';

@NgModule({
  declarations: [
    PaymentsPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentsPage),
  ],
})
export class PaymentsPageModule {}
