import { Component, OnInit, OnDestroy } from '@angular/core'
import { ApiService } from '../api.service'
import { LmsService } from '../lms.service'
declare var $

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
  emplCSV = new Object()

  cmn: any
  application: any
  case: any
  restHide: any

  unsubMyLeaves: any
  unsubZeroLeaves: any
  unsubGetEmployees: any
  unsubLoader: any
  unsubTotalLeaves: any
  unsubGetEmpCSV: any
  unsubEmployeeOnLeave: any

  constructor(private lms: LmsService, private api: ApiService) {
    this.unsubLoader = this.lms.emitsload.subscribe(el => this.loader = el)
    this.lms.showLoader()

    this.unsubGetEmployees = this.api.emitgetEmployee.subscribe(r => {
      this.employee = r
    })
    this.unsubZeroLeaves = this.api.emitMyZero.subscribe(r => this.hide = false)
    this.unsubMyLeaves = this.api.emitMyLeaves.subscribe(r => this.leave = r)

    setTimeout(() => {
      $(function () {
        let user = $('#table_id').DataTable({
          paging: true,
          searching: true,
          ordering: true,
          scrollY: 335
        })
      })
    }, 800)
    this.unsubGetEmpCSV = this.api.emitgetEmpCSV.subscribe(e => {
      for ( let i = 1; i < e.length; i++ ) {
        console.log(e[i])
      }
      this.emplCSV = e
    })

    this.unsubEmployeeOnLeave = this.api.emitEOL.subscribe( el => {
      this.cmn.push(el)
      this.simplyfiData()
      this.application = this.cmn[this.cmn.length - 1]
      this.case = this.application
    })
  
  }
  
  public ngOnInit() {
    this.api.getEmployee()
    this.api.myLeaves()
    this.api.getEmployeeCSV()

    // team applications
    this.api.getEOL()
  }
  
  simplyfiData() {
    if (!(this.cmn.length > 0)) this.restHide = false
    else {
      this.restHide = true
      var i = this.cmn.length - 1
      for (var j = 0; j < this.cmn[i].length; j++) {
        this.cmn[i][j].info.map(r => {
          delete this.cmn[i][j].info[0].application_id
          var t = Object.assign(this.cmn[i][j], r)
          delete this.cmn[i][j].info
        })
      }
    }
  }

  ngOnDestroy() {
    this.unsubLoader.unsubscribe()
    this.unsubGetEmployees.unsubscribe()
    this.unsubMyLeaves.unsubscribe()
    this.unsubZeroLeaves.unsubscribe()
    this.unsubGetEmpCSV.unsubscribe()
  }
  
} 
