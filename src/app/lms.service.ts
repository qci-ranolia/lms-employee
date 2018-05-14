import { EventEmitter, Injectable } from '@angular/core'
import { ApiService } from './api.service'
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material'

@Injectable()
export class LmsService {
  loader : boolean = false
  emitsload = new EventEmitter<any>()
  emithload = new EventEmitter<any>()

  emitgetEmployees = new EventEmitter<any>()
  emitLogin = new EventEmitter<any>()
  emitErr = new EventEmitter<any>()

  constructor( private api: ApiService, private router:Router, public snackBar: MatSnackBar) { }// 

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
  
  isLogin() {
    if ( localStorage.getItem('token')) {
      this.router.navigate(['./'])
    }
  }

  login( uname : string, pwd : string ) {
    let tmp : any
    tmp = { qci_id:uname, password:pwd }
    let temp = JSON.stringify( tmp )
    this.api.Login( temp ).subscribe( el => {
      if( el.success ) {
        localStorage.setItem('token',el.token)
        this.emitLogin.emit()
      } // else {
      //   this.emitErr.emit()
      // }
    }, err => alert( err ) )
  }

  getEmployees(){
    this.api.GetEmployeeDetails().subscribe( el => {
      if ( el.success ) this.emitgetEmployees.emit( el.data )
      // else console.log( el )
    }, err => console.log( err ) )
  }
  
}
