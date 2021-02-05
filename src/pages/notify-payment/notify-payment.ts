import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { LoginProvider } from "../../providers/login/login";
import { DataProvider } from '../../providers/data/data';
import { MsgProvider } from '../../providers/msg/msg';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Base64ToGallery, Base64ToGalleryOptions } from '@ionic-native/base64-to-gallery';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';

@IonicPage()
@Component({
  selector: 'page-notify-payment',
  templateUrl: 'notify-payment.html',
})
export class NotifyPaymentPage {

  pmethods: any;
  error: boolean;
  myForm: FormGroup;
  customerId : any;
  contractId : any;
  image: any = null;
  upImage: boolean = true;

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public login: LoginProvider,
      public loadingCtrl: LoadingController,
      public dataProvider: DataProvider,
      public msgProvider: MsgProvider,
      public alert: AlertController,
      public toast: ToastController,
      public formBuilder: FormBuilder,
      private camera: Camera,
      private base64ToGallery: Base64ToGallery,
      private imagePicker: ImagePicker
  ) {
      this.myForm = this.createForm();
      this.loadPaymentMethods();
  }

    ionViewDidLoad(){
        this.customerId = this.navParams.data.customerId;
        this.contractId = this.navParams.data.contractId;
    }

    createForm() {
        return this.formBuilder.group({
            customer: ['', Validators.required],
            contract: ['', Validators.required],
            date: ['', Validators.required],
            amount: ['', Validators.required],
            payment_method_id: ['', Validators.required],
            image_receipt: ['', Validators.required],
        })
    }


    loadPaymentMethods() {
        let loading = this.loadingCtrl.create();
        loading.present();

        this.dataProvider.getPaymentMethods().subscribe(
            data => {
              loading.dismiss();
              this.error = false;
              this.pmethods = data;
            },
            error => {
              loading.dismiss();
              this.error = true;
              this.msgProvider.presentToast(
                  "Se produjo un error en la conexión. Intente nuevamente en unos instantes.",
                  "bottom"
              );
            }
        );
    }

    saveData() {
        let loading = this.loadingCtrl.create();
        loading.present();

        this.dataProvider.sendNotifyPayment(this.myForm.value).subscribe(
            response => {
                if(response['status']) {
                    if (this.upImage) {
                        this.dataProvider.uploadImage(this.image, response['notify_payment_id']).subscribe(
                            data => {
                                loading.dismiss();
                                this.alert.create({
                                    message: response['message'],
                                    buttons: [
                                        {
                                            text: 'OK',
                                            handler: () => {
                                                this.navCtrl.setRoot('InitPage')
                                            }
                                        }
                                    ]
                                }).present()
                            },
                            error => {
                                loading.dismiss();
                                this.msgProvider.presentToast(
                                    "Se produjo un error al enviar la imagen del comprobante de pago. Intente nuevamente en unos instantes.",
                                    "bottom"
                                );
                            },
                        )
                    }else {
                        loading.dismiss();
                                this.alert.create({
                                    message: response['message'],
                                    buttons: [
                                        {
                                            text: 'OK',
                                            handler: () => {
                                                this.navCtrl.setRoot('InitPage')
                                            }
                                        }
                                    ]
                                }).present()
                    }
                } else {
                    loading.dismiss();
                    this.msgProvider.presentToast(
                        "Se produjo un error al informar su pago. Intente nuevamente en unos instantes. " + response['message'],
                        "bottom"
                    );
                }
            },
            error => {
                loading.dismiss();
                this.msgProvider.presentToast(
                    "Se produjo un error en la conexión. Intente nuevamente en unos instantes.",
                    "bottom"
                );
            }
        );
    }

    getPicture(){
        let options: CameraOptions = {
            destinationType: this.camera.DestinationType.DATA_URL,
            targetWidth: 1000,
            targetHeight: 1000,
            quality: 100
        }
        this.camera.getPicture( options )
            .then(imageData => {
                this.loadImage(imageData);
            })
            .catch(error =>{
                console.error( error );
            });
    }

    loadImage(filePath){
        this.myForm.controls['image_receipt'].setValue(filePath);

        let base64option : Base64ToGalleryOptions = {
            prefix: 'img',
            mediaScanner: false
        };

        let loading = this.loadingCtrl.create();
        loading.present();

        let todecode = atob(filePath);
        this.base64ToGallery.base64ToGallery(btoa(todecode), base64option).then(
            res => {
                this.upImage = false;
                loading.dismiss();
                this.image = res;
            },
            err => {
                console.log('Error saving image to gallery ', err);
                loading.dismiss();
            }
        );
    }

    selectImage(){
        let imageOptions: ImagePickerOptions = {
            maximumImagesCount: 1,
            outputType: 0
        };

        this.imagePicker.getPictures(imageOptions).then((results) => {
            console.log(results[0]);
            this.image = results[0];
            this.myForm.controls['image_receipt'].setValue(results[0]);
        }, (err) => { });
    }

}
