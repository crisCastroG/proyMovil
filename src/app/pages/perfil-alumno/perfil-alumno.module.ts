import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilAlumnoPageRoutingModule } from './perfil-alumno-routing.module';

import { PerfilAlumnoPage } from './perfil-alumno.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilAlumnoPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PerfilAlumnoPage]
})
export class PerfilAlumnoPageModule {}
