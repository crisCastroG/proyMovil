import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EscaneoFallidoPage } from './escaneo-fallido.page';

const routes: Routes = [
  {
    path: '',
    component: EscaneoFallidoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EscaneoFallidoPageRoutingModule {}
