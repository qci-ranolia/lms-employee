import { Component, OnInit, OnDestroy } from '@angular/core'
import { LmsService } from '../lms.service'
import { ApiService } from '../api.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit, OnDestroy {
  loader: boolean = false

  hide: boolean = true
  employee = new Object()
  leave = new Array()
  leaveRejected = new Array()
  myLeaveStatus: any

  unsubMyLeaves: any
  unsubZeroLeaves: any
  unsubGetEmployees: any
  unsubLoader: any

  constructor(private lms: LmsService, private api: ApiService) {
    this.unsubLoader = this.lms.emitsload.subscribe(el => this.loader = el)
    this.lms.showLoader()

    this.unsubGetEmployees = this.api.emitgetEmployee.subscribe(r => {
      this.employee = r
      // console.log(this.employee)
    })
    this.unsubZeroLeaves = this.api.emitMyZero.subscribe(r => {
      this.hide = false
      // console.log(r)
    })
    this.unsubMyLeaves = this.api.emitMyLeaves.subscribe(r => {
      this.leave = r
      // console.log(this.leave)
    })
  }
  public ngOnInit() {
    this.api.getEmployee()
    this.api.myLeaves()
  }
  ngOnDestroy() {
    this.unsubLoader.unsubscribe()
    this.unsubGetEmployees.unsubscribe()
    this.unsubMyLeaves.unsubscribe()
    this.unsubZeroLeaves.unsubscribe()
  }
} 
