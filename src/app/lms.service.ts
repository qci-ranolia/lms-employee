import { EventEmitter, Injectable } from '@angular/core'
import { ApiService } from './api.service'
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material'
import { MatStepper } from '@angular/material'
@Injectable()
export class LmsService {
  
  loader : boolean = false
  emitsload = new EventEmitter<any>()
  emithload = new EventEmitter<any>()

  emitgetEmployees = new EventEmitter<any>()
  emitLogin = new EventEmitter<any>()
  emitMyZero = new EventEmitter<any>()
  emitMyLeaves = new EventEmitter<any>()

  constructor( private api: ApiService, private router:Router, public snackBar: MatSnackBar ) { }

  showLoader(){
    this.loader = true
    this.emitsload.emit(this.loader)
    setTimeout(() => {
      this.hideLoader()
    }, 1000 )
  }

  hideLoader(){
    this.loader = false
    this.emithload.emit(this.loader)
  }

  snackBars(message:string,action:string){  
    this.snackBar.open(message,action,{
      duration:2600,
    })
  }

  isLogin() {
    if ( localStorage.getItem('token') ){
      this.router.navigate(['./'])
    }
  }

  login( uname : string, pwd : string ){
    let tmp : any
    tmp = { qci_id:uname, password:pwd }
    let temp = JSON.stringify( tmp )
    this.api.Login( temp ).subscribe( el => {
      console.log( el )
      if ( el.success ) {
        localStorage.setItem( 'token',el.token )
        this.emitLogin.emit()
      } else this.snackBars("! Success" , "Try Again" ) 
    }, err => this.snackBars("API Error" , "Try Again" )
   )
  }

  getEmployees(){
    this.api.GetEmployeeDetails().subscribe( el => {
      if ( el.success ) this.emitgetEmployees.emit( el.data )
      else this.snackBars("! Success" , "Try Again" )
    }, err => this.snackBars( "API Error" , "Try Again" ) )
  }

  applyleave( leave : any, stepper : MatStepper ){
    this.api.ApplyLeave( leave ).subscribe( el => {
      console.log(el)
      if( el.success ) {
        this.emitMyLeaves.emit(el)
        stepper.next() 
      } else stepper.next() //this.snackBars("! Success" , "Try Again" )
    }, err => this.snackBars("API Error" , "Try Again" ) )
  }

  myLeaves(){
    this.api.myLeaves().subscribe( el => {
      // console.log(el)
      if ( el.success ) this.emitMyLeaves.emit(el.data)
      else {
        if ( el.messages == 'No Application available currently' ) this.emitMyZero.emit(el)
        else this.snackBars( "!Success" , "Try Again" ) 
      }
    }, err => this.snackBars( "API Error" , "Try Again" ))
  }

  /* getLeavedetails(){
    this.api.GetLeaveDetail().subscribe( el => {
      if ( el.success ) this.emitGetLeaveDetail.emit( el.data )
     else console.log( el )
     }, err => console.log( err ) )
  } */
  
}