import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  }, 
  {
    path: 'bar-chart',
    loadChildren: () => import('./components/bar-chart-component/bar-chart.module').then(m => m.BarChartModule)
  },
  {
    path: 'line-chart',
    loadChildren: () => import('./components/line-chart-component/line-chart.module').then (m => m.LineChartModule)
  },
  {
    path: 'pie-chart',
    loadChildren: () => import('./components/pie-chart-component/pie-chart.module').then (m => m.PieChartModule)
  },
  // {
  //   path: 'tab4',
  //   loadChildren: () => import('./tab4/tab4.module').then( m => m.Tab4PageModule)
  // },
  {
    path: 'tab5',
    loadChildren: () => import('./tab5/tab5.module').then( m => m.Tab5PageModule)
  },
  {
    path: 'event-modal',
    loadChildren: () => import('./services/event-modal/event-modal.module').then( m => m.EventModalPageModule)
  },
  {
    path: 'diaply-event-modal',
    loadChildren: () => import('./services/diaply-event-modal/diaply-event-modal.module').then( m => m.DiaplyEventModalPageModule)
  },
  {
    path: 'pdf-make',
    loadChildren: () => import('./services/pdf-make/pdf-make.module').then( m => m.PdfMakePageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
