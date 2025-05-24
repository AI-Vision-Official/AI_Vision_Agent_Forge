import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Task } from '../types/types';

interface TaskContextType {
  tasks: Task[];
  createTask: (task: Task) => void;
  updateTask: (id: string, updatedTask: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTaskById: (id: string) => Task | null;
  getTasksByAgentId: (agentId: string) => Task[];
}

export const TaskContext = createContext<TaskContextType>({
  tasks: [],
  createTask: () => {},
  updateTask: () => {},
  deleteTask: () => {},
  getTaskById: () => null,
  getTasksByAgentId: () => []
});

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  // Initialize with sample tasks for demonstration
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      description: 'Research latest AI advancements in natural language processing',
      assignedAgentId: '1',
      status: 'in_progress',
      completed: false,
      createdAt: new Date().toISOString()
    }
  ]);

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const createTask = (task: Task) => {
    setTasks([...tasks, task]);
  };

  const updateTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { 
            ...task, 
            ...updatedTask,
            completedAt: updatedTask.completed && !task.completed 
              ? new Date().toISOString() 
              : task.completedAt
          } 
        : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const getTaskById = (id: string): Task | null => {
    return tasks.find(task => task.id === id) || null;
  };
  
  const getTasksByAgentId = (agentId: string): Task[] => {
    return tasks.filter(task => task.assignedAgentId === agentId);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        createTask,
        updateTask,
        deleteTask,
        getTaskById,
        getTasksByAgentId
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};