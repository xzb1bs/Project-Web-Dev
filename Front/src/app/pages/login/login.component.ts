import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // импортируем для ngModel
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service'; // импортируем AuthService

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule] // импортируем необходимые модули
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private location: Location,
    private http: HttpClient,
    private authService: AuthService, // инжектим сервис авторизации
  ) {}

  ngOnInit(): void {
    // Можно, например, проверять, если пользователь уже залогинен, перенаправлять его на доски
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/boards']);
    }
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      alert('Please fill in both fields');
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (userId) => {
        this.router.navigate(['/boards']);
      },
      error: () => {
        alert('Invalid email or password');
      }
    });
  }

  goReg(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/register']);
  }

  goBack(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/']);
  }
}
