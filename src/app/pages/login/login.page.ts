import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { MenuController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private menu: MenuController, private userService: UserService) { }

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })


  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ionViewWillEnter(){
    this.menu.enable(false);
  }


  async submit() {
    if (this.form.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc.signIn(this.form.value as User).then(res => {
        
        this.getUserInfo(res.user.uid);

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

  async getUserInfo(uid: string) {
    if (this.form.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();

      let path = `users/${uid}`;

      this.firebaseSvc.getDocument(path).then((user: User) => {

        let userType = user.type;

        this.userService.setUserData(user);

        this.utilsSvc.saveInLocalStorage('user', user);
        this.utilsSvc.saveInLocalStorage('userType', userType);
        if(userType === "profesor"){
          this.utilsSvc.routerLink('/home');
        } else{
          this.utilsSvc.routerLink('/home-alumno');
        }
        
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


  ngOnInit() {
  }






  /*constructor(private router:Router) { }

  mensaje:string=''
  usr:Usuario={
    username:'',
    password:''
  }


  
  onSubmit(){
    console.log(this.usr);
    if(this.usr.username=="wacoldo" && this.usr.password=="123"){
      console.log("Acceso ok");
        this.router.navigate(['/home'])
    }
    else{
      this.mensaje='Acceso Denegado';
    }
  }*/

}
