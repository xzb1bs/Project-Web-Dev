import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { FormsModule } from '@angular/forms'; 
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  imports: [CommonModule, FormsModule]
})
export class RegisterComponent {
  password: string = '';
  email:string='';
  form = {
    username: '',
    email: '',
    password: ''
  };
  

  constructor(private router: Router,
    private dataService: DataService,
    private location: Location,
    private http: HttpClient,
    private authService: AuthService
  ) {
  }
  ngOnInit(): void {
    this.email=this.dataService.getEmail();
  }

  onSubmit():void {
    if (!this.email || !this.password) {
      alert('Please fill in both fields');
      return;
    }

    this.http.post('http://localhost:8000/api/register/', {
      email: this.email,
      password: this.password
    }).subscribe({ // Подобие добавления нового пользователя
      next: () => {
        alert('Registration successful!');
        this.router.navigate(['/boards']);
      },
      error: (err) => {
        alert(err.error.error || 'Registration failed');
      }
    });
  }
  register(): void {
    this.authService.register(this.form.email, this.form.email, this.form.password)
      .subscribe({
        next: () => {
          alert('Регистрация прошла успешно!');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          alert(err.error?.error || 'Ошибка регистрации');
        }
      });
  }

  onLogin(event:Event) { // Сохраняем почту в сервис
    event.preventDefault(); 
    this.router.navigate(['/login']);  // Переходим на страницу login
    }

  goBack(event:Event):void {
    event.preventDefault(); 
    this.router.navigate(['/'])
  } 
}
