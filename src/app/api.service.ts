import { EventEmitter, Injectable } from '@angular/core'
import { Http, Headers, RequestOptions } from '@angular/http'
import { Router } from '@angular/router'
import 'rxjs/add/operator/map'
import { MatSnackBar } from '@angular/material' // remove from lms service after all promise< resolve,reject> successfully implemented here
import { MatStepper } from '@angular/material'

@Injectable()
export class ApiService {
  URL: string = "http://13.127.13.175:5000/"
  // URL: string = "http://192.168.15.55:5000/"
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

  constructor(public snackBar: MatSnackBar, private http: Http, private router: Router) { //, private router:Router // we will use both imports here. Are we using anywhere in comments only ???
    this.uid = localStorage.getItem('userName')
    this.token = localStorage.getItem('token') // If this token available, login using can activate gaurd 
    this.headers = new Headers() // Default headers
    this.headers.append('Authorization', this.token) // ADD/Append your authorized token to Default headers
    this.opts = new RequestOptions() // how to check if front end have issue or backend, without even using postman!! Am i correct ?
    this.opts.headers = this.headers
  }
  snackBars(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2600,
    })
  }
  isLogin() {
    if (localStorage.getItem('token')) {
      this.router.navigate(['./'])
    }
  }
  login(uname: string, pwd: string) {
    let tmp: any
    tmp = { qci_id: uname, password: pwd }
    let data = JSON.stringify(tmp)
    return new Promise((resolve) => {
      this.http.post(this.URL + 'lms/loginEmp', data)
        .map(res => res.json())
        .subscribe(response => {
          // console.log(response)
          if (response.success) {
            localStorage.setItem('token', response.token)
            localStorage.setItem('userName', uname)
            this.uid = uname
            this.emitLogin.emit()
          } else this.snackBars(response.message, response.success)
          resolve(true)
        }, err => this.router.navigate(['/404']))
    })
  }
  applyLeave(data: any, stepper: MatStepper) {
    return new Promise((resolve) => {
      this.http.post(this.URL + 'lms/applyLeave', data, this.opts)
        .map(res => res.json())
        .subscribe(response => {
          if (response.success) {
            this.emitMyLeaves.emit(response)
            this.router.navigate(['/dashboard'])
          } else stepper.next()
          resolve(true)
        }, err => this.router.navigate(['/404']))
    })
  }
  // HINT : Are we checking the response is a success or not ???
  getEmployee() {
    return new Promise((resolve) => {
      this.http.get(this.URL + 'lms/addEmployee/' + this.uid, this.opts)
        .map(res => res.json())
        .subscribe(response => {
          // console.log(response)
          if (response.success) this.emitgetEmployee.emit(response.data)
          else this.snackBars(response.message, response.success)
          resolve(true)
        }, err => this.router.navigate(['/404']))
    })
  }
  myLeaves() {
    return new Promise((resolve) => {
      this.http.get(this.URL + 'lms/applyLeave/' + this.uid, this.opts)
        .map(res => res.json())
        .subscribe(response => {
          // console.log(response)
          if (response.success) this.emitMyLeaves.emit(response.data)
          else {
            if (response.messages == 'No application available currently') this.emitMyZero.emit(response)
            else this.snackBars("! Success", "Try Again")
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
          else this.snackBars(response.message, response.success)
          resolve(true)
        }, err => this.router.navigate(['/404']))
    })
  }
  tleave() {
    return new Promise((resolve) => {
      this.http.get(this.URL + 'lms/tleave', this.opts)
        .map(res => res.json())
        .subscribe(response => {
          if (response.success) this.emitTotalLeave.emit(response.result)
          else this.snackBars("response.message", "response.success")
          resolve(true)
        }, err => this.router.navigate(['/404']))
    })
  }
}