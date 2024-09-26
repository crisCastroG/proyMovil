import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistroOpcionesPageRoutingModule } from './registro-opciones-routing.module';

import { RegistroOpcionesPage } from './registro-opciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistroOpcionesPageRoutingModule
  ],
  declarations: [RegistroOpcionesPage]
})
export class RegistroOpcionesPageModule {}
