import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EscanearQrAlumnoPage } from './escanear-qr-alumno.page';

const routes: Routes = [
  {
    path: '',
    component: EscanearQrAlumnoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EscanearQrAlumnoPageRoutingModule {}
