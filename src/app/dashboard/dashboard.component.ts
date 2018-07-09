import { Component, OnInit, OnDestroy } from '@angular/core'
import { LmsService } from '../lms.service'
import { ApiService } from '../api.service'
// import * as moment from 'moment'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit, OnDestroy {
  loader: boolean = false
  // public momentDate = moment()
  // public daysArr
  hide: boolean = true
  employee = new Array()
  leave = new Array()
  leaveRejected = new Array()
  myLeaveStatus: any

  unsubMyLeaves: any
  unsubZeroLeaves: any
  unsubGetEmployees: any
  unsubLoader: any

  constructor(private lms: LmsService, private api: ApiService) {//
    this.unsubLoader = this.lms.emitsload.subscribe(el => this.loader = el)
    this.lms.showLoader()

    this.unsubGetEmployees = this.api.emitgetEmployee.subscribe(r => this.employee = r)
    this.unsubZeroLeaves = this.lms.emitMyZero.subscribe(r => this.hide = false)
    this.unsubMyLeaves = this.api.emitMyLeaves.subscribe(r => this.leave = r )
  }

  public ngOnInit() {
    this.api.getEmployees()
    this.api.myLeaves()
  }

  ngOnDestroy() {
    this.unsubLoader.unsubscribe()
    this.unsubGetEmployees.unsubscribe()
    this.unsubMyLeaves.unsubscribe()
    this.unsubZeroLeaves.unsubscribe()
  }
}
