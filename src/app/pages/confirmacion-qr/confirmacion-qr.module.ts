import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmacionQrPageRoutingModule } from './confirmacion-qr-routing.module';

import { ConfirmacionQrPage } from './confirmacion-qr.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmacionQrPageRoutingModule
  ],
  declarations: [ConfirmacionQrPage]
})
export class ConfirmacionQrPageModule {}
