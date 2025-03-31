import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskDetailComponent } from './components/task-detail/task-detail.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from './/guards/auth.guard';
import { BrowserModule } from '@angular/platform-browser';


import { AppComponent } from './app.component';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    RouterModule, // Import RouterModule to enable router-outlet
    AppComponent
  ],
  providers: [],
})
export class AppModule { }

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'tasks', component: TaskListComponent, canActivate: [AuthGuard] },
  { path: 'tasks/:id', component: TaskDetailComponent, canActivate: [AuthGuard] },
  { path: 'tasks/new', component: TaskFormComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/tasks', pathMatch: 'full' },
  { path: '**', redirectTo: '/tasks' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }