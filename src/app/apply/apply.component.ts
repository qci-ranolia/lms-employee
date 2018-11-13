import { Component, OnInit, OnDestroy } from "@angular/core"
import { LmsService } from "../lms.service"
import { ApiService } from "../api.service"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { MatDatepickerInputEvent } from "@angular/material/datepicker"
import * as moment from "moment"
import { MatSnackBar } from '@angular/material'
declare var $

@Component({
  selector: "app-apply",
  templateUrl: "./apply.component.html",
  styleUrls: ["./apply.component.scss"]
})

export class ApplyComponent implements OnInit, OnDestroy {
  
  firstFormGroup: FormGroup; secondFormGroup: FormGroup
  minDate = new Date(); minDate2 = new Date()
  isLinear: boolean = true; loader: boolean = false; isFirstDateSelected: boolean = true; zeroHolidays: boolean = false
  condition: boolean = false; dis: any = false; isHalfDay: boolean = false
  disabled: boolean = true; showHalfDay: boolean = false
  selectedValue: string  
  getDate2: any; fDate: any; sDate: any; today: any; leavedays: any; selected: any; tDate:any; test:any
  firstDate: any; secondDate: any; sundays: any; sundaySaturday:any; dayList: any
  date: any; month: any; year: any; getDate: any; leave_type: any; leave_reason: any
  ifLAL: any; toggleHalf: any; 
  compulsory: any = []; restricted: any = []; compulsoryDates: any = []; restrictedDates: any = []; rdm : any = []; cdm : any = []; applyLeave = new Array(); employee = new Array(); holidays: any = new Array(); leave = new Array()
  unsubLoader: any; unsubGetEmployee: any; unsubGetHoliday: any; unsubMyLeaves: any

  snackBars(message:string,action:string){
    this.snackBar.open(message, action,{
      duration: 3000,
    })
  }

  constructor(public snackBar: MatSnackBar, private api: ApiService, private lms: LmsService, private _formBuilder: FormBuilder) {
    this.unsubLoader = this.lms.emitsload.subscribe(el => (this.loader = el))
    this.lms.showLoader()

    this.unsubGetEmployee = this.api.emitgetEmployee.subscribe(r => {
      this.employee = r
    })
    this.unsubMyLeaves = this.api.emitMyLeaves.subscribe(r => (this.leave = r))
    this.unsubGetHoliday = this.api.emitgetHoliday.subscribe(el => {
      if (el == "Holidays are not updated") this.zeroHolidays = true
      else {
        this.zeroHolidays = false
        setTimeout(() => {
          for (let i = 0; i < el.length; i++) {
            if (i >= el.length - 2) {
              JSON.parse(el[i].data).map(r => {
                if (r.RestrictedHoliday) this.restricted.push(r)
                if (r.CompulsoryHoliday) this.compulsory.push(r)
                this.holidays.push(r)
              })
            }
          }
          this.compulsory.map(e => this.compulsoryDates.push(e["Date"]))
          this.restricted.map(e => this.restrictedDates.push(e["Date"]))
          let d = this.tDate,
            m = this.month
          if (d < 10) this.date = "0" + d
          else this.date = d
          if (m < 9) m++ && (this.month = "0" + m)
          else m++ && (this.month = m)
          this.today = String(this.date + "/" + this.month + "/" + this.year)
          this.holidays.push({ Today: "Today", Date: this.today })
          this.holidays.sort((a, b) => {
            (a = a.Date.split("/").reverse().join("")), (b = b.Date.split("/").reverse().join(""))
            return a > b ? 1 : a < b ? -1 : 0
          })
        }, 350)
      }
    })
  }
  ngOnInit() {
    this.tDate = this.minDate.getDate() // Get date
    this.month = this.minDate.getMonth() // Now get month
    this.year = this.minDate.getFullYear() // Now get year

    this.api.myLeaves()
    this.api.getHoliday()
    this.firstFormGroup = this._formBuilder.group({
      check1: ["", Validators.required],
      check2: ["", Validators.required]
    })
    this.secondFormGroup = this._formBuilder.group({
      check3: ["", Validators.required],
      check4: ["", Validators.required]
    })
    this.api.getEmployee()
  }
  firstDateEvent(event: MatDatepickerInputEvent<Date>) {
    this.date = event.value.getDate() // Get date
    this.month = event.value.getMonth() // Now get month
    this.year = event.value.getFullYear() // Now get year
    this.letDateConditions()
    this.firstDate = this.getDate // for moment js
    this.fDate = this.getDate2 // for server
    
    // enable second datepicker
    this.isFirstDateSelected = false
    // Calculate on the basis of second datepicker if already selected || !selected
    if (this.sDate) this.countSundays()

    // datpicker will not let user to select previous dates
    this.minDate2 = this.firstDate
  }
  secondDateEvent(event: MatDatepickerInputEvent<Date>) {
    this.date = event.value.getDate() // Get date
    this.month = event.value.getMonth() // Now get month
    this.year = event.value.getFullYear() // Now get year
    this.letDateConditions()
    this.secondDate = this.getDate // for moment js
    this.sDate = this.getDate2 // for server
    this.countSundays()
  }
  letDateConditions() {
    let d: number = this.date, m = this.month
    if (d < 10) this.date = "0" + d
    else this.date = d
    if (m < 9) m++ && (this.month = "0" + m)
    else m++ && (this.month = m)

    // just some bad codes. Optimising.................../.
    this.getDate = String(this.year + "-" + this.month + "-" + this.date)
    this.getDate2 = String(this.date + "/" + this.month + "/" + this.year)
    
    // check if already a compulsory holiday
    this.compulsoryDates.filter(k => {
      if (this.getDate2.indexOf(k) == 0) this.snackBars("Note:", "Already a holiday")
    })
    // check if already a restricted holiday
    this.restrictedDates.filter(l => {
      if (this.getDate2.indexOf(l) == 0) this.snackBars("Note:", "Its a restricted holiday")
    })
    // check if leave dates are already in the current applications of the employee
    // for loop to create a temp array of all dates
    for (let i = 0; i < this.leave.length; i++) {
      if (this.leave[i].leave_status !== "Rejected") {
        // Convert applied date_from in the format DD/MM/YYYY for momentJS for the leave application's
        var x = this.leave[i].date_from.split("/"), y = x[1] + '/' + x[0] + '/' + x[2],
          f = moment(y), s = this.leave[i].date_to,
          arr = []
        while (f.format("DD/MM/YYYY") < s) {
          arr.push(f.format("DD/MM/YYYY"))
          f.add(1, 'day')
        }
        // All the date array[temp array] of particular application 
        arr.push(s)
        arr.filter(k => {
          // is selected date already in the applied application/s list, if index == 0 :=> we found the selected date in already applied application/s(pending,rejected&approved) dates
          if ( this.getDate2.indexOf(k) == 0 ) this.snackBars( "Note:", "Your one of previous application has same date" )
        })
      } // else console.log(this.leave[i].leave_status) // Rejected. Right ??
    }
  }
  // echo 65536 | sudo tee -a /proc/sys/fs/inotify/max user watches
  countSundays() {
    // As well anything you can do with dates
    
    // Calculate sundays/saturday between two days using Moment JS
    var f = moment(this.firstDate), s = moment(this.secondDate),
      sunday = 0,
      r = [], c = f.clone(),
      temp = []
    // calculate leave days list
    // Find all dates between two dates and push them in an array
    while ( f < s ) {
      temp.push(f.format("DD/MM/YYYY"))
      f.add(1, "day")
    }
    temp.push(s.format("DD/MM/YYYY"))
    this.dayList = temp
    
    // After running while(f<s) loop, reset firstdate to initial. Comment next line to see the effect
    f = moment(this.fDate)
    
    // Find all sunday/'s
    while (c.day(7 + sunday).isBefore(s)) r.push(c.clone())
    this.sundays = r
    if ( !( this.ifLAL == undefined ) ){
      this.ifLeavesAreLess(this.ifLAL)
      if (this.ifLAL == 'cl' && this.isHalfDay) this.leavedays -= 0.5
    }
  }
  disableSunDay = (d: Date): boolean => {
    const day = d.getDay()
    return day !== 0 && day !== 6 // comment if saturday is not disabled
  }
  ifLeavesAreLess(item) {
    this.ifLAL = item
    this.sundaySaturday = this.sundays.length
    var a = Object.keys(this.employee),
      b = Object.values(this.employee) 
    // More functionality added here, not the right name of a function ;-p
    // Calculate leavedays, removing sundays & saturdays total count
    let td: number = moment(this.secondDate).diff(moment(this.firstDate), "days")
    if ( item == "cl" ){
      this.leavedays = 0 // reset leaves
      this.leavedays = 1 + td // just count total days
      for ( let i = 0; i < this.dayList.length; i++ ){
        // see if compulsory holiday is there ?? 
        this.compulsoryDates.filter(k => {  
          if (this.dayList[i].indexOf(k) == 0) {
            this.cdm.push(this.dayList[i])
            this.leavedays -= this.cdm.length
            this.cdm.length = 0
          }
        })
        // see if restricted holiday is there ??
        this.restrictedDates.filter(l => {
          if (this.dayList[i].indexOf(l) == 0) {
            this.rdm.push(this.dayList[i])
            this.leavedays -= this.rdm.length
            this.rdm.length = 0
          }
        })      
      }
      // subtract saturdays and sundays
      this.leavedays -= this.sundaySaturday*2
      this.sundaySaturday = 0 // reset
      // Half day concept
      this.disabled = false
      this.showHalfDay = true // show half day option
      if (this.condition){
        this.leavedays -= 0.5
        this.condition = false
      }
      // Warn user for not taking more than 5 leaves
      if ( this.leavedays > 5 ) this.api.snackBars("Note:", "Casual leaves must be less than 5")
    }
    else if ( item == "sl" || item == "pl" || item == "eol" || item == "ml" || item == "ptl" ||  item == "rh" ||  item == "od" ) {
      this.leavedays = 0
      this.leavedays = 1 + td
      this.disabled = true
      this.showHalfDay = false // hide half day option
      this.condition = true
    }
    for (let i = 0; i < a.length; i++) {
      if (item == a[i] && item !== 'od') {
        if (this.leavedays > b[i].bal) {
          this.api.snackBars("Note:", "Total applied days are less than your balance leave")
          this.dis = true
        } else this.dis = false
      }
    }
    if ( this.leavedays < 1 ) {
      this.dis = true      
      this.leavedays = 0
      this.api.snackBars("Note:", "'Date from' can not preeced 'Date to'")
    }
    // else this.dis = false
  }
  halfDay() {
    if ( this.ifLAL == 'cl' && !this.isHalfDay ){
      this.leavedays -= 0.5
    } else if (this.ifLAL == 'cl' && this.isHalfDay){
      if (!this.condition) this.leavedays += 0.5
    }
  }
  Applyleave(stepper) {
    var temp = localStorage.getItem("userName"), tmp: any
    tmp = {
      qci_id: temp,
      date_of_apply: this.today,
      days:this.leavedays,
      date_from: this.fDate,
      date_to:this.sDate,
      day_list:this.dayList,
      leave_reason: this.leave_reason,
      leave_type: this.leave_type
    }
    this.applyLeave.push(tmp)
    console.log(tmp)
    // this.api.applyLeave(tmp, stepper)
  }
  ngOnDestroy() {
    this.unsubLoader.unsubscribe()
    this.unsubGetEmployee.unsubscribe()
    this.unsubGetHoliday.unsubscribe()
    this.unsubMyLeaves.unsubscribe()
  }

}