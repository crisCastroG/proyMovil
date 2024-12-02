import { AsistenciasPendientes } from './../../models/asistenciasPendientes';
import { Asistente } from '../../models/asistente.model';
import { Component, inject, OnInit } from '@angular/core';
import { Barcode, BarcodeScanner, LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { getDoc } from '@angular/fire/firestore';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { doc, getFirestore } from 'firebase/firestore';
import { User } from 'src/app/models/user.model';
import { DetalleAsistencia } from 'src/app/models/detalle_asistencia.model';
import { AsignaturaAlumno } from 'src/app/models/asignatura_alumno.model';
import { QrCode } from '../../models/qrCode.model';
import { Geolocation } from '@capacitor/geolocation';


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
  latitude: number | null = null;
  longitude: number | null = null;
  locationMessage: string | null = null;
  readonly allowedDistance = 120; // Rango en metros

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
      if (this.scanResult.length !== 0 || this.scanResult)
        this.registrarAsistencia(this.scanResult);
    }

  }

  async registrarAsistencia(qrResult: string) {

    const loading = await this.utilsSvc.loading();
    await loading.present();

    let qrData: QrCode = JSON.parse(qrResult);

    let detalleAsistencia: DetalleAsistencia = {
      idAsistencia : qrData.idAsistencia,
      idAsignatura: qrData.id_asignatura,
      idSeccion: qrData.id_seccion,
      idProfesor: qrData.id_profesor,
      nombreprofesor: qrData.nombreProfesor,
      nombreAsignatura: qrData.nombreAsignatura,
      siglaAsignatura: qrData.siglaAsignatura,
      nombreSeccion: qrData.nombreSeccion,
      fecha: qrData.fecha,
      hora: qrData.hora,
    }

    let path = `users/${qrData.id_profesor}/asignaturas_profesor/${qrData.id_asignatura}/secciones/${qrData.id_seccion}/asistencias/${qrData.idAsistencia}`
    let document;
    let asistenciasPendientes : AsistenciasPendientes = this.utilsSvc.getFromLocalStorage("asistenciasPendientes_" + this.user().uid) as AsistenciasPendientes;
    let registroOffline: Boolean = false;

    try {
      document = await getDoc(doc(getFirestore(), path));
    } catch (error) {

      registroOffline = true;

    }

    if (registroOffline === true) {
      let estaPresente: Boolean = false;
      if (asistenciasPendientes) {
        asistenciasPendientes.asistencias.forEach(asistencia => {
          if (asistencia.idAsistencia === qrData.idAsistencia) {
            estaPresente = true;
            return;
          }
        });
      }
      if (estaPresente === true) {
        this.utilsSvc.presentToast({
          message: 'Esta asistencia ya está guardada en asistencias pendientes.',
          duration: 2500,
          color: 'primary',
          position: 'middle'
        });
        loading.dismiss();
        return;
      }


    } else {

      // Checkear si la asistencia existe
      if (!document.exists()) {
        this.utilsSvc.presentToast({
          message: 'Error de lectura. Inténtelo denuevo.',
          duration: 2500,
          color: 'primary',
          position: 'middle'
        });
        loading.dismiss();
        return;
      }


      let estaPresente = await this.verificarDocumentoExiste(path + '/asistentes', this.user().uid);
      // Checkear si ya está registrado en la asistencia
      if (estaPresente) {
        this.utilsSvc.presentToast({
          message: 'Ya estás presente en esta clase',
          duration: 2500,
          color: 'primary',
          position: 'middle'
        });
        loading.dismiss();
        return;
      }
    }



    // Checkear si está dentro del tiempo para registrar asistencia
    let fechaAsistencia = this.convertirStringADate(qrData.fecha + ' ' + qrData.hora);
    let fechaAhora = new Date();
    let diferencia = fechaAhora.getTime() - fechaAsistencia.getTime();



    if (diferencia > 1800000) { // 30 minutos en milisegundos
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
    let [qrLat, qrLng] = qrData.localizacion
      .split(',')
      .map(coord => parseFloat(coord.replace(/[^\d.-]/g, '')));

    let estaEnRango = await this.checkLocation(qrLat, qrLng);
    if (!estaEnRango) {
      this.utilsSvc.presentToast({
        message: 'No estas dentro de la ubicacion necesaria para marcar asistencia.',
        duration: 2500,
        color: 'primary',
        position: 'middle'
      });
      loading.dismiss();
      return;
    }

    if (registroOffline === false) {
      // Asignando esta asignatura a la lista de asignaturas del alumno, si es que no la tiene asignada.
      let asignaturaDocument = await getDoc(doc(getFirestore(), `users/${this.user().uid}/asignaturas_alumno/${qrData.id_asignatura}`));

      let asignaturaAlumno: AsignaturaAlumno = {
        idAsignatura: qrData.id_asignatura,
        idSeccion: qrData.id_seccion,
        idProfesor: qrData.id_profesor,
        nombreAsignatura: qrData.nombreAsignatura,
        siglaAsignatura: qrData.siglaAsignatura,
        nombreSeccion: qrData.nombreSeccion,
        nombreProfesor: qrData.nombreProfesor
      }
      if (!asignaturaDocument.exists()) // Si no existe la asignatura, agregarla
      {
        await this.firebaseSvc.setDocument(`users/${this.user().uid}/asignaturas_alumno/${asignaturaAlumno.idAsignatura}`, asignaturaAlumno);
      }
      else {
        let asignaturaDetalleData = asignaturaDocument.data()
        if (asignaturaDetalleData["idSeccion"] !== qrData.id_seccion) {
          this.utilsSvc.presentToast({
            message: 'Ya estas registrado en otra sección para esta asignatura',
            duration: 2000,
            color: 'primary',
            position: 'middle'
          })
          loading.dismiss();
          return;
        }
      }

      this.utilsSvc.saveInLocalStorage('asistenciaEscaneada', detalleAsistencia);

      // Registrar al alumno en la lista de asistentes
      let asistente: Asistente = {
        uid: this.user().uid,
        nombreCompleto: this.user().name,
        hora: this.getFormattedTime(new Date())
      }

      this.firebaseSvc.setDocument(`users/${qrData.id_profesor}/asignaturas_profesor/${qrData.id_asignatura}/secciones/${qrData.id_seccion}/asistencias/${qrData.idAsistencia}/asistentes/${this.user().uid}`, asistente).then(async res => {

        this.utilsSvc.routerLink('escaneo-exitoso');

        this.utilsSvc.presentToast({
          message: 'Asistencia registrada con exito!',
          duration: 2000,
          color: 'primary',
          position: 'middle'
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
    } else { // Registrar asistencia offline

      if (asistenciasPendientes) { // Si ya existen asistencias pendientes, pushear otra a la cola

        asistenciasPendientes.asistencias.push(detalleAsistencia);
        this.utilsSvc.saveInLocalStorage("asistenciasPendientes_" + this.user().uid, asistenciasPendientes)

      } else {

        let asistenciasPendientes: AsistenciasPendientes = {
          asistencias: [

          ]
        }
        asistenciasPendientes.asistencias.push(detalleAsistencia);

        this.utilsSvc.saveInLocalStorage("asistenciasPendientes_" + this.user().uid, asistenciasPendientes);

      }
      this.utilsSvc.saveInLocalStorage('asistenciaEscaneada', detalleAsistencia);
      loading.dismiss();

      this.utilsSvc.presentToast({
        message: 'Sin conexión, registrada en asistencias pendientes',
        duration: 2000,
        color: 'primary',
        position: 'middle'
      })

      this.utilsSvc.routerLink('escaneo-exitoso');
    }


  }
  async checkLocation(qrLat: number, qrLong: number): Promise<boolean> {
    try {
      const permission = await Geolocation.checkPermissions();

      // Verificar si los permisos de ubicación están concedidos
      if (permission.location !== 'granted') {
        const request = await Geolocation.requestPermissions();
        if (request.location !== 'granted') {
          this.presentAlert('Permiso denegado', 'La aplicación necesita acceso a la ubicación para funcionar.');
          return false; // No se concedieron permisos
        }
      }

      // Obtener la posición actual
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true, // Usar alta precisión
        timeout: 10000, // Tiempo de espera para obtener la ubicación
      });

      this.latitude = position.coords.latitude; // Asignar latitud
      this.longitude = position.coords.longitude; // Asignar longitud

      // Mensaje de ubicación
      this.locationMessage = `Ubicación actual: ${this.latitude.toFixed(6)}, ${this.longitude.toFixed(6)}`;

      const distance = this.calculateDistance(
        qrLat,
        qrLong,
        this.latitude,
        this.longitude
      );

      return distance <= this.allowedDistance; // Retorna true si está dentro del rango permitido
    } catch (error) {
      console.error('Error obteniendo la ubicación:', error);

      // Mensajes de error mejorados
      let message = 'No se pudo obtener la ubicación. Intenta nuevamente más tarde.';
      if (error instanceof Error) {
        if (error.message.includes('Permission denied')) {
          message = 'La aplicación no tiene permisos para acceder a la ubicación. Por favor, habilítalos en la configuración.';
        } else if (error.message.includes('Location unavailable')) {
          message = 'No se pudo obtener la ubicación. Asegúrate de que el GPS esté habilitado y que tengas una buena conexión.';
        }
      }

      this.presentAlert('Error de ubicación', message);

      // Limpiar la latitud y longitud
      this.latitude = null;
      this.longitude = null;
      this.locationMessage = message; // Mantener el mensaje en el mismo formato

      return false; // No se pudo obtener la ubicación
    }
  }



  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distancia en metros
  }

  async presentAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
  convertirStringADate(fechaHoraStr) {
    // Divide la fecha y la hora
    let [fecha, hora] = fechaHoraStr.split(" ");
    let [dia, mes, anio] = fecha.split("/").map(Number);
    let [horas, minutos, segundos] = hora.split(":").map(Number);

    // Crea un nuevo objeto Date con estos valores
    return new Date(anio, mes - 1, dia, horas, minutos, segundos);
  }

  async verificarDocumentoExiste(coleccionPath: string, documentoId: string) {

    let docRef = doc(getFirestore(), coleccionPath, documentoId);

    let docSnap = await getDoc(docRef);

    if (docSnap.exists()) {

      return true;
    } else {
      return false;
    }
  }

  getFormattedTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  getFormattedDateTime(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses son de 0 a 11
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
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