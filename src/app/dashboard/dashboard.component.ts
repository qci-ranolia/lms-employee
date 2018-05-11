import { Component, OnInit } from '@angular/core'
import { LmsService } from '../lms.service'
// import * as moment from 'moment'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  
  // public momentDate = moment()
  // public daysArr
  
  employee = new Object()
  
  constructor( private lms: LmsService ) {
    this.lms.emitgetEmployees.subscribe( r => {
      this.employee = r
    })
  }
  
  public ngOnInit() {
    this.lms.getEmployees()
    // this.daysArr = this.createCalendar( this.momentDate )
  }
  

  // public todayCheck(day){
  //   if ( !day ) {
  //     return false
  //   }
  //   return moment().format( "L" ) === day.format 
  // }

  // public createCalendar( month ) {
  //   let firstDay = moment(month).startOf( "M" )
  //   let days = Array.apply( null, { length: month.daysInMonth() } )
  //     .map( Number.call, Number )
  //     .map ( (n) => {
  //       return moment(firstDay).add( n, 'd' )
  //     })
  //     return days
  // }

  // public nextMonth() {
  //   this.momentDate.add(1, 'M' )
  //   this.daysArr = this.createCalendar( this.momentDate )
  // }

  // public previousMonth() {
  //   this.momentDate.subtract( 1, 'M' )
  //   this.daysArr = this.createCalendar( this.momentDate )
  // }
  
}
