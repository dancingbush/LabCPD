import { Component, Input, OnInit } from '@angular/core';
import { cpdEvent } from '../interfaces';
import { ModalController, NavParams } from '@ionic/angular';
import { CameraService } from '../camera.service';



@Component({
  selector: 'app-diaply-event-modal',
  templateUrl: './diaply-event-modal.page.html',
  styleUrls: ['./diaply-event-modal.page.scss'],
})
export class DiaplyEventModalPage implements OnInit {
  /**
   * Display an evnet only.
   * This class take the test data passed when user taps the event on Tab3.
   * NavParams pass the data to this modal.
   * We can use NavParam to retun data to tab3 if needed.
   * event-modal is used to edit / update / add new evenst to remote DB
   * This modal is diplay purpsoes only
   */

  
  @Input()  event! : cpdEvent;
  public imagePathway : string = '';
  public eventData = {
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
public certifcateImage : HTMLImageElement | null = null;

  constructor(
    private modalController : ModalController,
    private navParams : NavParams,
    //private cameras2ervice : Camera2Service
  ) { 
    //this.event = this.eventData;
    console.log("DisplayEventModal constructor.");
  }

  ngOnInit() {
    // Assign details passed fork tab3 CPD Event list to local object
    
    console.log("UOPDATED: display-event-modal: got his form tab3: " + this.event.title + " : And IMage base64 = " , this.event.certificate);
    this.getImageName(); // for imgae row
    
  }

  ionViewWillEnter(){
    this.loadCertificateImage();
  }

  async loadCertificateImage() {
    // Get image form base64 string in database
    console.log("Display Modal: Loaidng image from event.certifcate: ", this.event.certificate);

  }


  getImageName () : void {
    // Depdning oin categpory, get image for assest and display
    
    console.log("dipslay-ev.modal: getting image for catorgorey :"  + this.eventData.compentancyCat);
    switch (this.eventData.compentancyCat){
      case 'Supervision/Mentoring':{
        this.imagePathway = '../../../assets/tests/test6.jpg';
        break;
      }
      case 'Peer Review': {
        this.imagePathway = '../../../assets/cpd/peerreview.jpeg';
        break;
      }
      case 'Professioal Body Member': {
        this.imagePathway = '../../../assets/cpd/professioanlmember.jpeg';
        break;
      }
      case 'Online Acitivty': {
        this.imagePathway = '../../../assets/cpd/onlinelearning.jpeg';
        break;
      }
      case 'Professional Reading / Study' : {
        this.imagePathway = '../../../assets/cpd/onlinelearning.jpeg';
        break;
      }
      case 'Journal Club' : {
        this.imagePathway = '../../../assets/cpd/journalclub.jpeg';
        break;
      }
      case 'Other' :{
        this.imagePathway = '../../../assets/cpd/otherCPD.jpeg';
        break;
      }
      default: {
        this.imagePathway = '../../../assets/cpd/otherCPD.jpeg';
      }
        
    }
  }
  async closeModal() {
    // clsoe modal and pas sback messgae to calling class tab3

    const message = 'dispaly-event-modal - Modal Closed';
    await this.modalController.dismiss(message);
  }



}
