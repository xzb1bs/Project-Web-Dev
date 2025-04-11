import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, Observable, of, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = false;
  private userId:string ='';
  private mockUser = {
    email: 'test@example.com',
    password: '123456',
    id: '123'
  };
  
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor() {
    // Загружаем статус из localStorage при инициализации сервиса
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.userId = storedUserId;
      this.isLoggedInSubject.next(true); // если есть ID — считаем пользователя залогиненным
        }
    }
    private checkLoggedInStatus(): boolean {
        // Проверяем localStorage, чтобы установить статус
        return !!localStorage.getItem('userId');
    }

  setUserId(id: string): void {
    this.userId = id;
  }

  getUserId(): string {
    return this.userId;
  }

  login(email: string, password: string): Observable<string> {
    if (email === this.mockUser.email && password === this.mockUser.password) {
      this.userId = this.mockUser.id;
      localStorage.setItem('userId', this.userId); // Сохраняем userId в localStorage
      this.isLoggedInSubject.next(true);
      return of(this.mockUser.id).pipe(delay(500)); // имитируем задержку
    } else {
      return throwError(() => new Error('Invalid email or password'));
    }
  }

  logout() {
    this.loggedIn = false;
    this.userId = '';
    localStorage.removeItem('userId'); // Удаляем userId из localStorage
    this.isLoggedInSubject.next(false); 
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value; 
    
  }
}
