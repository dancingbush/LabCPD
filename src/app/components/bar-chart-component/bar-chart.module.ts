import {RouterModule, Routes } from '@angular/router';
import { BarChartComponentComponent } from './bar-chart-component.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

export const routes : Routes = [
    // Make the ar chart visble by defult using redicet route
    {
        path: '',
        redirectTo: '/bar-chart',
        pathMatch: 'full'
    },
    {

        path: 'bar-chart',
        component: BarChartComponentComponent
    }
];


@NgModule({
    imports : [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes)
    ],
    //declarations: [BarChartComponentComponent]
})

export class BarChartModule {}

