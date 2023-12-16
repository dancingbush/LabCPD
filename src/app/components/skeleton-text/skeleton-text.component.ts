import {Component, OnInit} from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-skeleton-text',
    templateUrl: './skeleton-text.component.html',
    
})

export class SkeletonTextComponent implements OnInit {
    /**
   * This is placed as loading animated skelieton tect whenever a page is loading
   * Its placed by using the tag in selector <app-skeleton-text></app-skeleton-text>
   * A cutom conponment cna be used in a signle page by impotrting teh componment and 
   * declaring it in .ts page; but you will get errors if using in multople pages so you have to
   * create a module instead, and hen the module is imported to the a page
   * The cmodule used here is components.module.ts
   * See this tutoril for details https://www.youtube.com/watch?v=za5NaFavux4
   * The funtionaility is in teh HTML file 
   */

    constructor(){}

    ngOnInit(): void {
        
    }
}
