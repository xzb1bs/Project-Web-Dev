import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

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

  getBoardsByUser(userId: string): Observable<Board[]> {
    const boards = this.mockBoards.filter(board => board.userId === userId);
    return of(boards); // возвращаем как Observable
  }
}
