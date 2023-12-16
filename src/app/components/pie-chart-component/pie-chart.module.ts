import { Router, RouterModule, Routes } from "@angular/router";
import { PieChartComponentComponent } from "./pie-chart-component.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";


export const routes : Routes = [
    //array of objects
    {
        path: '', //defult path is empty string
        component: PieChartComponentComponent // retun this comon when this path is navigated to

    }
]

@NgModule({
    imports : [
        CommonModule,
        IonicModule,
        FormsModule,
        RouterModule.forChild(routes)

    ],
    }
)

export class PieChartModule {}