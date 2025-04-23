import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';


export interface Board {
  id: number;
  title: string;
  userId: string;
  color?: string;
}

@Injectable({ providedIn: 'root' })
export class BoardService {
  private apiUrl = 'http://127.0.0.1:8000/api/boards/'; // ссылка на DRF ViewSet

  constructor(private http: HttpClient) {}

  getBoardById(id: number): Observable<Board> {
    return this.http.get<Board>(`${this.apiUrl}${id}/`);
  }

  // Создание доски
  createBoard(boardData: { title: string; color: string }): Observable<any> {
    return this.http.post(this.apiUrl, {
      title: boardData.title,
      color: boardData.color
      
    });
  }

  deleteBoard(id: number): Observable<any> {

    return this.http.delete(`${this.apiUrl}${id}/`);
    }

  // Получение досок пользователя
  getBoardsByUser(userId: string): Observable<Board[]> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get<Board[]>(this.apiUrl, { params });
  }
}
