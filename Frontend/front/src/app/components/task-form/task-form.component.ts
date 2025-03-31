import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from '../../app.component';

import { CommonModule } from '@angular/common';
import { Task } from './../models/task.model';




@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }
@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {

  taskForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: ['', Validators.required],
      priority: ['medium'],
      status: ['open']
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.taskService.createTask(this.taskForm.value).subscribe(() => this.router.navigate(['/tasks']));
    }
  }
}

// Remove the NgModule declaration from this file