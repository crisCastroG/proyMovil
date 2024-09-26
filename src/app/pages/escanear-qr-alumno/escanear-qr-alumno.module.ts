import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EscanearQrAlumnoPageRoutingModule } from './escanear-qr-alumno-routing.module';

import { EscanearQrAlumnoPage } from './escanear-qr-alumno.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EscanearQrAlumnoPageRoutingModule
  ],
  declarations: [EscanearQrAlumnoPage]
})
export class EscanearQrAlumnoPageModule {}
