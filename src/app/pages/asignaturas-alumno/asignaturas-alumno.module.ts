import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AsignaturasAlumnoPageRoutingModule } from './asignaturas-alumno-routing.module';

import { AsignaturasAlumnoPage } from './asignaturas-alumno.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AsignaturasAlumnoPageRoutingModule,
    ComponentsModule
  ],
  declarations: [AsignaturasAlumnoPage]
})
export class AsignaturasAlumnoPageModule {}
