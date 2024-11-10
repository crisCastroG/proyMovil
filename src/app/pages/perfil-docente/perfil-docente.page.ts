import { Component, inject, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-perfil-docente',
  templateUrl: './perfil-docente.page.html',
  styleUrls: ['./perfil-docente.page.scss'],
})
export class PerfilDocentePage implements OnInit {

  constructor() { }

  utilsSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);

  nombre : string = '';
  correo : string = '';

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
   this.nombre = this.user().name;
   this.correo = this.user().email;
  }

  signOut(){
    this.firebaseSvc.signOut();
  }

}
