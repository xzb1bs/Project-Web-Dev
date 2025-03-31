import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskDetailComponent } from './components/task-detail/task-detail.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    TaskFormComponent
  ],
  imports: [       
    FormsModule,    
    ReactiveFormsModule, 
    HttpClientModule, 
    AppRoutingModule,  
    AppComponent,     
    TaskListComponent,
    TaskDetailComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    TaskFormComponent,
    RouterModule,
    CommonModule
  ],
  providers: [    
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } 
  ],
})
export class AppModule { }