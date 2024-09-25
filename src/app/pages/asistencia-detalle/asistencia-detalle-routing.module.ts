import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AsistenciaDetallePage } from './asistencia-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: AsistenciaDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AsistenciaDetallePageRoutingModule {}
