import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//login platform for admin and employee
import { LoginComponent } from './login/login.component';

//common components
import { NavComponent } from './nav/nav.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ApplyComponent } from './apply/apply.component';


const routes: Routes = [
  { path:'', component:NavComponent, children:[
    { path:'dashboard', component:DashboardComponent },
    { path:'', redirectTo:'/dashboard', pathMatch:'full' },
    { path:'apply-leave', component:ApplyComponent },
  ]},
  { path:'login', component:LoginComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}