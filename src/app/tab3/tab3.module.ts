import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';
//import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { ComponentsModule } from '../components/components.module';
import { Tab3PageRoutingModule } from './tab3-routing.module';
import {  ScrollingModule } from '@angular/cdk/scrolling';
import { NativePageTransitions } from '@awesome-cordova-plugins/native-page-transitions/ngx';
import { StorageService } from '../services/storageservice.service';
//mport { NativePageTransitionsOriginal } from '@awesome-cordova-plugins/native-page-transitions/ngx';

/**
 * Import ComponentsNodule so we can use our custom
 * components in multiple pages
 * Decleartions are for decalring extart components you want to use, 
 * that are not in CommonModule / IonicModule etc
 */

@NgModule({
  imports: [
    IonicModule,
    ComponentsModule,
    ScrollingModule,
    CommonModule,
    FormsModule,
    //NativePageTransitions,
    //ExploreContainerComponentModule,
    Tab3PageRoutingModule
  ],
  providers: [
    NativePageTransitions,
    StorageService
  ],
  declarations: [Tab3Page]
})
export class Tab3PageModule {}
