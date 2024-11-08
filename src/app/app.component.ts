import { Component, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { FirebaseService } from './services/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  firebaseSvc = inject(FirebaseService);

  constructor(private router: Router, private menu: MenuController) {
    // Cerrar el menú en cada cambio de página
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.menu.close();
      }
    });


  }

  signOut(){
    console.log("logout");
    this.firebaseSvc.signOut();
  }
}
