import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AsistenciaDetallePageRoutingModule } from './asistencia-detalle-routing.module';

import { AsistenciaDetallePage } from './asistencia-detalle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AsistenciaDetallePageRoutingModule
  ],
  declarations: [AsistenciaDetallePage]
})
export class AsistenciaDetallePageModule {}
