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
  locationMessage: string | null = null; // Variable para mostrar mensaje de ubicación
  //Ubicacion DUOC: { lat: -36.79538244183323, lng: -73.06152573267023 }; 
  readonly institutionCoords = { lat: -36.60909853022575, lng: -72.96350965358964 };
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
      this.registrarAsistencia(this.scanResult);
    }

  }

  async registrarAsistencia(qrResult: string) {

    const loading = await this.utilsSvc.loading();
    await loading.present();

    let document = await getDoc(doc(getFirestore(), qrResult));
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
    const position = await this.checkLocation(); // Obtener ubicación al presionar el botón
    this.locationMessage = position ? `Ubicación actual: ${this.latitude?.toFixed(6)}, ${this.longitude?.toFixed(6)}` : 'No se pudo obtener la ubicación.';

    // Verificar si el usuario está en el área permitida
    if (!position) {
      this.presentAlert(
        'Ubicación no permitida',
        'No estás dentro del área permitida para registrar asistencia. ' + this.locationMessage
      );
      return;
    }
    // Registrar al alumno en la lista de asistentes
    let asistente: Asistente = {
      uid: this.user().uid,
      nombreCompleto: this.user().name,
      hora: new Date().toLocaleTimeString(),
    }

    this.firebaseSvc.setDocument(qrResult + '/asistentes/' + this.user().uid, asistente).then(async res => {

      let asistenciaData = (await getDoc(doc(getFirestore(), qrResult))).data() as Asistencia;
      let seccionData = (await getDoc(doc(getFirestore(), qrResult).parent.parent)).data() as Seccion;
      let asignaturaData = (await getDoc(doc(getFirestore(), qrResult).parent.parent.parent.parent)).data() as Asignatura;
      let profesorData =  (await getDoc(doc(getFirestore(), qrResult).parent.parent.parent.parent.parent.parent)).data() as Profesor;

      let detalleAsistencia : DetalleAsistencia = {
        idAsignatura : asignaturaData.id,
        idSeccion : seccionData.id,
        nombreAsignatura : asignaturaData.nombAsig,
        siglaAsignatura : asignaturaData.codAsig,
        nombreSeccion : seccionData.nombSeccion,
        fecha : asistenciaData.fecha,
        hora : asistenciaData.hora
      }

      // Asignando esta asignatura a la lista de asignaturas del alumno, si es que no la tiene asignada.
      let document = await getDoc(doc(getFirestore(), `users/${this.user().uid}`));
      let asignaturaAlumnoData = document.data();

      if(!asignaturaAlumnoData['asignaturas_alumno'].includes(asignaturaData.id)){

        let asignaturaAlumno : AsignaturaAlumno = {
          idAsignatura : detalleAsistencia.idAsignatura,
          idSeccion : detalleAsistencia.idSeccion,
          idProfesor : profesorData.idProfesor,
          nombreAsignatura : asignaturaData.nombAsig,
          siglaAsignatura : asignaturaData.codAsig,
          nombreSeccion : asignaturaData.nombAsig,
          nombreProfesor : profesorData.nombreProfesor
        }

        await this.firebaseSvc.setDocument(`users/${this.user().uid}/asignaturas_alumno/${asignaturaData.id}`,asignaturaAlumno);
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
  async checkLocation(): Promise<boolean> {
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
        this.institutionCoords.lat,
        this.institutionCoords.lng,
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