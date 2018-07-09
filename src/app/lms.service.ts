import { EventEmitter, Injectable } from '@angular/core'
import { ApiService } from './api.service'
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material'

@Injectable()
export class LmsService {

  loader: boolean = false
  emitsload = new EventEmitter<any>()
  emithload = new EventEmitter<any>()

  emitgetEmployees = new EventEmitter<any>()
  emitLogin = new EventEmitter<any>()
  emitMyZero = new EventEmitter<any>()
  emitMyLeaves = new EventEmitter<any>()

  constructor(private api: ApiService, private router: Router, public snackBar: MatSnackBar) { }
  showLoader() {
    this.loader = true
    this.emitsload.emit(this.loader)
    setTimeout(() => this.hideLoader(), 1000)
  }
  hideLoader() {
    this.loader = false
    this.emithload.emit(this.loader)
  }
  snackBars(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2800,
    })
  }
  myLeaves() {
    this.api.myLeaves()/* .subscribe(el => {
      if (el.success) this.emitMyLeaves.emit(el.data)
      else {
        if (el.messages == 'No application available currently') this.emitMyZero.emit(el)
        else this.snackBars("! Success", "Try Again")
      }
    }, err => this.router.navigate(['/404'])
    ) */
  }
}