import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { PrivateTokenInterceptor } from '../providers/interceptor/privateToken';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DataProvider } from '../providers/data/data';
import { HttpClientModule } from '@angular/common/http';
import { MsgProvider } from '../providers/msg/msg';
import { LoginProvider } from '../providers/login/login';
import { NativeStorage } from '@ionic-native/native-storage';
// import { Facebook } from '@ionic-native/facebook';
// import { GooglePlus } from '@ionic-native/google-plus';
import { ComponentsModule } from '../components/components.module';
import { OneSignal } from '@ionic-native/onesignal';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Camera } from '@ionic-native/camera';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { ImagePicker } from '@ionic-native/image-picker';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Badge } from '@ionic-native/badge';

@NgModule({
    declarations: [
        MyApp,
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        HttpClientModule,
        ComponentsModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        DataProvider,
        NativeStorage,
        LoginProvider,
        MsgProvider,
        Camera,
        Base64ToGallery,
        FileTransfer,
        FileTransferObject,
        ImagePicker,
        Badge,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: PrivateTokenInterceptor,
            multi: true,
        },
        // Facebook,
        // GooglePlus,
        OneSignal,
        InAppBrowser,
        AndroidPermissions
    ]
})
export class AppModule { }
