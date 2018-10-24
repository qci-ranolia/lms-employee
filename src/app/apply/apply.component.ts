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
  applyLeave = new Array()
  leave_type: any
  leave_reason: any
  employee = new Array()

  isLinear = true
  firstFormGroup: FormGroup
  secondFormGroup: FormGroup

  selectedValue: string
  // showUs = false
  loader: boolean = false
  isFirstDateSelected: boolean = true
  zeroHolidays: boolean = false

  firstDate: any
  secondDate: any
  sundays: any
  sundaySaturday:any
  dayList: any
  condition: boolean = false
  
  date: any
  month: any
  year: any
  getDate: any

  getDate2: any
  fDate: any
  sDate: any
  today: any
  leavedays: any
  selected: any
  minDate = new Date()
  minDate2 = new Date()

  ifLAL: any
  compulsory: any = []
  holidays: any = new Array()

  unsubLoader: any
  unsubGetEmployee: any
  unsubGetHoliday: any
  unsubMyLeaves: any

  leave = new Array()
  dis: any = false
  isHalfDay: any = false
  disabled: any = true
  showHalfDay: any = false

  tDate:any

  test:any

  snackBars( message: string, action: string ){
    this.snackBar.open(message, action,{
      duration: 3000,
    })
  }

  constructor(public snackBar: MatSnackBar, private api: ApiService, private lms: LmsService, private _formBuilder: FormBuilder) {
    this.unsubLoader = this.lms.emitsload.subscribe(el => (this.loader = el))
    this.lms.showLoader()

    this.unsubGetEmployee = this.api.emitgetEmployee.subscribe(r => {
      this.employee = r
    }) // getEmployees()
    this.unsubMyLeaves = this.api.emitMyLeaves.subscribe(r => (this.leave = r))
    this.unsubGetHoliday = this.api.emitgetHoliday.subscribe(el => {
      if (el == "Holidays are not updated") this.zeroHolidays = true
      else {
        this.zeroHolidays = false
        setTimeout(() => {
          for (let i = 0; i < el.length; i++) {
            if (i >= el.length - 2) {
              JSON.parse(el[i].data).map(r => {
                if (r.CompulsoryHoliday) this.compulsory.push(r)
                this.holidays.push(r)
              })
            }
          }
          let d = this.tDate,
            m = this.month
          if (d < 10) this.date = "0" + d
          else this.date = d
          if (m < 9) m++ && (this.month = "0" + m)
          else m++ && (this.month = m)
          var today = String(this.date + "/" + this.month + "/" + this.year)
          this.holidays.push({ Today: "Today", Date: today })
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
    // Get fulldate
    this.firstDate = this.getDate
    this.fDate = this.getDate2
    // var a = this.getDate2
    let h: any = []
    this.compulsory.map(e => h.push(e["Date"]))
    // find if it is a holiday
    h.filter(k => {
      if (this.fDate.indexOf(k) == 0) this.snackBars("Note:", "Already a holiday")
    })
    // enable second datepicker
    this.isFirstDateSelected = false
    // Calculate on the basis of second datepicker if already selected || !selected
    if (this.secondDate) this.countSundays()
    else this.leavedays = 1
    this.minDate2 = this.firstDate
  }

  secondDateEvent(event: MatDatepickerInputEvent<Date>) {
    this.date = event.value.getDate() // Get date
    this.month = event.value.getMonth() // Now get month
    this.year = event.value.getFullYear() // Now get year
    this.letDateConditions()
    // Get fulldate
    this.secondDate = this.getDate
    this.sDate = this.getDate2
    // var a = this.getDate2
    let h: any = []
    this.compulsory.map(e => h.push(e["Date"]))
    // Find if it is a holiday
    h.filter(k => {
      if (this.sDate.indexOf(k) == 0) this.snackBars("Note:", "Already a holiday")
    })
    this.countSundays()
  }

  letDateConditions() {
    let d: number = this.date, m = this.month
    if (d < 10) this.date = "0" + d
    else this.date = d
    if (m < 9) m++ && (this.month = "0" + m)
    else m++ && (this.month = m)

    var getDate = String(this.year + "-" + this.month + "-" + this.date),
      temp = String(this.date + "/" + this.month + "/" + this.year)
    this.getDate = getDate
    this.getDate2 = temp
    this.today = temp
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
          if (this.getDate2.indexOf(k) == 0) this.snackBars("Note:", "Your one of previous application has same date")
        })
      } // else console.log(this.leave[i].leave_status) // Rejected. Right ??
    }
  }


  // echo 65536 | sudo tee -a /proc/sys/fs/inotify/max user watches
  countSundays() {
    // As well anything you can do with dates here
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
    this.dayList = temp
    // After running while(f<s) loop, reset firstdate to initial. Comment next line to see the effect
    f = moment(this.firstDate)
    // Find all sunday/'s
    while (c.day(7 + sunday).isBefore(s)) r.push(c.clone())
    this.sundays = r
    // Calculate leavedays, removing sundays & saturdays total count
    let td: number = s.diff(f, "days")
    this.leavedays = (1 + td) - (r.length * 2)
    if ( !( this.ifLAL == undefined ) ){
      this.ifLeavesAreLess(this.ifLAL)
    }
  }

  disableSunDay = (d: Date): boolean => {
    const day = d.getDay()
    return day !== 0 && day !== 6 // Uncomment if saturday is disabled too
  }

  ifLeavesAreLess(item) {
    this.ifLAL = item
    var a = "bal_" + item,
      b = Object.keys(this.employee),
      c = Object.values(this.employee)
      // JSON changed have to rework for this loop or change above variables
      // for (let i = 0; i < b.length; i++) {
      //   if (a == b[i])
      //     if (this.leavedays > c[i]) {
      //       this.api.snackBars("Note:", "Total applied days are less than your balance leave")
      //       this.dis = true
      //     } else {
      //       this.dis = false
      //     }
      // }
    // More functionality added here, not the right name of a function ;-p
    if ( item == "CL" ){
      if ( this.condition == true ){
        if ( this.showHalfDay == false && this.isHalfDay == true ) this.leavedays -= 0.5
        if ( this.sundaySaturday > 0 ) {
          this.condition = false
          this.leavedays -= this.sundaySaturday*2
          this.sundaySaturday == 0
        }
      }
      this.showHalfDay = true
      this.disabled = false
      if ( this.leavedays > 5 ) this.api.snackBars("Note:", "Casual leaves must be less than 5")
    }
    else if ( item == "SL" || item == "PL" || item == "EOL" || item == "ML" || item == "PTL" )
    {
      if ( this.showHalfDay == true && this.isHalfDay == true ) this.leavedays += 0.5
      if ( this.condition == false && this.sDate ){
        if ( this.sundays.length > 0 ) {
          this.condition = true
          this.sundaySaturday = this.sundays.length
          this.leavedays += this.sundaySaturday*2
        }
      }
      this.showHalfDay = false
    }
  }


  halfDay() {
    if ( this.leavedays || !this.disabled ){
      if ( !this.isHalfDay ) this.leavedays -= 0.5
      else this.leavedays += 0.5
    }
  }
  
  Applyleave(stepper) {
    this.date = this.minDate.getDate() // Get date
    this.month = this.minDate.getMonth() // Now get month
    this.year = this.minDate.getFullYear() // Now get year
    // this.letDateConditions()
    let d: number = this.date, m = this.month
    if (d < 10) this.date = "0" + d
    else this.date = d
    if (m < 9) m++ && (this.month = "0" + m)
    else m++ && (this.month = m)
    this.today = String(this.date + "/" + this.month + "/" + this.year)
    var temp = localStorage.getItem("userName"),
      tmp: any
    tmp = {
      ID_code: temp,
      date_of_apply: this.today,
      days: this.leavedays,
      date_from: this.fDate,
      date_to: this.sDate,
      day_list:this.dayList,
      leave_reason: this.leave_reason,
      leave_type: this.leave_type
    }
    this.applyLeave.push(tmp)
    this.api.applyLeave(tmp, stepper)
  }
  
  ngOnDestroy() {
    this.unsubLoader.unsubscribe()
    this.unsubGetEmployee.unsubscribe()
    this.unsubGetHoliday.unsubscribe()
    this.unsubMyLeaves.unsubscribe()
  }

}