import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventModalPageRoutingModule } from './event-modal-routing.module';

import { EventModalPage } from './event-modal.page';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    //EventModalPageRoutingModule
    RouterModule.forChild([
      {
      path: '',
      component: EventModalPage
      }
    ])
  ],
  declarations: [EventModalPage]
})
export class EventModalPageModule {}


