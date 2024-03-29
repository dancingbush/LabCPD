import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { PickerController, Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Camera, CameraResultType, CameraSource, Photo} from '@capacitor/camera';
import {Plugins} from '@capacitor/core';
import { Directory, Filesystem, FilesystemDirectory } from '@capacitor/filesystem';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { LoadingController } from '@ionic/angular';
//import { Content } from 'pdfmake/interfaces';


import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Content } from 'pdfmake/interfaces';
import { cpdEvent } from '../interfaces';
import { read, truncate } from 'fs';
import { table } from 'console';
import { ModalController } from '@ionic/angular'; 
import { AlertController, ToastController} from '@ionic/angular';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;


/**
 * C.Mooney 29.12.23
 * Creates a PDF from data passed to the class, in  this case from tab3 which holds teh lost
 * of all cpd events.
 * No images as they require base64, whihc is to much oveead
 * Will use a logo though.
 * Tutorial uses ionic-native and corova plugins so we replace these with 
 * 'awsome-cordove-plugins' as this is new repo.
 * Tutoorial is : https://www.youtube.com/watch?v=QZ-CRdhxQbI
 * PDFMake Git docs: https://pdfmake.github.io/docs/0.1/getting-started/client-side/
 */

@Component({
  selector: 'app-pdf-make',
  templateUrl: './pdf-make.page.html',
  styleUrls: ['./pdf-make.page.scss'],
})
export class PdfMakePage implements OnInit {
  // Fields

  @Input() cpdEvents! : cpdEvent[]; // Get cpdEvents form tab3 
  myForm! : FormGroup;
  pdfObj : any = null;
  base64Image = "";
  photoPreview = "";
  logoData = ""; // Will hold base64 string
  photoPlaceHolder = "";
  CPDtimeFrameCaptured : string = '';
  totalCPDPoints = 0;
  totalEvents = 0;
  progressValue = 0; // loading bar 
// Tese will define the defaulkt  dates for ion calender 
selectedDate: string = new Date().toISOString();
selectedEndDate : string = new Date().toISOString();
// Bind from dates entered 'name'
startDate = new Date();
endDate = new Date();
checkBoxAllDates : boolean = true;
filteredCpdEvents! : cpdEvent[];
willTakePhoto : boolean = false;
includeWaterMark: boolean = true;
totalCPDPointsFilteredDates = 0;
totalEventsFilteredDates = 0;
totalCPDHoursFilteredEvents = 0;
isPDFDownLoaded : boolean = false;
isAlertOpen = false; //Alert when PDF generated




  constructor(private fb : FormBuilder,
    private plt : Platform, private http: HttpClient, 
    private fileOpener : FileOpener,
    private loadingController : LoadingController,
    private modalCtyl : ModalController,
    private alertController : AlertController, 
    private toaster: ToastController) {}

  ngOnInit() {
    // Create form to cpature data 
    /** 
    this.myForm = this.fb.group({
      showLogo: true,
      showWatermark: true,
      from: 'Ciaran',
      to: 'Max',
      text: 'TEST'
    });
    */
/*
    this.myForm = this.fb.group({
      showLogo: [false],
      showWatermark: [false],
      from: [''],
      to: [''],
      text: [''],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
    });
    */

    // Get calnder checkbox valyes
    // Load image form assest as base64 for logo
    this.loadLocalAssetToBase64();
    this.initilizeCPDDataSummary();

    console.log("PDFMake ngOnIt: got cpdEvents from tab3 : ", this.cpdEvents);
  }

  public initilizeCPDDataSummary(){
    // get daya summet for table summary in report

    this.totalEvents = this.cpdEvents.length;
    this.totalCPDPoints = this.cpdEvents.reduce((total, event) => total + event.CPDPoints, 0);

   // const totalCPDPoints = cpdEvents.reduce((total, event) => total + event.cpdEvent.CPDPoints, 0);
   // Get the StartDate from the first and last objects
   const startDateFirstIndex: Date = this.cpdEvents[0].startdate;
   console.log("Start Date : " , startDateFirstIndex);
   const lastDateLastIndex : Date = this.cpdEvents[this.cpdEvents.length -1].startdate;
   
   // Calculate the time difference in milliseconds
   const timeDifferenceInMilliseconds: number = lastDateLastIndex.getTime() - startDateFirstIndex.getTime();
   
   // Calculate the time difference in days
   const daysDifference: number = timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24);
   
   // Calculate the time difference in months
   const monthsDifference: number = lastDateLastIndex.getMonth() - startDateFirstIndex.getMonth() +
     (12 * (lastDateLastIndex.getFullYear() - startDateFirstIndex.getFullYear()));
   
   // Calculate the time difference in years
   const yearsDifference: number = lastDateLastIndex.getFullYear() - startDateFirstIndex.getFullYear();
   
   console.log(`Time Difference in Days: ${daysDifference}`);
   console.log(`Time Difference in Months: ${monthsDifference}`);
   console.log(`Time Difference in Years: ${yearsDifference}`);

   this.CPDtimeFrameCaptured = yearsDifference + ' Years, ' + monthsDifference + ' months and ' + daysDifference + ' days.'
    

  }

  

  loadLocalAssetToBase64 () {
    // PDFMake you cannot just refernec asset folder
    // You must convert to base64 first

    // get logo form assest as base64 as DF only handles images in base64 format
    this.http.get('./assets/cpd/otherCPD.jpeg', {responseType: 'blob'})
      .subscribe(res => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.logoData = reader.result as string;
        }
        reader.readAsDataURL(res);
      })

      // get base64 of profile pic placeholder in case user does not want a profile pic
      this.http.get('./assets/sample-images/user/profilepic.png', {responseType: 'blob'})
        .subscribe(res => {
          const reader = new FileReader();
          reader.onloadend = () => {
            this.photoPlaceHolder = reader.result as string;
          }
          reader.readAsDataURL(res);
        })
  }

  async takePicture() {
    // Allow user option to take selfie for the CPD report

    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Base64, // hase ot base64 as PDFMake only deals with base64
      source: CameraSource.Prompt
    });
    
    // Importnat to use a back tick ` and not a signle qoute ' in string interoplation
    this.photoPreview = `data:image/jpeg;base64,${image.base64String}`;

  }

  createPdf(){

    const formValue = this.myForm.value; // get form contenst fomr html
    const image  = this.photoPreview ? {image: this.photoPreview, width:100, alignment: 'right'} : {image: this.photoPlaceHolder, width: 100, alignment: 'right'}; // if image taken presnet it, if not blank

  
    let logo = {};
    if (formValue.showLogo){
      logo = { image: this.logoData, width: 50};
    }

    // test mock up doc definition to roubleshhot
   // playground requires you to assign document definition to a variable called dd

var dd = {
  watermark: {text: 'LabCPD', color: 'blue', opacity: 0.2, bold: true},
 
	content: [
    

		{
			text: 'CPD Title',
			style: 'header'
		},
    
		'CPD Descrition : Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.\n\n',
		
    {
      layout: 'lightHorizontalLines', // optional
      table: {
        // headers are automatically repeated if the table spans over multiple pages
        // you can declare how many rows should be treated as headers
        headerRows: 1,
        widths: [ '*', 'auto', 100, '*' ],

        body: [
          [ 'CPD Points', 'Hours Spent learning', 'Date', 'The last one' ],
          [ 'Value 1', 'Value 2', 'Value 3', 'Value 4' ],
          [ { text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4' ]
        ]
      }
    },
    
    '',// empy line
    {
			text: 'Subheader 1 - using subheader style',
			style: 'subheader'
		},
		'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam posset, eveniunt specie deorsus efficiat sermone instituendarum fuisse veniat, eademque mutat debeo. Delectet plerique protervi diogenem dixerit logikh levius probabo adipiscuntur afficitur, factis magistra inprobitatem aliquo andriam obiecta, religionis, imitarentur studiis quam, clamat intereant vulgo admonitionem operis iudex stabilitas vacillare scriptum nixam, reperiri inveniri maestitiam istius eaque dissentias idcirco gravis, refert suscipiet recte sapiens oportet ipsam terentianus, perpauca sedatio aliena video.',
		'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam posset, eveniunt specie deorsus efficiat sermone instituendarum fuisse veniat, eademque mutat debeo. Delectet plerique protervi diogenem dixerit logikh levius probabo adipiscuntur afficitur, factis magistra inprobitatem aliquo andriam obiecta, religionis, imitarentur studiis quam, clamat intereant vulgo admonitionem operis iudex stabilitas vacillare scriptum nixam, reperiri inveniri maestitiam istius eaque dissentias idcirco gravis, refert suscipiet recte sapiens oportet ipsam terentianus, perpauca sedatio aliena video.',
		'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam posset, eveniunt specie deorsus efficiat sermone instituendarum fuisse veniat, eademque mutat debeo. Delectet plerique protervi diogenem dixerit logikh levius probabo adipiscuntur afficitur, factis magistra inprobitatem aliquo andriam obiecta, religionis, imitarentur studiis quam, clamat intereant vulgo admonitionem operis iudex stabilitas vacillare scriptum nixam, reperiri inveniri maestitiam istius eaque dissentias idcirco gravis, refert suscipiet recte sapiens oportet ipsam terentianus, perpauca sedatio aliena video.\n\n',
		{
			text: 'Subheader 2 - using subheader style',
			style: 'subheader'
		},
		'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam posset, eveniunt specie deorsus efficiat sermone instituendarum fuisse veniat, eademque mutat debeo. Delectet plerique protervi diogenem dixerit logikh levius probabo adipiscuntur afficitur, factis magistra inprobitatem aliquo andriam obiecta, religionis, imitarentur studiis quam, clamat intereant vulgo admonitionem operis iudex stabilitas vacillare scriptum nixam, reperiri inveniri maestitiam istius eaque dissentias idcirco gravis, refert suscipiet recte sapiens oportet ipsam terentianus, perpauca sedatio aliena video.',
		'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam posset, eveniunt specie deorsus efficiat sermone instituendarum fuisse veniat, eademque mutat debeo. Delectet plerique protervi diogenem dixerit logikh levius probabo adipiscuntur afficitur, factis magistra inprobitatem aliquo andriam obiecta, religionis, imitarentur studiis quam, clamat intereant vulgo admonitionem operis iudex stabilitas vacillare scriptum nixam, reperiri inveniri maestitiam istius eaque dissentias idcirco gravis, refert suscipiet recte sapiens oportet ipsam terentianus, perpauca sedatio aliena video.\n\n',
		{
			text: 'It is possible to apply multiple styles, by passing an array. This paragraph uses two styles: quote and small. When multiple styles are provided, they are evaluated in the specified order which is important in case they define the same properties',
			style: ['quote', 'small']
		}
	],
	styles: {
		header: {
			fontSize: 18,
			bold: true
		},
		subheader: {
			fontSize: 15,
			bold: true
		},
		quote: {
			italics: true
		},
		small: {
			fontSize: 8
		}
	}
	
//}
      
      
    }// testDocDef


    const docDefinition = {
      // styles avalble are here http://pdfmake.org/playground.html
      watermark: {text: 'LabCPD', color: 'blue', opacity: 0.2, bold: true},
      content: [
        // insert columns / tables etc here
        {
          //alignment: 'justify',
          columns: [
            logo,
            {
              text: new Date().toTimeString(),
              alignment: 'right'
            }
          ] // end 1st columns 
        }, //end first obj in content array 
        {text: "REMINDER", style: 'header'},
        {
          columns: [
            {
              width: '50%',
              text: 'From',
              style: 'subheader'
            },
            {
              width: '50%',
              text: 'To',
              style: 'subheader'
            }
          ] // end second column content
        }, // end secind coulmn object 
        
        {
          columns: [
            {
              width: '50%',
              text: formValue.from
            },
            {
              width: '50%',
              text: formValue.to
            }
          ]// edn 3rd column array
        }, // end 3rd col object
        
       image , // insert image of present
        { text: formValue.text, margin: [0,20,0,20]},

      ], // end content
      // Insert styles here
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0,15,0,0]
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin : [0,15,0,0]
        }
      } // styles
    } // docDefinition

    // Create this document - not working, use test case for now
    //this.pdfObj = pdfMake.createPdf(docDefinition);

    // test
    try {

    
    if (this.plt.is('capacitor' || this.plt.is('cordova') || this.plt.is('iphone') || this.plt.is('mobile'))){
      console.log("PDFMake- mobile detected : ", this.plt);
      //this.pdfObj = pdfMake.createPdf(dd).open();// gives error blocked by Browser!
      this.pdfObj = pdfMake.createPdf(dd);
      this.downloadPDF();

    }else{
      // open in web brwoser 
      console.log("PDFMake- brwoser detecetd platfomr: ", this.plt);
      this.pdfObj = pdfMake.createPdf(dd).open();
    }
  } catch (e){
    console.log("PDFmake- error making PDF : ", e);
  }
    //this.pdfObj = pdfMake.createPdf(dd).open();
    console.log("PDFMake: have created this PDF object: ", this.pdfObj);
  }

  public downloadPDF(){
    // Download the PDF 

    if (this.plt.is('cordova') || this.plt.is('capacitor')) {
      // using mobile, save PDF as base64  to mobile dev and open
      console.log("PDFMake DownloadPDF() - mobile detected, saving PDF to mobile.")
      this.pdfObj.getBase64( async (data: any) => {
        try {
          const timestamp = Date.now();
          let path = 'pdf/cpdrecord_${timestamp}.pdf';

          const result = await Filesystem.writeFile({
            path,
            data,
            directory: Directory.Documents,
            recursive: true
            // encoding: Filesystemencodinhg.UTF8 - cases errors
          });
          //this.fileOpener.open('${result.uri}', 'application/pdf');
          this.fileOpener.open(result.uri, 'application/pdf');
          
        } catch(e) {
          console.log("PDFMake- unable to write PDF to mobile.", e);
        }
      });
    }else {
      // using web
      this.pdfObj.download();
    }
  }

 public calculateCPDPointsOnFilteredDates(){
  // If filetred dates then calulate summary data 

  this.totalEventsFilteredDates= this.cpdEvents.length-1;
  this.totalCPDPointsFilteredDates = this.cpdEvents.reduce((sum, cpdEvent)=> {
    return sum + (cpdEvent.CPDPoints || 0);
  }, 0);

  this.totalCPDHoursFilteredEvents = this.cpdEvents.reduce((sum, cpdEvent )=>{
    return sum + (cpdEvent.hours || 0);
  },0)



 }

  async generateDynamicPDF(form : NgForm) {
    
    // Creat dynamic PDF form cpdEvenst array
    this.startDate = form.value.startDate;
    this.endDate = form.value.endDate;
    this.checkBoxAllDates = form.value.checkBoxallDatesValue;
    this.willTakePhoto = form.value.willTakePhotoCheckBoxValue;
    this.includeWaterMark= form.value.showWatermarkCheckBoxValue;

  
    console.log("PDFMake form value submitted : ", form.value , " and allDates checkbox = ", form.value.checkBoxallDatesValue);
    console.log("Creating dynmnmaic PDF from cpeEvent array with lenght : ", this.cpdEvents.length);
    console.log("PDFMaker onsubmit genearteDynamicPDF() dates captured: start date = ", this.startDate);

    // progress bar
    const loading = await this.loadingController.create({
      message: 'Creating PDF...'
    })
    await loading.present();

    // Check if 'All' date has not  check, if not then filter on selected dates
    let dateRange = "All";
    if (!form.value.checkBoxallDatesValue){
       this.cpdEvents = await this.filterCPDEvents();
       console.log("PDFMake - chekc date vlaues ofmr date picker: start date ", this.startDate, " and end date : ", this.endDate, " And data type of startDate : " , typeof(this.startDate));
    
       const startDateString = new Date(this.startDate).toISOString().split('T')[0];
       const endDateString = new Date(this.endDate).toISOString().split('T')[0];
     
       dateRange = this.checkBoxAllDates ? 'All' : `${startDateString} to ${endDateString}` 

       // Calculate CPD summary table stats on filetred dates for use later
       this.calculateCPDPointsOnFilteredDates();

    }
    

    // If photo taken (chekbox ticked) use photo form user otherwise use default photo
    const image  = this.photoPreview ? {image: this.photoPreview, width:200, alignment: 'right'} : {image: this.photoPlaceHolder, width:200, alignment: 'right'};
    const formValue = form.value;
    let dd : any = {}; // document
    dd['watermark'] = {};

    let logo : any = {}
    if (this.includeWaterMark){
      // If logo checkbox checked use it
      logo = {image : this.logoData, width: 50};
      dd['watermark'] = {text: 'CPD', color:'blue',
       opacity: 0.2, bold: true};
    }

    
    // Initialize the document definition and styling
    dd  = {
      watermark: {text: 'LabCPD', color: 'blue', opacity: 0.2, bold: true},
      
      content: [],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 15,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        nomral: {
          fontszie: 13,
          bold: false,
          margin: [0,0,0,10]
        },
        quote: {
          italics: true,
          margin: [0, 0, 0, 10]
        },
        small: {
          fontSize: 8
        },
        tableExample: {
          body: [
            [
              { text: 'rowSpan: 3\n\nborder:\n[false, false, false, false]', fillColor: '#eeeeee', border: [false, false, false, false], alignment: 'center' },
              { text: 'border:\nundefined', alignment: 'center' },
              { text: 'border:\nundefined', alignment: 'center' }
            ],
            [
              { text: '', alignment: 'center' }, // Empty cell to maintain alignment
              { text: 'border:\nundefined', alignment: 'center' },
              { text: 'border:\nundefined', alignment: 'center' }
            ],
            [
              { text: '', alignment: 'center' }, // Empty cell to maintain alignment
              { text: 'border:\nundefined', alignment: 'center' },
              { text: 'border:\nundefined', alignment: 'center' }
            ]
          ]
        }
      }
    };

    dd.content.push({
      columns: [
        {
          stack: [
            {
              text: 'Ciaran Mooney',
              style: 'header',
              alignment: 'left'
            },
            {
              text: 'CORU reg Number: 123456',
              style: 'subheader',
              alignment: 'left'
            },
            {
              text: 'Date of registration: 23/03/23',
              style: 'quote',
              alignment: 'left'
            },
            logo
          ],
          width: 'auto', // Adjust width as needed
        },
        {
          stack: [
            // to the right of the above stacked left column comtents
            image,
            // Add other content to the right as needed
          ],
          width: '*', // * maeans take up remaining space
        },
      ],
    });
    
    

    
   // Add an empty line
dd.content.push({ text: '\n\n' });

// Add the Summary centered table
dd.content.push(
  //stack: [
    {
      text: 'Total Summary All CPD Events',
      style: 'subheader',
      alignment: 'left', // Optional: You can add alignment to the text
    },
    {
      style: 'tableExample',
      alignment: 'center',
      table: {
        body: [
          ['Total Points', 'Total Activities', 'Time Period'],
          [this.totalCPDPoints, this.totalEvents, this.CPDtimeFrameCaptured]
        ]
      },
      //alignment: 'center', // Center the table within the stack
    },
  //],
 // alignment: 'center', // Center the entire stack
);

dd.content.push({
  text: '\n\n'
});

if (dateRange !== 'All'){
  // summarise data fro selected date range

  dd.content.push (
    {
    text: '\n\n'
    },
    //columns: [
      {
        text: 'Summary for Selcected Dates : ' + dateRange,
        style: 'subheader',
        alignment: 'left'
      },
      {
        style: 'tableExample',
        table : {
          body: [
            ['Total Points', 'Events', 'CPD Hours'],
          [this.totalCPDPointsFilteredDates, this.totalEventsFilteredDates,this.totalCPDHoursFilteredEvents]]
          
        },

      }
    //],
  )
}

dd.content.push ({
  text: '\n\n'
})

dd.content.push({
  columns: [
    {
      text: 'CPD Transcript Date Range: ' + dateRange,
      style: 'subheader',
      alignment: 'left',
    },
    {
      text: 'Date Generated: ' + new Date().toDateString(),
      style: 'subheader',
      alignment: 'right',
    },
  ]
});


    // Loop through each object in the cpdEvents array
    this.cpdEvents.forEach(cpdEvent => {
      
      
      // Add title
      dd.content.push({
        text: '\n\nTitle: ' + cpdEvent.title,
        style: 'header'
      });

      // Add date
      dd.content.push({
        text: cpdEvent.startdate ? cpdEvent.startdate : '\nDate Not Recorded.\n\n',
        style: 'subheader'
      })

      // ad summaty table
      dd.content.push({
        
          style: 'tableExample',
          table: {
            body: [
              ['CPD Points', 'Category', 'Event Organisers','Start Date', 'End Date', 'Activity Duration'],
              [cpdEvent.CPDPoints, cpdEvent.compentancyCat, cpdEvent.eventOrganisers, cpdEvent.startdate, cpdEvent.endDate, cpdEvent.hours ]
            ]
          },
          alignment: 'center'
        
      })

      // Add description
      dd.content.push({
        text: '\n\nEvent Descritption',
        style: 'subheader'
      })

      dd.content.push({
        text: cpdEvent.description,
        style: 'normal'
      });

      // Add learning
      dd.content.push({
        text: '\n\nLearning Plan',
        style: 'subheader'
      });
      dd.content.push({
        text: cpdEvent.reflection,
        style: 'nomral'
      })

      dd.content.push({
        text: '\n\n------------------------------------------------------------------------------------------',
        alignment: 'center'
      })
      // Add quote with multiple styles
      dd.content.push({
        text: 'It is possible to apply multiple styles, by passing an array. This paragraph uses two styles: quote and small. When multiple styles are provided, they are evaluated in the specified order which is important in case they define the same properties',
        style: ['quote', 'small']
      });
    });

    // Generate and download the PDF
    //const pdfDoc = pdfMake.createPdf(dd).download('document.pdf');
    
   

    this.pdfObj = pdfMake.createPdf(dd);

    // Close progress bar
    this.pdfObj.download((buffer: ArrayBuffer) => {
      // Handle buffer 
      console.log("PDFMake - calling downloadPDF()");
      this.downloadPDF();
      loading.dismiss(); // dismiss once loaded
      this.isPDFDownLoaded = true; // activate complete button
      this.presentAlert();
    }, (progress: { loaded: number; total: number }) => {
      // This callback will be used to update the progress bar as PDF is generated 
      console.log("PDFMake - adding to the progress bar...progressValue ", this.progressValue);
      this.progressValue = Math.round((progress.loaded / progress.total) * 100);

    });
    
}



  async filterCPDEvents() : Promise<cpdEvent[]>{
    /** 
     * Filter the cpdEvents array on the dates selected form date picker (this.startDate / this.endDate)
     * Ion date picker retunrs a string
     * You can compar  strings with '=> =< '  operands as long as they are the same fomrat string
     * Allot of chedcs with types are made, due to issues possibly due to the test data base enties
     * been a mixture of strings and Date objects during testing
     * 
     */
    
    const startDateString = new Date(this.startDate).toISOString().split('T')[0];
  const endDateString = new Date(this.endDate).toISOString().split('T')[0];
  console.log("Filtering ion picker  dates between startdate  ", startDateString, " of type: ", typeof(startDateString)," and end date ", endDateString, " type of: ", typeof(endDateString));

  return this.cpdEvents.filter(event => {
    console.log("PDFMake - filter on dates: event.startdate value : ", event.startdate, " and data type should be string = ", typeof event.startdate);
  
    if (typeof event.startdate === "string" || event.startdate instanceof String) {
      const eventDateString = new Date(event.startdate).toISOString().split('T')[0];
      console.log(`In loop- Filtering on event date:", eventDateString, " Is added to new array - ${eventDateString >= startDateString && eventDateString <= endDateString}`);
      return eventDateString >= startDateString && eventDateString <= endDateString;
    }
  
    return false; // Filter out events with no valid startdate
  });
  }

public dismissPage(){
  // Dismiss this modal controller and return data

  this.modalCtyl.dismiss({
    // no data to pass
  })
  
}


async  presentAlert(){
  // Present succes message

  console.log("Presenting alert");
  /** 
  const alert = await this.alertController.create({
    header: "PDF Generated Succesfully!",
    buttons: ['OK'],
    cssClass: 'centered-alert'
  });

  await alert.present();
*/
  const toast = await this.toaster.create({
    message: "Success!!",
    duration: 1500,
    position: 'middle',
    cssClass: 'custom-toast'
  });

  await toast.present()

}
}// class
