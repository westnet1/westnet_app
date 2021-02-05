import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONFIG } from '../../app/app-config';
import { Observable } from 'rxjs/Observable';
import { NativeStorage } from '@ionic-native/native-storage';
import { OneSignal } from '@ionic-native/onesignal';

/*
  Generated class for the LoginProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoginProvider {
    
    baseUrl: string = CONFIG.apiUrl;
    urlAccount: string = 'accounts';

    constructor(public http: HttpClient, public nativeStorage: NativeStorage, private oneSignal: OneSignal) {
        console.log('Hello LoginProvider Provider');
    }

    login(document_number, customer_nro) {
        return Observable.create(
            obs => {
                this.getPushToken().subscribe(
                    data => {
                        this.http.post(this.baseUrl + '/user-app/register',
                            { document_number: document_number, customer_code: customer_nro, player_id: data }).subscribe(
                                data => { obs.next(data) },
                                error => { obs.error(error) }
                            )
                    }
                );
            }
        );
    }

    customerData(email, customer_nro) {
        return Observable.create(
            obs => {
                this.getPushToken().subscribe(
                    data => {
                        this.http.post(this.baseUrl + '/user-app/customer-data',
                            { email: email, customer_code: customer_nro, player_id: data }).subscribe(
                                data => { obs.next(data) },
                                error => { obs.error(error) }
                            )
                    }
                );
            }
        );
    }

    verifyData(attr, customer_nro) {
        return Observable.create(
            obs => {
                this.getPushToken().subscribe(
                    data => {
                        this.http.post(this.baseUrl + '/user-app/verify-data',
                            { customer_code: customer_nro, destinatary: attr }).subscribe(
                                data => { obs.next(data) },
                                error => { obs.error(error) }
                            )
                    }
                );
            }
        );
    }


    checkCustomer(customer_nro: number) {
        return Observable.create(
            obs => {
                this.http.post(this.baseUrl + '/user-app/verify-customer',
                    { customer_code: customer_nro }).subscribe(
                        data => { obs.next(data) },
                        error => { obs.error(error) }
                    )

            }
        );
    }

    sendNotification(attr, customer_nro, user_app_id) {
        return this.http.post(this.baseUrl + '/user-app/send-validation-code', { user_app_id: user_app_id, customer_code: customer_nro, destinatary: attr });
    }

    validate(code, customer_nro) {
        return this.http.post(this.baseUrl + '/user-app/validate-code', { code: code, customer_code: customer_nro });
    }

    isLogged() {
        return Observable.create(observer => {
            if (localStorage.getItem("customer-token")) {
                observer.next(true);
            } else {
                observer.next(false);
            }
        });
    }

    addCustomer(data) {
        return this.http.post(this.baseUrl + '/user-app/add-customer', data);
    }

    getPushToken() {
        return Observable.create(observer => {
            this.oneSignal.getIds().then((data) => {
                if (data["userId"]) {
                    observer.next(data["userId"]);
                } else {
                    observer.next();
                }
            }).catch(
                error => {
                    observer.next();
                }
            )
        });
    }


    setDocumentNumber(code, customer_nro, document_number): any {
        return this.http.post(this.baseUrl + '/user-app/set-document-number', { validation_code: code, document_number: document_number, customer_code: customer_nro });
    }

    getContactInfo() {
        return Observable.create((observer) => {
            this.http.get(this.baseUrl + '/user-app/get-contact-info').subscribe(data => {
                observer.next(data);
            })
        });
    }

    //Obtiene la información relacionada a las extensiones de pago, como cantidad de extensiones disponibles, precio a pagar, etc.
    getPaymentExtensionInfo() {
        return Observable.create((observer) => {
            this.http.get(this.baseUrl + '/user-app/get-payment-extension-info').subscribe(data => {
                observer.next(data);
            })
        });
    }

}
