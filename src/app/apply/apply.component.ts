import { Component, OnInit } from '@angular/core'
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms'

import { LmsService } from '../lms.service'

import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatStepperModule } from '@angular/material/stepper';

import * as moment from 'moment'
import * as _ from "lodash"

@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss']
})

export class ApplyComponent implements OnInit {
  applyLeave = new Array()
  employee = new Array()
  
  isLinear = true
  firstFormGroup : FormGroup
  secondFormGroup : FormGroup
  
  selectedValue : string
  showUs = false
  loader : boolean = false
  isFirstDateSelected : boolean = true

  firstDate : any
  secondDate : any // string[] = []
  // result : any

  date : any
  month : any
  year : any
  getDate : any

  leavedays : any  
  selected : any
  
  minDate = new Date()
  minDate2 = new Date()

  constructor( private lms:LmsService, private _formBuilder: FormBuilder){
    this.lms.emitsload.subscribe( el => this.loader = el )
    this.lms.showLoader()

    this.lms.emitgetEmployees.subscribe( r => {
      this.employee = r
    })
  }

  ngOnInit(){
    this.lms.getEmployees()
    this.firstFormGroup = this._formBuilder.group({
      check1 : [ '', Validators.required ],
      check2 : [ '', Validators.required ]
    })
    this.secondFormGroup = this._formBuilder.group({
      check3: [ '', Validators.required ],
      check4: [ '', Validators.required ]
    })
  }
  firstDateEvent( event: MatDatepickerInputEvent<Date> ){
    this.date = event.value.getDate() // Get date
    this.month = event.value.getMonth() // Now get month
    this.year = event.value.getFullYear() // Now get year 
    this.letDateCondition()
    // Get fulldate
    this.firstDate = this.getDate
    // enable second datepicker
    this.isFirstDateSelected = false
    // Calculate on the basis of second datepicker if already selected || !selected 
    if ( this.secondDate ){
      this.countSundays()
    } else this.leavedays = 1
    this.minDate2 = this.firstDate
  }
  secondDateEvent( event: MatDatepickerInputEvent<Date> ) {
    this.date = event.value.getDate() // Get date
    this.month = event.value.getMonth() // Now get month
    this.year = event.value.getFullYear() // Now get year 
    this.letDateCondition()
    // Get fulldate
    this.secondDate = this.getDate
    this.countSundays()
  }
  letDateCondition(){
    let d = this.date
    if ( d < 10 ){
      this.date = '0' + d
    } else this.date = d
    let m = this.month
    if ( m < 10 ) {
      m++
      this.month = '0' + m
    } else {
      m++
      this.month = m
    }
    var getDate = String( this.year+'-'+this.month+'-'+this.date )
    this.getDate = getDate
  }
  countSundays(){
    // Calculate sundays between two days using Moment JS
    var f = moment(this.firstDate),
    s = moment(this.secondDate),
    sunday = 0 // Sunday
    let result = []
    var current = f.clone()
    while ( current.day(7 + sunday).isBefore(s) ) {
      result.push( current.clone() )
    }
    // Calculate leavedays
    let totalDays = s.diff(f, 'days')
    let sundayCount = result.map( m => m ).length
    
    this.leavedays =  1 + totalDays - sundayCount
  }

  disableSunDay = ( d : Date ) : boolean => {
    const day = d.getDay()
    return day !== 0 // && day !== 6 // Uncomment if saturday is disabled too
  }
  ifLeavesAreLess( item ) {
    var as = Object.keys(this.employee)
    for ( let i = 0; i < as.length; i++ ) {
      if ( item = as[i] ) console.log(as[i])
      else console.log( as[i] )
    }
  }
  Applyleave(){
    // this.employee.push({'date_of_apply':this.minDate})
    console.log(this.applyLeave)
    // this.lms.applyleave(this.employee)
  }
}
