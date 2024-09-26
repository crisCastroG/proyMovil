import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmacionQrPageRoutingModule } from './confirmacion-qr-routing.module';

import { ConfirmacionQrPage } from './confirmacion-qr.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmacionQrPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ConfirmacionQrPage]
})
export class ConfirmacionQrPageModule {}
