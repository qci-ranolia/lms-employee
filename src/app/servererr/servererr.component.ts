import { Component, OnInit } from '@angular/core'
import { Location } from '@angular/common'

@Component({
  selector: 'app-servererr',
  templateUrl: './servererr.component.html',
  styleUrls: ['./servererr.component.scss']
})
export class ServererrComponent implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }
  
  refresh(): void {
    this.location.back()
    // window.location.reload()
  }

}
