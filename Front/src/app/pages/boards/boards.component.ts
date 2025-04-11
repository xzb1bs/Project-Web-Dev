import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardService } from '../../services/board.service';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-boards',
  standalone: true,
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.css'],
  imports: [CommonModule]
})
export class BoardsComponent implements OnInit {
  userId: string | null = null;
  boards: any[] = [];
  isUserLoggedIn$: Observable<boolean>; // Используем Observable для подписки

  constructor(
    private route: ActivatedRoute,
    private boardService: BoardService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.isUserLoggedIn$ = this.authService.isLoggedIn$; // Присваиваем observable
  }

  ngOnInit(): void {
    // Получаем userId из маршрута, если оно есть
    this.userId = this.route.snapshot.paramMap.get('userId');
    if (this.userId) {
      this.boardService.getBoardsByUser(this.userId).subscribe((data) => {
        this.boards = data;
      });
    }
  }

  logout(): void {
    this.authService.logout();
    // Перенаправляем пользователя на страницу входа после выхода
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (!isLoggedIn) {
        this.router.navigate(['/home']);
      }
    });
  }
}
