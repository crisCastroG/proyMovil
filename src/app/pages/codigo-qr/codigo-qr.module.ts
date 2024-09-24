import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CodigoQrPageRoutingModule } from './codigo-qr-routing.module';

import { CodigoQrPage } from './codigo-qr.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CodigoQrPageRoutingModule
  ],
  declarations: [CodigoQrPage]
})
export class CodigoQrPageModule {}
