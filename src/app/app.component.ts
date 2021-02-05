import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, AlertController, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginProvider } from '../providers/login/login';
import { NativeStorage } from '@ionic-native/native-storage';
import { CONFIG } from './app-config';
import { OneSignal } from '@ionic-native/onesignal';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { DataProvider } from '../providers/data/data';
import { Badge } from '@ionic-native/badge';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {

    @ViewChild(Nav) nav: Nav;

    rootPage: any;

    pages: Array<{ title: string, component: any, icon: any, hide?: boolean, badge?: any}>;
    notificationsCount: number = 0;

    constructor(public platform: Platform,
        public statusBar: StatusBar,
        public splashScreen: SplashScreen,
        public login: LoginProvider,
        public events: Events,
        public alertCtrl: AlertController,
        private oneSignal: OneSignal,
        public menuCtrl: MenuController,
        public nativeStorage: NativeStorage,
        public permissions: AndroidPermissions,
        public data: DataProvider,
        private badge: Badge
        ) {

        //Para las ultimas versiones de android no tenemos el permiso para usar internet y ver el estado de la red
        //Por lo que se debe de solicitar explicitamente
        if (this.platform.is('android')) {
            this.permissions.checkPermission(this.permissions.PERMISSION.INTERNET).then(
                result => console.log('Has permission?',result.hasPermission),
                err => this.permissions.requestPermission(this.permissions.PERMISSION.INTERNET)
            );

            this.permissions.checkPermission(this.permissions.PERMISSION.ACCESS_NETWORK_STATE).then(
                result => console.log('Has permission?',result.hasPermission),
                err => this.permissions.requestPermission(this.permissions.PERMISSION.ACCESS_NETWORK_STATE)
            );
        }

        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.statusBar.backgroundColorByHexString('#f9698b');
            // #f9698bb8
            this.splashScreen.hide();

            this.login.isLogged().subscribe(
                data => {
                    if (data) {
                        this.notifications();
                        this.rootPage = 'InitPage';
                    } else {
                        this.rootPage = 'LoginPage';
                    }
                },
            );
            if (platform.is('cordova')) {
                this.handlerNotifications();
            }

            setInterval(() => {
                //Llama al método para verificar el numero de notificaciones sin leer
                this.notifications();
            }, 360000);
        });

        //Se suscribe al evento para escuchar cuando se vence el token de autenticación y obliga al usuario a realizar nuevamente el login
        this.events.subscribe('http:forbidden', error => {
            nativeStorage.remove('user');
            this.nav.setRoot('LoginPage');
        });

        //Se suscribe al evento para escuchar cuando se vence el token de autenticación y obliga al usuario a realizar nuevamente el login
        this.events.subscribe('user:login', error => {
            this.nav.setRoot('InitPage');
            this.menuCtrl.enable(true, 'main-menu');
            this.menuCtrl.swipeEnable(true);
        });

        //Se suscribe al evento para escuchar cuando se actualice el numero de notificaciones sin leer
        events.subscribe('notification:count', (count) => {
          // user and time are the same arguments passed in `events.publish(user, time)`
          this.notificationsCount = count;
          this.badge.set(count);
          this.loadPages();
        });

        //Se suscribe al evento para escuchar cuando se vea una notificacion
        events.subscribe('notification:view', (notification_id) => {
            // user and time are the same arguments passed in `events.publish(user, time)`
            this.notificationsCount = this.notificationsCount - 1;
            this.badge.decrease(1)
            this.loadPages();
        });

        // used for an example of ngFor and navigation
        this.loadPages();
    }

    private handlerNotifications() {
        this.oneSignal.startInit(CONFIG.oneSignalAppID, CONFIG.senderIdFirebase);
        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
        this.oneSignal.handleNotificationOpened().subscribe(result => {
          if (result.notification.payload.additionalData) {
            this.nav.push('NotificationViewPage', {notification: result.notification.payload.additionalData})
          }
        });
        this.oneSignal.endInit();
    }

    loadPages()
    {
        this.pages = [
            { title: 'Inicio', component: 'InitPage', icon: 'logo-buffer' },
            { title: 'Mi Perfil', component: 'ProfilePage', icon: 'people' },
            { title: 'Notificaciones ', component: 'NotificationsPage', icon: 'notifications', badge: this.notificationsCount},
            // { title: 'Últimos Movimientos', component: 'MovementsPage', icon: 'logo-buffer' },
            //{ title: 'Mis Comprobantes', component: 'CurrentAccountPage', icon: 'key'},
            { title: 'Añadir Cuenta', component: 'AddCustomerPage', icon: 'person-add' },
            { title: 'Contactanos', component: 'ContactInfoPage', icon: 'logo-whatsapp' },
            { title: 'Lugares de Pago', component: 'PlacePaymentPage', icon: 'card' },
            { title: 'Solicitar extensión de pago', component: 'PaymentExtensionPage', icon: 'cash' },
            { title: 'Informar pago', component: 'IndexNotifyPaymentPage', icon: 'megaphone' },
        ];
    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        if(page.component != 'InitPage'){
            this.nav.push(page.component);
        } else {
            this.nav.setRoot(page.component);
        }
    }

    logout() {
        let alert = this.alertCtrl.create({
            title: '¿Cerrar sesión?',
            message: '¿Está seguro que desea cerrar la sesión?',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Continuar',
                    handler: () => {
                        console.log('Buy clicked');
                        // this.isLogged = false;
                        localStorage.removeItem("customer-token");
                        localStorage.removeItem('oauth-token');
                        this.nav.setRoot('LoginPage');
                    }
                }
            ]
        });
        alert.present();

    }

    notifications()
    {
        this.data.getNotificationsCount().subscribe((response:any) => {
            console.log(response);
            this.events.publish('notification:count', response.count);
        })
    }

    ngOnInit()
    {
        this.notifications();
    }
}
