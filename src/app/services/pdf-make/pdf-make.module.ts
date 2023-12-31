import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PdfMakePageRoutingModule } from './pdf-make-routing.module';

import { PdfMakePage } from './pdf-make.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PdfMakePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [PdfMakePage]
})
export class PdfMakePageModule {}
