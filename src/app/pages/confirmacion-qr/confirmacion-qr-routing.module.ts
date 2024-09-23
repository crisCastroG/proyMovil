import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmacionQrPage } from './confirmacion-qr.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmacionQrPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmacionQrPageRoutingModule {}
