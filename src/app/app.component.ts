import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuController, Platform } from '@ionic/angular';
import { FirebaseService } from './services/firebase.service';
import { UtilsService } from './services/utils.service';
import { User } from './models/user.model';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  userName: string = '';
  userType : string = '';

  constructor(private router: Router, private menu: MenuController, private userService: UserService) {
    // Cerrar el menú en cada cambio de página
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.menu.close();
      }
    });
  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  ngOnInit() {
    // Esto ayuda a cambiar el ion menu segun su nombre y el tipo de usuario
    this.userService.userData$.subscribe(user => {
      if(user === null){
        this.userName = this.user().name;
        this.userType = this.user().type;
      }else{
        this.userName = user.name;
        this.userType = user.type;
      }

    });

      
  }


  signOut() {
    this.firebaseSvc.signOut();
  }
}
