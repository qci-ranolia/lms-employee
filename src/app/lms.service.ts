import { EventEmitter, Injectable } from '@angular/core'
import { ApiService } from './api.service'

@Injectable()
export class LmsService {

  loader: boolean = false
  emitsload = new EventEmitter<any>()
  emithload = new EventEmitter<any>()

  emitgetEmployees = new EventEmitter<any>()
  emitLogin = new EventEmitter<any>()
  emitMyZero = new EventEmitter<any>()
  emitMyLeaves = new EventEmitter<any>()

  constructor(private api: ApiService) { }
  showLoader() {
    this.loader = true
    this.emitsload.emit(this.loader)
    setTimeout(() => this.hideLoader(), 1000)
  }
  hideLoader() {
    this.loader = false
    this.emithload.emit(this.loader)
  }
  myLeaves() {
    this.api.myLeaves()
  }
}