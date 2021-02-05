import { Injectable } from '@angular/core';
import { ToastController, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class MsgProvider {

    constructor(
        private toastCtrl: ToastController,
        private alertCtrl: AlertController) {
    }


    presentToast(message: string, position?: string, duration?: number) {
        let _duration: number = 3000;
        let _position: string = 'top';

        if (duration) {
            _duration = duration;
        }

        if (_position) {
            _position = position;
        }

        let toast = this.toastCtrl.create({
            message: message,
            duration: _duration,
            position: _position
        });

        toast.present();
    }

    presentAlert(title: string, subtitle: string, buttonLabel: any, message?: string, ) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: subtitle,
            message: message,
            buttons: [buttonLabel]
        });
        return alert;
    }

    //Retorna un observador que retorn un valor booleano dependiendo de la elección realizada por el usuario
    presentConfirm(title: string, message: string, textOk?: string, textCancel?: string) {
        return Observable.create(observer => {
            let alert = this.alertCtrl.create({
                title: title,
                message: message,
                buttons: [
                    {
                        text: textCancel ? textCancel : 'Cancelar',
                        role: 'cancel',
                        handler: () => {
                            observer.next(false);
                        }
                    },
                    {
                        text: textOk ? textOk : 'Aceptar',
                        handler: () => {
                            observer.next(true);
                        }
                    }
                ]
            });
            alert.present();
        });
    }

    manageError(data?) {
        console.log("recibi el error: ", data);
        if (data && data.error && data.error.status && data.error.status === 'error' && data.error.errors) {
            let tmpMessages = data.error.errors;
            if (tmpMessages instanceof Array && tmpMessages.length > 0) {
                this.presentToast(
                    "Se produjo el siguiente error: " + tmpMessages[0],
                    "bottom"
                );
            } else if (tmpMessages) {
                this.presentToast(
                    "Se produjo el siguiente error: " + tmpMessages,
                    "bottom"
                );
            } else {
                this.presentToast(
                    "Se produjo un error al consultar los datos. Intente nuevamente es unos instantes.",
                    "bottom"
                );
            }
            return;
        } else if (data && data.error && data.error.status === 'error' && data.error.error) {
            this.presentToast(
                "Se produjo el siguiente error: " + data.error.error,
                "bottom"
            );
            return;
        } else {
            this.presentToast(
                "Se produjo un error al consultar los datos. Intente nuevamente es unos instantes.",
                "bottom"
            );
            return;
        }
    }
}
