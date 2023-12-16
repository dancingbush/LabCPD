import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {Chart} from 'chart.js';

@Component({
  selector: 'app-pie-chart-component',
  templateUrl: './pie-chart-component.component.html',
  styleUrls: ['./pie-chart-component.component.scss'],
})
export class PieChartComponentComponent  implements OnInit, AfterViewInit {

  @ViewChild('doughnutCanvas')
  private doughnutCanvas!:ElementRef;

  doughnutChart : any;

  constructor() { }

  ngOnInit() {}

  ngAfterViewInit(): void {
      this.dougnutChartMethod();
  }

  dougnutChartMethod() {
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['BJP','Congress','AAP','CPM','SP'],
        datasets: [{
          label: '# of votes',
          data: [50,29,15,10,7],
          backgroundColor: [
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)'

          ],
          hoverBackgroundColor: [
            '#FFCE56',
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#FF6384'
          ]
        }]
      }
    });
  }

}
