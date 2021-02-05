import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';

/**
 * Generated class for the NotificationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {

  notifications = [];
  loader;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private data: DataProvider,
    private loadingCtrl: LoadingController,
    private events: Events) {

  }

  ionViewDidLoad() {
    this.showLoading();
    this.data.getNotifications().subscribe((response: any) => {
      this.notifications = response.notifications;
      console.log(this.notifications);
      this.hideLoading();
    });

    //Se suscribe al evento para escuchar cuando se vea una notificacion
    this.events.subscribe('notification:view', (notification_id) => {
      const notifications = this.notifications;
      notifications.forEach((element, index) => {
        if(element.mobile_push_has_user_app_id == notification_id) {
          notifications[index]['notification_read'] = 1;
        }
      });
    });
  }

  view(event,notification) {
    this.navCtrl.push('NotificationViewPage', {notification: notification});
  }

  showLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Aguarde un instante...",
    });
    this.loader.present();
  }

  hideLoading() {
    if(this.loader !== undefined) {
      this.loader.dismiss();
    }
  }

  getNotificationClass(notification)
  {
    if(notification.notification_read) {
      return '';
    } else {
      return 'notification_new';
    }
  }

}
