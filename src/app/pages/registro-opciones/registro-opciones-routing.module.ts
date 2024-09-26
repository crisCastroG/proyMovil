import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistroOpcionesPage } from './registro-opciones.page';

const routes: Routes = [
  {
    path: '',
    component: RegistroOpcionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistroOpcionesPageRoutingModule {}
