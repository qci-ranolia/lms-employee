import { Component, OnInit } from '@angular/core';
// import { MatTabsModule } from '@angular/material/tabs';
import { LmsService } from '../lms.service';
import { Router } from '@angular/router';

@Component({
  selector:'app-nav',
  templateUrl:'./nav.component.html',
  styleUrls:['./nav.component.scss']
})

export class NavComponent implements OnInit {
  
  loader : boolean = false
  constructor( private lms: LmsService, private router: Router ){
    this.lms.emitsload.subscribe( el => this.loader = el )
  }

  ngOnInit(){ }

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    localStorage.removeItem('qci_id')
    this.lms.showLoader()
    this.router.navigate(['/login'])
  }

}
