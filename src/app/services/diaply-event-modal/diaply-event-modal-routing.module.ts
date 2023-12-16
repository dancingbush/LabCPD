import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiaplyEventModalPage } from './diaply-event-modal.page';

const routes: Routes = [
  {
    path: '',
    component: DiaplyEventModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiaplyEventModalPageRoutingModule {}
