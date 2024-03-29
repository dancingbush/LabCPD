import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import {  ScrollingModule } from '@angular/cdk/scrolling';
import { Tab1PageRoutingModule } from './tab1-routing.module';

import { CircularChartComponent } from '../circular-chart/circular-chart.component';
import { NgChartsModule } from 'ng2-charts';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule,
    NgChartsModule,
    ComponentsModule,
    ScrollingModule
  ],
  declarations: [Tab1Page, CircularChartComponent]
})
export class Tab1PageModule {}
