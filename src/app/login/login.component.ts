import { Component, OnInit } from '@angular/core'
import { ApiService } from '../api.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  uname: any
  pwd: any
  unsubLogin: any

  constructor(private api: ApiService, private router: Router) { }

  isLogin() {
    localStorage.setItem('userName', this.uname)
    this.api.login(this.uname, this.pwd)
  }
  
  ngOnInit() {
    this.api.isLogin()
    this.unsubLogin = this.api.emitLogin.subscribe((res) => {
      this.router.navigate(['/'])
      setTimeout(() => {
        this.router.navigate(['/'])
      }, 200)
    })
  }

}
