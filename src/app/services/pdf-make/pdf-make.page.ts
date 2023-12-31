import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Camera, CameraResultType, CameraSource, Photo} from '@capacitor/camera';
import {Plugins} from '@capacitor/core';
import { Directory, Filesystem, FilesystemDirectory } from '@capacitor/filesystem';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';

//import { Content } from 'pdfmake/interfaces';


import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Content } from 'pdfmake/interfaces';
import { cpdEvent } from '../interfaces';

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



  constructor(private fb : FormBuilder,
    private plt : Platform, private http: HttpClient, 
    private fileOpener : FileOpener) { }

  ngOnInit() {
    // Create form to cpature data 
    this.myForm = this.fb.group({
      showLogo: true,
      from: 'Ciaran',
      to: 'Max',
      text: 'TEST'
    });
  }

  loadLocalAssetToBase64 () {
    // PDFMake you cannot just refernec asset folder
    // You must convert to base64 first

    this.http.get('./assets/cpd/otherCPD.jpeg', {responseType: 'blob'})
      .subscribe(res => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.logoData = reader.result as string;
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
      source: CameraSource.Camera
    });
    
    this.photoPreview = 'data:image/jpeg;base64,${image.base64Image}';

  }

  createPdf(){

    const formValue = this.myForm.value; // get form contenst fomr html
    const image  = this.photoPreview ? {image: this.photoPreview, width:300} : {}; // if image taken presnet it, if not blank

    // try this for svg error
    let image2 = {};
    image2 = { image : image  , width:50};

    let logo = {};
    if (formValue.showLogo){
      logo = { image: this.logoData, width: 50};
    }

    // test mock up doc definition to roubleshhot
   // playground requires you to assign document definition to a variable called dd

var dd = {
  watermark: {text: 'LabCPD', color: 'blue', opacity: 0.2, bold: true},
 
	content: [
    

    // QR code
    //{ qr : 'text in QR', fit : '500'},
  
   
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
}
