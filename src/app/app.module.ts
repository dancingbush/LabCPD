import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Chart } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { BarChartComponentComponent } from './components/bar-chart-component/bar-chart-component.component';
import { LineChartComponentComponent } from './components/line-chart-component/line-chart-component.component';
import { PieChartComponentComponent } from './components/pie-chart-component/pie-chart-component.component';
import { ComponentsModule } from './components/components.module';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule} from '@ionic/storage-angular'
//import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
//import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { StorageService } from './services/storageservice.service';
import { CameraService} from './services/camera.service';

//import { Storage } from '@ionic/storage';

  // Ionic 5 Charts & Graphs using Chart.js Library

//Ankit Maheshwari
// native storgae - https://www.positronx.io/ionic-native-storage-tutorial/

@NgModule({
  declarations: [AppComponent],
  //declarations: [AppComponent],
  imports: [ 
    NgChartsModule,
    IonicModule,
    ComponentsModule,
    HttpClientModule,
     BrowserModule,
     IonicStorageModule.forRoot(),
      IonicModule.forRoot(), 
      AppRoutingModule],
  providers: [
    //NativeStorage,
    StorageService,
    CameraService,
    
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
