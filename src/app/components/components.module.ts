import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncabezadoComponent } from './encabezado/encabezado.component';
import { IonicModule } from '@ionic/angular';
import { ComponentsRoutingModule } from './components-routing.module';
import { EncabezadoAlumnoComponent } from './encabezado-alumno/encabezado-alumno.component';
import { CustomInputComponent } from './custom-input/custom-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [EncabezadoComponent,EncabezadoAlumnoComponent, CustomInputComponent],
  imports: [
    CommonModule,
    IonicModule,
    ComponentsRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[EncabezadoComponent,EncabezadoAlumnoComponent, CustomInputComponent]
  
})
export class ComponentsModule {}
