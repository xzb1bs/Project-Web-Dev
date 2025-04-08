import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  loginForm: FormGroup;
  email:string='';

  constructor(private fb: FormBuilder,private router: Router,private dataService: DataService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onLogin() { // Сохраняем почту в сервис
    this.router.navigate(['/login']);  // Переходим на страницу login
    }

  onReg(){
    const email = this.loginForm.value.email;
    if (email) {
      this.dataService.setEmail(email);  // Сохраняем почту в сервис
      this.router.navigate(['/register']);  // Переходим на страницу login
    }
  }
    
}
