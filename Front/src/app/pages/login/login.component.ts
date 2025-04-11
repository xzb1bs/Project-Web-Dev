import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { FormsModule } from '@angular/forms'; // импортируем для ngModel
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule] // импортируем необходимые модули
})
export class LoginComponent {
  password: string = '';
  email:string='';

  constructor(
    private router: Router,
    private dataService: DataService,
    private location: Location,
    private http: HttpClient,
  ) 
  {
  }

  onSubmit():void {
    if (!this.email || !this.password) {
      alert('Please fill in both fields');
      return;
    }
  
    this.http.post('http://localhost:8000/api/login/', {
      email: this.email,
      password: this.password
    }).subscribe({  //Подобие проверки почты и пароля через джанго
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        alert('Invalid email or password');
      }
    });
  }

  goReg(event:Event):void{
    event.preventDefault(); 
    this.router.navigate(['/register'])
  }

  goBack(event:Event):void {
    event.preventDefault(); 
    this.router.navigate(['/'])
  } 
}
