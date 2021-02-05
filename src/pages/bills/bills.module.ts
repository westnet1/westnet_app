import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BillsPage } from './bills';

@NgModule({
  declarations: [
    BillsPage,
  ],
  imports: [
    IonicPageModule.forChild(BillsPage),
  ],
})
export class BillsPageModule {}
