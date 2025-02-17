import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})

export class ForgotPasswordComponent implements OnInit {

  authForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.authForm = this.fb.group({
      email: ['',[Validators.required, Validators.email]]

    });
  }

  ngOnInit(): void {}

  onSubmit(){
    if (this.authForm.valid) {
      console.log(this.authForm.value);
  }}
}
