import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AsignaturasAlumnoDetallePageRoutingModule } from './asignaturas-alumno-detalle-routing.module';

import { AsignaturasAlumnoDetallePage } from './asignaturas-alumno-detalle.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AsignaturasAlumnoDetallePageRoutingModule,
    ComponentsModule
  ],
  declarations: [AsignaturasAlumnoDetallePage]
})
export class AsignaturasAlumnoDetallePageModule {}
