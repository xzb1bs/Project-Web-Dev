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
    private taskService: TaskService,
  ) {
    this.isUserLoggedIn$ = this.authService.isLoggedIn$; // Присваиваем observable
  }

  ngOnInit(): void {
    // Получаем userId из маршрута, если оно есть
    this.userId = this.route.snapshot.paramMap.get('userId');
 
    this.loadBoards();

    this.taskService.getTasks().subscribe((data: any) => {
      this.tasks = data;
      console.log(this.tasks);
    });
  }
  openBoard(board: { id: number, title: string }) {
    this.router.navigate(['/boards', this.userId, board.id]);
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
    const id = this.route.snapshot.paramMap.get('userId')?.trim();
    if (id) {
      this.userId = id;
      this.boardService.getBoardsByUser(id).subscribe((data) => {
        this.boards = data;
      });
    } else {
      console.warn('User ID не найден в маршруте');
    }
  }
  
  handleCreateBoard(data: { title: string, color: string }) {
    this.boardService.createBoard({ title: data.title, color: data.color })
      .subscribe({
        next: () => {
          this.showModal = false;
          this.loadBoards(); // <--- обязательно
        },
        error: (err) => {
          alert(err.error.error || 'Ошибка создания доски');
        }
      });
  }
  
    
}

