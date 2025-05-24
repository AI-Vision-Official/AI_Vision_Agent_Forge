import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Brain, Sparkles, GitBranch, Activity } from 'lucide-react';
import { AgentCard } from '../components/AgentCard';
import { useAgents } from '../hooks/useAgents';
import { useTasks } from '../hooks/useTasks';

export const Dashboard: React.FC = () => {
  const { agents } = useAgents();
  const { tasks } = useTasks();
  
  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="space-y-8 animate-fadeIn">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          Welcome to AgentForge
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Build AI agents that can create other agents autonomously to accomplish complex tasks
        </p>
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <Link
            to="/create-agent"
            className="flex items-center bg-gradient-to-r from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-800 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-teal-500/20"
          >
            <Plus className="mr-2 h-5 w-5" />
            Create New Agent
          </Link>
          <Link
            to="/tasks"
            className="flex items-center bg-slate-700 hover:bg-slate-600 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 shadow-lg"
          >
            <Activity className="mr-2 h-5 w-5" />
            Manage Tasks
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
          <div className="flex items-center text-teal-400 mb-2">
            <Brain className="h-5 w-5 mr-2" />
            <h3 className="font-semibold">Total Agents</h3>
          </div>
          <p className="text-3xl font-bold">{agents.length}</p>
          <p className="text-slate-400 text-sm mt-1">Active AI agents in your network</p>
        </div>
        
        <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
          <div className="flex items-center text-purple-400 mb-2">
            <GitBranch className="h-5 w-5 mr-2" />
            <h3 className="font-semibold">Agent Hierarchy</h3>
          </div>
          <p className="text-3xl font-bold">{agents.filter(a => a.parentId).length}</p>
          <p className="text-slate-400 text-sm mt-1">Child agents created by other agents</p>
        </div>
        
        <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
          <div className="flex items-center text-blue-400 mb-2">
            <Activity className="h-5 w-5 mr-2" />
            <h3 className="font-semibold">Active Tasks</h3>
          </div>
          <p className="text-3xl font-bold">{activeTasks.length}</p>
          <p className="text-slate-400 text-sm mt-1">Tasks currently in progress</p>
        </div>
        
        <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
          <div className="flex items-center text-green-400 mb-2">
            <Sparkles className="h-5 w-5 mr-2" />
            <h3 className="font-semibold">Completed</h3>
          </div>
          <p className="text-3xl font-bold">{completedTasks.length}</p>
          <p className="text-slate-400 text-sm mt-1">Successfully completed tasks</p>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Your Agents</h2>
          <Link
            to="/create-agent"
            className="flex items-center text-sm bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-all duration-200"
          >
            <Plus className="mr-1 h-4 w-4" />
            New Agent
          </Link>
        </div>
        
        {agents.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-700">
            <Brain className="h-12 w-12 mx-auto text-slate-500 mb-4" />
            <h3 className="text-xl font-medium text-slate-300 mb-2">No Agents Created Yet</h3>
            <p className="text-slate-400 mb-6">Create your first agent to get started</p>
            <Link
              to="/create-agent"
              className="inline-flex items-center bg-teal-600 hover:bg-teal-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200"
            >
              <Plus className="mr-1 h-4 w-4" />
              Create Agent
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};