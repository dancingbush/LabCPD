// Srevce to pull, push, delete data from remote server

import { Injectable } from "@angular/core";
import { HttpClient} from '@angular/common/http';
import { cpdEvent } from "./interfaces";
import { Observable, catchError, of, timeout } from "rxjs";

@Injectable({
    providedIn: 'root' // make serivce avaible at root level to entire app
})


export class DataService {
  /**
   * Calling class is TAb3 whihc holds the list ofnic capCPD Events.
   */
  //http://mooneycallans.com/LabCPD/crud_api/api/LabCPDapp.php
    private dateBaseURL ='http://mooneycallans.com/LabCPD/crud_api/api/LabCPDapp.php'; // remote DB
    private testLocalDatabse = 'http://localhost:8888/crud_api/api/LabCPDapp.php'; // Hosted on MAMP, scripts n HTDOCS (applciations-> MAMP)
    public event! : cpdEvent;
    /*
    public mockCpdEvents : cpdEvent[] = [
      {
        id : 0,
        title : "Jounral Club",
        description: "Bone MArrow Morphology",
      hours: 0.5,
        startdate: new Date('11/9/23'),
    endDate: new Date('11/9/23'),
    eventOrganisers: "SVUH HAematology",
    CPDPoints: 1,
    compentancyCat: "Internal",
    reflection: "AML RARA vs Pherpial blood blasts appeard different",
    learningPlan: 'Review further APML cases',
    certificate: "Attached"
      },
      {
        id : 1,
        title : "MDT",
        description: "Intresting Cases ",
      hours: 0.5,
      startdate: new Date('11/9/23'),
    endDate: new Date('11/9/23'),
    eventOrganisers: "SVUH HAematology",
    CPDPoints: 1,
    compentancyCat: "Internal",
    reflection: "Accuty fatty liver disease",
    learningPlan: "Train students",
    certificate: "Attached" 
      },
      {
        id : 2,
        title : "Histology MDT",
        description: "Haem Obc Annes Ward ",
      hours: 1.5,
        startdate: new Date('11/10/23'),
    endDate: new Date('11/10/23'),
    eventOrganisers: "SVUH HAematology",
    CPDPoints: 2,
    compentancyCat: "Internal",
    reflection: "Annes Day Ward Rounds",
    learningPlan: "Review morphology",
    certificate: "Attached"
      }
    ]
    */

    constructor(private http : HttpClient) {}


    /*
    public getMockCpdEvents():cpdEvent[]{
      //mock ata service for testing
      console.log("dataservice getMockCDEvetnst- retunring these events : " + JSON.stringify(this.mockCpdEvents));
      return this.mockCpdEvents;
    }
    */


    public getallEvents(){
      // Get all events form remote server or single if ID specified
      console.log("DataService: getAllEvents()");
    
    // Make an HTTP GET request to the data source and return an Observable of 'cpdEvent' array
    return this.http.get<cpdEvent[]>(this.dateBaseURL)
      .pipe(
        timeout(10000), // Set a timeout for the HTTP request (10 seconds in this case)
        catchError(error => {
          // Handle any errors that occur during the HTTP request
          console.log("DataService - Error fetching all data: " + JSON.stringify(error));
          return of(null); // Return an Observable with null to indicate that there was an error
        })
      );
  }

  public getEvent (id : string){
    // retrive a specific event
    console.log("Dataservce- retriving evenet : ", id);
    return this.http.get<cpdEvent>(this.dateBaseURL + '/?' + id);

  }

  public createEvent (newEvent : cpdEvent) : Observable<any>{
    console.log("Dataservice: create new event for : ",  newEvent.title , " and certifcate image : ", newEvent.certificate);
    
    return this.http.post(this.dateBaseURL, newEvent);

  }

  /*
  public createNewEntMockData(newEvent : cpdEvent) : Observable<cpdEvent>{
    // Use fo mock event testing
    console.log("dataservice: createNewNokcData, recuve this event :" + JSON.stringify(newEvent));
    //const newMockArray = this.getMockCpdEvents();
    //newMockArray.push(newEvent);
    //this.mockCpdEvents = newMockArray;
    //return of(newMockArray);
    return of(newEvent)
  }
  */

  public updateEvent (event : cpdEvent, id : number){
    /**
     * URL syntax in postman works - for exmaoe index 18 in DB
     * http://localhost/crud_api/api/app.php/students/?id=18
     */
    console.log("dataservice: update event for " + event.title + " : evnet id: " + event.id);

    return this.http.put(this.dateBaseURL + '/?id=' + id, event);

  }

  public deleteEvent(id : number) {
    
    console.log("dataservice: deleting event: ", id);
    return this.http.delete(this.dateBaseURL + '/?id=' + id);
  }

  /*
  public deletMockEvent(id : number){
    //mock event testing

    console.log("dataservice- delte mock event testing");
    let modeifeMockEvents = this.getMockCpdEvents().filter(cpdEvent => cpdEvent.id !== id);
    return modeifeMockEvents;
  }
  */
 
}
