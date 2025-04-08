import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { DataService } from '../../data.service';
import { FormsModule } from '@angular/forms'; // импортируем для ngModel

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule] // импортируем необходимые модули
})
export class LoginComponent implements OnInit {
  password: string = '';
  email:string='';

  constructor(private router: Router,private dataService: DataService,
    private location: Location,
  ) {
  }
  ngOnInit(): void {
    this.email=this.dataService.getEmail();
  }

  onSubmit():void {
    if (this.email && this.password) {
      console.log('Email:', this.email);
      console.log('Password:', this.password);
      this.router.navigate(['/dashboard']);
    } else {
      alert('Please fill in both fields');  
    }
  }

  goBack(event:Event):void {
    event.preventDefault(); 
    this.location.back();
  } 
}
