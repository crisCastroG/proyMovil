import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EscanearQrAlumnoPageRoutingModule } from './escanear-qr-alumno-routing.module';

import { EscanearQrAlumnoPage } from './escanear-qr-alumno.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EscanearQrAlumnoPageRoutingModule,
    ComponentsModule
  ],
  declarations: [EscanearQrAlumnoPage, BarcodeScanningModalComponent]
})
export class EscanearQrAlumnoPageModule {}
