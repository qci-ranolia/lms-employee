import { Injectable } from '@angular/core'
import { Http, Headers, RequestOptions } from '@angular/http' 
import { HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http'
// import{RouterModule, Routes, Router} from '@angular/router'
//import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'

@Injectable()

export class ApiService {

  addEmp: any;
  URL:string = "http://192.168.15.219:5000/"
  token:string // Useful in Authentication
  headers:Headers // Useful when backend and frontend have different IP's

  constructor( private http:Http ){ //private http:Http, private router:Router  // we will use both imports here. Are we using anywhere in comments only ???
    
    
    // this.token = localStorage.getItem('token') // If this token available, login using can activate gaurd 
    // this.headers =  new Headers() // Default headers
    // this.headers.append( 'Authorization', this.token ) // ADD/Append your authorized token to Default headers
  }
   
  //HINT : Are we checking the response is a success or not ???
  GetEmployeeDetails(){
    return this.http.get( this.URL+'lms/employeeDetails' ).map( r => r.json() )
  }

  // addEmp(data:any){
  //   let temp = JSON.stringify(data)
  //   console.log(temp)
  //   return this.http.post( this.URL+'lms/addEmployee', temp).map( r => console.log(r) )
  // }

}