import { Component, OnInit } from '@angular/core'
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { LmsService } from '../lms.service'
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment'
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss']
})

export class ApplyComponent implements OnInit {
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

  leavedays : any  
  leaves = [
    { value : 'bal_cl', tol : 'Casual Leave', bal : '10' },
    { value : 'bal_sl', tol : 'Sick Leave', bal : '10' },
    { value : 'bal_pl', tol : 'Privileged Leave', bal : '10' },
    { value : 'bal_eol', tol : 'Extra Ordinary Leave', bal : '10' },
    { value : 'bal_ptl', tol : 'Materinity Leave', bal : '10' },
    { value : 'bal_mtl', tol : 'Paterinity Leave', bal : '10' }
  ]

  minDate = new Date()
  constructor( private lms:LmsService, private _formBuilder: FormBuilder){
    this.lms.emitsload.subscribe( el => this.loader = el )
    this.lms.showLoader()
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
  }

  firstDateEvent( event: MatDatepickerInputEvent<Date> ){
    // Get date
    let date = event.value.getDate()
    let d = date
    if ( d < 10 ){
      this.date = '0' + d
    } else this.date = d

    // Now get month
    let month = event.value.getMonth()
    let m = month
    if ( m < 10 ) {
      m++
      this.month = '0' + m
    } else {
      m++
      this.month = m
    }
    
    // Now get year 
    let year = event.value.getFullYear()
    this.year = year
    
    // Get fulldate
    let fulldate = String( this.year+'-'+this.month+'-'+this.date ) 
    this.firstDate = fulldate
    this.isFirstDateSelected = false
    this.leavedays = 1
  }

  secondDateEvent( event: MatDatepickerInputEvent<Date> ) {
    // Get date
    let date = event.value.getDate()
    let d = date
    if ( d < 10 ){
      this.date = '0' + d
    } else this.date = d
    
    // Now get month
    let month = event.value.getMonth()
    let m = month
    if ( m < 10 ) {
      m++
      this.month = '0' + m
    } else {
      m++
      this.month = m
    }
    
    // Now get year 
    let year = event.value.getFullYear()
    this.year = year
    
    // Get fulldate
    let fulldate = String( this.year+'-'+this.month+'-'+this.date ) 
    this.secondDate = fulldate
    
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
    var totalDays = s.diff(f, 'days')
    this.leavedays =  1 + totalDays - result.map( m => m ).length
  
  }
  
  disableSunDay = ( d : Date ) : boolean => {
    const day = d.getDay()
    return day !== 0 // && day !== 6 // Uncomment if saturday is disabled too
  }

}
