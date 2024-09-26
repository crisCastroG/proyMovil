import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-perfil-alumno',
  templateUrl: './perfil-alumno.page.html',
  styleUrls: ['./perfil-alumno.page.scss'],
})
export class PerfilAlumnoPage implements OnInit {

  constructor(private menu: MenuController) { }

  ionViewDidEnter() {
    this.menu.isEnabled('main-menu').then((enabled) => {
      if (!enabled) {
        this.menu.enable(false);
        this.menu.enable(true,'main-content');
      }
    });
  }

  ngOnInit() {
  }

}
