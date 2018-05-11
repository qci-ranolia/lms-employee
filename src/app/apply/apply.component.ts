import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms'

@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss']
})
export class ApplyComponent implements OnInit {
  selectedValue: string
  showUs = false
  
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
  
  constructor(){}

  ngOnInit(){}
  
}
