import { Injectable } from '@angular/core';
import { DiaryModel } from './diary-model';
import { BehaviorSubject, Subject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DiaryService {

  constructor(private http:HttpClient) { }
  diary_Entries: DiaryModel[] = []
  diarySubject = new Subject<DiaryModel[]>();
  //Getting all diary entries
  getdiaryEntry(){
    this.http.get<{diary_Entries:any}>("http://localhost:3000/getEntries").pipe(map((data:any)=>{
     return data.diary_Entries.map((entry:any)=> {
        return {
        entry:entry.entry,
        date:entry.date,
        id:entry._id
     } })
    })).subscribe((response)=>{
      this.diary_Entries=response;
      this.diarySubject.next(this.diary_Entries)},(err)=>{
      })
   
  }
  //Getting diary entry by id for populating in edit form
  getEntrybyId(id:string){
    const index=this.diary_Entries.findIndex((item)=>item.id==id)
    return {...this.diary_Entries[index]}
  }
  //Updating diary Entry
  updateEntry(id:string,entry:DiaryModel) {  
    // this.diary_Entries[id]=entry;
    // this.diarySubject.next([...this.diary_Entries]);
    this.http.put<{msg:string}>("http://localhost:3000/editEntry/" +id ,entry).subscribe((res)=>{
      this.getdiaryEntry();
    });

  }
  //Adding diary entry
  addEntry(newEntry: any) {
    // this.http.get<{entryid:number}>("http://localhost:3000/getid").subscribe((jsonId)=>newEntry.id=jsonId.entryid +1);
    this.http.post('http://localhost:3000/postEntry',newEntry).subscribe((res)=>{
      this.getdiaryEntry();
      } )
    // this.diary_Entries.push(newEntry);
  }
  //Deleting a diary entry
  deleteEntry(id:string){
    // this.diary_Entries.splice(id,1);
    this.http.delete('http://localhost:3000/deleteEntry/'+ id).subscribe((res)=>{
      this.getdiaryEntry();
      } );

  }
}
