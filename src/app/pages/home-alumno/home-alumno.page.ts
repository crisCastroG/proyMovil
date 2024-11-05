import { Component, OnInit } from '@angular/core';

import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home-alumno',
  templateUrl: './home-alumno.page.html',
  styleUrls: ['./home-alumno.page.scss'],
})
export class HomeAlumnoPage implements OnInit  {

  isSupported = false;
  
  constructor(private alertController: AlertController) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }


}