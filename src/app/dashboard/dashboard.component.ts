import { Component, OnInit } from '@angular/core'
import { LmsService } from '../lms.service'
// import * as moment from 'moment'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  loader : boolean = false
  
  // public momentDate = moment()
  // public daysArr

  hide : boolean = true
  employee = new Array()
  leave = new Array()
  myLeaveStatus : any
  
  constructor( private lms: LmsService ) {
    this.lms.emitsload.subscribe( el => this.loader = el )
    this.lms.showLoader()
    
    this.lms.emitgetEmployees.subscribe( r => this.employee = r )
    this.lms.emitMyZero.subscribe( r => {
      this.hide = false
      //console.log(this.hide)
    })
    this.lms.emitMyLeaves.subscribe( r => {
      this.leave = r 
      console.log(this.leave)
    })
  }
  
  public ngOnInit() {
    this.lms.getEmployees()
    this.lms.myLeaves()
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
