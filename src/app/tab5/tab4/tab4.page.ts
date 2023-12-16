import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { cpdEvent } from '../services/interfaces';
import { ModalController } from '@ionic/angular';
import { DataService } from '../services/dataservice';

/*
this compnent to ADD or EDIT an event

FROM USER MANUAL AAPP THE HOME {AGE IS LOST AND 
HANDLS ADD / EDITING / DLETEING COMMAND AND DISPLAYING DATA IN A LIST
STUDENT MODAL DISPLAYS FORM FOR EDITINGA ND ADDING NEW CPD EVENT
SRUDENT SERVCE HANDLES BAKCEDN API CALLS */

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})

/* NOT USED- EventModal i services used instead!*/

export class Tab4Page implements OnInit {

  ngOnInit(): void {
      
  }


  // @Input() editEvent!: cpdEvent; // event sent form calling class, tabs3
  // isEdit = false; // convert to true if we are passed data to edit form calling class (list)

  // // CPD eveent properties
  // uploadEvent! : cpdEvent;

  // constructor(private modalCtrl : ModalController, private service : DataService) { }

  // ngOnInit() {
  //   /*
  //   If 'cpdEvent is not null it means a cpdEvent has been passed 
  //   from parnet class (List tab) for editing an event
  //   */
  //  if (this.editEvent){
  //   console.log("tab4 ADD passed event to edit form List: " + this.editEvent.title)
  //   this.isEdit = true;
  //   this.uploadEvent = this.editEvent;
  // }

  // }

  // onSubmit(form : NgForm) {
  //   console.log("Cpd event fomr submitted");
  //   const event = form.value;

  //   if (this.editEvent){

  //   }
  // }

  // addEvent(){

  // }
  // closeRecord(){}

}

