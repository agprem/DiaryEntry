import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './User-model';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: any;
  expires: any;
  logoutTimer: any;
  isAuthenticated: boolean = false;
  newuser: any;

  private authenticatedSub = new Subject<boolean>();
  public user = new Subject<string>();

  constructor(private http: HttpClient, private router: Router,private toastr:ToastrService) { }

  //Getting Token
  getToken() {
    return this.token;
  }
//Creating subject as observable for passing authentication from login
  getAuthenticatedsub() {
    return this.authenticatedSub.asObservable();

  }
  getAuthenticated() {
    return this.isAuthenticated;
  }

  //Sign up
  signup(username: string, password: string) {
    const userData: User = { username: username, password: password }
    this.http.post("http://localhost:3000/sign-up", userData).subscribe((res) => {
      this.router.navigate(['/login'])
    },(err)=>{
      console.log(err)
      this.toastr.error(err?.error?.err?.username?.message,"Error")

    })
  }
//Sign-In
  signin(username: string, password: string) {
    const userData: User = { username: username, password: password }
    this.http.post("http://localhost:3000/login", userData).subscribe((res: any) => {
      this.token = res.token;
      this.authenticatedSub.next(true);
      this.isAuthenticated = true;
      this.router.navigate(['']);
      this.expires = res.expiresIn;
      this.user.next(res.user);
      this.newuser = res.user;
      this.setLocalstorage();
      //this.return timeoutid this can be cancelled by cleartimeout(id)
      this.logoutTimer = setTimeout(() => { this.logout() }, this.expires * 1000);

    },(err)=>{
      this.toastr.error(err?.error?.msg,"Error")
    })

  }
  //Log-out
  logout() {
    this.token = '';
    this.authenticatedSub.next(false);
    this.isAuthenticated = false;
    this.user.next('Guest');
    this.newuser = "";
    this.clearLoginDetails();
    clearTimeout(this.logoutTimer)
  }
  //Setting Localstorage
  setLocalstorage() {
    localStorage.setItem("expiresIn", JSON.stringify(this.expires));
    localStorage.setItem("token", this.token)
  }
  //Clearing Local Storage for logging-out
  clearLoginDetails() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
  }

  //Keeping User login till token doen not expires in localstorage
  authenticatefromlocalstorage() {
    const localStoragedata = this.getLocalStorageData();
    if (localStoragedata) {
      const now = new Date();
      const expiresIn = localStoragedata.expiresIn.getTime() - now.getTime();
      if (expiresIn > 0) {
        this.token = localStoragedata.token;
        this.isAuthenticated = true;
        this.authenticatedSub.next(true);
        this.logoutTimer?.setTimeout(expiresIn / 1000);
      }
    }
  }
  //Getting Localstorage data for keeping User Login till token expires
  getLocalStorageData() {
    const token = localStorage.getItem('token');
    const expiresIn = localStorage.getItem('expiresIn');

    if (!token || !expiresIn) {
      return;
    }
    return {
      'token': token,
      'expiresIn': new Date(expiresIn)
    }
  }
}
