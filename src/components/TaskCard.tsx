import React from 'react';
import { CheckCircle, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Task } from '../types/types';
import { useTasks } from '../hooks/useTasks';
import { useAgents } from '../hooks/useAgents';

type TaskCardProps = {
  task: Task;
};

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { updateTask, deleteTask } = useTasks();
  const { getAgentById } = useAgents();
  
  const agent = task.assignedAgentId ? getAgentById(task.assignedAgentId) : null;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const getStatusIcon = () => {
    switch (task.status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-400" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-400" />;
    }
  };
  
  const getStatusColor = () => {
    switch (task.status) {
      case 'completed': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'in_progress': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'failed': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    }
  };
  
  const toggleTaskCompletion = () => {
    updateTask(task.id, {
      ...task,
      completed: !task.completed,
      status: !task.completed ? 'completed' : 'pending'
    });
  };

  return (
    <div className={`bg-slate-800/70 backdrop-blur rounded-lg border border-slate-700 p-4 transition-all duration-300 ${
      task.completed ? 'opacity-70' : ''
    }`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <button 
            onClick={toggleTaskCompletion}
            className={`p-1 rounded-full mr-2 transition-colors ${
              task.completed 
                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
          </button>
          <p className={`font-medium ${task.completed ? 'text-slate-400 line-through' : 'text-white'}`}>
            {task.description}
          </p>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor()}`}>
          {task.status.replace('_', ' ')}
        </span>
      </div>
      
      <div className="flex justify-between items-center ml-7 text-xs text-slate-400">
        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          <span>{formatDate(task.createdAt)}</span>
        </div>
        
        <button
          onClick={() => deleteTask(task.id)}
          className="text-red-400 hover:text-red-300 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};