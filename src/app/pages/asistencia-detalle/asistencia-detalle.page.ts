import { Component, inject, OnInit } from '@angular/core';
import { Asistente } from 'src/app/models/asistente.model';
import { DetalleAsistencia } from 'src/app/models/detalle_asistencia.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-asistencia-detalle',
  templateUrl: './asistencia-detalle.page.html',
  styleUrls: ['./asistencia-detalle.page.scss'],
})
export class AsistenciaDetallePage implements OnInit {

  constructor() { }

  utilsSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);

  nombreAsignatura : string = '';
  siglaAsignatura : string = '';
  nombreSeccion : string = '';
  fecha : string = '';
  hora : string = '';

  asistentes : Asistente[];

  detalleAsistencia(): DetalleAsistencia{
    return this.utilsSvc.getFromLocalStorage('detalleAsistencia');
  }

  user(): User{
    return this.utilsSvc.getFromLocalStorage('user');
  }


  ngOnInit(){
      
  }

  ionViewWillEnter(){
    
    this.fecha = this.detalleAsistencia().fecha;
    this.hora = this.detalleAsistencia().hora;
    this.nombreAsignatura = this.detalleAsistencia().nombreAsignatura;
    this.siglaAsignatura = this.detalleAsistencia().siglaAsignatura;
    this.nombreSeccion = this.detalleAsistencia().nombreSeccion;

    this.getAsistentes(this.detalleAsistencia().idAsignatura, this.detalleAsistencia().idSeccion, this.detalleAsistencia().idAsistencia);

  }

  getAsistentes(idAsignatura : string, idSeccion: string, idAsistencia : string){

    let path = `users/${this.user().uid}/asignaturas_profesor/${idAsignatura}/secciones/${idSeccion}/asistencias/${idAsistencia}/asistentes`

    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {   
        this.asistentes = res;
        this.ordenarPorHora(this.asistentes);
        sub.unsubscribe();
      }
    });
  }

  ordenarPorHora(array: { hora: string }[]) {
    return array.sort((a, b) => {
      // Convertir hora a objeto Date para cada elemento
      let [horasA, minutosA, segundosA] = a.hora.split(':').map(Number);
      let horaA = new Date(0, 0, 0, horasA, minutosA, segundosA); 
  
      let [horasB, minutosB, segundosB] = b.hora.split(':').map(Number);
      let horaB = new Date(0, 0, 0, horasB, minutosB, segundosB);
  
      return horaA.getTime() - horaB.getTime();
    });
  }

}
