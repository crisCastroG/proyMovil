import { Component, inject, Input, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { FirebaseService } from '../../services/firebase.service';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-encabezado',
  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.scss'],
})
export class EncabezadoComponent  implements OnInit {

  constructor(private menu: MenuController, private router: Router) { }

  firebaseSvc = inject(FirebaseService);

  @Input() titulo:string=''

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.miFuncionAlCambiarPagina();
      }

      if (event instanceof NavigationStart) {
        this.miFuncionAlIniciarPagina();
      }
      
    });

  }

  miFuncionAlIniciarPagina() {
    console.log('pagina iniciada');
    
  }

  miFuncionAlCambiarPagina() {
    console.log('pagina cambiada');
    
  }


  OnClick()
  {
    console.log("onc")
    this.menu.close('main-content');
    this.menu.open('main-content');
  }

  CloseMenu()
  {
    this.menu.close('main-content');  
  }

  signOut(){
    console.log("logout");
    this.firebaseSvc.signOut();
  }




}
