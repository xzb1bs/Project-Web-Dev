import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Column, Task } from '../models/column.model';

@Injectable({
  providedIn: 'root'
})
export class InboardService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  // Получение задач по доске
  getColumns(boardId:number) {
    return this.http.get<Column[]>(`${this.apiUrl}/columns/?board=${boardId}`);
  }
  
  addColumn(boardId:number, columnTitle: string) {
    return this.http.post<Column>(`${this.apiUrl}/columns/`, {
      board: boardId,  
      title: columnTitle,
    });}

  getBoardContent(boardTitle: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/${boardTitle}`);
  }

  // Добавление задачи в доску с колонкой
  addTaskToBoard(boardId:number, task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/boards/${boardId}/add-task/`, task);
  }

  getTasksForColumn(columnId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/columns/${columnId}/tasks/`);
  }
}
