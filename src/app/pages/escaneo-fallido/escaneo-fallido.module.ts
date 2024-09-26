import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EscaneoFallidoPageRoutingModule } from './escaneo-fallido-routing.module';

import { EscaneoFallidoPage } from './escaneo-fallido.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EscaneoFallidoPageRoutingModule,
    ComponentsModule
  ],
  declarations: [EscaneoFallidoPage]
})
export class EscaneoFallidoPageModule {}
