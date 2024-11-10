import { Component, inject, OnInit } from '@angular/core';
import { AsignaturaAlumno } from 'src/app/models/asignatura_alumno.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-asignaturas-alumno',
  templateUrl: './asignaturas-alumno.page.html',
  styleUrls: ['./asignaturas-alumno.page.scss'],
})
export class AsignaturasAlumnoPage implements OnInit {

  constructor() { }

  utilsSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);
  
  asignaturasAlumno : AsignaturaAlumno[];
  
  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  ngOnInit() {
  }
  
  ionViewCanEnter(){
    this.getAsignaturasAlumno();
  }

  getAsignaturasAlumno() {
    let path = `users/${this.user().uid}/asignaturas_alumno`;

    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        this.asignaturasAlumno = res;
        sub.unsubscribe();
      }
    })
  }

  redirigirAlDetalle(asignatura: AsignaturaAlumno){
    this.utilsSvc.saveInLocalStorage('seleccionAsignatura', asignatura);
    this.utilsSvc.routerLink('asignaturas-alumno-detalle');
  }

}
