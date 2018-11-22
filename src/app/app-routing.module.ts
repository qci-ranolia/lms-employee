import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthService } from './auth.service'
//login platform for admin and employee
import { LoginComponent } from './login/login.component'
//common components
import { NavComponent } from './nav/nav.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { ApplyComponent } from './apply/apply.component'
import { ServererrComponent } from './servererr/servererr.component'

export const routes: Routes = [
  {
    path: '', component: NavComponent, children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthService] },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full', canActivate: [AuthService] },
      { path: 'apply-leave', component: ApplyComponent, canActivate: [AuthService] },
      { path: '404', component: ServererrComponent, canActivate: [AuthService] }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'login?email=rep', component: LoginComponent },
  { path: '**', redirectTo: '/login' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }