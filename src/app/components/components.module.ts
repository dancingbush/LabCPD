import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SkeletonTextComponent } from './skeleton-text/skeleton-text.component';

/**
 * Use this component module as an import into a page.ts 
 * so any of the custim cponments can be used
 * To use a custom copmonet just insert the selctor tag form the .ts page in the page 
 * you wnat to use it in html 
 * Remeber to import  components.module into tehPage.module.ts
 * 
 * The imports below are all componmenst associated with Ionic, Fomrs, Shell and Common modules
 * The decaleratiosn declare individual componments we want to use
 * in a given page
 * 
 * Tutorial for using components in multiple pages: https://www.youtube.com/watch?v=za5NaFavux4
 */

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ],
    declarations: [
        SkeletonTextComponent
    ],
    exports: [
        SkeletonTextComponent
    ]

})

export class ComponentsModule {}

