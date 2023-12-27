import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'diary';
  constructor(private authService :AuthService){}
  ngOnInit(): void {
    //Checking token is expired or not 
    this.authService.authenticatefromlocalstorage();
  }
}
