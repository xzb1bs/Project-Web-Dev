import { CommonModule } from '@angular/common';
import { Component , OnInit} from '@angular/core';
import { BoardService } from '../../services/board.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';


@Component({
  selector: 'app-board',
  imports: [CommonModule],
  standalone:true,
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent implements OnInit{
  isUserLoggedIn$: Observable<boolean>; 
  boardTitle: string =''; // или boardTitle, если удаляете по названию
  currentBoard: any;

  constructor(
    private route: ActivatedRoute,
    private boardService: BoardService,
    private authService: AuthService,
    private router: Router,
    private taskService: TaskService,
    private location: Location
  ) {
    this.isUserLoggedIn$ = this.authService.isLoggedIn$; // Присваиваем observable
  }
  ngOnInit(): void {
    
    this.boardTitle = this.route.snapshot.paramMap.get('title')!;
  }

  deleteBoard(title: string): void {
    if (confirm('Вы уверены, что хотите удалить эту доску?')) {
      this.boardService.deleteBoard(title).subscribe({
        next: () => {
          alert('Доска успешно удалена');
          this.location.back()
          // Обновляем список досок или выполняем другие действия
        },
        error: (err) => {
          console.error('Ошибка при удалении доски:', err);
          alert('Не удалось удалить доску');
        }
      });
    }
  }
}
