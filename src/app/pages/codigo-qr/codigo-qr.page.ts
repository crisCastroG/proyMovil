import { Component, inject } from '@angular/core';
import { Asistencia } from 'src/app/models/asistencia.model';
import { DetalleAsignatura } from 'src/app/models/detalle_asignatura.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-codigo-qr',
  templateUrl: './codigo-qr.page.html',
  styleUrls: ['./codigo-qr.page.scss'],
})
export class CodigoQrPage  {

  constructor() { }

  qrText = '';

  utilsSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);

  nombreAsignatura : string = '';
  siglaAsignatura : string = '';
  nombreSeccion : string = '';
  fecha : string = '';
  hora : string = '';

  detalleAsistencia():DetalleAsignatura{
    return this.utilsSvc.getFromLocalStorage('detalleAsistencia');
  }

  infoAsistencia(): Asistencia{
    return this.utilsSvc.getFromLocalStorage('infoAsistencia');
  }

  ionViewWillEnter(){
    
    this.fecha = this.infoAsistencia().fecha;
    this.hora = this.infoAsistencia().hora;
    this.nombreAsignatura = this.detalleAsistencia().nombreAsignatura;
    this.siglaAsignatura = this.detalleAsistencia().siglaAsignatura;
    this.nombreSeccion = this.detalleAsistencia().nombreSeccion;

    this.qrText = localStorage.getItem('qrGenerado'); // Aqui se carga el código QR
  }



  

}
