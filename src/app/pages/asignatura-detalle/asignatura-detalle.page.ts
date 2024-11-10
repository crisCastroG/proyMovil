import { Component, inject, OnInit } from '@angular/core';
import { DetalleAsignatura } from 'src/app/models/detalle_asignatura.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Asistencia } from '../../models/asistencia.model';
import { User } from 'src/app/models/user.model';
import { Asistente } from 'src/app/models/asistente.model';
import { DetalleAsistencia } from 'src/app/models/detalle_asistencia.model';

@Component({
  selector: 'app-asignatura-detalle',
  templateUrl: './asignatura-detalle.page.html',
  styleUrls: ['./asignatura-detalle.page.scss'],
})
export class AsignaturaDetallePage implements OnInit {

  constructor() { }

  utilsSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);

  nombreAsignatura: string = '';
  siglaAsignatura: string = '';
  nombreSeccion: string = '';

  asistencias: Asistencia[];


  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  detalleAsignatura(): DetalleAsignatura {
    return this.utilsSvc.getFromLocalStorage('seleccionAsignatura');
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.nombreAsignatura = this.detalleAsignatura().nombreAsignatura;
    this.siglaAsignatura = this.detalleAsignatura().siglaAsignatura;
    this.nombreSeccion = this.detalleAsignatura().nombreSeccion;

    this.getAsistencias(this.detalleAsignatura().id_asignatura, this.detalleAsignatura().id_seccion);
  }

  getAsistencias(idAsignatura: string, idSeccion: string) {

    let path = `users/${this.user().uid}/asignaturas_profesor/${idAsignatura}/secciones/${idSeccion}/asistencias`

    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        this.asistencias = res;
        this.asistencias.forEach(asistencia => {
          this.getNumeroDeAsistentes(idAsignatura, idSeccion, asistencia);
        });
        sub.unsubscribe();
      }
    });
  }

  getNumeroDeAsistentes(idAsignatura: string, idSeccion: string, asistencia: Asistencia) {

    let path = `users/${this.user().uid}/asignaturas_profesor/${idAsignatura}/secciones/${idSeccion}/asistencias/${asistencia.id}/asistentes`

    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        let asistentes : Asistente[] = res;
        let cantidadAsistentes : number = 0;
        asistentes.forEach(asistente => {
          cantidadAsistentes += 1;
        })
        asistencia.numeroAsistentes = cantidadAsistentes;
      }
    });
  }

  redirigirAlDetalle(idAsistencia : string, fecha : string, hora : string, numeroAsistentes : number){
    
    let asistencia : DetalleAsistencia = {
      idAsistencia : idAsistencia,
      idAsignatura : this.detalleAsignatura().id_asignatura,
      idSeccion : this.detalleAsignatura().id_seccion,
      fecha : fecha,
      hora : hora,
      numeroAsistentes : numeroAsistentes
    }
    this.utilsSvc.saveInLocalStorage('detalleAsistencia',asistencia);
    this.utilsSvc.routerLink('asistencia-detalle');

  }

}
