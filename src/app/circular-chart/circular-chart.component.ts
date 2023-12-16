import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-circular-chart',
  templateUrl: './circular-chart.component.html',
  styleUrls: ['./circular-chart.component.scss'],
})
export class CircularChartComponent  implements OnInit, AfterViewInit {

  @ViewChild('myChartCanvas') myChartCanvas!: ElementRef;


  constructor() { }

  ngOnInit() {
   
  }

  ngAfterViewInit(): void {
      this.createCircularGraph();
  }



  createCircularGraph() {
    const canvas = this.myChartCanvas.nativeElement as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Failed to get the 2D context of the canvas element.');
      return;
    }
    
    const data = {
      labels: ['Label 1', 'Label 2', 'Label 3'],
      datasets: [
        {
          data: [30, 50, 20],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        },
      ],
    };
    
    const options = {
      responsive: true,
    };
    
    const myChart = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: options,
    });
  }
}