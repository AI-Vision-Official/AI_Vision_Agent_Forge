import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Brain, Check, X, Plus, Minus, Info, AlertCircle } from 'lucide-react';
import { Agent } from '../types/types';
import { useAgents } from '../hooks/useAgents';

type CapabilityOption = {
  id: string;
  label: string;
  description: string;
};

export const CreateAgent: React.FC = () => {
  const navigate = useNavigate();
  const { agents, addAgent } = useAgents();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [intelligence, setIntelligence] = useState(7);
  const [autonomy, setAutonomy] = useState(5);
  const [creativity, setCreativity] = useState(6);
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([]);
  const [parentAgent, setParentAgent] = useState<string | null>(null);
  const [showInfoTooltip, setShowInfoTooltip] = useState<string | null>(null);
  
  const capabilityOptions: CapabilityOption[] = [
    { id: 'research', label: 'Research', description: 'Ability to gather and analyze information from various sources' },
    { id: 'coding', label: 'Coding', description: 'Capability to write and debug code in multiple programming languages' },
    { id: 'analysis', label: 'Analysis', description: 'Advanced data processing and pattern recognition' },
    { id: 'creative', label: 'Creative', description: 'Generate innovative ideas and content' },
    { id: 'planning', label: 'Planning', description: 'Create detailed plans and strategies to achieve goals' },
    { id: 'learning', label: 'Learning', description: 'Rapidly acquire new knowledge and skills' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !description || selectedCapabilities.length === 0) {
      return;
    }
    
    const newAgent: Agent = {
      id: Date.now().toString(),
      name,
      description,
      intelligence,
      autonomy,
      creativity,
      capabilities: selectedCapabilities,
      level: parentAgent ? 2 : 1,
      parentId: parentAgent,
      childIds: [],
      createdAt: new Date().toISOString()
    };
    
    addAgent(newAgent);
    navigate('/');
  };
  
  const toggleCapability = (capability: string) => {
    if (selectedCapabilities.includes(capability)) {
      setSelectedCapabilities(selectedCapabilities.filter(c => c !== capability));
    } else {
      setSelectedCapabilities([...selectedCapabilities, capability]);
    }
  };
  
  const handleSliderChange = (setter: React.Dispatch<React.SetStateAction<number>>, value: number) => {
    setter(Math.max(1, Math.min(10, value)));
  };

  return (
    <div className="max-w-3xl mx-auto animate-fadeIn">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Create a New AI Agent</h1>
        <p className="text-slate-300">
          Define your agent's capabilities, intelligence, and purpose
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-slate-800/30 backdrop-blur rounded-xl border border-slate-700 p-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
              Agent Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800/70 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              placeholder="e.g., ResearchMaster, CodeGenius"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">
              Agent Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-slate-800/70 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              placeholder="Describe what this agent does and its primary purpose..."
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Core Capabilities
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {capabilityOptions.map((capability) => (
                <div 
                  key={capability.id}
                  className={`relative border rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                    selectedCapabilities.includes(capability.id)
                      ? 'bg-teal-500/20 border-teal-500/50 text-white'
                      : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700/50'
                  }`}
                  onClick={() => toggleCapability(capability.id)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{capability.label}</span>
                    {selectedCapabilities.includes(capability.id) ? (
                      <Check className="h-4 w-4 text-teal-400" />
                    ) : (
                      <Plus className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                  <div 
                    className="absolute right-2 top-2"
                    onMouseEnter={() => setShowInfoTooltip(capability.id)}
                    onMouseLeave={() => setShowInfoTooltip(null)}
                  >
                    <Info className="h-3.5 w-3.5 text-slate-400" />
                    
                    {showInfoTooltip === capability.id && (
                      <div className="absolute z-10 right-0 w-48 p-2 bg-slate-900 border border-slate-700 rounded-md shadow-lg text-xs text-slate-300">
                        {capability.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {selectedCapabilities.length === 0 && (
              <p className="text-red-400 text-xs mt-2 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                Select at least one capability
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex justify-between items-center">
                <label htmlFor="intelligence" className="block text-sm font-medium text-slate-300">
                  Intelligence
                </label>
                <span className="text-sm font-medium text-teal-400">{intelligence}/10</span>
              </div>
              <div className="flex items-center mt-2">
                <button 
                  type="button" 
                  onClick={() => handleSliderChange(setIntelligence, intelligence - 1)}
                  className="p-1 rounded-full bg-slate-700 text-slate-300 hover:bg-slate-600"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <input
                  type="range"
                  id="intelligence"
                  min="1"
                  max="10"
                  value={intelligence}
                  onChange={(e) => setIntelligence(parseInt(e.target.value))}
                  className="flex-grow mx-2 h-2 rounded-lg appearance-none bg-slate-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-500"
                />
                <button 
                  type="button" 
                  onClick={() => handleSliderChange(setIntelligence, intelligence + 1)}
                  className="p-1 rounded-full bg-slate-700 text-slate-300 hover:bg-slate-600"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center">
                <label htmlFor="autonomy" className="block text-sm font-medium text-slate-300">
                  Autonomy
                </label>
                <span className="text-sm font-medium text-teal-400">{autonomy}/10</span>
              </div>
              <div className="flex items-center mt-2">
                <button 
                  type="button" 
                  onClick={() => handleSliderChange(setAutonomy, autonomy - 1)}
                  className="p-1 rounded-full bg-slate-700 text-slate-300 hover:bg-slate-600"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <input
                  type="range"
                  id="autonomy"
                  min="1"
                  max="10"
                  value={autonomy}
                  onChange={(e) => setAutonomy(parseInt(e.target.value))}
                  className="flex-grow mx-2 h-2 rounded-lg appearance-none bg-slate-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-500"
                />
                <button 
                  type="button" 
                  onClick={() => handleSliderChange(setAutonomy, autonomy + 1)}
                  className="p-1 rounded-full bg-slate-700 text-slate-300 hover:bg-slate-600"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center">
                <label htmlFor="creativity" className="block text-sm font-medium text-slate-300">
                  Creativity
                </label>
                <span className="text-sm font-medium text-teal-400">{creativity}/10</span>
              </div>
              <div className="flex items-center mt-2">
                <button 
                  type="button" 
                  onClick={() => handleSliderChange(setCreativity, creativity - 1)}
                  className="p-1 rounded-full bg-slate-700 text-slate-300 hover:bg-slate-600"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <input
                  type="range"
                  id="creativity"
                  min="1"
                  max="10"
                  value={creativity}
                  onChange={(e) => setCreativity(parseInt(e.target.value))}
                  className="flex-grow mx-2 h-2 rounded-lg appearance-none bg-slate-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-500"
                />
                <button 
                  type="button" 
                  onClick={() => handleSliderChange(setCreativity, creativity + 1)}
                  className="p-1 rounded-full bg-slate-700 text-slate-300 hover:bg-slate-600"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
          
          {agents.length > 0 && (
            <div>
              <label htmlFor="parentAgent" className="block text-sm font-medium text-slate-300 mb-1">
                Parent Agent (Optional)
              </label>
              <select
                id="parentAgent"
                value={parentAgent || ''}
                onChange={(e) => setParentAgent(e.target.value || null)}
                className="w-full bg-slate-800/70 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">No parent (Create as root agent)</option>
                {agents.map(agent => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name} (Level {agent.level})
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-400 mt-1">
                If selected, this agent will be created as a child of the parent agent
              </p>
            </div>
          )}
          
          <div className="flex justify-end space-x-4 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name || !description || selectedCapabilities.length === 0}
              className="flex items-center px-6 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Create Agent
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};