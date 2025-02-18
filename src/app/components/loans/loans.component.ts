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
      customerId: ['', [Validators.required]],
      principalAmount: ['',[Validators.required]],
      interestRate: ['',[Validators.required]],
      repaymentPeriod: ['',[Validators.required]],
      duedate: ['',[Validators.required]],
      status: ['',[Validators.required]], 
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
  sortColumn: keyof Loan = 'id';
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
    
    const newLoan  = this.loanForm.value
    

    this.LoanService.createLoan(newLoan).subscribe({

      next: (response) => {

        this.loans.push(response);
        this.updateDisplayedLoans();
        this.closeCreateModal();

        
      },
    
      error: (error) => {
        console.error("ERROR CREATING LOAN",error)
        alert("ERROR CREATING LOAN")
        }
      });
      
    
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

    this.selectAll = !this.selectAll

    if (this.selectAll) {
      //select all displayed customers
      this.displayedLoans.forEach(loan => this.selectedLoans.add(loan.id));
    }
    else {
      //clear all selections
      this.selectedLoans.clear();
    }
  }

  toggleSelect(id: number) {
    if(this.selectedLoans.has(id)) {
      this.selectedLoans.delete(id);
      this.selectAll = false;
    } else {
      this.selectedLoans.add(id);

      //check if all displayed customers are selected
      if (this.displayedLoans.every(loan => this.selectedLoans.has(loan.id))) {
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

        const index = this.loans.findIndex( loan => loan.id === this.edit_selected_loan.id);
        
        if (index !== -1){
          this.loans[index] = {...this.edit_selected_loan }
        }
        this.updateDisplayedLoans()
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

  deleteLoan(loan?: Loan) {

    if(!loan) return

    //Deleting 1 customer
    if(this.selectedLoans.size === 0) {

      if(confirm(`Are you sure you want to delete  LOAN ${loan.id} of Value ${loan.amount}?`)){

        this.LoanService.deleteLoan(loan.id).subscribe ({
  
          next: () =>{
            
            //remove loan from the local array
            this.loans = this.loans.filter(loan => loan.id !== loan.id)
  
            //update the display
            this.updateDisplayedLoans()
          }
        });
      }
    }

    //BULK DELETING LOANS
    else{

      if (confirm(`Are you sure you want to delete these ${this.selectedLoans.size} loans?`)) {

        //convert the set to array
        const LoanIds = Array.from(this.selectedLoans)

        this.LoanService.bulkDeleteLoans(LoanIds).subscribe({
          
          next: () => {
            this.loans = this.loans.filter(loan => !this.selectedLoans.has(loan.id))

              //UPDATE THE DISPLAYED LOANS
              this.updateDisplayedLoans()
              // alert("${this.selectedLoans.size} LOANS DELETED SUCCESSFULLY")

            //CLEAR THE SELECTION ON THE TABLE
            this.selectedLoans.clear()
            this.selectAll = false;

          
          },

          error: (error) => {

            console.error("ENCOUNTERED ERROR WHILE BULK DELETING LOANS",error)
          }
        })
    }
      


    }}

   

  

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
      customerId: customer.id 
  });

  this.searchTerm = ` ${customer.id} ${customer.firstname} ${customer.lastname}`
  this.filteredCustomers = [];

  
}
}


