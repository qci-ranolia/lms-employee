import { Component } from '@angular/core';
import { LmsService } from './lms.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  loader : boolean = false

  constructor ( private lms:LmsService){
    this.lms.emitsload.subscribe( el => this.loader = el )
    this.lms.emithload.subscribe( el => this.loader = el )
  }
  ngOnInit() {
    this.lms.showLoader()
    setTimeout(() => {
      this.lms.hideLoader()
    }, 1000 )
  }


}
