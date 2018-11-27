import { Injectable } from '@angular/core'
import { Router, CanActivate } from '@angular/router'

@Injectable()
export class AuthService implements CanActivate {
  constructor(private router: Router) {
    if ( router.url == '/login?email=rep' ){
      localStorage.removeItem('token')
      localStorage.removeItem('userName')
      localStorage.removeItem('qci_id')  
    }
  }
  
  canActivate() {
    if ( localStorage.getItem('token') != null ) {
      return true
    }
    this.router.navigate(['/login'])
    return false
  }
  
}