import { Asistente } from '../../models/asistente.model';
import { Component, inject, OnInit } from '@angular/core';
import { Barcode, BarcodeScanner, LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { getDoc } from '@angular/fire/firestore';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Asistencia } from 'src/app/models/asistencia.model';
import { doc, getFirestore } from 'firebase/firestore';
import { User } from 'src/app/models/user.model';
import { DetalleAsistencia } from 'src/app/models/detalle_asistencia.model';
import { Seccion } from 'src/app/models/seccion.model';
import { Asignatura } from 'src/app/models/asignatura.model';
import { Profesor } from 'src/app/models/profesor.model';
import { AsignaturaAlumno } from 'src/app/models/asignatura_alumno.model';
import { QrCode } from '../../models/qrCode.model';

@Component({
  selector: 'app-escanear-qr-alumno',
  templateUrl: './escanear-qr-alumno.page.html',
  styleUrls: ['./escanear-qr-alumno.page.scss'],
})
export class EscanearQrAlumnoPage implements OnInit {

  isSupported = false;
  barcodes: Barcode[] = [];
  scanResult = '';
  resultadoAsistencia = '';

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  constructor(private alertController: AlertController, private modalController: ModalController, private platform: Platform) { }
  ngOnInit() {
    if (this.platform.is('capacitor')) {
      BarcodeScanner.isSupported().then((result) => {
        this.isSupported = result.supported;
      });
      BarcodeScanner.checkPermissions().then();
      BarcodeScanner.removeAllListeners;
    }

  }

  async startScan() { // Funcion que inicia el scaneo
    const modal = await this.modalController.create({
      component: BarcodeScanningModalComponent,
      cssClass: 'barcode-scanning-modal',
      showBackdrop: false,
      componentProps: {
        formats: {},
        lensFacing: LensFacing.Back,
      }
    });

    await modal.present();  // Esto se llama cuando se retira la camara
    const { data } = await modal.onWillDismiss();
    if (data) {  // Si existe data se procede a registrar la asistencia
      this.scanResult = data?.barcode?.displayValue;
      this.registrarAsistencia(this.scanResult);
    }

  }

  async registrarAsistencia(qrResult: string) {

    const loading = await this.utilsSvc.loading();
    await loading.present();

    let qrData : QrCode = JSON.parse(qrResult);

    let path = `users/${qrData.id_profesor}/asignaturas_profesor/${qrData.id_asignatura}/secciones/${qrData.id_seccion}/asistencias/${qrData.idAsistencia}`
    let document = await getDoc(doc(getFirestore(), path));
    let asistenciaData = document.data();

    // Checkear si la asistencia existe
    if (!document.exists()) {

      this.utilsSvc.presentToast({
        message: 'Error de lectura. Asistencia no existente.',
        duration: 2500,
        color: 'primary',
        position: 'middle'
      });
      loading.dismiss();
      return;
    }

    // Checkear si ya está registrado en la asistencia
    if (asistenciaData['asistentes'] && asistenciaData['asistentes'].includes(this.user().uid)) {
      this.utilsSvc.presentToast({
        message: 'Ya estás presente en esta clase',
        duration: 2500,
        color: 'primary',
        position: 'middle'
      });
      loading.dismiss();
      return;
    }

    // Checkear si está dentro del tiempo para registrar asistencia
    let asistencia = asistenciaData as Asistencia;

    let fechaAsistencia = this.convertirStringADate(asistencia.fecha + ' ' + asistencia.hora);
    let fechaAhora = new Date();
    let diferencia = fechaAhora.getTime() - fechaAsistencia.getTime();

    if (diferencia > 300000) { // 5 minutos en milisegundos
      this.utilsSvc.presentToast({
        message: 'El tiempo para registrarte en esta clase ha expirado.',
        duration: 2500,
        color: 'primary',
        position: 'middle'
      });
      loading.dismiss();
      return;
    }

    // Aquí debería checkear si está lo suficientemente cerca al lugar de la asistencia.

    //
    
    // Registrar al alumno en la lista de asistentes
    let asistente: Asistente = {
      uid: this.user().uid,
      nombreCompleto: this.user().name,
      hora: new Date().toLocaleTimeString(),
    }

    this.firebaseSvc.setDocument(`users/${qrData.id_profesor}/asignaturas_profesor/${qrData.id_asignatura}/secciones/${qrData.id_seccion}/asistencias/${qrData.idAsistencia}/asistentes/${this.user().uid}`, asistente).then(async res => {
      
      let detalleAsistencia : DetalleAsistencia = {
        idAsignatura : qrData.id_asignatura,
        idSeccion : qrData.id_seccion,
        nombreAsignatura : qrData.nombreAsignatura,
        siglaAsignatura : qrData.siglaAsignatura,
        nombreSeccion : qrData.nombreSeccion,
        fecha : qrData.fecha,
        hora : qrData.hora,
      }

      // Asignando esta asignatura a la lista de asignaturas del alumno, si es que no la tiene asignada.
      let document = await getDoc(doc(getFirestore(), `users/${this.user().uid}`));
      let asignaturaAlumnoData = document.data();

      let asignaturaAlumno : AsignaturaAlumno = {
        idAsignatura : qrData.id_asignatura,
        idSeccion : qrData.id_seccion,
        idProfesor : qrData.id_profesor,
        nombreAsignatura : qrData.nombreAsignatura,
        siglaAsignatura : qrData.siglaAsignatura,
        nombreSeccion : qrData.nombreSeccion,
        nombreProfesor : qrData.nombreProfesor
      }

      if(asignaturaAlumnoData['asignaturas_alumno'])
      {
        if(!asignaturaAlumnoData['asignaturas_alumno'].includes(asignaturaAlumno.idAsignatura)){
          await this.firebaseSvc.setDocument(`users/${this.user().uid}/asignaturas_alumno/${asignaturaAlumno.idAsignatura}`,asignaturaAlumno);
        }
      } else {
        await this.firebaseSvc.setDocument(`users/${this.user().uid}/asignaturas_alumno/${asignaturaAlumno.idAsignatura}`,asignaturaAlumno) 
      }

      this.utilsSvc.saveInLocalStorage('asistenciaEscaneada', detalleAsistencia);
      this.utilsSvc.routerLink('escaneo-exitoso');

      this.utilsSvc.presentToast({
        message: 'Asistencia registrada con exito!',
        duration: 2000,
        color: 'primary',
        position: 'bottom'
      })

    }).catch(error => {
      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle'
      });

    }).finally(() => {
      loading.dismiss();

    })
  }

  convertirStringADate(fechaHoraStr) {
    // Divide la fecha y la hora
    let [fecha, hora] = fechaHoraStr.split(" ");
    let [dia, mes, anio] = fecha.split("/").map(Number);
    let [horas, minutos, segundos] = hora.split(":").map(Number);

    // Crea un nuevo objeto Date con estos valores
    return new Date(anio, mes - 1, dia, horas, minutos, segundos);
  }

}

/*async requestPermissions(): Promise<boolean> {
const { camera } = await BarcodeScanner.requestPermissions();
return camera === 'granted' || camera === 'limited';
}
 
async presentAlert(): Promise<void> {
const alert = await this.alertController.create({
  header: 'Permiso denegado',
  message: 'Para usar la aplicación autorizar los permisos de cámara',
  buttons: ['OK'],
});
await alert.present();
}
 
/*async scan(): Promise<void> {
const granted = await this.requestPermissions();
if (!granted) {
  this.presentAlert();
  return;
}
const { barcodes } = await BarcodeScanner.scan();
this.barcodes.push(...barcodes);
}*/