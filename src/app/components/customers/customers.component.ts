import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {  FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Customer } from 'src/app/components/customers/customer';
import { CustomerService } from './customer.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})




export class CustomersComponent implements OnInit{

  

  ngOnInit() {
    this.loadCustomers()
    
  }

  

  showCreateModal = false;
  isEditModalOpen = false;
  edit_selected_customer: any = {}
  customerForm: FormGroup;
  editCustomerForm: FormGroup;
  filteredCustomers: string[]=[];



  constructor(private formbuilder: FormBuilder, private CustomerService: CustomerService) {
    
    //initialize the form with the validators
    this.customerForm = this.formbuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      nationalid: ['', [Validators.required]],
      phonenumber: ['', [Validators.required]],

    });

    this.editCustomerForm = this.formbuilder.group({

    });
  }




  openCreateModal(){
    this.showCreateModal = true
  }
  
  closeCreateModal(){
    this.showCreateModal = false
    this.customerForm.reset
  }

  createCustomer(){
    if (this.customerForm.valid){
      const newCustomer  = this.customerForm.value

      this.CustomerService.createCustomer(newCustomer).subscribe({

        next: (response) => {

          this.customers.push(response);
          this.updateDisplayedCustomers()
          this.closeCreateModal();

          },
      
        error: (error) => {
          console.error("ERROR CREATING CUSTOMER",error)
          alert("ERROR CREATING CUSTOMER")
        }
      });
      
    }
  }

  //EDIT CUSTOMER DETAILS = get a copy of the customer details and open the eidt window
  editCustomer(customer: any) {
    //create a copy of the customer object
    this.edit_selected_customer = { ...customer}
    this.isEditModalOpen = true;

  }

  saveChanges(){
    this.CustomerService.updateCustomer(this.edit_selected_customer).subscribe({

      next: (response) => {

        const index = this.customers.findIndex( cust => cust.id === this.edit_selected_customer.id);
        
        if (index !== -1){
          this.customers[index] = {...this.edit_selected_customer }
        }
        this.closeEditModal()
        this.updateDisplayedCustomers()
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
    this.edit_selected_customer = {}
  }
  
  // store customers from the API
  customers: Customer[] = [];
  
  //store displayed customers
  displayedCustomers: Customer[] = [];

  //sorting properties
  sortColumn: keyof Customer = 'id';
  sortDirection: 'asc' | 'desc' = 'asc'

  //Track selection
  selectedCustomers: Set<number> = new Set();
  selectAll: boolean = false;

  //Pagination properties
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;

  

  //LOAD CUSTOMERS FROM THE API
  loadCustomers() {
    this.CustomerService.getCustomers().subscribe({

      next: (response) => {
        this.customers = response;
        //calculate total pages
        this.totalPages = Math.ceil(this.customers.length / this.pageSize)
    
        //UPDATE THE DISPLAYED CUSTOMERS
        this.updateDisplayedCustomers();

            },

      error: (error) => {
        console.error("ERROR FETCHING CUSTOMERS",error)
      }
    })

    
  }

  //displays based on the current page and page size
  updateDisplayedCustomers() {
    const startIndex = (this.currentPage -1 ) * this.pageSize;
    const endIndex  = startIndex + this.pageSize
    this.displayedCustomers = this.customers.slice(startIndex, endIndex);
  }

  //handle sorting of columns
  sort(column: keyof Customer){

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
    this.customers.sort((a,b) => {

      const valueA = a[column];
      const valueB = b[column];

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    //after sorting update the displayed customers
    this.updateDisplayedCustomers();
  }


  //handle the "select all" checkbox toggle
  toggleSelectAll() {

    //toggle the selectAll  state
    this.selectAll = !this.selectAll

    if (this.selectAll) {
      //select all displayed customers
      this.displayedCustomers.forEach(customer => this.selectedCustomers.add(customer.id));
    }
    else {
      //clear all selections
      this.selectedCustomers.clear();
    }
  }

  //handle the individual customer checkbox
  toggleSelect(customerId: number) {
    if(this.selectedCustomers.has(customerId)) {
      this.selectedCustomers.delete(customerId);
      this.selectAll = false;
    } else {
      this.selectedCustomers.add(customerId);

      //check if all displayed customers are selected
      if (this.displayedCustomers.every(customer => this.selectedCustomers.has(customer.id))) {
        this.selectAll = true;
      }
    }
  }
  
  //handle page navigation
  goToPage(page: number) {
    if(page >= 1 && page<=this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedCustomers();

      //reset select all when changing pages
      this.selectAll = false;

    }
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    for(let i = 1; i<=this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
  
  //CUSTOMER EDIT FUNCTION

//DELETE CUSTOMER(s)
  deleteCustomer(customer?: Customer) {
    
    //Deleting 1 customer
    if (this.selectedCustomers.size === 1 && customer ) {
      
    
    if(confirm(`Are you sure you want to delete ${customer.firstname} ${customer.lastname}?`)){

      this.CustomerService.deleteCustomer(customer.id).subscribe({
      

        next: () => {

          //remove the customer from the local array
          this.customers = this.customers.filter(cust => cust.id !== customer.id)


          //update the display/
          this.updateDisplayedCustomers()
          alert("CUSTOMER DELETED SUCCESSFULLY")

        },

        error: (error) => {
          console.error("ERROR DELETING CUSTOMER", error)
        }
      });
    }
  }
  //Deleting multilple customers
  else {

    if(confirm(`Are you sure you want to delete  these ${this.selectedCustomers.size} customers?`)){

      //Convert the set to array
      const customerIds = Array.from(this.selectedCustomers);
      // alert(customerIds)

      this.CustomerService.bulkDeleteCustomers(customerIds).subscribe({

        next: () => {

          this.customers = this.customers.filter(cust => !this.selectedCustomers.has(cust.id));

          //clear selection
          this.selectedCustomers.clear()
          this.selectAll = false;

          //update displayed customers
          this.updateDisplayedCustomers()
          alert("CUSTOMERS DELETED SUCCESSFULLY");
        },

        error: (error) => {
        
          console.error("ENCOUNTERED ERROR WIHLE BULK DELETING", error)
      }})

  }


  }

  //OPEN THE DELETE MODAL 
}}
