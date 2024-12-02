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

  asisPendientes: boolean = false;

  constructor() { }

  utilsSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);

  asignaturasAlumno: AsignaturaAlumno[];

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getAsignaturasAlumno();
    this.verificarAsistenciasPendientes();
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

  redirigirAlDetalle(asignatura: AsignaturaAlumno) {
    this.utilsSvc.saveInLocalStorage('seleccionAsignatura', asignatura);
    this.utilsSvc.routerLink('asignaturas-alumno-detalle');
  }

  verificarAsistenciasPendientes() {
    if (this.utilsSvc.getFromLocalStorage("asistenciasPendientes_" + this.user().uid)) {
      this.asisPendientes = true;
    }
  }

  async actualizarLista() {
    const loading = await this.utilsSvc.loading();
    await loading.present();
    await this.firebaseSvc.cargarAsistenciasPendientes(this.user().uid, this.user().name).then(res => {
      this.asisPendientes = false;
    }
    ).catch((error) => {
      this.asisPendientes = true;
    }).finally(()=>{        
      loading.dismiss();
      
    })
    this.getAsignaturasAlumno(); 

  }

}
