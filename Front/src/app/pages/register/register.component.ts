import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { FormsModule } from '@angular/forms'; 
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  imports: [CommonModule, FormsModule]
})
export class RegisterComponent {
  password: string = '';
  email:string='';

  constructor(private router: Router,
    private dataService: DataService,
    private location: Location,
    private http: HttpClient,
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
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert(err.error.error || 'Registration failed');
      }
    });
  }

  goBack(event:Event):void {
    event.preventDefault(); 
    this.router.navigate(['/'])
  } 
}
