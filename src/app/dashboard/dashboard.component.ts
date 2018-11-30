import { MatTabChangeEvent, MatDialog } from '@angular/material'
import { Component, OnInit, OnDestroy } from '@angular/core'
import { AppinfoComponent } from "./appinfo/appinfo.component"
import { ApiService } from '../api.service'
import { LmsService } from '../lms.service'
import { DatePipe } from '@angular/common'
import * as moment from 'moment'
declare var $

export interface DialogData {
  animal: 'accept' | 'cancel' | 'reject'
}

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
  emplCSV = new Array

  cmn: any
  application: any
  case: any
  restHide: any

  employeeLeave = []
  temp1 = []

  spnnr: boolean = false
  dis: any = false
  date: any
  table: any
  toggle: boolean = false
  edit: boolean = false
  ro: boolean = false
  approvedLeave: any
  cancelledLeave: any

  employeeOnLeave: any

  application_id: any
  applicationData: any = new Array()
  proBar:boolean = false

  unsubMyLeaves: any
  unsubZeroLeaves: any
  unsubGetEmployees: any
  unsubLoader: any
  unsubTotalLeaves: any
  unsubGetEmpCSV: any
  unsubZeroEOL: any
  unsubAcceptedApplication: any

  unsubInputOthers: any
  unsubInputOwn: any
  unsubApprovedOthers: any
  unsubApprovedOwn: any
  unsubCancelledOthers: any
  unsubCancelledOwn: any

  constructor( private lms:LmsService, private api:ApiService, public datepipe:DatePipe, public dialog:MatDialog ){
    this.unsubLoader = this.lms.emitsload.subscribe( el => this.loader = el )
    this.lms.showLoader()
    setTimeout(() => {
      $(function () {
        this.table = $('#table_id').DataTable({
          paging: true,
          searching: true,
          ordering: true,
          scrollY: 335
        })
      })
    }, 400)

    this.unsubGetEmployees = this.api.emitgetEmployee.subscribe( r => {
      this.employee = r
      var lt = Object.keys(r)
      var rt = Object.values(r)
      for (let i = 22; i < lt.length; i++ ){
        if (lt[i] == 'role') {
          if ( rt[i][0] == 'reporting_officer') {
            this.ro = true
          }
        }
      }
    })
    this.unsubZeroLeaves = this.api.emitMyZero.subscribe( r => this.hide = false )
    this.unsubMyLeaves = this.api.emitMyLeaves.subscribe( r => {
      this.leave = r.reverse()
    })
    // if pending leave
    this.unsubInputOthers = this.api.emitInputOthers.subscribe( el => {
      if ( this.ro == true ){
        this.cmn = el[0]
        this.simplyfiData()
        this.application = this.cmn
        this.case = this.application
      }
    })
    this.unsubInputOwn = this.api.emitInputOwn.subscribe( el => {
      // this.cmn = el[0]
      // this.simplyfiData()
    })
    // if approved leave
    this.unsubApprovedOthers = this.api.emitApprovedOthers.subscribe( el => {
      if ( this.ro == true ){
        this.cmn = el[0]
        this.simplyfiData()
        this.approvedLeave = this.cmn
      }
    })
    this.unsubApprovedOwn = this.api.emitApprovedOwn.subscribe( el => {
      // this.cmn = el[0]
      // this.simplyfiData()
    })
    // if cancelled leave
    this.unsubCancelledOthers = this.api.emitCancelledOthers.subscribe( el => {
      if ( this.ro == true ){
        this.cmn = el[0]
        this.simplyfiData()
        this.cancelledLeave = this.cmn
      }
    })
    this.unsubCancelledOwn = this.api.emitCancelledOwn.subscribe( el => {
      // this.cmn = el[0]
      // this.simplyfiData()
    })

    this.unsubAcceptedApplication = this.api.emitMyApplication.subscribe( el => {
      // this.dis = false
      // this.spnnr = false
      this.api.getEOL()
      switch (el.message) {
        case "Leave Approved!!":
          this.api.approvedLeave()
          break
        case "Leave has been declined.":
          this.api.cancelledLeave()
      }
    })
  }
  
  ngOnInit() {
    this.api.getEmployee()
    this.api.myLeaves()
    // Do you really need this here ??
    // this.api.getEmployeeCSV()
    // team applications
    this.api.getEOL()
    this.api.approvedLeave()
    this.api.cancelledLeave()
  }

  simplyfiData() {
    if (!(this.cmn.length > 0)) this.restHide = false
    else {
      this.restHide = true
      var i = this.cmn.length
      for (var j = 0; j < i; j++) {
        this.cmn[j].info.map(r => {
          // delete this.cmn[j].info[0].application_id
          var t = Object.assign(this.cmn[j], r)
          delete this.cmn[j].info
        })
      }
    }
  }

  whichApplication($event: MatTabChangeEvent) {
    switch ($event.index) {
      case 0:
        $('#table_approve').DataTable().destroy()
        $('#table_cancel').DataTable().destroy()
        this.table = $('#table_new').DataTable({
          paging: true,
          searching: true,
          ordering: true,
          scrollY: 335
        })
        this.case = this.application // pending applications
        break
      case 1:
        $('#table_new').DataTable().destroy()
        $('#table_cancel').DataTable().destroy()
        this.table = $('#table_approve').DataTable({
          paging: true,
          searching: true,
          ordering: true,
          scrollY: 335
        })
        this.case = this.approvedLeave
        break
      case 2:
        $('#table_new').DataTable().destroy()
        $('#table_approve').DataTable().destroy()
        this.table = $('#table_cancel').DataTable({
          paging: true,
          searching: true,
          ordering: true,
          scrollY: 335
        })
        this.case = this.cancelledLeave
    }
  }

  appInfo(application_id, qci_id, leave_type) {
    localStorage.setItem('qci_id', qci_id)
    let event = 'info'
    this.openApplicationModal(application_id, event, leave_type)
  } appAccept(application_id, qci_id, leave_type) {
    localStorage.setItem('qci_id', qci_id)
    let event = 'accept'
    this.openApplicationModal(application_id, event, leave_type)
  } appEdit(application_id, qci_id, leave_type) {
    localStorage.setItem('qci_id', qci_id)
    let event = 'edit'
    this.openApplicationModal(application_id, event, leave_type)
  } appCancel(application_id, qci_id, leave_type) {
    localStorage.setItem('qci_id', qci_id)
    let event = 'decline'
    this.openApplicationModal(application_id, event, leave_type)
  }
  // commen dialog for all the application related queries
  public openApplicationModal(application_id, event, leave_type) {
    var item = this.case.find(it => it.application_id == application_id) // linear search
    item.event = event
    this.dialog.open(AppinfoComponent, {
      width:"60%",
      height:"75%",
      data:item
    })
  }

  toggler() {
    this.toggle = !this.toggle
  }
  // accept leave application
  acceptApp(app_id, qci_id) {
    this.dis = true
    this.spnnr = true
    let date = new Date(),
      latest_date = this.datepipe.transform(date, 'dd/MM/yyyy'),
      tmp = { application_id: app_id, qci_id: qci_id, date_reviewed: latest_date }
    this.api.leaveForApproval(tmp)
    this.api.getEOL()
  }
  // decline leave application
  declineApp(dec_reason, app_ids) {
    this.dis = true
    this.spnnr = true
    let date = moment().format("DD/MM/YYYY")
    let tmp = { application_id: app_ids, date_reviewed: date, decline_reason: dec_reason }
    if (dec_reason) this.api.declineLeave(tmp)
    else {
      this.dis = false
      this.spnnr = false
      this.api.noDeclineReason()
      this.api.getEOL()
    }
  }
  ngOnDestroy() {
    this.unsubLoader.unsubscribe()
    this.unsubGetEmployees.unsubscribe()
    this.unsubMyLeaves.unsubscribe()
    this.unsubZeroLeaves.unsubscribe()
    // Do we really need this unsubscribe here ??
    // this.unsubGetEmpCSV.unsubscribe()
    // new unsubscribes
    this.unsubInputOthers.unsubscribe()
    this.unsubInputOwn.unsubscribe()
    this.unsubApprovedOthers.unsubscribe()
    this.unsubApprovedOwn.unsubscribe()
    this.unsubCancelledOthers.unsubscribe()
    this.unsubCancelledOwn.unsubscribe()
    localStorage.removeItem('qci_id')
  }

}
