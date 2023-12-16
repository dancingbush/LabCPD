import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { Chart } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { BarChartComponentComponent } from '../components/bar-chart-component/bar-chart-component.component';

@NgModule({
  imports: [
    NgChartsModule,
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
