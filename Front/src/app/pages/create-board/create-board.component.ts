import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-board',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-board.component.html',
  styleUrls: ['./create-board.component.css']
})
export class CreateBoardComponent {
  title = '';
  selectedColor = '#0079bf';  
  
  colors = ['#0079bf', '#d29034', '#519839', '#b04632', '#89609e', '#cd5a91'];

  @Output() create = new EventEmitter<{ title: string, color: string }>();
  @Output() close = new EventEmitter<void>();

  submit(): void {
    if (this.title.trim()) {
      this.create.emit({ title: this.title.trim(), color: this.selectedColor });
      this.title = '';
    } else {
      alert('Введите название доски');
    }
  }

  closeModal(): void {
    this.close.emit();
  }
}
