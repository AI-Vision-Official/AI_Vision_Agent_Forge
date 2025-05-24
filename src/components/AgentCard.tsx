import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, GitBranch, ChevronRight, Zap } from 'lucide-react';
import { Agent } from '../types/types';
import { useAgents } from '../hooks/useAgents';

type AgentCardProps = {
  agent: Agent;
};

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const { getAgentById } = useAgents();
  const parentAgent = agent.parentId ? getAgentById(agent.parentId) : null;
  
  // Calculate child agents
  const childAgentsCount = agent.childIds?.length || 0;
  
  // Determine capability color
  const getCapabilityColor = (capability: string) => {
    switch (capability.toLowerCase()) {
      case 'research': return 'bg-blue-500/20 text-blue-300';
      case 'coding': return 'bg-green-500/20 text-green-300';
      case 'analysis': return 'bg-purple-500/20 text-purple-300';
      case 'creative': return 'bg-yellow-500/20 text-yellow-300';
      default: return 'bg-slate-500/20 text-slate-300';
    }
  };

  return (
    <div className="bg-slate-800/40 backdrop-blur border border-slate-700 rounded-xl overflow-hidden hover:bg-slate-800/60 transition-all duration-300 group">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${agent.level > 1 ? 'bg-purple-500/20' : 'bg-teal-500/20'}`}>
              <Brain className={`h-6 w-6 ${agent.level > 1 ? 'text-purple-400' : 'text-teal-400'}`} />
            </div>
            <div className="ml-3">
              <h3 className="font-bold text-white">{agent.name}</h3>
              <div className="flex items-center text-sm text-slate-400">
                <span>Level {agent.level} Agent</span>
                {parentAgent && (
                  <div className="flex items-center ml-2">
                    <GitBranch className="h-3 w-3 mr-1" />
                    <span>Created by {parentAgent.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400">{agent.intelligence}</span>
          </div>
        </div>
        
        <p className="text-slate-300 text-sm mb-4 line-clamp-2">{agent.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {agent.capabilities.map((capability, index) => (
            <span 
              key={index}
              className={`text-xs px-2 py-1 rounded-full ${getCapabilityColor(capability)}`}
            >
              {capability}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center pt-3 border-t border-slate-700">
          <div className="text-xs text-slate-400">
            {childAgentsCount > 0 ? (
              <span className="flex items-center">
                <GitBranch className="h-3 w-3 mr-1" />
                {childAgentsCount} child agent{childAgentsCount !== 1 ? 's' : ''}
              </span>
            ) : (
              <span>No child agents</span>
            )}
          </div>
          <Link
            to={`/agent/${agent.id}`}
            className="flex items-center text-sm text-teal-400 hover:text-teal-300 transition-colors"
          >
            <span className="mr-1">Details</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};