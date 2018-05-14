import { Component, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
import { LmsService } from '../lms.service'
import { MatDatepickerModule } from '@angular/material/datepicker'



import * as moment from 'moment'

@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss']
})

export class ApplyComponent implements OnInit {
  selectedValue: string
  showUs = false
  loader : boolean = false

  leaves = [
    { value: 'bal_cl', tol: 'Casual Leave', bal:'10' },
    { value: 'bal_sl', tol: 'Sick Leave', bal:'10' },
    { value: 'bal_pl', tol: 'Privileged Leave', bal:'10' },
    { value: 'bal_eol', tol: 'Extra Ordinary Leave', bal:'10' },
    { value: 'bal_ptl', tol: 'Materinity Leave', bal:'10' },
    { value: 'bal_mtl', tol: 'Paterinity Leave', bal:'10' }
  ]

  materialDate = new FormControl(new Date())
  serializedDate = new FormControl((new Date()).toISOString())
  
  constructor(private lms:LmsService){
    this.lms.emitsload.subscribe( el => this.loader = el )
    this.lms.showLoader()

    var start = moment('2018-05-14'), // first date
    end   = moment('2018-06-02'), // second date
    day   = 0;                    // Sunday

    var result = [];
    var current = start.clone();

    while (current.day(7 + day).isBefore(end)) {
      result.push(current.clone());
    }
    console.log(result.map(m => m.format('LLLL')));
  }

  ngOnInit(){}
  
}
