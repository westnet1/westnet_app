import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';

/**
 * Generated class for the NotificationViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification-view',
  templateUrl: 'notification-view.html',
})
export class NotificationViewPage {

  notification;

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private data: DataProvider,
      private events: Events) {
    this.notification = this.navParams.get('notification');
  }

  ionViewDidLoad() {
    if(this.notification.notification_read == 0) {
      this.notification.notification_read == 1;
      this.events.publish('notification:view', this.notification.mobile_push_has_user_app_id);
      this.data.notificationViewed(this.notification.mobile_push_has_user_app_id).subscribe((response:any) => {
        console.log(response);
      });
    }
  }

  buttonAction(event, action) {
    switch (action) {
      case "payment_extension":
        this.navCtrl.push('PaymentExtensionPage');
        break;
      case "payment_notify":
        this.navCtrl.push('IndexNotifyPaymentPage');
        break;
      case "edit_data": 
        this.navCtrl.push('ProfilePage');
        break;
      case "send_bill":
        this.navCtrl.push('BillsPage')
        break;
      default:
        console.log("Action not defined");      
    }
  }
}
