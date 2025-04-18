import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardService } from '../../services/board.service';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CreateBoardComponent } from '../create-board/create-board.component';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-boards',
  standalone: true,
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.css'],
  imports: [CommonModule,CreateBoardComponent]
})
export class BoardsComponent implements OnInit {
  userId: string | null = null;
  boards: any[] = [];
  tasks: any[] = [];
  isUserLoggedIn$: Observable<boolean>; // Используем Observable для подписки

  constructor(
    private route: ActivatedRoute,
    private boardService: BoardService,
    private authService: AuthService,
    private router: Router,
    private taskService: TaskService
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
    this.loadBoards();

    this.taskService.getTasks().subscribe((data: any) => {
      this.tasks = data;
      console.log(this.tasks);
    });
  }

  openBoard(boardId: string): void {
    this.router.navigate(['/boards', boardId]); // Пример: /boards/123
  }
  

  

  logout(): void {
    this.authService.logout();
    // Перенаправляем пользователя на страницу входа после выхода
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (!isLoggedIn) {
        this.router.navigate(['']);
      }
    });
  }

  showModal = false;

  loadBoards(): void {
    if (this.userId) {
      this.boardService.getBoardsByUser(this.userId).subscribe((data) => {
        this.boards = data;
      });
    }
  }
  
  handleCreateBoard(data: { title: string, color: string }) {
    this.boardService.createBoard({ title: data.title, color: data.color, userId: this.userId! })
      .subscribe({ // Подобие добавления нового пользователя
        next: () => {
          this.showModal = false;
          this.loadBoards();
        },
        error: (err) => {
          alert(err.error.error || 'Ошибка создания доски');
          this.showModal = false;
        }
      });
    
  }
}
