import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { InboardService } from '../../services/inboard.service';
import { Column,Task} from '../../models/column.model';
import { Board } from '../../services/board.service';


@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent implements OnInit {
  isUserLoggedIn$: Observable<boolean>; 
  boardTitle: string = '';
  tasks: Task[] = [];  
  boardId:number =0;
  isLoading: boolean = true;
  currentBoard!: Board;

  columns: Column[] = [];

  constructor(
    private taskService:TaskService,
    private inboardService: InboardService,
    private route: ActivatedRoute,
    private boardService: BoardService,
    private authService: AuthService,
    private router: Router,
    private location: Location
  ) {
    this.isUserLoggedIn$ = this.authService.isLoggedIn$;
  }

  ngOnInit(): void {
    this.boardId = Number(this.route.snapshot.paramMap.get('id'));

    this.boardService.getBoardById(this.boardId).subscribe({
      next: (board) => {
        this.currentBoard = board;
        this.boardTitle = board.title;


        this.loadColumns();
      },
      error: (err) => {
        console.error('Ошибка при загрузке доски:', err);
        alert('Не удалось загрузить доску');
      }
    });
  }

  // 🟢 Метод для распределения задач по колонкам (заглушка или реальное разделение)
 

  loadColumns(): void {
    this.inboardService.getColumns(this.boardId).subscribe({
      next: (columns) => {
        // Можно сразу загружать пустые массивы задач (если нужно)
        this.columns = columns.map(col => ({ ...col, tasks: [] }));

        // Загрузить задачи для каждой колонки
        this.columns.forEach(col => this.loadTasksForColumn(col));
      },
      error: () => {
        alert('Ошибка при загрузке колонок');
      }
    });
  }

  deleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId).subscribe(
      () => {
        // Обновляем список задач после удаления
        this.tasks = this.tasks.filter(task => task.id !== taskId);
      },
      (error) => {
        console.error('Ошибка при удалении задачи:', error);
      }
    );
  }

  loadTasksForColumn(column: Column): void {
    if (!column.id) return;
  
    this.inboardService.getTasksForColumn(column.id).subscribe({
      next: (tasks) => column.tasks = tasks,
      error: () => {
        alert(`Ошибка при загрузке задач для колонки: ${column.title}`);
      }
    });}

  
  back(): void {
    this.location.back();
  }
  
  deleteBoard(): void {
    if (confirm('Вы уверены, что хотите удалить эту доску?')) {
      this.boardService.deleteBoard(this.boardId).subscribe({
        next: () => {
          alert('Доска успешно удалена');
          this.location.back();
        },
        error: (err) => {
          console.error('Ошибка при удалении доски:', err);
          alert('Не удалось удалить доску');
        }
      });
    }
  }

  addColumn() {
  const title = prompt('Введите название колонки:');
  if (title) {
    this.inboardService.addColumn(this.boardId, title).subscribe({
      next: (newColumn) => this.columns.push({ ...newColumn, tasks: [] }),
      error: () => alert('Ошибка при добавлении колонки')
    });
  }
  }
  addTask(column: Column) {
    const taskTitle = prompt('Введите название карточки:');
    if (taskTitle && column.id !== undefined) {  // Проверка на undefined
      const newTask: Task = {
        title: taskTitle,
        column: column.id  // Теперь точно number
      };
  
      this.inboardService.addTaskToBoard(this.boardId, newTask).subscribe({
        next: (createdTask) => column.tasks.push(createdTask),
        error: () => alert('Ошибка при добавлении задачи')
      });
    }
  }
}
