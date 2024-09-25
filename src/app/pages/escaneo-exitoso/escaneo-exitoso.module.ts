import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EscaneoExitosoPageRoutingModule } from './escaneo-exitoso-routing.module';

import { EscaneoExitosoPage } from './escaneo-exitoso.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EscaneoExitosoPageRoutingModule
  ],
  declarations: [EscaneoExitosoPage]
})
export class EscaneoExitosoPageModule {}
