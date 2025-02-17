import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { startWith } from 'rxjs';
import { Loan } from './loan';
import { Customer as Customer } from '../customers/customer';
import { LoanService } from './loan.service';
import { CustomerService } from '../customers/customer.service';

@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.css']
})
export class LoansComponent implements OnInit {

  constructor(private formbuilder: FormBuilder, private LoanService: LoanService, private CustomerService: CustomerService) {
    
    //initialize the form with the validators
    this.loanForm = this.formbuilder.group({
      customerid: ['', [Validators.required]],
      principal_amount: ['',[Validators.required]],
      repayment_period: ['',[Validators.required]],
      duedate: ['',[Validators.required]],
      frequency: ['', [Validators.required]],
      status: ['',[Validators.required]],
      totalRepayableAmount: ['',[Validators.required]]
    });

    this.editLoanForm = this.formbuilder.group({

    });
  }



  customerControl = new FormControl('')
  filteredCustomers: Customer[]=[]
  searchTerm: string = '';
  customers: Customer[]=[];

  
  

  ngOnInit(): void {
    this.loadLoans();
   
  }

  // private _filter(value: string): string[]{

  //   const filterValue = value.toLowerCase();
  //   return this.customers.filter(customer => customer.toLowerCase().includes(filterValue));
  // }
//POP UP WINDOWS CONTROLLERS
  showCreateModal = false;
  isEditModalOpen = false;

  edit_selected_loan: any = {};

//Track selection
   selectedCustomers: Set<number> = new Set();
   selectAll: boolean = false;

//LOAN FORMS
  loanForm: FormGroup;
  editLoanForm: FormGroup;

//STORE LOANS
  loans: Loan[] = [];
  displayedLoans: Loan[] = [];

//SORTING PROPERTIES
  sortColumn: keyof Loan = 'loanid';
  sortDirection: 'asc' | 'desc' = 'asc';
  selectedLoans: Set<number> = new Set();

//Pagination properties
   currentPage: number = 1;
   pageSize: number = 10;
   totalPages: number = 1;

 
  //LOAD ALL EXISTING LOANS
  loadLoans(){

    this.LoanService.getLoans().subscribe({

      next: (response) => {
        this.loans = response;
        this.totalPages = Math.ceil(this.loans.length / this.pageSize)
        this.updateDisplayedLoans();
      },

      error: (error) => {
        console.error("ERROR FETCHING LOANS",error)
      }
    });
  }

  createLoan(){
    if (this.loanForm.valid){
      const newLoan  = this.loanForm.value

      this.LoanService.createLoan(newLoan).subscribe({

        next: (response) => {

          this.loans.push(response);
          this.updateDisplayedLoans();
          this.closeCreateModal();

          alert("CUSTOMER CREATED SUCCESSFULLY")
        },
      
        error: (error) => {
          console.error("ERROR CREATING LOAN",error)
          alert("ERROR CREATING LOAN")
        }
      });
      
    }
  }

  

  updateDisplayedLoans() 
  {
    const startIndex = (this.currentPage -1 ) * this.pageSize;
    const endIndex  = startIndex + this.pageSize
    this.displayedLoans = this.loans.slice(startIndex, endIndex);
  }

  //FUNCTION TO SORT THE COLUMNS
  sort(column: keyof Loan){

    //const key = column as keyof Customer;

    //when you click the same column toggle the direction
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    }
    else {
      //when you click a new column , set it as the sort column and default to ascending order
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    //sort the full customers array
    this.loans.sort((a,b) => {

      const valueA = a[column];
      const valueB = b[column];

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    //after sorting update the displayed customers
    this.updateDisplayedLoans();
  }

  toggleSelectAll() {
    if (this.selectAll) {
      //select all displayed customers
      this.displayedLoans.forEach(loan => this.selectedLoans.add(loan.loanid));
    }
    else {
      //clear all selections
      this.selectedLoans.clear();
    }
  }

  toggleSelect(loanid: number) {
    if(this.selectedCustomers.has(loanid)) {
      this.selectedCustomers.delete(loanid);
      this.selectAll = false;
    } else {
      this.selectedCustomers.add(loanid);

      //check if all displayed customers are selected
      if (this.displayedLoans.every(loan => this.selectedLoans.has(loan.loanid))) {
        this.selectAll = true;
      }
    }
  }

  goToPage(page: number){
  if(page >= 1 && page<=this.totalPages) {
    this.currentPage = page;
    this.updateDisplayedLoans();

    //reset select all when changing pages
    this.selectAll = false;

  }}

  openCreateModal(){
    this.showCreateModal = true
  }
  
  closeCreateModal(){
    this.showCreateModal = false
    this.loanForm.reset
  }

//SAVE CHANGES MADE TO A LOAN
  saveChanges(){
    this.LoanService.updateLoan(this.edit_selected_loan).subscribe({

      next: (response) => {

        const index = this.loans.findIndex( loan => loan.loanid === this.edit_selected_loan.id);
        
        if (index !== -1){
          this.loans[index] = {...this.edit_selected_loan }
        }
        this.closeEditModal()
      },

      error: (error) => {
        console.error("ERROR UPDATING CUSTOMER DETAILS",error)
      }

    })
  }

  openEditModal() {
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false
    this.edit_selected_loan = {}
  }

  editLoan(loan: any) {
    //create a copy of the loan object
    this.edit_selected_loan = { ...loan}
    this.isEditModalOpen = true;

  }

  deleteLoan(loan: Loan) {

    if(confirm(`Are you sure you want to delete ${loan.loanid} of Value ${loan.amount}?`)){

      this.LoanService.deleteLoan(loan.loanid).subscribe ({

        next: () =>{
          
          //remove loan from the local array
          this.loans = this.loans.filter(loan => loan.loanid !== loan.loanid)

          //update the display
          this.updateDisplayedLoans()
        }
      });
    }
  }

  

  //SEARCH FOR CUSTOMERS ON THE LOAN APPLICATION FORM
  searchCustomers(): void{

    // if (!this.searchTerm.trim()) {

    //   this.filteredCustomers = [];
    //   return;
    // }

    this.CustomerService.getCustomers().subscribe({

      next: (response) => {
        this.customers = response;

         //have a local copy of the customers
        this.filteredCustomers = this.customers.filter(customer => 
    
        (customer.firstname   && customer.firstname.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (customer.lastname    && customer.lastname.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (customer.phonenumber && customer.phonenumber.includes(this.searchTerm)) ||
        (customer.nationalid  && customer.nationalid.includes(this.searchTerm))
        ).slice(0, 1)
        
        },

      error: (error) => {
        console.error("ERROR FETCHING CUSTOMERS",error)
      }
    })

    
  
   
  }



  selectCustomer(customer: Customer) {
    this.loanForm.patchValue({
      customerid: customer.id
  });

  this.searchTerm = `${customer.firstname} ${customer.lastname}`
  this.filteredCustomers = [];

  
}
}


