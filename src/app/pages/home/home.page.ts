import { Component, inject, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private menu: MenuController) { }

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.menu.enable(true);
  }

  signOut(){
    this.firebaseSvc.signOut();
  }

}
