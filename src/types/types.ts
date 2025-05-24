export interface Agent {
  id: string;
  name: string;
  description: string;
  level: number;
  intelligence: number;
  autonomy: number;
  creativity: number;
  capabilities: string[];
  parentId: string | null;
  childIds?: string[];
  createdAt: string;
}

export interface Task {
  id: string;
  description: string;
  assignedAgentId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}