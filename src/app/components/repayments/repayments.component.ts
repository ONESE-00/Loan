import { Component,OnInit } from '@angular/core';

//import the Loan and Customer interfaces
import { Loan } from '../loans/loan';
import { Customer } from '../customers/customer';

//Import the Loan and Customer Services
import { LoanService } from '../loans/loan.service';
import { CustomerService } from '../customers/customer.service';
import { RepaymentsService } from './repayments.service';

//Import the Form modules
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';




@Component({
  selector: 'app-repayments',
  templateUrl: './repayments.component.html',
  styleUrls: ['./repayments.component.css']
})
export class RepaymentsComponent {

  payForm: FormGroup;
  calcForm: FormGroup
  filteredCustomers: Customer[] = [];
  filteredLoans: Loan[]=[]
  searchTerm: string = ''

  //customer interaces objects
  customers: Customer[]=[];
  loans: Loan[]=[]

  //pop-up windows controllers
  showPayModal = false;
  showCalcModal = false;
  


  //constructor
  constructor(private formbuilder: FormBuilder, 
              private LoanService: LoanService, 
              private CustomerService: CustomerService, 
              private RepaymentsService: RepaymentsService) {


  //initialize the form with the validators
  this.payForm = this.formbuilder.group({

    id: ['',[Validators.required]],
    amount: ['',[Validators.required]]
  });

  this.calcForm = this.formbuilder.group({

    id: ['',[Validators.required]],
    principalAmount: ['',[Validators.required]],
    repaymentPeriod: ['',[Validators.required]],
    interestRate: ['',[Validators.required]]
  })


  }
  openPayModal() {

    this.showPayModal = true
  }

  openCalcModal() {

    this.showCalcModal = true
  }

  closeCalcModal(){

    this.showCalcModal = false
    this.calcForm.reset
  }

  closePayModal() {

    this.showPayModal = false
    this.payForm.reset
  }

  //SEARCH FOR SPECIFIC LOAN
  searchLoan(): void {
    

    this.LoanService.getLoans().subscribe({

      next: (response) => {

        this.loans = response;
        this.filteredLoans = this.loans.filter(loan  => 

          (loan.id && loan.id.toString().includes(this.searchTerm.toLowerCase())) ||
          (loan.principalAmount && loan.principalAmount.toString().includes(this.searchTerm))).slice(0,5);       
          
      },

      error: (error) => {

        console.error("ERROR SEARCHING LOANS",error)
      }
      
    })
  }

  selectLoan(loan: Loan) {
    
    this.payForm.patchValue({
      id: loan.id });

    this.searchTerm = `${loan.id}`
    this.filteredLoans = [];

  }


  //PAY LOAN
  payLoan(){
    return
  }

  //take the values from the form and submit to the api 
  calculateLoan() {

    if(this.payForm.valid) {

    
    }


  }

}
