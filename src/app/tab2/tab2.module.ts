import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import { BarChartComponentComponent } from '../components/bar-chart-component/bar-chart-component.component';
import { LineChartComponentComponent } from '../components/line-chart-component/line-chart-component.component';
import { PieChartComponentComponent } from '../components/pie-chart-component/pie-chart-component.component';
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab2PageRoutingModule
  ],
  declarations: [Tab2Page, BarChartComponentComponent, LineChartComponentComponent, PieChartComponentComponent]
})
export class Tab2PageModule {}
