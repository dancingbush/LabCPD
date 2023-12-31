import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PdfMakePage } from './pdf-make.page';

const routes: Routes = [
  {
    path: '',
    component: PdfMakePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PdfMakePageRoutingModule {}
