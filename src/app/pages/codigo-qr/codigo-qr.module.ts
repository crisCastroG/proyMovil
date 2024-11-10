import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CodigoQrPageRoutingModule } from './codigo-qr-routing.module';

import { CodigoQrPage } from './codigo-qr.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { QrCodeModule } from 'ng-qrcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CodigoQrPageRoutingModule,
    ComponentsModule,
    QrCodeModule
  ],
  declarations: [CodigoQrPage]
})
export class CodigoQrPageModule {}
