import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountStatusPage } from './account-status';

@NgModule({
  declarations: [
    AccountStatusPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountStatusPage),
  ],
})
export class AccountStatusPageModule {}
