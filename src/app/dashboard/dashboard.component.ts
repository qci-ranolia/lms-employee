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

  unsubMyLeaves: any
  unsubZeroLeaves: any
  unsubGetEmployees: any
  unsubLoader: any
  unsubTotalLeaves: any
  unsubGetEmpCSV: any

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
      // console.log(e)
      // for ( let i = 1; i < e.length; i++ ) {
      //   if ( e[i-1].ID_code == e[i].ID_code ){
      //     let jack = []
      //     jack.push(e[i-1],e[i])
      //     switch (e[i-1].leave_type) {
      //       case "CL":
      //       // let a = e[i-1].slice(0,9)
      //       // let b = e[i-1].slice(9,26)
      //       // console.log(a)
      //       // console.log(b)
      //       break
      //       case "SL":

      //     }
      //     if (e[i].leave_type == 'PL'){

      //     }
      //   }
      // }
      this.emplCSV = e
    })
  }
  public ngOnInit() {
    this.api.getEmployee()
    this.api.myLeaves()
    this.api.getEmployeeCSV()
  }
  ngOnDestroy() {
    this.unsubLoader.unsubscribe()
    this.unsubGetEmployees.unsubscribe()
    this.unsubMyLeaves.unsubscribe()
    this.unsubZeroLeaves.unsubscribe()
    this.unsubGetEmpCSV.unsubscribe()
  }
} 
