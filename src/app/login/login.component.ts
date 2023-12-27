import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
loginForm:FormGroup
constructor(private authService:AuthService){}
ngOnInit(){
  this.loginForm=new FormGroup({
    'username':new FormControl("",[Validators.required]),
    'password':new FormControl("",[Validators.required])
  })
}

onSubmit(){
  this.authService.signin(this.loginForm.value.username, this.loginForm.value.password)

}
}
