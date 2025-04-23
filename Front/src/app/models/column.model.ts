export interface Task {
  id?: number;
  title: string;
  column: number;
}

export interface Column {
  id?: number; 
  title: string;
  tasks: Task[];
}