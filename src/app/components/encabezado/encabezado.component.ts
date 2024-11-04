import { Component, inject, Input, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-encabezado',
  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.scss'],
})
export class EncabezadoComponent  implements OnInit {

  constructor(private menu: MenuController) { }

  firebaseSvc = inject(FirebaseService);

  @Input() titulo:string=''

  ngOnInit() {}

  ionViewDidEnter() {
    this.menu.isEnabled('main-content').then((enabled) => {
      if (enabled) {
        this.menu.enable(false, 'main-content');
        this.menu.enable(true,'main-content');
        this.menu.open('main-content');
      }
    });
  }

  OnClick()
  {
    this.menu.close('main-content');   
  }

  CloseMenu()
  {
    this.menu.close('main-content');  
  }

  signOut(){
    this.firebaseSvc.signOut();
  }




}
