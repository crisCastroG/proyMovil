import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {


  form = new FormGroup({
    uid : new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    type: new FormControl('', [Validators.required])
  })

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  OnSelectChange($event){
    //this.form.controls.type = $event.target.value;
    this.form.controls.type.setValue($event.target.value);
  }

  async submit() {
    if (this.form.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc.signUp(this.form.value as User).then(async res => {
        await this.firebaseSvc.updateUser(this.form.value.name);

        let uid = res.user.uid;
        this.form.controls.uid.setValue(uid); // Setea el uid del registro al form

        this.setUserInfo(uid); ;// Guarda al usuario en la base de datos

        this.utilsSvc.presentToast({
          message: 'Registro exitoso',
          duration: 2500,
          color: 'primary',
          position: 'middle'
        })
        
        this.utilsSvc.routerLink('/login');
        this.form.reset();


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

  async setUserInfo(uid : string) {
    if (this.form.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();
      delete this.form.value.password;

      let path = 'users/${uid}';

      this.firebaseSvc.setDocument(path, this.form.value).then(async res => {
        
        this.utilsSvc.saveInLocalStorage('user', this.form.value)

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

  ngOnInit() {
  }
}