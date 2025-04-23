import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private apiUrl = 'http://127.0.0.1:8000/api/task-list/';

  constructor(private http: HttpClient) {}
  deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${taskId}/`);
  }
  getTasks() {
    return this.http.get(this.apiUrl);
  }
}
