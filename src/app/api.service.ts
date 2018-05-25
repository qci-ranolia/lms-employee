import { Injectable } from '@angular/core'
import { Http, Headers, RequestOptions } from '@angular/http' 
import { HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http'
import { RouterModule, Routes, Router } from '@angular/router'
// import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'

@Injectable()

export class ApiService {

  // URL : string = "http://13.127.13.175:5000/"
  URL : string = "http://192.168.15.55:5000/"
  token : string // Useful in Authentication
  headers : Headers // Useful when backend and frontend have different IP's
  opts : any

  uid : any
  constructor( private http:Http, private router: Router ) { //, private router:Router // we will use both imports here. Are we using anywhere in comments only ???  
 
    this.token = localStorage.getItem('token') // If this token available, login using can activate gaurd 
    this.headers = new Headers() // Default headers
    this.headers.append( 'Authorization', this.token ) // ADD/Append your authorized token to Default headers
    this.opts = new RequestOptions() // how to check if front end have issue or backend, without even using postman!! Am i correct ?
    this.opts.headers = this.headers
  }
  
  Login( data : any ){
    this.uid = data.qci_id
    return this.http.post( this.URL+'lms/loginEmp', data).map( r => r.json() )
  }

  // HINT : Are we checking the response is a success or not ???
  GetEmployeeDetails(){
    this.uid = localStorage.getItem('userName')
    return this.http.get( this.URL+'lms/addEmployee/'+this.uid, this.opts ).map( r => r.json() )
  }

  ApplyLeave( data:any ) {
    return this.http.post( this.URL+'lms/applyLeave', data, this.opts ).map( r => r.json() )
  }

  myLeaves(){
    return this.http.get( this.URL+'lms/applyLeave/'+this.uid, this.opts ).map( r => r.json() )
  }

}