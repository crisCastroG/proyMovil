import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  firebaseSvc = inject(FirebaseService);

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password : new FormControl ('',[Validators.required])
  })

  submit(){
    if(this.form.valid){
      this.firebaseSvc.signIn(this.form.value as User).then(res => {
        console.log(res);
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
