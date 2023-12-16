import { NgModule } from "@angular/core";
import { LineChartComponentComponent } from "./line-chart-component.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { RouterModule, Routes } from "@angular/router";

export const routes : Routes = [
    {
        path:'',
        component: LineChartComponentComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes)
    ],
})

export class LineChartModule {}
