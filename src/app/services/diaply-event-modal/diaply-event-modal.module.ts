import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiaplyEventModalPageRoutingModule } from './diaply-event-modal-routing.module';

import { DiaplyEventModalPage } from './diaply-event-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiaplyEventModalPageRoutingModule
  ],
  declarations: [DiaplyEventModalPage]
})
export class DiaplyEventModalPageModule {}
