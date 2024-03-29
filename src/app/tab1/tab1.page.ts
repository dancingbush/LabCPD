import { Component, OnInit } from '@angular/core';
import { Chart, ChartData } from 'chart.js'
import { NgChartsModule } from 'ng2-charts';
import { AfterViewInit,  ElementRef, ViewChild } from '@angular/core';
import { DataService } from '../services/dataservice';
import { privateEncrypt } from 'crypto';
import { Data } from '@angular/router';
import { cpdEvent } from '../services/interfaces';
//import { ChartLegendLabelItem } from 'chart.js';
import { StorageService } from '../services/storageservice.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page implements AfterViewInit, OnInit{

/**
 * Charts are mnaged here but dipslyed in elemenst in Tab number.
 * Check if data us drwn form DB first and cached, of not make a new pull
 * 
 * this tutoiral file:///Users/callanmooneys/Desktop/HDip%20software%20Dev/CPD%20App/Ionic%205%20Charts%20&%20Graphs%20using%20Chart.js%20Library%20%7C%20by%20Ankit%20Maheshwari%20%7C%20JavaScript%20in%20Plain%20English.webarchive
 * Ionic 5 Charts & Graphs using Chart.js Library  Ankit Maheshwari
 * Importing ViewChild. We need @ViewChild decorator to get a reference to the local variable 
 * that we have added to the canvas element in the HTML template.
*/

  @ViewChild('barCanvas')
  private barCanvas!: ElementRef;
  @ViewChild('doughnutCanvas')
  private doughnutCanvas!: ElementRef;
  @ViewChild('lineCanvas')
  private lineCanvas!: ElementRef;

  barChart : any;
  doughnutChart: any;
  lineChart: any;

  // CPD data to display
  private cpdEvents : cpdEvent[] = [];
  private cacheCpdEvents : cpdEvent[]=[];
  private barlabels : [] = [];
  private barChartData : [] = [];
  private lineChartLabels: [] = [];
  private lineChartData : [] = [];
  public sortedCatFrequency : Map<string, number> = new Map();
  


  constructor(private dataService : DataService,
    private storageService : StorageService) {}


  ngOnInit(): void {
    
    // Get data only if we hvae not alreday saved it loccal in storage in tab3
    console.log("tab1 charts: ngOnit, looking for cached data, if none will make new request. ");
    this.storageService.get('cachedCPDEvents').then((storedData) => {
      if (storedData) {
        console.log("tab1 Charts- got cached CPD data from cachedCPDEvenst Key : ", storedData);
        this.cacheCpdEvents = storedData;
        this.cpdEvents = storedData;
        this.sortedCatFrequency = this.sortByCPDPointsAndFrequencyOfEvent();
        this.loadCharts();
      }else {
        console.log("Tab1 - no stored data for charts so call data service to get remotely.")
        this.dataService.getallEvents().subscribe(response => {
          console.log("tab1 charts: Got events from data service : ", response);
          if (response != null ){
            this.cpdEvents = response;
            this.sortedCatFrequency = this.sortByCPDPointsAndFrequencyOfEvent();
            this.loadCharts();
            
          }else{
            console.log("tab1 charts: got null response / data : ", response)
          }
        })
      }

    })
  }

 

  
  // When we try to call our chart to initialize methods in ngOnInit() it shows an error nativeElement of undefined. 
  // So, we need to call all chart methods in ngAfterViewInit() where @ViewChild and @ViewChildren will be resolved.

  ngAfterViewInit(): void {
    /** remove from here becsue charts render before data is loaded ascynronly in ngOnIt 
      this.barChartMethod();
      this.dougnutChartMethod();
      this.lineChartMethod();
      */
  }

  public loadCharts(){
    // Call form ngOnIt when data is loaded first
    this.barChartMethod();
      this.dougnutChartMethod();
      this.lineChartMethod();
  }

  public sortByCPDPointsAndFrequencyOfEvent () : Map<string, number>{
    // Sort events by cpdPoints in descending order, for bar chart

    console.log("tab1- sortbyDPdPoinst and Cats called...cpdEvents size = ", this.cpdEvents.length);
    this.cpdEvents.sort((a,b) => b.CPDPoints - a.CPDPoints);

    // Count the freq of Competency cat
    const frequencyMap : Map<string, number> = new Map();
    for (const event of this.cpdEvents){
      const { compentancyCat } = event;
      console.log("tab1 sortFeqCat: counting freqency of compentacy : ", compentancyCat , " from event with COmpetCat: ", event.compentancyCat, " form evet titel: ", event.title);
      frequencyMap.set(compentancyCat, (frequencyMap.get(compentancyCat) || 0 ) + 1);
    }

    // Sort the competnecy categories by freq in descending order
    const sortedFrequency = new Map([...frequencyMap.entries()].sort((a, b) => b[1] - a[1]));

    sortedFrequency.forEach((value, key)=>{
      console.log("tab1: for each: sortedCPD Freqency key : value pairs: ", `${key} : ${value}`);
    })

    console.log("tab1 charts - sortedFrequency map size= ", sortedFrequency.size , " - bar chart sorted freq of cat events VALUES: ", sortedFrequency.values());

    return sortedFrequency;
    }

  barChartMethod() {
    /**
     *  Now we need to supply a Chart element reference with an object that 
     * defines the type of chart we want to use, and the type of data we want to display.
     * First get our data sorted according to most common event and the number fo points for same
     * This method is called from ngOnIt
    */

    const labels : string[] = [];
    const data : number[] = [];
    const backgroundColours : string[]=[];
    const borderColours : string[] = [];

    // Extract the data from sorted freq map
    this.sortedCatFrequency.forEach((count, category)=>{
      console.log("tab1: Bar Chart - sorteCat Map: adding category : " + category + " and adding count : " + count);
      labels.push(category);
      data.push(count);

      // define custom colors oif needed 
      backgroundColours.push(`rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},0.2)`);
        borderColours.push(`rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},1)`);
  
    });
    
    // Print array contenst using separtor ... whihc passes each element to an arg
    console.log("tab1: Bar Chart: labels array of categoriesy : ", ...labels);
    console.log("tab1 : Bar Chart: data array contents fro highst CPD points  of categories: ", ...data )
    
    
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
 
      data: {
        labels: labels,
        datasets: [{
          label: '# of CPD Points',
          data: data,
          backgroundColor: backgroundColours,
          borderColor: borderColours,
          borderWidth: 1
      }]
      },
      
/** old
      data: {
        labels: ['BJP', 'INC', 'AAP', 'CPI', 'CPI-M', 'NCP'],
        datasets: [{
          label: '# of Votes',
          data: [200, 50, 30, 15, 20, 34],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      */
      options: {
        scales: {
          //yAxes: [{
            //ticks: {
              //beginAtZero: true
            //}
          //}]
        }
      }
    });
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


  lineChartMethod() {
    /**
     * plot activity. 
     * Displaying the number of entries per month over the last 12 montths
     * 
     */

    console.log("tab1: creating line chart...")

    // there is an issue when converting the endDate type in bloew code so leats see examine it first
    this.cpdEvents.forEach((event, index)=>{
      const endDate = event.endDate;
      console.log(`tab1 : line chart endDate type ${index + 1}:`, endDate );
      console.log('Data type of Event date ${index + 1}:', typeof endDate);

    })
  
    // Initialize an object to store the count of events per calendar month
const eventsPerMonth: { [month: string]: number } = {};

// Iterate through each event
this.cpdEvents.forEach(event => {
  if (event.endDate !== null){
  // Extract endDate from each event
  const endDate: Date = new Date(event.endDate);

  // Calculate the occurrence of endDate per calendar month
  const monthKey: string = `${endDate.getFullYear()}-${endDate.getMonth() + 1}`; // key format 'YYYY-MM'
  eventsPerMonth[monthKey] = (eventsPerMonth[monthKey] || 0) + 1; // Increment count for month
  }
});

// Organize the data into a format suitable for plotting
const dataPoints = Object.keys(eventsPerMonth).map(month => {
  // Split the monthKey into year and month parts
  const [yearStr, monthIndexStr] = month.split('-');
  // Create a Date object representing the month
  const date = new Date(parseInt(yearStr), parseInt(monthIndexStr) - 1); // months are 0-indexed in JavaScript
  // Format the month name and year
  const monthName = date.toLocaleString('default',{month:'short'});
  const year = date.getFullYear().toString().substr(2); // Get last to digots of year
  
  // COncatenate month and year for x axis
  const xAxisLabel = `${monthName}-${year}`;

  // Return the data point with Date object and event count


  return { x: xAxisLabel, y: eventsPerMonth[month] };
});
    

    console.log("tab1 line chart: got data points array of months and number of events: ", dataPoints);

    // Plot the data on a line chart 

// Step 5: Plot the data on a line chart (using Chart.js as an example)
const ctx = document.getElementById('lineChart') as HTMLCanvasElement;

    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        //labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December'],
        //labels : dataPoints.map(dataPoint => dataPoint.x.toLocaleString('default',{month: 'long'})),
        labels: dataPoints.map(dataPoint => dataPoint.x),
        datasets: [
          {
            label: 'Events Per Month',
            fill: false,
            //lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            //data: [65, 59, 80, 81, 56, 55, 40, 10, 5, 50, 10, 15],
            data: dataPoints.map(dataPoint => dataPoint.y),
            spanGaps: false,

          }
        ]
      }
    });
  }

}// end class 
