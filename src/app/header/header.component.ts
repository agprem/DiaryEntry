import { Component } from '@angular/core';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isAuthenticated:boolean=false;
  constructor(private authService:AuthService){}
ngOnInit(){
this.authService.getAuthenticatedsub().subscribe((res:any)=>{this.isAuthenticated=res;console.log(this.isAuthenticated)});
this.isAuthenticated=this.authService.isAuthenticated;
}
logout(){
this.authService.logout()
}
}
