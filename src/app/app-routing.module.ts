import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { DashboardCardComponent } from './components/dashboard-card/dashboard-card.component';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LoansComponent } from './components/loans/loans.component';
import { CustomersComponent } from './components/customers/customers.component';
import { RepaymentsComponent } from './components/repayments/repayments.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [

  {
    path: '',
    redirectTo: '/auth',
    pathMatch: 'full'
  },


  {
    path: 'auth',
    component: AuthComponent
  }, 

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },

 
  {
    path: 'dashboard',
    component: DashboardCardComponent
    
  },

  {
    path: 'loans',
    component: LoansComponent
  },

  {
    path: 'register',
    component: RegisterComponent
  },

  {
    path: 'customers',
    component: CustomersComponent
  },
 
  {

    path: 'repayments',
    component: RepaymentsComponent
  }

  // {
  //   path: '**',
  //   redirectTo: '/auth'
  // }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
