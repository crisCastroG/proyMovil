import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-registro-asignatura',
  templateUrl: './registro-asignatura.page.html',
  styleUrls: ['./registro-asignatura.page.scss'],
})
export class RegistroAsignaturaPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);



  formAsignatura = new FormGroup({
    codAsig: new FormControl('', [Validators.required]),
    nombAsig: new FormControl('', [Validators.required]),
  })

  ngOnInit() {
  }

  async agregarAsignatura(){
    if(this.formAsignatura.valid){

      const loading = await this.utilsSvc.loading();
      await loading.present();

      let path = `users/` + this.firebaseSvc.getAuth().currentUser.uid +'/asignaturas_profesor'

      this.firebaseSvc.addDocument(path,this.formAsignatura.value).then(async res => {

        this.utilsSvc.presentToast({
          message: 'Asignatura registrada',
          duration: 1000,
          color: 'primary',
          position: 'bottom'
        })

        this.utilsSvc.routerLink('/asignaturas');
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
  }

}
