import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'] 
})
export class HomeComponent {
  loginForm: FormGroup;
  email:string='';

  message: string = '';

  sendMessage(): void {
    console.log('Message sent:', this.message);
    this.message = ''; // Clear the message after sending
  }
  scrollToFooter(): void {
    const footerElement = document.getElementById('footer');
    if (footerElement) {
      footerElement.scrollIntoView({ behavior: 'smooth' });
    }
  
  }
  constructor(private fb: FormBuilder,private router: Router,private dataService: DataService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
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
