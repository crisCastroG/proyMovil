import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncabezadoComponent } from './encabezado/encabezado.component';
import { IonicModule } from '@ionic/angular';
import { ComponentsRoutingModule } from './components-routing.module';


@NgModule({
  declarations: [EncabezadoComponent],
  imports: [
    CommonModule,
    IonicModule,
    ComponentsRoutingModule
  ],
  exports:[EncabezadoComponent]
})
export class ComponentsModule {}
