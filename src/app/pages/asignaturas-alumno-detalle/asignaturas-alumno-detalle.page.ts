import { Component, inject, OnInit } from '@angular/core';
import { getDoc } from 'firebase/firestore';
import { AsignaturaAlumno } from 'src/app/models/asignatura_alumno.model';
import { AsistenciaAlumno } from 'src/app/models/asistencia.alumno.model';
import { Asistencia } from 'src/app/models/asistencia.model';
import { Asistente } from 'src/app/models/asistente.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-asignaturas-alumno-detalle',
  templateUrl: './asignaturas-alumno-detalle.page.html',
  styleUrls: ['./asignaturas-alumno-detalle.page.scss'],
})
export class AsignaturasAlumnoDetallePage implements OnInit {

  constructor() { }

  utilsSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);

  nombreAsignatura: string = '';
  siglaAsignatura: string = '';
  nombreSeccion: string = '';
  nombreProfesor: string = '';


  asistenciasAlumno : AsistenciaAlumno[] = [];
  asistencias : Asistencia[];
  asistentes : Asistente[];

  asignaturaAlumno(): AsignaturaAlumno {
    return this.utilsSvc.getFromLocalStorage('seleccionAsignatura');
  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }


  ngOnInit() {
  }

  ionViewWillEnter(){
    this.nombreAsignatura = this.asignaturaAlumno().nombreAsignatura;
    this.siglaAsignatura = this.asignaturaAlumno().siglaAsignatura;
    this.nombreSeccion = this.asignaturaAlumno().nombreSeccion;
    this.nombreProfesor = this.asignaturaAlumno().nombreProfesor;
    
    this.getAsistenciasDeAsignatura();
  }

  getAsistenciasDeAsignatura(){
    let a : AsignaturaAlumno = this.asignaturaAlumno();
    let path = `users/${a.idProfesor}/asignaturas_profesor/${a.idAsignatura}/secciones/${a.idSeccion}/asistencias`;

    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        this.asistencias = res;
        this.ordenarPorFechaYHora(this.asistencias);
        this.asistencias.forEach( asistencia => {
          this.getAsistentes(a, asistencia);
        });
        sub.unsubscribe();
      }
    })
  }

  getAsistentes(asig : AsignaturaAlumno, asis : Asistencia){

    let path = `users/${asig.idProfesor}/asignaturas_profesor/${asig.idAsignatura}/secciones/${asig.idSeccion}/asistencias/${asis.id}/asistentes`;
    

    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        
        let estado : string = 'ausente';
        let hora : string = 'Sin marcar';

        this.asistentes = res;
        this.asistentes.every( asistente => {
          if(asistente.uid === this.user().uid){
            estado = 'presente';
            hora = asistente.hora;
            return false;
          }
          return true;          
        });
        let asistenciaAlumno : AsistenciaAlumno = {
          fecha: asis.fecha,
          hora: asis.hora,
          horaMarcada : hora,
          estadoPresente : estado
        }
        this.asistenciasAlumno.push(asistenciaAlumno);
        sub.unsubscribe();
      }
    })
  }

  ordenarPorFechaYHora(array) {
    return array.sort((a, b) => {
      // Convertir fecha y hora a objetos Date para cada elemento
      let [diaA, mesA, añoA] = a.fecha.split('/').map(Number);
      let [horasA, minutosA, segundosA] = a.hora.split(':').map(Number);
      let fechaHoraA = new Date(añoA, mesA - 1, diaA, horasA, minutosA, segundosA);
  
      let [diaB, mesB, añoB] = b.fecha.split('/').map(Number);
      let [horasB, minutosB, segundosB] = b.hora.split(':').map(Number);
      let fechaHoraB = new Date(añoB, mesB - 1, diaB, horasB, minutosB, segundosB);
  
      return fechaHoraA.getTime() - fechaHoraB.getTime();
    });
  }


}
