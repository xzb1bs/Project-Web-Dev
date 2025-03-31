import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from './../models/task.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css'],
  imports: [CommonModule]
})
export class TaskDetailComponent implements OnInit {

  task: Task | undefined;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    this.getTask();
  }

  getTask(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.taskService.getTask(id).subscribe(task => this.task = task);
  }
}

