import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from '../../app.component';

@Component({
  imports: [
    BrowserModule,
    FormsModule
  ],
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerData = {
    username: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService.register(this.registerData).subscribe(
      () => this.router.navigate(['/tasks']),
      error => console.error('Registration failed', error)
    );
  }
}