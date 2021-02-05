import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationViewPage } from './notification-view';

@NgModule({
  declarations: [
    NotificationViewPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationViewPage),
  ],
})
export class NotificationViewPageModule {}
