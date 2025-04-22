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
    const newBoard = { id: Date.now(), title: board.title, userId: board.userId };
    this.mockBoards.push(newBoard);
    return of(newBoard); // имитация успешного ответа
  }

  

  getBoardsByUser(userId: string): Observable<Board[]> {
    const boards = this.mockBoards.filter(board => board.userId === userId);
    return of(boards);
  }
}
