import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistroAsignaturaPageRoutingModule } from './registro-asignatura-routing.module';

import { RegistroAsignaturaPage } from './registro-asignatura.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistroAsignaturaPageRoutingModule,
    ComponentsModule
  ],
  declarations: [RegistroAsignaturaPage]
})
export class RegistroAsignaturaPageModule {}
