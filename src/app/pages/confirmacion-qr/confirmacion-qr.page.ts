import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { DetalleAsignatura } from 'src/app/models/detalle_asignatura.model';
import { Asistencia } from 'src/app/models/asistencia.model';
import { QrCode } from '../../models/qrCode.model';

@Component({
  selector: 'app-confirmacion-qr',
  templateUrl: './confirmacion-qr.page.html',
  styleUrls: ['./confirmacion-qr.page.scss'],
})
export class ConfirmacionQrPage implements OnInit {

  constructor(private router : Router) { }

  utilsSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);

  nombreAsignatura : string = '';
  siglaAsignatura : string = '';
  nombreSeccion : string = '';
  fecha : string = '';
  hora : string = '';

  qrData : string = '';

  

  user(): User{
    return this.utilsSvc.getFromLocalStorage('user');
  }

  detalleAsistencia():DetalleAsignatura{
    return this.utilsSvc.getFromLocalStorage('detalleAsistencia');
  }

  ngOnInit() {
    
  }

  ionViewWillEnter(){
    this.fecha = new Date().toLocaleDateString();
    this.hora = new Date().toLocaleTimeString();
    this.nombreAsignatura = this.detalleAsistencia().nombreAsignatura;
    this.siglaAsignatura = this.detalleAsistencia().siglaAsignatura;
    this.nombreSeccion = this.detalleAsistencia().nombreSeccion;
    }
  



  async generarCodigoQR (){
      const loading = await this.utilsSvc.loading();
      await loading.present();

      // Aquí se debería calcular los datos de localización para guardarlos


      //

      let asistencia : Asistencia = {
        fecha : this.fecha,
        hora : this.hora,
        localizacion : 'Aquí deberian ir los datos de localización'
      }
      
      // Este path sera parte del código QR 
      let detalleAsistencia = this.detalleAsistencia();
      let path = `users/${this.user().uid}/asignaturas_profesor/${detalleAsistencia.id_asignatura}/secciones/${detalleAsistencia.id_seccion}/asistencias`


      this.firebaseSvc.addDocument(path,asistencia).then(async res => {

        let qrCode : QrCode = {
          id_asignatura: detalleAsistencia.id_asignatura,
          id_seccion: detalleAsistencia.id_seccion,
          id_profesor: this.user().uid,
          nombreAsignatura: detalleAsistencia.nombreAsignatura,
          nombreSeccion: this.nombreSeccion,
          siglaAsignatura: detalleAsistencia.siglaAsignatura,
          nombreProfesor: this.user().name,
          idAsistencia: res.id,
          fecha: asistencia.fecha,
          hora: asistencia.hora,
        }
        
        localStorage.setItem('qrGenerado', JSON.stringify(qrCode)); // El código QR se guarda en el localStorage para cargarlo en la siguiente pagina
        this.utilsSvc.saveInLocalStorage('infoAsistencia', asistencia);
        this.utilsSvc.routerLink('codigo-qr');


      }).catch(error => {
        this.utilsSvc.presentToast({
          message: 'Error al crear QR :' + error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle'
        });

      }).finally(() => {
        loading.dismiss();

      })
  }

}
