import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EscaneoExitosoPageRoutingModule } from './escaneo-exitoso-routing.module';

import { EscaneoExitosoPage } from './escaneo-exitoso.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EscaneoExitosoPageRoutingModule,
    ComponentsModule
  ],
  declarations: [EscaneoExitosoPage]
})
export class EscaneoExitosoPageModule {}
