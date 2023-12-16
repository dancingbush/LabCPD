import { Component, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { cpdEvent } from '../services/interfaces';
import { FormControl } from '@angular/forms';
import { DataService } from '../services/dataservice';
import { AlertController, IonContent, MenuController, ModalController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CdkVirtualScrollViewport, CdkScrollable } from '@angular/cdk/scrolling';
import { NativePageTransitions, NativeTransitionOptions} from '@awesome-cordova-plugins/native-page-transitions/ngx';
import { StorageService } from '../services/storageservice.service';
import { debounce, debounceTime } from 'rxjs';
import { EventModalPage } from '../services/event-modal/event-modal.page';
import { DiaplyEventModalPage } from '../services/diaply-event-modal/diaply-event-modal.page';
import { IonItemSliding } from '@ionic/angular';
import { NgZone} from '@angular/core';
import { CameraService } from '../services/camera.service';
//import { title } from 'process';

//import { Storage } from '@ionic/storage';//?out of use
//import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: [
    './styles/tab3.page.scss',
  './styles/tab3.shell.scss'],
  changeDetection: ChangeDetectionStrategy.Default, // Add this line
})

export class Tab3Page {
  // Display all events, synmonius with Home.ts un usermanul
  public events!: cpdEvent[];
  public serachTerm! : string;
  public searchControl! : FormControl;
  public searching: any = false;
  public cacheLocalData! : cpdEvent[];
  private cacheTestData!: string;
  private searchForEvent!: string;
  public scrollToTop : boolean = false;
  //public slidingItem : IonItemSliding = any;
 


  constructor(private service : DataService,
    private cdr: ChangeDetectorRef, //force detect chnages
    private ngZone : NgZone, // try another form of force detec chnages and upddate list
              //private slidingItem : IonItemSliding,
              private alertCtrl : AlertController,
              private modalCtrl: ModalController,
              private menu : MenuController,
              //private storage : Storage,
              //private nativeStorage : NativeStorage,
              private storage: StorageService,
              private router : Router,
              private toaster : ToastController,
              private pageTransition: NativePageTransitions
              ) {
                this.searchControl = new FormControl();
              }

/* Get the ionconent for scrolling https://sbsharma.com/go-to-top-button-ionic/
CdkVirtScrolViewprt angular CDK to allow list t load only when its view
*/
@ViewChild(IonContent) ionContent! : IonContent;
@ViewChild(CdkVirtualScrollViewport) cdkVirtualScrollViewport!: CdkVirtualScrollViewport;

ngAfterViewInit(){
   //angular hook- register for scrolling events after CDKVirtualScroll has renedred
   console.log("Tabe3 Events: ngAfterViewiNit");   
   this.cdkVirtualScrollViewport.elementScrolled()
      .subscribe((event : Event)=> {
          console.log("CDK Scroll position: " + this.cdkVirtualScrollViewport.measureScrollOffset() + "; CDKView port height: " + this.cdkVirtualScrollViewport.getDataLength());
         if (this.cdkVirtualScrollViewport.measureScrollOffset() > (
          this.cdkVirtualScrollViewport.getDataLength() * 10)){
            console.log("tab3.page.ts: event list: Setting back to top butto to true.");
            this.scrollToTop = true;
          }else{
            this.scrollToTop = false;
          }
        })
      }

      ionViewWillLeave() {
        // lifecyle hook when page is abou to exit
        this.pageTransistion();
      }

      ionViewWillEnter(){
        this.pageTransistion();
      }

      ionViewDidEnter(){
        this.menu.enable(true);
      }

      ngOnInit(){
        /*
        Get data from remote server using dataservice.ts
        Debounce time is time to wait before triger search / observable.
        If connection down prompt will appear
        If timeout in dataservice catches slow connection tehn prompt will appear
        */
       console.log("tab3 NgOnit, getAllEvents called and passing null..")
      
       this.getAllEvents(null);
      }

      refreshPage (event : Event){
         /* Called form html <ion-refresh compnment 
    * tutorial - https://www.freakyjolly.com/ionic-4-pull-to-refresh-functionality-in-ionic-4-x-application/
    */
        console.log("tab3- refereseh page called - event = " + JSON.stringify(event));
        }

      pageTransistion(){
        /**
     * Page transition set to flip
     * For other choices or docs, Ctrl Click the method
     * https://github.com/danielsogl/awesome-cordova-plugins
     * Dont forgte to add this service to Decleaetions array in homepage module
     */

    let options : NativeTransitionOptions = {
      direction: 'up',
      duration: 500,
      slowdownfactor: 3,
      slidePixels: 20,
      iosdelay: 100,
      androiddelay: 150,
      fixedPixelsTop: 0,
      fixedPixelsBottom: 60
    }

    this.pageTransition.flip(options)
      .then(onSuccess => {
        console.log("home page flip.")
      })
      .catch(err => {
        console.log("tab3.ts transistion flip error " + err);
      })
      
    }

    getAllEvents(event:any){
       /*
    * Called form ngOniT() and from refreshPAge() 
    * in ion-refresher component 
    * Refreshe tutorial - https://www.freakyjolly.com/ionic-4-pull-to-refresh-functionality-in-ionic-4-x-application/
    * If event (form CDKScollAble observable which ommits an eent when pulled down) is not null the user has passed this from pull down
    * So if not null dont display searching icon spinner.
    * Here we get cpdEvent[] (cpdEvent is interface) from remote server, 
    * and assign array to cacheTestData and save this for off line use
    * We also assign localCacheData here which can be used in the serach bar when we 
    * want to cancel the search and retun all cpd events.
    */
       if (event){
        this.searching = false;
      
      }else{
     this.searching = true;
      }
      console.log("tab3 - Home.page: Refresher pull down called- Gettnig all data...");
     
       //Mock up service
       //this.events = this.service.getMockCpdEvents();

       this.service.getallEvents();
       //console.log("tab3: getAllEvents called form NgOnIt() - Got mock data: " + JSON.stringify(this.events) + " title - "+ this.events[this.events.length-1].description);
        console.log("tab3: getAllEvents- r ");
       
       this.storage['set'](this.cacheTestData, this.events);
       //this.nativeStorage.setItem(this.cacheTestData, this.cacheLocalData);
       this.searching = false;
       this.cacheLocalData = this.events;
 
       if (event) {
         event.target.complete();
       }
 
       
 


      // Live remote call
      this.service.getallEvents().subscribe(response => {
      
        console.log("home.page: calling servuce for data...data returned is : " + response);
        if (response != null ){
          this.events = response;
          this.storage['set'](this.cacheTestData, this.events);
          this.searching = false; //Turn spinner off
          this.cacheLocalData = this.events;
          
          //turn refresher off if its a pull down refresh
          if (event ){
            event.target.complete();          
          }
        }else{
        
          //this.displayAlertController("Error", "Connection Timed Out!", "Do you want to work offline?", "Yes", "No");
          this.alertCtrl.create({
            header: "Error",
            cssClass: 'customAlertBox',
            subHeader: "Connection Timed out",
            message: "Do you want to work offline?",
            buttons: [
              {
                text: "Yes",
                handler : () => {
                  console.log("No internet- getting date form cache..." + this.cacheLocalData);
                  this.storage['get'](this.cacheTestData).then((data : cpdEvent[]) =>{
                    console.log("Assigning cached test data to tests : " + data);
                    if (data != null){
                      this.events = data;
                      this.searching = false;
                    if (event){
                      event.target.complete();
                    }
                    }
                  });
                }
              },
              {
                text: "No",
                handler: () => {
                  this.router.navigate(['app/categories']);
                  
                }
              }
            ]
      
          }).then(alert => alert.present());
        }    
      },
      (error) => {
        console.log("homr.page.ts: SQD DB Error= " + error);
      });
  
      // set serach box time out
       this.searchControl.valueChanges
       .pipe(debounceTime(2000))
       .subscribe(search=> {
         this.searching = false;
         this.setFilteredEvents(search);
         
       });
  
    }

    setFilteredEvents(searchTerm : string){
      /**
     * USer teh seah term form user input to filter
     * the test array
     * https://www.joshmorony.com/high-performance-list-filtering-in-ionic-2/
     * Assign a lcoal var tp current tests array which we will use
     * to reasign tests if searh is null or empty. 
     * This saves us making another tme wasting API call to get all tests form remote server
     */

      console.log("tabpage2- set filter serach abr called");
      
      if (this.serachTerm != ""){
        
        this.events = this.events.filter(cpdRecord => {
          if (cpdRecord.title.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1){
            console.log("tab2page: list events- serach found for " + searchTerm );
            this.searching = false;
            
            return cpdRecord.title.toLowerCase().indexOf(this.serachTerm.toLowerCase()) > -1;
          }
          return false; //dont include event in filter
          
      })
      
      
         // If serach retunrs nothing the events array will be empty
         if (this.events.length == 0){
          console.log("after filtering events array with searchterm, " + this.serachTerm + " the events array enght is " + this.events.length);
          this.presentToaster(this.serachTerm);
          this.searching = false;
          this.events = this.cacheLocalData;
         }
      }else {
        console.log("tab3 list: Search term is blank or user has clcked X");
        // Reset the event data to cahedLcoalData whihc was set in NgOnIt()
        if (this.events.length < 1){
          this.events = this.cacheLocalData;
        }
        this.searching = false;
      }
    }

    searchCancelled() {
      // Serach box cancelled so refill list of events
      console.log("tabs3.pg : Search term is blank or user clicked X so getting data from cacheLocalData.");
      this.events = this.cacheLocalData;
      this.searching = false;

    }

async presentToaster(searchTerm : string){
  // Preset toaster
  const toast = await this.toaster.create({
    message: "No events found mathicng " + searchTerm, 
    duration: 3000,
    cssClass: 'customToaster',
    position: 'middle'
  });

  toast.present();
}

async presentGeneralToast(message : string){
  // General messages

  const toast = await this.toaster.create ({
    message: message,
    duration: 2000,
    cssClass: 'customToaster',
    position: 'middle'
  }) 
  toast.present()
}


onSearchinput(){
  /**
     * Turn on spinner when seraching
     * Set to false when loading page and when serach observable triggers in onIt
     */
    this.searching = true;
    this.setFilteredEvents(this.serachTerm);

}

removeEvent(id: number, slidingItem:IonItemSliding){
  // CRUD opeartion to remove event form DB
  console.log("tab3.page: rmove event with id: " + id);
  this.alertCtrl
    .create({
      header: "Delete Event",
      message: "Are you sure you want to delte this event?",
      buttons : [
        {
          text: 'Yes',
          handler: () => {
            this.service.deleteEvent(id).subscribe(() => {
              // Filter the events array to all events.id excepte deldted one
              this.events = this.events.filter(std => std.id !== id);
            });
          }
        },
        { text: 'No'}
      ]
    })
    .then(alertE1 => alertE1.present());  
    if (slidingItem){
      slidingItem.close()
    }
    }

    openEventModal(event : cpdEvent) {
      // Open modal to display event info overlay
      console.log("tabs3.page: opening event model with event title :" + event.title);
      this.modalCtrl.create({
        component: DiaplyEventModalPage,
        componentProps: {event : event} // Pass the event to the modal
       
      })
      .then(modal => {
        modal.present();
        return modal.onDidDismiss();
      })
    }

    addEvent(){
      /**c
       * Call eventmodal page
       * Also when Add Event page is closed 
       * we will capture what the page sends back  when navCtlr.dismiss(params)
       * is called, so we can upadte any new test additions to this page
       * The modal presents the Add Event page, .then() return info sent back 
       * from this page.
       */

      console.log("thab3.page- list- Add Event called.")

      this.modalCtrl.create({
        component: EventModalPage //  note no compnemntprops args as we are not sending modal data
      })
      .then(modal => {
        modal.present();
        return modal.onDidDismiss();
      })
      .then((
        {data, role}
      )=>{
        console.log("tab3- reciveinf data (event): role (string returnd form modal)  from createNewMockEv event modal: " + JSON.stringify(data) + " : " + role);
        if (role == 'Event Created' ){
          /**
           * ngZone and cdk. force the list to refresh, not needed if list 
           * updates as expected whem reote dtabse installed 
           * 
           */ 
          console.log("Command to present toaster!");
          this.presentGeneralToast(data.title + " Event Created!");

          this.ngZone.run(()=>
          {

         
          console.log("tabs3.page list: New test created from EventModal, add it to event array : " + data);
          this.events.push(data);
          this.events.filter((event)=>{
            return true;
          })
          // Trailing different things as list wont refresh, tried updated evenst array with opush and also
          // retunring a new arrau, nothing works

          //const typedData : cpdEvent[] = data;
          //console.log("tab3-AddEvent- converted data <any> to data<cpdEvent[]: " + JSON.stringify(typedData))
        //this.events = typedData;
        //console.log("event-modal: events array now updated to new array: " + JSON.stringify(typedData));
          //this.events = data;
          
          this.cdr.detectChanges();//Manully detced evenst updated as doesnt appear to be happening automatically
        })//ngZone 

        console.log("tab3: addEvent(): after getting new data now will call get " 
        + "getAllVents(), should return new array whihc is : " + JSON.stringify(this.events)
       + " ::: So Now calling getAllEvents to compare : " + JSON.stringify(this.getAllEvents(null)) + " THIS returns this events object : " + JSON.stringify(this.events));
        
        }
      });
     
    }

    updateEvent(event: cpdEvent, slidingItem : IonItemSliding){
       /* 
       * Rifgt slide - Edit Event
       * Need slidingItem so we can reset slider to normal
       * We need to pass the event  object ot the 
      * EventModalPage with modalCtrl
      * And we also handle the retuned data from Event Modal Page
      * Use slidingItem to close the HTML slider back to normal firm Edit
      */
     console.log("tabs3.pg- list: updae event, passing this to EventModal page: " + event.title + " and event ID = " + event.id);

     this.modalCtrl.create({
      component: EventModalPage,
      componentProps: {editEvent:event}
     })
     .then(modal => {
      modal.present();
      console.log("tabs3.pg- upadteEvent()- getting data returned from modal: ")
      return modal.onDidDismiss();
     })
     .then((
      {data, role}) => {
        this.events = this.events.filter(std => {
          if (data.id === std.id){
            // return updated events array
            return data;
          }
          return std;
        });
      });
      // Return HTM slider back to normal posistion
      if (slidingItem){
      slidingItem.close()
      }
    }// updateEvent
    
    scrollToTopSpeed(){
      //Specify speed to sroll to op of ion content when button clicked
      this.cdkVirtualScrollViewport.scrollToIndex(0);

    }

} // end class


