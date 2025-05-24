import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Bot, CheckCircle, Activity, Search, XCircle } from 'lucide-react';
import { TaskCard } from '../components/TaskCard';
import { useTasks } from '../hooks/useTasks';
import { useAgents } from '../hooks/useAgents';
import { Task } from '../types/types';

export const ManageTasks: React.FC = () => {
  const { tasks, createTask } = useTasks();
  const { agents } = useAgents();
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState<string | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  const handleCreateTask = () => {
    if (!newTaskDescription || !selectedAgentId) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      description: newTaskDescription,
      assignedAgentId: selectedAgentId,
      status: 'pending',
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    createTask(newTask);
    setNewTaskDescription('');
  };
  
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' 
      ? true 
      : filterStatus === 'completed' 
        ? task.completed 
        : !task.completed;
    return matchesSearch && matchesStatus;
  });
  
  return (
    <div className="animate-fadeIn">
      <Link to="/" className="inline-flex items-center text-slate-300 hover:text-white mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>
      
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Task Management</h1>
        <p className="text-slate-300">
          Create and manage tasks for your AI agents
        </p>
      </div>
      
      <div className="bg-slate-800/30 backdrop-blur rounded-xl border border-slate-700 p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Create New Task</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="taskDescription" className="block text-sm font-medium text-slate-300 mb-1">
              Task Description
            </label>
            <input
              type="text"
              id="taskDescription"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              className="w-full bg-slate-800/70 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              placeholder="Describe the task..."
            />
          </div>
          
          <div>
            <label htmlFor="assignAgent" className="block text-sm font-medium text-slate-300 mb-1">
              Assign Agent
            </label>
            <select
              id="assignAgent"
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
              className="w-full bg-slate-800/70 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Select an agent</option>
              {agents.map(agent => (
                <option key={agent.id} value={agent.id}>
                  {agent.name} (Level {agent.level})
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <button
            onClick={handleCreateTask}
            disabled={!newTaskDescription || !selectedAgentId}
            className="flex items-center px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Task
          </button>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">All Tasks</h2>
          
          <div className="flex space-x-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-800/70 border border-slate-600 rounded-lg pl-9 pr-4 py-1.5 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-sm w-60"
                placeholder="Search tasks..."
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-800/70 border border-slate-600 rounded-lg px-3 py-1.5 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-sm"
            >
              <option value="all">All Tasks</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-700">
            <Activity className="h-12 w-12 mx-auto text-slate-500 mb-4" />
            <h3 className="text-xl font-medium text-slate-300 mb-2">No Tasks Found</h3>
            <p className="text-slate-400 mb-6">
              {tasks.length === 0 
                ? "You haven't created any tasks yet" 
                : "No tasks match your current filters"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
        
        <div className="mt-6 flex justify-between items-center text-sm text-slate-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Activity className="h-4 w-4 mr-1 text-yellow-400" />
              <span>{tasks.filter(t => !t.completed).length} active</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-1 text-green-400" />
              <span>{tasks.filter(t => t.completed).length} completed</span>
            </div>
          </div>
          
          <div>
            <span>Total: {tasks.length} tasks</span>
          </div>
        </div>
      </div>
    </div>
  );
};