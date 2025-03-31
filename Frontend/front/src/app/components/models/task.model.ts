export interface Task {
    id: number;
    title: string;
    description: string;
    dueDate: Date;
    priority: 'low' | 'medium' | 'high';
    status: 'open' | 'in progress' | 'completed';
    assigneeId?: number;
    projectId?: number;
  }