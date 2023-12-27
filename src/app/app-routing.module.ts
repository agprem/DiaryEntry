import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiaryFormComponent } from './diary-form/diary-form.component';
import { DiaryComponent } from './diary/diary.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { RouteGuard } from './shared/auth.guard';

const routes: Routes = [
{path:"data-entry",component:DiaryFormComponent},
{path:'',component:DiaryComponent},
{path:'newentry',component:DiaryFormComponent,canActivate:[RouteGuard]},
{path:'data-entry/:id',component:DiaryFormComponent,canActivate:[RouteGuard]},
{path:'login',component:LoginComponent},
{path:'sign-up',component:SignupComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[RouteGuard]
})
export class AppRoutingModule { }
