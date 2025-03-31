import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from './../models/user.model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css',
  ],
  imports: [CommonModule]
})

export class ProfileComponent implements OnInit {

  user: User | undefined;
  userId: number = 1;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    this.userService.getUser(this.userId).subscribe(
      user => this.user = user,
      error => console.error('Error when loading a profile', error)
    );
  }
}