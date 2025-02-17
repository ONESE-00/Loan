import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AuthComponent } from './components/auth/auth.component';
import { AuthLogicService } from './auth-logic.service';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { DashboardCardComponent } from './components/dashboard-card/dashboard-card.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { CustomersComponent } from './components/customers/customers.component';
import { LoansComponent } from './components/loans/loans.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RepaymentsComponent } from './components/repayments/repayments.component';
import { RegisterComponent } from './components/register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    LoginComponent,
    ForgotPasswordComponent,
    DashboardCardComponent,
    CustomersComponent,
    LoansComponent,
    RepaymentsComponent,
    RegisterComponent,
    ],
    
  imports: [  
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    RouterModule,
    MatAutocompleteModule,
    MatFormFieldModule,
     
          ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
