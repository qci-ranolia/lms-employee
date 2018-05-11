import{ EventEmitter, Injectable } from '@angular/core'
import { ApiService } from './api.service'

@Injectable()
export class LmsService {
  
  emitgetEmployees = new EventEmitter<any>()
  
  constructor( private api: ApiService ) { }

  getEmployees(){
    this.api.GetEmployeeDetails().subscribe( el => {
      console.log(el)
      this.emitgetEmployees.emit(el)
      // if(el.success){
      //   //console.log("s")
      //   this.emitgetEmployees.emit(el)
      // } else {console.log(el)}
    }, err => {
      console.log(err)
    })
  }
  // addEmp(employee){
  //   this.api.addEmp(employee).subscribe(/*  r => {
  //     if ( r.success ) console.log("1")
  //     else console.log("2")
  //   }, err => {
  //     console.log(err)
  //   } */)
  // }
}
