import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AsistenciaDetallePageRoutingModule } from './asistencia-detalle-routing.module';

import { AsistenciaDetallePage } from './asistencia-detalle.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AsistenciaDetallePageRoutingModule,
    ComponentsModule
  ],
  declarations: [AsistenciaDetallePage]
})
export class AsistenciaDetallePageModule {}
