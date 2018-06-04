import { Component, OnInit } from '@angular/core'
import { LmsService } from '../lms.service'
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDatepickerInputEvent } from '@angular/material/datepicker'
import { MatStepperModule } from '@angular/material/stepper'
import * as moment from 'moment'
// import * as _ from "lodash"

@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss']
})

export class ApplyComponent implements OnInit {
  applyLeave = new Array()
  leave_type : any
  leave_reason : any
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
  
  getDate2 : any
  fDate : any
  sDate : any
  today : any
  leavedays : any  
  selected : any
  minDate = new Date()
  minDate2 = new Date()
  
  constructor( private lms:LmsService, private _formBuilder: FormBuilder){    
    this.lms.emitsload.subscribe( el => this.loader = el )
    this.lms.showLoader()
    this.lms.emitgetEmployees.subscribe( r => {
      this.employee = r
      // console.log(this.employee)
    })
  }
  
  ngOnInit(){
    this.firstFormGroup = this._formBuilder.group({
      check1 : [ '', Validators.required ],
      check2 : [ '', Validators.required ]
    })
    this.secondFormGroup = this._formBuilder.group({
      check3: [ '', Validators.required ],
      check4: [ '', Validators.required ]
    })
    this.lms.getEmployees()
  }
  
  firstDateEvent( event: MatDatepickerInputEvent<Date> ){
    this.date = event.value.getDate() // Get date
    this.month = event.value.getMonth() // Now get month
    this.year = event.value.getFullYear() // Now get year 
    this.letDateCondition()
    // Get fulldate
    this.firstDate = this.getDate
    this.fDate = this.getDate2
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
    this.sDate = this.getDate2
    this.countSundays()
  }
  letDateCondition(){
    let d = this.date
    if ( d < 10 ) {
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
    var temp = String( this.date+'/'+this.month+'/'+this.year )
    this.getDate = getDate
    this.getDate2 = temp
    this.today = temp
  }
  countSundays(){
    // Calculate sundays between two days using Moment JS
    var f = moment( this.firstDate ),
    s = moment( this.secondDate ),
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
    var a = "bal_"+item,
    b = Object.keys(this.employee),
    c = Object.values(this.employee)
    // console.log(b.length)
    for ( let i = 0; i < b.length; i++ ) {
      if ( a == b[i] ) {
        if ( this.leavedays > c[i] ) this.lms.snackBars( "Alert", "Total applied days are less than your balance leaves" )
      }
    }
  }
  Applyleave( stepper ) {
    this.date = this.minDate.getDate() // Get date
    this.month = this.minDate.getMonth() // Now get month
    this.year = this.minDate.getFullYear() // Now get year 
    this.letDateCondition()
    var temp = localStorage.getItem('userName'),
    tmp : any;
    tmp = {
      qci_id  : temp,
      date_of_apply : this.today,
      days  : this.leavedays,
      date_from : this.fDate,
      date_to : this.sDate,
      leave_reason  : this.leave_reason,
      leave_type  : this.leave_type
    }
    this.applyLeave.push( tmp )
    // console.log(stepper)
    // console.log(tmp)
    console.log(this.today)
    this.lms.applyleave( tmp, stepper )
  }
  
}
