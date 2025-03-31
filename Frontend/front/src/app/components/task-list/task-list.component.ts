import { Component, OnInit } from '@angular/core';
import { Task } from './../models/task.model';
import { TaskService } from '../../services/task.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from '../../app.component';
import { RouterModule } from '@angular/router';

@Component({
  imports: [
    BrowserModule,
    RouterModule
  ],
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  tasks: Task[] = [];

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe(
      tasks => this.tasks = tasks,
      error => console.error('Error when loading tasks', error)
    );
  }

  deleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId).subscribe(() => this.loadTasks());
  }
}