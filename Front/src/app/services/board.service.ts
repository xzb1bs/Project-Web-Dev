import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface Board {
  id: number;
  title: string;
  userId: string;
}

@Injectable({ providedIn: 'root' })
export class BoardService {
  private mockBoards: Board[] = [
    { id: 1, title: 'Project Phoenix', userId: '123' },
    { id: 2, title: 'Kanban Flow', userId: '123' },
    { id: 3, title: 'Marketing Plan', userId: '456' }
  ];
  constructor(private http:HttpClient){}
  // board.service.ts
  createBoard(board: { title: string; userId: string; color: string }): Observable<any> {
    return this.http.post('http://localhost:8000/task-list/', board);
  }

  

  getBoardsByUser(userId: string): Observable<Board[]> {
    const boards = this.mockBoards.filter(board => board.userId === userId);
    return of(boards); // возвращаем как Observable
  }
}
