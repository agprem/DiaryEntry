import { Component, OnInit } from '@angular/core';
import { DiaryService } from '../shared/diary.service';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.css']
})
export class DiaryComponent implements OnInit {
  constructor(private diaryService: DiaryService, private router: Router,private authService:AuthService) { }
  entries: any;
  isAuthenticated:boolean;
  user:any="Guest";
  isuser:any;
  ngOnInit() {
    //Get Diary Entries
    this.diaryService.getdiaryEntry();
    this.diaryService.diarySubject.subscribe((data => { this.entries = data })
    );

    this.authService.getAuthenticatedsub().subscribe((data)=>{this.isAuthenticated=data;console.log("auth",data);})
    this.isAuthenticated=this.authService.getAuthenticated();
    this.authService.user.subscribe((data:any)=>{this.user=data});
    this.isuser=this.authService.newuser;
  
  }
//Update 
  update(id: string) {
    this.router.navigate(["/data-entry", id])
  }

  //Delete
  delete(id: string) {
    this.diaryService.deleteEntry(id)
  }
}
