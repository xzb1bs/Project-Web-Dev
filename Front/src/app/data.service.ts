import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // Сервис доступен во всем приложении
})
export class DataService {
  private email: string = '';

  constructor() { }

  setEmail(email: string): void {
    this.email = email;
  }

  getEmail(): string {
    return this.email;
  }
}
