import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AgregarSeccionComponent } from 'src/app/components/agregar-seccion/agregar-seccion.component';
import { Asignatura } from 'src/app/models/asignatura.model';
import { Seccion } from 'src/app/models/seccion.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-asignaturas',
  templateUrl: './asignaturas.page.html',
  styleUrls: ['./asignaturas.page.scss'],
})
export class AsignaturasPage implements OnInit {

  constructor(private modalCtrl: ModalController, private router: Router) { }

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  formSeccion = new FormGroup({
    nombSeccion : new FormControl('')
  })

  asignaturas : Asignatura[] = [];

  ngOnInit() {
  }
  
  ionViewWillEnter(){
    this.getAsignaturas();
  }

  user(): User{
    return this.utilsSvc.getFromLocalStorage('user');
  }

    // Modal para abrir ventana para agregar seccion
    async openAddSectionModal(id: string) {
      const modal = await this.modalCtrl.create({
        component: AgregarSeccionComponent,
        cssClass: 'small-modal'
      });
  
      await modal.present();
  
      // Captura el valor cuando el usuario confirma
      const { data, role } = await modal.onWillDismiss();
  
      if (role === 'confirm' && data) {
        this.addSeccion(id, data)     
      }
    }

  getAsignaturas(){
    let path = `users/${this.user().uid}/asignaturas_profesor`;

    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        this.asignaturas = res;
        this.asignaturas.forEach(asignatura => {
          console.log(asignatura);
          this.getSecciones(asignatura.id, asignatura)
         });
        sub.unsubscribe();
      }
    })
  }

  getSecciones(id: string, asignatura : Asignatura){
    let path = `users/${this.user().uid}/asignaturas_profesor/${id}/secciones`;

    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        console.log(res);
        asignatura.secciones = res;
        sub.unsubscribe();
      }
    })
    
  }

  async addSeccion(id: string, nombSeccion : string){

    const loading = await this.utilsSvc.loading();
      await loading.present();

    let path = `users/${this.user().uid}/asignaturas_profesor/${id}/secciones`
    this.formSeccion.controls.nombSeccion.setValue(nombSeccion)
    this.firebaseSvc.addDocument(path,this.formSeccion.value).then(async res => {

      this.getAsignaturas();

      this.utilsSvc.presentToast({
        message: 'Seccion registrada',
        duration: 1000,
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




}
