import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DiaryService } from '../shared/diary.service';
import { DiaryModel } from '../shared/diary-model';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-diary-form',
  templateUrl: './diary-form.component.html',
  styleUrls: ['./diary-form.component.css']
})
export class DiaryFormComponent {
  date = new FormControl("");
  entry = new FormControl("");
  diaryForm: FormGroup;
  editMode: boolean;
  id: any;
  constructor(private diaryService: DiaryService, private route: ActivatedRoute, private router: Router) {
    this.diaryForm = new FormGroup({
      date: this.date,
      entry: this.entry
    })

    this.route.paramMap.subscribe((params) => {
      //if id is there in params then it is edit request
      if (params.has('id')) {
        this.editMode = true;
        this.id = params.get('id')!
        this.date.patchValue(this.diaryService.getEntrybyId(this.id).date);
        this.entry.patchValue(this.diaryService.getEntrybyId(this.id).entry)
      }
      else {
        this.editMode = false;
      }
    })
  }

  onSubmit() {
    const newEntry = new DiaryModel("", this.diaryForm.value.date, this.diaryForm.value.entry);
    if (this.editMode) {
      newEntry.id = this.id;
      this.diaryService.updateEntry(this.id, newEntry)
    }
    else {
      this.diaryService.addEntry(newEntry);
    }
    this.router.navigate([''])
  }
}
