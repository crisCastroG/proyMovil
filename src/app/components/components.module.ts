import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncabezadoComponent } from './encabezado/encabezado.component';
import { IonicModule } from '@ionic/angular';
import { ComponentsRoutingModule } from './components-routing.module';
import { EncabezadoAlumnoComponent } from './encabezado-alumno/encabezado-alumno.component';


@NgModule({
  declarations: [EncabezadoComponent,EncabezadoAlumnoComponent],
  imports: [
    CommonModule,
    IonicModule,
    ComponentsRoutingModule
  ],
  exports:[EncabezadoComponent,EncabezadoAlumnoComponent]
  
})
export class ComponentsModule {}
