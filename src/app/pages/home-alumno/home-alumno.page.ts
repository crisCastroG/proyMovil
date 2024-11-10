import { Component, inject, OnInit } from '@angular/core';

import { AlertController, MenuController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-home-alumno',
  templateUrl: './home-alumno.page.html',
  styleUrls: ['./home-alumno.page.scss'],
})
export class HomeAlumnoPage implements OnInit  {

  isSupported = false;

  constructor(private menu: MenuController) { }

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit(){
    
  }

  ionViewWillEnter(){
    this.menu.enable(true);
  }

  signOut(){
    this.firebaseSvc.signOut();
  }


}