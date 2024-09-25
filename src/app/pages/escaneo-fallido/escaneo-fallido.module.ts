import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EscaneoFallidoPageRoutingModule } from './escaneo-fallido-routing.module';

import { EscaneoFallidoPage } from './escaneo-fallido.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EscaneoFallidoPageRoutingModule
  ],
  declarations: [EscaneoFallidoPage]
})
export class EscaneoFallidoPageModule {}
