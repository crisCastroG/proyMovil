import { Component, inject, Input, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { FirebaseService } from '../../services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-encabezado',
  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.scss'],
})
export class EncabezadoComponent  implements OnInit {

  constructor(private menu: MenuController) { }

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  @Input() titulo:string=''

  ngOnInit() {

  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  OnClick()
  {
    this.menu.close('main-content');
    this.menu.open('main-content');
  }

  CloseMenu()
  {
    this.menu.close('main-content');  
  }

  signOut(){
    console.log("logout");
    this.firebaseSvc.signOut();
  }

  goHome(){
    if(this.user().type === 'profesor'){
      this.utilsSvc.routerLink('home');
    } else {
      this.utilsSvc.routerLink('home-alumno');
    }
  }




}
