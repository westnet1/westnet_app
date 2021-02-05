import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONFIG } from '../../app/app-config';
import { Observable } from 'rxjs/Observable';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

interface Response {
    results: string[];
}

@Injectable()
export class DataProvider {

    fileTransfer: FileTransferObject = this.transfer.create();
    baseUrl: string = CONFIG.apiUrl;

    constructor(public http: HttpClient, private transfer: FileTransfer) {
        console.log('Hello DataProvider Provider');
    }
    getCustomers() {
        return this.http.get(this.baseUrl + '/user-app/view');
    }

    getCustomersExpands($expands): Observable<any[]> {
        //eturn this.http.get(this.baseUrl + '/user-app/view&expand=customer');
        return this.http.get<Response[]>(this.baseUrl + '/user-app/view&expand=' + $expands);
    }

    updateCustomer(customer_code, email, phone) {
        return this.http.post(this.baseUrl + '/user-app/update', { code: customer_code, email: email, phone: phone });
    }

    getPlaces() {
        return this.http.get(this.baseUrl + '/user-app/ecopagos');
    }

    getMovements() {
        return this.http.get(this.baseUrl + '/user-app/view');
    }

    sendPdfByEmail(pdfKey: string, email: string) {
        return this.http.get(CONFIG.apiUrl + '/user-app/send-bill-email&pdf_key=' + pdfKey + '&email=' + email);
    }

    createContactQuery(query) {
        return Observable.create(observer => {
            this.http.post<Response>(this.baseUrl + '/user-app/create-app-failed-register', query).subscribe(
                data => {
                    if (data['status'] == 'success') {
                        observer.next(true);
                    } else {
                        observer.next(false);
                    }
                },
                error => {
                    console.error(error);
                    observer.next(false);
                }
            );
        });

    }

    createExtensionPayment(data) {
        return this.http.post(CONFIG.apiUrl +'/user-app/force-connection', data);
    }

    getPaymentMethods() {
        return this.http.get(this.baseUrl + '/user-app/payment-methods');
    }

    sendNotifyPayment(data) {
        return this.http.post(CONFIG.apiUrl + '/user-app/create-notify-payment', data);
    }

    uploadImage(image, notify_payment_id) {

        let options: FileUploadOptions;

        if(localStorage.getItem('oauth-token')) {

            options = {
                fileKey: 'imageFile',
                fileName: image,
                chunkedMode: false,
                headers: { 'X-private-token': CONFIG.privateToken, 'Auth-token': localStorage.getItem('oauth-token')},
                params: { 'notify_payment_id': notify_payment_id },
            }

        } else {
            options = {
                fileKey: 'imageFile',
                fileName: image,
                chunkedMode: false,
                headers: { 'X-private-token': CONFIG.privateToken },
                params: { 'notify_payment_id': notify_payment_id },
            }
        }

        return Observable.create(observer => {
            this.fileTransfer.upload(image, CONFIG.apiUrl + "/user-app/upload-notify-payment-image", options).then(
                (data) => {
                    observer.next();
                },
                (err) => {
                    observer.error(err);
                })
        });
    }

    getNotificationsCount() {
        return this.http.get(CONFIG.apiUrl + "/notification/get-notifications-count");
    }

    getNotifications() {
        return this.http.get(CONFIG.apiUrl + "/notification/notifications");
    }

    notificationViewed(mphua_id) {
        return this.http.post(CONFIG.apiUrl + "/notification/set-as-read", {"mphua_id": mphua_id})
    }
}
