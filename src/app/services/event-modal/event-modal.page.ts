import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { cpdEvent } from '../interfaces';
import { ModalController } from '@ionic/angular';
import { DataService } from '../dataservice';
import { CameraService } from '../camera.service';
import { Camera2Service } from '../camera2.service';
import { AlertController } from '@ionic/angular';
import {TextToSpeech } from '@capacitor-community/text-to-speech';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';


/*
This componment opens a modal when called from TAB3.
TAB3 displays all CPD events, and gives user choice of adding, editing,
or delting an event. This is passed via Modal object to this class via @Inject
decorator.
This modal calls our dataservice to handle trasncation with back CRUD scripst
for adding, editing, removing events.
 */

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.page.html',
  styleUrls: ['./event-modal.page.scss'],
})

/**
 *  Here we present a screen (MODAL) to input a CPD event, and file back to backend DB 
   Use a NgForm to bind to html elemnet and capture submit button 
 * CameraService used to take or pick photo from gallery
   and store in file system of phone, and base64 url in database
 *  
 */

export class EventModalPage implements OnInit {

  @Input() editEvent!: cpdEvent; // event sent form calling class, tabs3
  isEdit = false; // convert to true if we are passed data to edit form calling class (list)
  specchToText = "Speak to record your event details, press the Speak icon when complete."
  recordingVoice = false;
  // Tese will define the defaulkt  dates for ion calender 
  public selectedDate: string = new Date().toISOString(); 
  public selectedEndDate : string = new Date().toISOString();
  public   uploadEvent = {
    id: 0,
    title: '',
    description : '',
    hours : 0,
    startdate: new Date(),
    endDate: new Date(),
    eventOrganisers: '',
    CPDPoints: 0,
    compentancyCat: '',
    reflection: '',
    learningPlan : '',
    certificate: ''
  }
 ;
  public base64photo: string= "";
  public photoFileLocation : string= "";

  constructor(
    private modalCtrl : ModalController, 
    public camera2Service : Camera2Service,
    public cameraService : CameraService,
    private service : DataService,
    private alertController : AlertController,
    private changeDetectorRef : ChangeDetectorRef // detect Speech listeners  and update UI
    ) {
      // Initilise speak recognition
      SpeechRecognition.requestPermissions();
     }

  ngOnInit() {
    /*
    If 'cpdEvent is not null it means a cpdEvent has been passed 
    from parnet class (List tab) for editing an event
    */
 
   console.log("evemt modal ngOnit, event passed form tab3 = " + this.editEvent.title + " and event base64 image: ", this.editEvent.certificate);
   if (this.editEvent){
    console.log("event-modal NgOnIt: tab3 ADD passed event to edit form List: " + this.editEvent.title)
    this.isEdit = true;
    this.uploadEvent = this.editEvent;
  }else{
    console.log("event-modal: ngOnOt- did not recive a event to edit form tab3 so this is a new event" 
    + " ; isEdit = ", this.isEdit )
  }

  }

  async startSpeechRecognition(){
    // Start recording voice, esnure functionalty available first

    const {available} = await SpeechRecognition.available();

    if (available) {
      this.recordingVoice = true;
      SpeechRecognition.start({
        popup: true, // Only for andrid and not reliable
        partialResults: true, // returns text as its spoken
        language: 'en-uk',
        //maxResults - dont need
      });

      SpeechRecognition.addListener('partialResults', (data : any) => {
        console.log("partialResults was fired", data.matches);
        if (data.matches && data.matches.lenght > 0 ){
          // mvoice is recording correctly
          this.specchToText = data.matches[0]; // first result is largest likley hood of been correct
          this.changeDetectorRef.detectChanges(); // uopadte UI when voice detected 
          this.uploadEvent.reflection = data.matches[0];
          console.log("Event mdoal - sppech detected: ", data.matches[0])
        }

        // Android with capactort speech plugin 2.1. has a diffenret result type then 'matches', its 'val;ue
        if (data.value && data.value.lenght > 0) {
          this.specchToText = data.value[0];
          this.changeDetectorRef.detectChanges();
        }

      })
    }
  }

  async stopSpeechRecording(){
    // Stopd voide recodring
    this.recordingVoice = false;
    await SpeechRecognition.stop();
  }

  public speechToText() {
    // Read back instructions to user 
    console.log("Event modl- SpeechTotext called");
    TextToSpeech.getSupportedVoices();
    TextToSpeech.getSupportedVoices();
    TextToSpeech.speak({
      text: this.specchToText,
      lang: 'en-uk',
      rate: 0.8,
      pitch: 0.8,
      volume: 0.8,
      category: 'ambient'
    })
  }
  public async takeAndDisplayPhoto() : Promise <void> {
    // Take a photo and then dipslay in HTML

    console.log("EventModal: takeAndDipslayPhoto called.")
    try {
      //const imagePath = await this.camera2Service.takePhoto();
      //this.photoFileLocation = imagePath; // Store the mobile file URI of cpatued photo b

      // convert photo to base64 so it can be saved to backend
      //this.base64photo = await this.camera2Service.convertImageToBase64String(this.photoFileLocation);
      this.base64photo = await this.cameraService.addNewPhotoToDevice();
      console.log("Event modal- saving base64 to remoted databse: ", this.base64photo);

      this.uploadEvent.certificate = this.base64photo;
      console.log("EventModal: Got photo mobile AND base64 rep: ", this.base64photo);
    } catch (error){
      console.log("EventModal: error captuirng or processing photo :  ", error);
    }
  }
  
/** 
  public getCertficatePhotoBase64() : string {
    // Get photo of certifcate, NEED TO RETURN A BASE 64 REP TO STORE IN REMOTE SQL
    
    //this.cameraService.addNewPhotoToDevice();
    this.cameraService.capturePhotoAndGetBase64()
      .then((base64data)=> {
        this.base64photo = base64data;
      })
      .catch(error => {
        console.log("EventNodal- error getting base 64 : " + error);
      })

      console.log("Event Modal: Assigning certofcate phptp base 64 to event for upload:m", this.base64photo);
      this.uploadEvent.certificate = this.base64photo;
    return this.base64photo;
  }
*/


  closeModal(){
    //Pass cancelled back t calling page 
    console.log("event-modla page: ClosedModal called");
    this.modalCtrl.dismiss(null, "closed");

  }


  onSubmit(form : NgForm) {
    // Return all data form form/html eventmodal
    console.log("even-modal onSubmit(): Cpd event form submitted with event: " + JSON.stringify(form.value));
    
    const event : cpdEvent = form.value;

    // Get dates 
    //event.startdate = new Date(this.selectedDate);

    console.log("EventModal: date before ots been modified : ", event.startdate, " and end date : ", event.endDate);
   

    if (this.editEvent){
      // Edit event
      console.log("event-modal: on Submit()- updating CPD Event ID: ", this.editEvent.id, " AND Photo URL is : ", this.base64photo);
      this.editEvent.certificate = this.base64photo;
      console.log("EventModal- got base 64 for certifcati image for uploading to database: " + this.editEvent.certificate);
      this.service.updateEvent(event, this.editEvent.id).subscribe(()=>{
        event.id = this.editEvent.id; 
        this.modalCtrl.dismiss(event,"Updated!");

      });
    }else{
      // New event to add
      console.log("Event-modal page: Creating a new event: ", event.title, " AND Photo base64 = ", this.base64photo, " and start date : ", event.startdate);
      event.certificate = this.base64photo;

      this.service.createEvent(event).subscribe(response => {
        console.log("event-modal: Create New Event: reponse form darta service: " + JSON.stringify(response));
        
        this.modalCtrl.dismiss(response, "Event Created"); // pass back to tab3 
      },
      error=> {
        console.log("event-modal: add new: error- ", JSON.stringify(error));
      },
      ()=> {
        console.log("event-modal: new event created with no errors.")
      });
    }
    
  }

async learningPlan(){
    // Display pop text 
    console.log("EventModal- learningPlan help txt called/")
    let message = "What have I learnt, did I achive what I had set out to achive, how will / have I applied this new skill / learning to work. Waht is the imapct on on my role of this experience";
    /*
    What have I learnt?
Did I achieve my learning outcomes?
What kind of unplanned outcomes or challenges arose from this experience?
Which barriers or blocks did I have to overcome?
How have I applied this learning at work?
What was the impact of this learning for service users and/or quality service provision?
What lessons can I take from this experience?
What was the impact of this learning on my professional practice?
*/

    const alert = await this.alertController.create({
      header: 'Learning',
      message: message,
      buttons: ["OK"]
    })

    await alert.present();

  }
  
}//end class

