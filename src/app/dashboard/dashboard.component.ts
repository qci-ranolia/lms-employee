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
  totalLeave = new Array

  unsubMyLeaves: any
  unsubZeroLeaves: any
  unsubGetEmployees: any
  unsubLoader: any
  unsubTotalLeaves: any

  constructor(private lms: LmsService, private api: ApiService) {
    this.unsubLoader = this.lms.emitsload.subscribe(el => this.loader = el)
    this.lms.showLoader()

    this.unsubGetEmployees = this.api.emitgetEmployee.subscribe(r => {
      console.log(r)
      this.employee = r
    })
    this.unsubZeroLeaves = this.api.emitMyZero.subscribe(r => {
      this.hide = false
    })
    this.unsubMyLeaves = this.api.emitMyLeaves.subscribe(r => {
      this.leave = r
    })
    this.unsubTotalLeaves = this.api.emitTotalLeave.subscribe(r => {
      this.totalLeave = r[0]
    })
  }
  public ngOnInit() {
    this.api.getEmployee()
    this.api.myLeaves()
    this.api.tleave()
  }
  ngOnDestroy() {
    this.unsubLoader.unsubscribe()
    this.unsubGetEmployees.unsubscribe()
    this.unsubMyLeaves.unsubscribe()
    this.unsubZeroLeaves.unsubscribe()
  }
} 
