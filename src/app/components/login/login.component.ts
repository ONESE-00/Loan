// import { ImplicitReceiver } from '@angular/compiler';
import { Component } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
//import the Authlogic service
import { AuthLogicService } from 'src/app/auth-logic.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  authForm: FormGroup;

  constructor(private fb: FormBuilder, private snackbar: MatSnackBar, private AuthLogicService: AuthLogicService, private Router: Router) {
    this.authForm = this.fb.group({
      username: ['',[Validators.required]],  
      password: ['', [Validators.required, Validators.minLength(7)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(){
    if (this.authForm.valid) {
      const {username, password} = this.authForm.value

      this.AuthLogicService.Login(username , password).subscribe({


        next: (response) => {

        
          localStorage.setItem('token', response.token);
          this.Router.navigate(['/dashboard']);
          console.log(response)
        }, 

        error: (error) => {

          this.showNotification('INCORRECT LOGIN CREDENTIALS', 'error');
          console.log(error)
          this.Router.navigate(['/login'])
          
      }
    });
}}

  showNotification(message: string, type: string){

    this.snackbar.open(message, 'OK',{
      duration: 2000,
      horizontalPosition: type === 'success' ? 'right' : 'left',
      verticalPosition: 'top',
      panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar'
    })
  }
}
