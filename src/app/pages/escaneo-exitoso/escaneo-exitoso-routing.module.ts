import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EscaneoExitosoPage } from './escaneo-exitoso.page';

const routes: Routes = [
  {
    path: '',
    component: EscaneoExitosoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EscaneoExitosoPageRoutingModule {}
