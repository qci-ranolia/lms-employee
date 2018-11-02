import { EventEmitter, Component, OnInit, Inject, OnDestroy } from '@angular/core'
import { MatDatepickerInputEvent } from "@angular/material/datepicker"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { MatDialogRef, MatSnackBar } from '@angular/material'
import { MAT_DIALOG_DATA } from '@angular/material'
import { DialogData } from '../dashboard.component'
import { ApiService } from '../../api.service'
import { LmsService } from '../../lms.service'
import { DatePipe } from '@angular/common'
import * as moment from 'moment'


@Component({
  selector: 'app-appinfo',
  templateUrl: './appinfo.component.html',
  styleUrls: ['./appinfo.component.scss']
})
export class AppinfoComponent implements OnInit, OnDestroy {
  public dialogData: DialogData
  public dD: any = new Array()
  proBar: boolean = false
  event = new EventEmitter<any>()

  // from employee section starts 
  applyLeave = new Array(); employee = new Array(); leave_type: any; leave_reason: any

  isLinear = true
  firstFormGroup: FormGroup
  secondFormGroup: FormGroup

  selectedValue: string
  // showUs = false
  loader: boolean = false; isFirstDateSelected: boolean = true; zeroHolidays: boolean = false

  firstDate: any; secondDate: any; dayList: any; sundays: any; extraDays:any

  date: any; month: any; year: any
  getDate: any; getDate2: any
  fDate: any; sDate: any; today: any
  leavedays: any; selected: any
  minDate = new Date(); minDate2 = new Date()

  ifLAL: any; compulsory: any = []; holidays: any = new Array()

  unsubLoader: any; unsubGetEmployee: any; unsubGetHoliday: any; unsubMyLeaves: any
  leave = new Array()
  dis: any = false
  isHalfDay: any = false
  disabled: any = true
  showHalfDay: any = false
  sundaySaturday:any
  condition:any
  totalLeave = new Array
  unsubTotalLeaves: any

  snackBars(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3900,
    })
  }
  // from employee section ends 
  qci_id: any
  reason_for_change: any

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public datepipe: DatePipe,
    public dialogRef: MatDialogRef<AppinfoComponent>,
    public lms: LmsService,
    private api: ApiService,
    public snackBar: MatSnackBar,
    private _formBuilder: FormBuilder) {
    /*From employee starts*/
    this.unsubGetEmployee = this.api.emitgetEmployee.subscribe(r => {
      this.employee = r
    }) // getEmployees()
    this.unsubMyLeaves = this.api.emitMyLeaves.subscribe(r => (this.leave = r))
    this.unsubGetHoliday = this.api.emitgetHoliday.subscribe(el => {
      if ( el == "Holidays are not updated" ) this.zeroHolidays = true
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
          let d = this.date,
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
    /*From employee ends*/
    this.unsubTotalLeaves = this.api.emitTotalLeave.subscribe(r => {
      this.totalLeave = r[0]
    })
  }

  ngOnInit() {this.dialogData = this.data
    this.qci_id = localStorage.getItem('qci_id')
    this.api.myLeaves()
    // this.api.getEmployee(this.qci_id)
    // this.api.tleave()
    
    /*from employee starts*/
    this.api.getHoliday()
    this.firstFormGroup = this._formBuilder.group({
      check1: ["", Validators.required],
      check2: ["", Validators.required]
    })
    this.secondFormGroup = this._formBuilder.group({
      check3: ["", Validators.required],
      check4: ["", Validators.required]
    })
    /*from employee close*/
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
    if ( item == "cl" ){
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
    else if ( item == "sl" || item == "pl" || item == "eol" || item == "ml" || item == "ptl" )
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
  modify() {
    var temp = localStorage.getItem("userName"),
      tmp: any
    tmp = {
      days: this.leavedays,
      date_from: this.fDate,
      date_to: this.sDate,
      leave_reason: this.reason_for_change,
      leave_type: this.leave_type
    }
    this.proBar = true
    /* this.api.leaveModified(tmp) */
    setTimeout(() => {
      this.proBar = false
    }, 2000)
  }
  // accept leave application
  acceptApp( app_id, qci_id ) {
    let date = new Date(),
      latest_date = this.datepipe.transform(date, 'dd/MM/yyyy'),
      tmp = { application_id: app_id }
      // , qci_id: qci_id
      // , date_reviewed: latest_date
    this.proBar = true
    this.api.leaveForApproval(tmp)
    setTimeout(() => {
      this.proBar = false
    }, 2000)
  }
  
  // decline leave application
  declineApp( dec_reason, app_ids, leave_type ) {
    let date = moment().format("DD/MM/YYYY")
    let tmp = { application_id:app_ids, decline_reason: dec_reason }
    // , leave_type:leave_type 
    // date_reviewed:date,
    this.proBar = true
    if ( !dec_reason ) alert('kindly fill the reason to decline.')
    else this.api.declineLeave(tmp)
    setTimeout(() => {
      this.proBar = false
    }, 2000) 
  }

  ngOnDestroy() {
    this.unsubGetEmployee.unsubscribe()
    this.unsubGetHoliday.unsubscribe()
    this.unsubMyLeaves.unsubscribe()
    localStorage.removeItem('qci_id')
  }

}
