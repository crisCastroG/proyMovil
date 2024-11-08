import { Component, inject, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-agregar-seccion',
  templateUrl: './agregar-seccion.component.html',
  styleUrls: ['./agregar-seccion.component.scss'],
})
export class AgregarSeccionComponent  implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  sectionName: string = '';
  message: string = '';

  utilsSvc = inject(UtilsService);

  ngOnInit() {}

  confirm(){
    if(this.sectionName != ''){
      this.modalCtrl.dismiss(this.sectionName,'confirm');
    }  
    else{
      this.message = 'El campo no puede estar vacío';
    }
  }

  cancel(){
    this.modalCtrl.dismiss(null,'cancel');
  }


}
