import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Brain, GitBranch, Trash2, Plus, ArrowLeft, 
  Clock, Zap, Sparkles, Shield, Activity, Bot
} from 'lucide-react';
import { useAgents } from '../hooks/useAgents';
import { useTasks } from '../hooks/useTasks';
import { TaskCard } from '../components/TaskCard';
import { Task } from '../types/types';

export const AgentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { agents, getAgentById, deleteAgent, createChildAgent } = useAgents();
  const { tasks, createTask } = useTasks();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCreateChildForm, setShowCreateChildForm] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildDescription, setNewChildDescription] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  
  const agent = id ? getAgentById(id) : null;
  const parentAgent = agent?.parentId ? getAgentById(agent.parentId) : null;
  const childAgents = agents.filter(a => a.parentId === id);
  const agentTasks = tasks.filter(task => task.assignedAgentId === id);
  
  if (!agent) {
    return (
      <div className="text-center py-16">
        <Brain className="h-16 w-16 mx-auto text-slate-500 mb-6" />
        <h2 className="text-2xl font-bold mb-2">Agent Not Found</h2>
        <p className="text-slate-400 mb-6">The agent you're looking for doesn't exist or has been deleted</p>
        <Link 
          to="/"
          className="inline-flex items-center px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }
  
  const handleDeleteAgent = () => {
    deleteAgent(agent.id);
    navigate('/');
  };
  
  const handleCreateChildAgent = () => {
    if (!newChildName || !newChildDescription) return;
    
    createChildAgent({
      name: newChildName,
      description: newChildDescription,
      parentId: agent.id,
      // Inherit some capabilities but not all
      capabilities: agent.capabilities.slice(0, Math.max(1, Math.floor(agent.capabilities.length / 2))),
      intelligence: Math.max(1, agent.intelligence - 1)
    });
    
    setNewChildName('');
    setNewChildDescription('');
    setShowCreateChildForm(false);
  };
  
  const handleCreateTask = () => {
    if (!newTaskDescription) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      description: newTaskDescription,
      assignedAgentId: agent.id,
      status: 'pending',
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    createTask(newTask);
    setNewTaskDescription('');
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="animate-fadeIn">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-slate-300 hover:text-white mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        
        <div className="bg-slate-800/30 backdrop-blur rounded-xl border border-slate-700 p-6">
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div className="flex items-start mb-4 md:mb-0">
              <div className={`p-3 rounded-lg ${agent.level > 1 ? 'bg-purple-500/20' : 'bg-teal-500/20'}`}>
                <Brain className={`h-8 w-8 ${agent.level > 1 ? 'text-purple-400' : 'text-teal-400'}`} />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-white">{agent.name}</h1>
                <div className="flex items-center text-sm text-slate-400">
                  <span>Level {agent.level} Agent</span>
                  {parentAgent && (
                    <div className="flex items-center ml-3">
                      <GitBranch className="h-3 w-3 mr-1" />
                      <span>Created by <Link to={`/agent/${parentAgent.id}`} className="text-teal-400 hover:underline">{parentAgent.name}</Link></span>
                    </div>
                  )}
                  <div className="flex items-center ml-3">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Created {formatDate(agent.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCreateChildForm(true)}
                className="flex items-center px-3 py-1.5 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors text-sm"
              >
                <Plus className="mr-1 h-3.5 w-3.5" />
                Create Child Agent
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center px-3 py-1.5 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-900/50 border border-red-900/50 transition-colors text-sm"
              >
                <Trash2 className="mr-1 h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
          
          <p className="text-slate-300 mb-6">{agent.description}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-800/70 rounded-lg p-3 border border-slate-700">
              <div className="flex items-center text-yellow-400 mb-1">
                <Zap className="h-4 w-4 mr-1" />
                <h3 className="text-sm font-medium">Intelligence</h3>
              </div>
              <div className="flex items-end">
                <span className="text-xl font-bold text-white">{agent.intelligence}</span>
                <span className="text-xs text-slate-400 ml-1 mb-0.5">/10</span>
              </div>
            </div>
            
            <div className="bg-slate-800/70 rounded-lg p-3 border border-slate-700">
              <div className="flex items-center text-purple-400 mb-1">
                <Shield className="h-4 w-4 mr-1" />
                <h3 className="text-sm font-medium">Autonomy</h3>
              </div>
              <div className="flex items-end">
                <span className="text-xl font-bold text-white">{agent.autonomy}</span>
                <span className="text-xs text-slate-400 ml-1 mb-0.5">/10</span>
              </div>
            </div>
            
            <div className="bg-slate-800/70 rounded-lg p-3 border border-slate-700">
              <div className="flex items-center text-blue-400 mb-1">
                <Sparkles className="h-4 w-4 mr-1" />
                <h3 className="text-sm font-medium">Creativity</h3>
              </div>
              <div className="flex items-end">
                <span className="text-xl font-bold text-white">{agent.creativity}</span>
                <span className="text-xs text-slate-400 ml-1 mb-0.5">/10</span>
              </div>
            </div>
            
            <div className="bg-slate-800/70 rounded-lg p-3 border border-slate-700">
              <div className="flex items-center text-green-400 mb-1">
                <Activity className="h-4 w-4 mr-1" />
                <h3 className="text-sm font-medium">Tasks</h3>
              </div>
              <div className="flex items-end">
                <span className="text-xl font-bold text-white">{agentTasks.length}</span>
                <span className="text-xs text-slate-400 ml-1 mb-0.5">total</span>
                <span className="text-xs text-green-400 ml-2 mb-0.5">
                  {agentTasks.filter(t => t.completed).length} completed
                </span>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-sm font-medium text-slate-300 mb-2">Capabilities</h3>
            <div className="flex flex-wrap gap-2">
              {agent.capabilities.map((capability, index) => {
                let bgColor, textColor;
                switch (capability.toLowerCase()) {
                  case 'research': 
                    bgColor = 'bg-blue-500/20 border-blue-500/30'; 
                    textColor = 'text-blue-300';
                    break;
                  case 'coding': 
                    bgColor = 'bg-green-500/20 border-green-500/30'; 
                    textColor = 'text-green-300';
                    break;
                  case 'analysis': 
                    bgColor = 'bg-purple-500/20 border-purple-500/30'; 
                    textColor = 'text-purple-300';
                    break;
                  case 'creative': 
                    bgColor = 'bg-yellow-500/20 border-yellow-500/30'; 
                    textColor = 'text-yellow-300';
                    break;
                  case 'planning': 
                    bgColor = 'bg-indigo-500/20 border-indigo-500/30'; 
                    textColor = 'text-indigo-300';
                    break;
                  case 'learning': 
                    bgColor = 'bg-pink-500/20 border-pink-500/30'; 
                    textColor = 'text-pink-300';
                    break;
                  default: 
                    bgColor = 'bg-slate-500/20 border-slate-500/30'; 
                    textColor = 'text-slate-300';
                }
                
                return (
                  <span 
                    key={index}
                    className={`px-3 py-1 rounded-full border ${bgColor} ${textColor} text-sm`}
                  >
                    {capability}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Child Agents</h2>
          </div>
          
          {childAgents.length === 0 ? (
            <div className="bg-slate-800/30 backdrop-blur rounded-xl border border-slate-700 p-6 text-center">
              <Bot className="h-10 w-10 mx-auto text-slate-500 mb-3" />
              <h3 className="text-lg font-medium text-slate-300 mb-2">No Child Agents</h3>
              <p className="text-slate-400 mb-4 text-sm">This agent hasn't created any child agents yet</p>
              <button
                onClick={() => setShowCreateChildForm(true)}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors text-sm"
              >
                <Plus className="mr-1 h-4 w-4" />
                Create Child Agent
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {childAgents.map(childAgent => (
                <div 
                  key={childAgent.id} 
                  className="bg-slate-800/30 backdrop-blur rounded-xl border border-slate-700 p-4 hover:bg-slate-800/50 transition-colors"
                >
                  <Link to={`/agent/${childAgent.id}`} className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-purple-500/20">
                        <Brain className="h-5 w-5 text-purple-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="font-bold text-white">{childAgent.name}</h3>
                        <div className="flex items-center text-xs text-slate-400">
                          <span>Level {childAgent.level} Agent</span>
                          <span className="mx-1">•</span>
                          <span>{childAgent.capabilities.length} capabilities</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Zap className="h-3.5 w-3.5 text-yellow-400" />
                      <span className="text-sm font-medium text-yellow-400">{childAgent.intelligence}</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
          
          {showCreateChildForm && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full">
                <h3 className="text-xl font-bold mb-4">Create Child Agent</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="childName" className="block text-sm font-medium text-slate-300 mb-1">
                      Child Agent Name
                    </label>
                    <input
                      type="text"
                      id="childName"
                      value={newChildName}
                      onChange={(e) => setNewChildName(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                      placeholder="e.g., SpecialistBot"
                    />
                  </div>
                  <div>
                    <label htmlFor="childDescription" className="block text-sm font-medium text-slate-300 mb-1">
                      Child Agent Description
                    </label>
                    <textarea
                      id="childDescription"
                      value={newChildDescription}
                      onChange={(e) => setNewChildDescription(e.target.value)}
                      rows={3}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                      placeholder="Describe what this child agent will do..."
                    />
                  </div>
                  <div className="pt-4 flex justify-end space-x-3 border-t border-slate-700">
                    <button
                      onClick={() => setShowCreateChildForm(false)}
                      className="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateChildAgent}
                      disabled={!newChildName || !newChildDescription}
                      className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Create Child Agent
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Agent Tasks</h2>
          </div>
          
          <div className="bg-slate-800/30 backdrop-blur rounded-xl border border-slate-700 p-4">
            <div className="mb-4">
              <label htmlFor="newTask" className="block text-sm font-medium text-slate-300 mb-1">
                Assign New Task
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="newTask"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  className="flex-grow bg-slate-700 border border-slate-600 rounded-l-lg px-4 py-2 text-white"
                  placeholder="Describe the task..."
                />
                <button
                  onClick={handleCreateTask}
                  disabled={!newTaskDescription}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Assign
                </button>
              </div>
            </div>
            
            {agentTasks.length === 0 ? (
              <div className="text-center py-4">
                <Activity className="h-8 w-8 mx-auto text-slate-500 mb-2" />
                <p className="text-slate-400">No tasks assigned to this agent yet</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {agentTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-2">Delete Agent</h3>
            <p className="text-slate-300 mb-4">
              Are you sure you want to delete <span className="font-semibold">{agent.name}</span>? 
              This action cannot be undone and will also delete all tasks assigned to this agent.
            </p>
            {childAgents.length > 0 && (
              <div className="bg-amber-900/30 border border-amber-900/50 rounded-lg p-3 mb-4">
                <p className="text-amber-400 text-sm flex items-start">
                  <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  This agent has {childAgents.length} child agent{childAgents.length !== 1 ? 's' : ''}. 
                  Deleting this agent will not delete its children, but they will become orphaned.
                </p>
              </div>
            )}
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAgent}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
              >
                Delete Agent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};