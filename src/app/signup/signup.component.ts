import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  username = new FormControl("", [Validators.required]);
  password = new FormControl("", [Validators.required]);
  constructor(private authService: AuthService) { }
  ngOnInit() {
    this.signupForm = new FormGroup({
      username: this.username,
      password: this.password
    })
  }

  onSubmit() {
    console.log(this.signupForm,"form",this.signupForm.value.password)
    this.authService.signup(this.signupForm.value.username, this.signupForm.value.password)

  }
}
