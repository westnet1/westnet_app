import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login'

@IonicPage()
@Component({
  selector: 'page-contact-info',
  templateUrl: 'contact-info.html',
  //styleUrls: ['./contact-info.scss']
})
export class ContactInfoPage {

  contacts:any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private login: LoginProvider,
  ) {
    this.login.getContactInfo().subscribe(data => {
      this.contacts = data['phones'];
    });
  }

  getUrl(phone, wp) {
    if(wp) {
      return "https://api.whatsapp.com/send?phone="+phone+"&abid="+phone;
    }

    return "tel:" + phone;
  }

}
