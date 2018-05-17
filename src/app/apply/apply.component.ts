import { Component, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
import { LmsService } from '../lms.service'
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import * as moment from 'moment'

@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss']
})

export class ApplyComponent implements OnInit {
  
  selectedValue : string
  showUs = false
  loader : boolean = false
  
  firstDate : any
  secondDate : any // string[] = []
  // result : any
  date : any
  month : any
  year : any

  // leaves = [
  //   { value: 'bal_cl', tol: 'Casual Leave', bal:'10' },
  //   { value: 'bal_sl', tol: 'Sick Leave', bal:'10' },
  //   { value: 'bal_pl', tol: 'Privileged Leave', bal:'10' },
  //   { value: 'bal_eol', tol: 'Extra Ordinary Leave', bal:'10' },
  //   { value: 'bal_ptl', tol: 'Materinity Leave', bal:'10' },
  //   { value: 'bal_mtl', tol: 'Paterinity Leave', bal:'10' }
  // ]
  constructor(private lms:LmsService){
    this.lms.emitsload.subscribe( el => this.loader = el )
    this.lms.showLoader()
  }

  ngOnInit(){}

  firstDateEvent( event: MatDatepickerInputEvent<Date>) {
    // get date
    let date = event.value.getDate()
    let d = date
    if ( d < 10 ){
      this.date = '0' + d
      // this.date
    } else this.date = d
    // now get month
    let month = event.value.getMonth()
    let m = month
    if ( m < 10 ) {
      m++
      this.month = '0' + m
      this.month
    } else {
      m++
      this.month = m
    }
    // now get year 
    let year = event.value.getFullYear()
    this.year = year
    
    // get fulldate
    let fulldate = String( this.year+'-'+this.month+'-'+this.date ) 
    this.firstDate = fulldate
  }

  secondDateEvent( event: MatDatepickerInputEvent<Date> ) {
    // get date
    let date = event.value.getDate()
    let d = date
    if ( d < 10 ){
      this.date = '0' + d
      this.date
    } else this.date = d
    
    // now get month
    let month = event.value.getMonth()
    let m = month
    if ( m < 10 ) {
      m++
      this.month = '0' + m
      this.month
    } else {
      m++
      this.month = m
    }
    // now get year 
    let year = event.value.getFullYear()
    this.year = year
    
    // get fulldate
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
    console.log(result.map( m => m ).length )


    // if ( frstmonth  > scndmonth ){
    //   //
    // } else {
    //   //
    // }


    // if ( frstDate  > scndDate ){
    //   //
    // } else {
    //   //
    // }
    
  }

  disableSunDay = ( d: Date ) : boolean => {
    const day = d.getDay()
    return day !== 0 // && day !== 6 // Uncomment if saturday is disabled too
  }

}
