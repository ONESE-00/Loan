import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { window } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthLogicService } from 'src/app/auth-logic.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})

export class AuthComponent implements OnInit {

  //USER DATA
  username: string = '';
  firstname: string= '';
  lastname: string = '';
  email: string = '';
  password: string = '';

  //success messages
  SuccessMessage: string = '';
  ErrorMessage: string = '';

  //FORM
  authForm: FormGroup;

  constructor(private fb: FormBuilder, private AuthLogicService: AuthLogicService,  private router: Router, private snackbar: MatSnackBar) {
    this.authForm = this.fb.group({
      username:   ['',[Validators.required]],
      firstname:  ['',[Validators.required]],
      lastname:   ['',[Validators.required]],
      email:      ['',[Validators.required, Validators.email]],  
      password:   ['', [Validators.required, Validators.minLength(7), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}')]]
    });
  }
  
  onSubmit(){

    if (this.authForm.valid) {

      const { username, firstname, lastname, email, password } = this.authForm.value;

      this.AuthLogicService.SignUp(username, firstname, lastname, email, password).subscribe({
        
        //next is the "success path" when the observable produces a value that can be processed by the subscriber
        next: (response) => {
          // this.snackbar.open('SIGNUP SUCCESSFUL', 'OK', {duration: 3000});
          // this.Router.navigate(['/login']);    
          this.showNotification('ACCOUNT CREATED SUCCESSFULLY', 'success');
          this.router.navigate(['/login'])     
          console.log('SIGNUP SUCCESSFUL', response);
          this.SuccessMessage = 'ACCOUNT CREATED SUCCESSFULLY';
          this.ErrorMessage = '';
        },
        
        //error property rep the callback f() that will be exec when the observable encounters an error
        error: (error) => {
          // this.snackbar.open('SIGNUP FAILED', 'OK', {duration: 3000});
          // this.Router.navigate(['/login']);
          this.showNotification('REGISTRATION FAILED', 'error' );
          this.router.navigate(['/auth'])
          console.error('SIGNUP FAILED', error);
          this.SuccessMessage = '';
          this.ErrorMessage = 'SIGNUP FAILED. Please Try Again'
        }
    });
      
    }
  }

  ngOnInit() {

    console.log("COMPONENT LOADED")
  }

  showNotification(message: string, type: string){
    this.snackbar.open(message, 'OK', {
      duration: 3000,
      horizontalPosition: type === 'success' ? 'right' : 'left',
      verticalPosition: 'top',
      panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar'
    })
  }
}
