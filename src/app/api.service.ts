import { Http, Headers, RequestOptions } from '@angular/http'
import { MatSnackBar, MatStepper } from '@angular/material' // remove from lms service after all promise< resolve,reject> successfully implemented here
import { EventEmitter, Injectable } from '@angular/core'
import { Router } from '@angular/router'
import 'rxjs/add/operator/map'

@Injectable()
export class ApiService {
  URL: string = "http://13.127.13.175:5000/"
  // URL: string = "http://192.168.15.219:5000/"

  token: string // Useful in Authentication
  headers: Headers // Useful when backend and frontend have different IP's
  opts: any
  uid: any
  
  emitgetHoliday = new EventEmitter<any>()
  emitgetEmployee = new EventEmitter<any>()
  emitLogin = new EventEmitter<any>()
  emitMyLeaves = new EventEmitter<any>()
  emitMyZero = new EventEmitter<any>()
  emitTotalLeave = new EventEmitter<any>()
  emitgetEmpCSV = new EventEmitter<any>()
  
  emitInputOthers = new EventEmitter<any>()
  emitInputOwn = new EventEmitter<any>()
  emitApprovedOthers = new EventEmitter<any>()
  emitApprovedOwn = new EventEmitter<any>()
  emitCancelledOthers = new EventEmitter<any>()
  emitCancelledOwn = new EventEmitter<any>()

  // emitZeroEOL = new EventEmitter<any>()
  // emitEOL = new EventEmitter<any>()
  // emitApprovedApplication = new EventEmitter<any>()
  // emitCancelledApplication = new EventEmitter<any>()
  
  emitMyApplication = new EventEmitter<any>()

  constructor( public snackBar: MatSnackBar, private http: Http, private router: Router ){ //, private router:Router // we will use both imports here. Are we using anywhere in comments only ???
    this.uid = localStorage.getItem('userName')
    this.token = localStorage.getItem('token') // If this token available, login using can activate gaurd 
    this.headers = new Headers() // Default headers
    this.headers.append('Authorization', this.token) // ADD/Append your authorized token to Default headers
    this.opts = new RequestOptions() // how to check if front end have issue or backend, without even using postman!! Am i correct ?
    this.opts.headers = this.headers
  }
  snackBars( message:string, action:string ){
    this.snackBar.open(message, action, {
      duration:2600,
    })
  }
  isLogin() {
    if (localStorage.getItem('token')) {
      this.router.navigate(['./'])
    }
  }
  login(uname: string, pwd: string) {
    this.uid = uname
    let tmp: any
    tmp = { qci_id: uname, password: pwd }
    let data = JSON.stringify(tmp)
    return new Promise((resolve) => {
      this.http.post(this.URL + 'lms/loginEmp', data)
      .map(res => res.json())
      
      .subscribe(response => {
        if (response.success) {
          localStorage.setItem('token', response.token)
          this.emitLogin.emit()
        } else this.snackBars(response.message, response.success)
        resolve(true)
      }, err => this.router.navigate(['/404']))
    })
  }
  noDeclineReason() {
    this.snackBars("Note:", "Kindly fill reason to cancel")
  }
  applyLeave(data: any, stepper: MatStepper) {
    return new Promise((resolve) => {
      this.http.post(this.URL + 'lms/applyLeave', data, this.opts)
      .map(res => res.json())
      .subscribe(response => {
        if (response.success) {
          this.emitMyLeaves.emit(response)
          this.router.navigate(['/dashboard'])
        }
        else if ( response == 'Wrong Token' ){
            setTimeout(() => {
                this.router.navigate(['/'])
            }, 400 )
        } else stepper.next()
        resolve(true)
      }, err => this.router.navigate(['/404']))
    })
  }
  // HINT : Are we checking the response is a success or not ???
  getEmployee() {
    return new Promise((resolve) => {
      this.http.get(this.URL + 'lms/addEmployee/' + this.uid, this.opts)//lms/addEmployee/
      .map(res => res.json())
      .subscribe(response => {
        if (response.success) this.emitgetEmployee.emit(response.data)
        else if ( response == 'Wrong Token' ){
          setTimeout(() => {
              this.router.navigate(['/'])
          }, 400 )
        } else this.snackBars('add employee', 'Try again')
        resolve(true)
      }, err => this.router.navigate(['/404']))
    })
  }
  // Get QCI Employee from CSV
  getEmployeeCSV() {
    return new Promise((resolve) => {
      this.http.get(this.URL + 'lms/upload', this.opts)// lms/addPEmp
      .map(res => res.json())
      .subscribe(response => {
        if (response.success) {
          if (response.message.length == 0) console.log("No employee file uploaded yet!")
          else this.emitgetEmpCSV.emit(response.message)
        }
        else if ( response == 'Wrong Token' ){
          setTimeout(() => {
              this.router.navigate(['/'])
          }, 400 )
        } else this.snackBars("csv", 'Try Again')
        resolve(true)
      }, err => this.router.navigate(['/404']))
    })
  }
  myLeaves() {
    return new Promise((resolve) => {
      this.http.get(this.URL + 'lms/applyLeave/' + this.uid, this.opts)
      .map(res => res.json())
      .subscribe(response => {
        if (response.success) this.emitMyLeaves.emit(response.data)
        else if ( response == 'Wrong Token' ){
          setTimeout(() => {
              this.router.navigate(['/'])
          }, 400 )
        } else {
          if (response.messages == 'No application available currently') this.emitMyZero.emit(response)
          else this.snackBars("apply leave", "Try Again")
        }
        resolve(true)
      }, err => this.router.navigate(['/404']))
    })
  }
  // Get QCI Calendar
  getHoliday() {
    return new Promise((resolve) => {
      this.http.get(this.URL + 'lms/holiday', this.opts)
      .map(res => res.json())
      .subscribe(response => {
        if (response.success) {
          if (response.result.length == 0) this.emitgetHoliday.emit("Holidays are not updated")
          else this.emitgetHoliday.emit(response.result)
        }
        else if ( response == 'Wrong Token' ){
          setTimeout(() => {
              this.router.navigate(['/'])
          }, 400 )
        } else this.snackBars("holiday", "try again")
        resolve(true)
      }, err => this.router.navigate(['/404']))
    })
  }
  // Filter team application's
  // Get Employee_on_leave
  getEOL() {
    return new Promise((resolve) => {
      this.http.get(this.URL + 'lms/input', this.opts)
      .map(res => res.json())
      .subscribe(response => {
        if (response.success) {
          this.emitInputOthers.emit(response.data_others)
          this.emitInputOwn.emit(response.data_own)
        }else if ( response == 'Wrong Token' ){
          setTimeout(() => {
              this.router.navigate(['/'])
          }, 400 )
        } else this.snackBars("Input", response.success)
        resolve(true)
      }, err => this.router.navigate(['/404']))
    })
  }
  // Get approved employee list on leaves
  approvedLeave() {
    return new Promise((resolve) => {
      this.http.get(this.URL + 'lms/output1', this.opts)
      .map(res => res.json())
      .subscribe(response => {
        if (response.success) {
          this.emitApprovedOthers.emit(response.data_others)
          this.emitApprovedOwn.emit(response.data_own)
          // this.emitApprovedApplication.emit(response.data)
        }else if ( response == 'Wrong Token' ){
          setTimeout(() => {
              this.router.navigate(['/'])
          }, 400 )
        } else this.snackBars("Output1", response.success)
        resolve(true)
      }, err => this.router.navigate(['/404']))
    })
  }
  // Get cancelled/rejected leave of employee's
  cancelledLeave() {
    return new Promise((resolve) => {
      this.http.get(this.URL + 'lms/output2', this.opts)
      .map(res => res.json())
      .subscribe(response => {
        if (response.success) {
          this.emitCancelledOthers.emit(response.data_others)
          this.emitCancelledOwn.emit(response.data_own)
          // this.emitCancelledApplication.emit(response.data)
        } else if ( response == 'Wrong Token' ){
          setTimeout(() => {
              this.router.navigate(['/'])
          }, 400 )
        } else this.snackBars("Output2", response.success)
        resolve(true)
      }, err => this.router.navigate(['/404']))
    })
  }
  // post employee application for approval
  // acceptApp( app_id, qci_id ){}
  leaveForApproval(data: any) {
    return new Promise((resolve) => {
      this.http.post(this.URL + 'lms/approveLeave', data, this.opts)
      .map(res => res.json())
      .subscribe(response => {
        if (response.success) {
          this.emitMyApplication.emit(response)
          this.snackBars("Application approved", "Successfully")
          // does not refresh after response
        } else if ( response == 'Wrong Token' ){
          setTimeout(() => {
              this.router.navigate(['/'])
          }, 400 )
        } else this.snackBars("Approve Leave", response.success)
        resolve(true)
      }, err => this.router.navigate(['/404']))
    })
  }
  // Post decline leave of employee's
  declineLeave(data: any) {
    return new Promise((resolve) => {
      this.http.post(this.URL + 'lms/declineLeave', data, this.opts)
      .map(res => res.json())
      .subscribe(response => {
        if (response.success) {
          this.emitMyApplication.emit(response)
          this.snackBars("Application declined", "Successfully")
        } else if ( response == 'Wrong Token' ){
          setTimeout(() => {
              this.router.navigate(['/'])
          }, 400 )
        } else this.snackBars("Decline Leave", response.success)
        resolve(true)
      }, err => this.router.navigate(['/404']))
    })
  }
}