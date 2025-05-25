import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Code, Globe, ShoppingBag, Database, Brain, Plus, 
  GitBranch, Eye, Terminal, Search, XCircle 
} from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { useAgents } from '../hooks/useAgents';
import { Project } from '../types/types';

export const ProjectDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { projects } = useProjects();
  const { agents } = useAgents();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const getProjectTypeIcon = (type: string) => {
    switch (type) {
      case 'website':
        return <Globe className="h-5 w-5 text-blue-400" />;
      case 'application':
        return <Code className="h-5 w-5 text-purple-400" />;
      case 'ecommerce':
        return <ShoppingBag className="h-5 w-5 text-green-400" />;
      default:
        return <Database className="h-5 w-5 text-amber-400" />;
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || project.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Projects</h1>
          <p className="text-slate-400">Manage and monitor your AI-powered projects</p>
        </div>
        
        <button
          onClick={() => navigate('/create-project')}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 rounded-lg text-white transition-all duration-200"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </button>
      </div>

      <div className="bg-slate-800/30 backdrop-blur rounded-xl border border-slate-700 p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/70 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              placeholder="Search projects..."
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
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-800/70 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">All Types</option>
            <option value="website">Websites</option>
            <option value="application">Applications</option>
            <option value="ecommerce">E-commerce</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/30 backdrop-blur rounded-xl border border-slate-700">
          <Brain className="h-12 w-12 mx-auto text-slate-500 mb-4" />
          <h3 className="text-xl font-medium text-slate-300 mb-2">No Projects Found</h3>
          <p className="text-slate-400 mb-6">
            {projects.length === 0 
              ? "You haven't created any projects yet" 
              : "No projects match your current filters"}
          </p>
          <button
            onClick={() => navigate('/create-project')}
            className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg text-white transition-all duration-200"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <div
              key={project.id}
              className="bg-slate-800/30 backdrop-blur rounded-xl border border-slate-700 hover:bg-slate-800/50 transition-all duration-200"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-slate-700/50">
                      {getProjectTypeIcon(project.type)}
                    </div>
                    <div className="ml-3">
                      <h3 className="font-bold text-white">{project.name}</h3>
                      <p className="text-sm text-slate-400 capitalize">{project.type} Project</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    project.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                    project.status === 'in_progress' ? 'bg-blue-500/20 text-blue-300' :
                    'bg-amber-500/20 text-amber-300'
                  }`}>
                    {project.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-sm text-slate-300 mb-4 line-clamp-2">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.map((tech, index) => (
                    <span 
                      key={index}
                      className="text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <div className="flex items-center text-sm text-slate-400">
                    <Brain className="h-4 w-4 mr-1" />
                    <span>
                      {agents.find(a => a.id === project.assignedAgentId)?.name || 'Unassigned'}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
                      >
                        <GitBranch className="h-4 w-4" />
                      </a>
                    )}
                    {project.previewUrl && (
                      <a
                        href={project.previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </a>
                    )}
                    <button
                      onClick={() => navigate(`/project/${project.id}`)}
                      className="p-1.5 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
                    >
                      <Terminal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};