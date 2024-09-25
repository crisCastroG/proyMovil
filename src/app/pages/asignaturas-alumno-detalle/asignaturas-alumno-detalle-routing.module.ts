import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AsignaturasAlumnoDetallePage } from './asignaturas-alumno-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: AsignaturasAlumnoDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AsignaturasAlumnoDetallePageRoutingModule {}
