import { UtilsService } from './../../services/utils.service';
import { Component, inject, OnInit } from '@angular/core';
import { DetalleAsistencia } from 'src/app/models/detalle_asistencia.model';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-escaneo-exitoso',
  templateUrl: './escaneo-exitoso.page.html',
  styleUrls: ['./escaneo-exitoso.page.scss'],
})
export class EscaneoExitosoPage implements OnInit {

  constructor() { }

  utilsSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);

  nombreAsignatura : string = '';
  siglaAsignatura : string = '';
  nombreSeccion : string = '';
  fecha : string = '';
  hora : string = '';

  detalleAsistencia():DetalleAsistencia{
    return this.utilsSvc.getFromLocalStorage('asistenciaEscaneada');
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.fecha = this.detalleAsistencia().fecha;
    this.hora = this.detalleAsistencia().hora;
    this.nombreAsignatura = this.detalleAsistencia().nombreAsignatura;
    this.siglaAsignatura = this.detalleAsistencia().siglaAsignatura;
    this.nombreSeccion = this.detalleAsistencia().nombreSeccion;
  }



}
