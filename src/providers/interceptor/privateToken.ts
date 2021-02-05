import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CONFIG } from '../../app/app-config';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { HttpErrorResponse } from '@angular/common/http';
import { Events } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { HttpHeaders } from '@angular/common/http';


@Injectable()
export class PrivateTokenInterceptor implements HttpInterceptor {


    constructor(public events: Events,
        public nativeStorage: NativeStorage) { }
    oauh: any;

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let _tmp;

        if (localStorage.getItem('oauth-token')) {
            _tmp = new HttpHeaders({
                'x-private-token': CONFIG.privateToken,
                'Auth-token': localStorage.getItem('oauth-token')
            });
        } else {
            _tmp = new HttpHeaders({'x-private-token': CONFIG.privateToken});
        }

        // Creo los headers para setear en el clone el request        
        const headers = _tmp;

        // Clone the request to add the new header.
        const authReq = req.clone({headers});
        // console.log("Peticion: ", authReq);
        return next.handle(authReq)
            .do((ev: HttpEvent<any>) => {
                return ev;
            })
            .catch(response => {
                if (response instanceof HttpErrorResponse && response.status === 401) {
                    let errorObject = response.error;
                    if (errorObject.message == 'auth-token-invalid') {
                        //Si el token es inválido se lanza el evento para forzar nuevamente la autenticación
                        this.events.publish('http:forbidden');
                    }
                } else if (response instanceof HttpErrorResponse && response.status === 403) {
                    let errorObject = response.error;
                    if (errorObject.message == 'No Auth Token') {
                        //Si el token es inválido se lanza el evento para forzar nuevamente la autenticación
                        this.events.publish('http:forbidden');
                    }
                }
                return Observable.throw(response);
            });

    }
}