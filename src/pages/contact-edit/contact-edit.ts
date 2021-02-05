import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MsgProvider } from '../../providers/msg/msg';
import { LoginProvider } from '../../providers/login/login';
import { DataProvider } from '../../providers/data/data';

/**
 * Generated class for the ContactEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-contact-edit',
    templateUrl: 'contact-edit.html',
})
export class ContactEditPage {
    customer: any;
    myForm: FormGroup;

    validationMessages = {
      name: [
        {type: 'pattern', message: 'Nombre solo debe contener letras'},
        {type: 'required', message: 'Nombre no puede estar vacío'}
      ],
      document_number: [
        {type: 'pattern', message: 'Número de Documento solo debe contener números'},
        {type: 'required', message: 'Número de Documento no puede estar vacío'}
      ],
      phone: [
        {type: 'pattern', message: 'Solo debe contener numeros'},
        {type: 'maxlenght', message: 'Máximo puede contener 11 caracteres'},
      ],
      phone2: [
        {type: 'pattern', message: 'Solo debe contener numeros'},
        {type: 'maxlenght', message: 'Máximo puede contener 11 caracteres'},
      ],
      phone3: [
        {type: 'pattern', message: 'Solo debe contener numeros'},
        {type: 'maxlenght', message: 'Máximo puede contener 11 caracteres'},
      ],
      phone4: [
        {type: 'pattern', message: 'Solo debe contener numeros'},
        {type: 'maxlenght', message: 'Máximo puede contener 11 caracteres'},
      ]
    }

    constructor(
        public navCtrl: NavController,
        public msg: MsgProvider,
        public auth: LoginProvider,
        public data: DataProvider,
        public navParams: NavParams,
        public loadingCtrl: LoadingController,
        public formBuilder: FormBuilder) {
        this.customer = this.navParams.data;
        console.log(this.customer);
        this.myForm = this.createForm();
        console.log(this.myForm);
    }

    ionViewDidLoad() {
        console.log(this.customer);
        this.myForm.patchValue({
            name: this.customer.fullName,
            phone: this.customer.phone,
            phone2: this.customer.phone2,
            phone3: this.customer.phone3,
            phone4: this.customer.phone4,
            email: this.customer.email,
            email2: this.customer.email2,
            document_number: this.customer.document_number,
            customer_code: this.customer.code,
        })
    }

    createForm() {
        return this.formBuilder.group({
            name: ['',Validators.compose([Validators.required, Validators.pattern("[a-zA-Z ]*")])],
            document_number: ['', Validators.compose([Validators.required, Validators.maxLength(11), Validators.pattern('[0-9]*')])],
            email: ['', Validators.required],
            email2: [''],
            phone: ['', Validators.compose([Validators.maxLength(11), Validators.pattern('[0-9]*')])],
            phone2: ['', Validators.compose([Validators.maxLength(11), Validators.pattern('[0-9]*')])],
            phone3: ['', Validators.compose([Validators.maxLength(11), Validators.pattern('[0-9]*')]) ],
            phone4: ['', Validators.compose([Validators.maxLength(11), Validators.pattern('[0-9]*')])],
            customer_code: ['', ],
            type: ['contact', ],
            document_type: this.customer.documentType.name
        })
    }

    sendNewData(contact){
        //Se abre un alert para confirmar el cierre de sesión
        this.msg.presentConfirm('Confirmar', '¿Esta seguro que quiere enviar estos datos?').subscribe(
            data => {
                if (data) {
                    let _loading = this.loadingCtrl.create();
                    _loading.present();
                    this.data.createContactQuery(contact).subscribe(
                        data => {
                            _loading.dismiss();
                            if (data) {
                                let _alert = this.msg.presentAlert("Datos enviados", "Gracias por comunicarte con nosotros. En breve, un representante modificará sus datos en nuestro sistema.", 'Ok');
                                _alert.present();
                                this.myForm = this.createForm();
                                this.navCtrl.pop();
                            } else {
                                this.msg.presentToast(
                                    "Se produjo un error al registrar la consulta. Intente nuevamente en unos instantes.",
                                    "bottom"
                                );
                            }
                        },
                        error => {
                            console.error(error);
                            _loading.dismiss();
                            this.msg.presentToast(
                                "Se produjo un error al registrar la consulta. Intente nuevamente en unos instantes.",
                                "bottom"
                            );
                        }
                    );
                }
            }
        );
    }

    onKeyPress(event) {
      if ((event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode >= 97 && event.keyCode <= 122) || event.keyCode == 32 || event.keyCode == 46) {
          return true
      }
      else {
          event.preventDefault();
          return false
      }
  }
}
