import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { DataService } from '../../data.service';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  imports: [CommonModule, FormsModule]
})
export class RegisterComponent {
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
      this.router.navigate(['/boards']);
    } else {
      alert('Please fill in both fields');  
    }
  }

  goBack(event:Event):void {
    event.preventDefault(); 
    this.location.back();
  } 
}
