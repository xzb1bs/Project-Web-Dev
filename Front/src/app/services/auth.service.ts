import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {jwtDecode} from 'jwt-decode';
import { BehaviorSubject, catchError, delay, map, Observable, of, throwError } from 'rxjs';


interface JWTPayload {
  user_id: string;
  exp: number;
  iat: number;
}


@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = false;
  private userId:string ='';
  private mockUser = {
    email: 'test@example.com',
    password: '123456',
    id: '123'
  };

  private apiUrl = 'http://127.0.0.1:8000/api';
  
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {
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
  return this.http.post<any>(`${this.apiUrl}/login/`, { email, password }).pipe(
    // Распарсим ответ и получим токены
    map((res) => {
      const access = res.access;
      const refresh = res.refresh;
  
      // Декодируем access-токен, чтобы получить user_id
      const decoded = jwtDecode<JWTPayload>(access);
      const userId = decoded.user_id;
  
      // Сохраняем токены и userId в localStorage
      localStorage.setItem('token', access);
      localStorage.setItem('refresh', refresh);
      localStorage.setItem('userId', userId);
  
      this.userId = userId;
      this.isLoggedInSubject.next(true);
  
      return userId;
    }),
    catchError(() => throwError(() => new Error('Invalid credentials')))
  );
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
  register(username: string, email: string, password: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/register/`, {
    username,
    email,
    password,
  });
}

}
