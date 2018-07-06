import { EventEmitter, Injectable } from '@angular/core'
import { Http, Headers, RequestOptions } from '@angular/http'
import { HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http'
import { RouterModule, Routes, Router } from '@angular/router'
// import { Observable } from 'rxjs'
import 'rxjs/add/operator/map'
import { MatSnackBar } from '@angular/material' // remove from lms service after all promise< resolve,reject> successfully implemented here
@Injectable()
export class ApiService {
  // URL : string = "http://13.127.13.175:5000/"
  URL: string = "http://192.168.15.55:5000/"
  token: string // Useful in Authentication
  headers: Headers // Useful when backend and frontend have different IP's
  opts: any
  uid: any
  emitgetHoliday = new EventEmitter<any>()

  constructor(public snackBar: MatSnackBar, private http: Http, private router: Router) { //, private router:Router // we will use both imports here. Are we using anywhere in comments only ???
    this.token = localStorage.getItem('token') // If this token available, login using can activate gaurd 
    this.headers = new Headers() // Default headers
    this.headers.append('Authorization', this.token) // ADD/Append your authorized token to Default headers
    this.opts = new RequestOptions() // how to check if front end have issue or backend, without even using postman!! Am i correct ?
    this.opts.headers = this.headers
    this.uid = localStorage.getItem('userName')
  }

  snackBars(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2600,
    })
  }

  Login(data: any) {
    this.uid = data.qci_id
    return this.http.post(this.URL + 'lms/loginEmp', data).map(r => r.json())
  }
  ApplyLeave(data: any) {
    return this.http.post(this.URL + 'lms/applyLeave', data, this.opts).map(r => r.json())
  }
  // HINT : Are we checking the response is a success or not ???
  GetEmployeeDetails() {
    return this.http.get(this.URL + 'lms/addEmployee/' + this.uid, this.opts).map(r => r.json())
  }
  myLeaves() {
    return this.http.get(this.URL + 'lms/applyLeave/' + this.uid, this.opts).map(r => r.json())
  }

  // Get QCI Calendar
  getHoliday() {
    return new Promise((resolve) => {
      this.http.get(this.URL + 'lms/holiday', this.opts)
        .map(res => res.json())
        .subscribe(response => {
          // console.log(response)
          if (response.success) {
            if (response.result.length == 0) this.emitgetHoliday.emit("Holidays are not updated")
            else this.emitgetHoliday.emit(response.result)
          }
          else this.snackBars(response.message, response.success)
          resolve(true)
        }, err => this.router.navigate(['/404']))
    })
    // return this.http.get( this.URL+'lms/holiday', this.opts ).map( r => r.json() )
  }

}