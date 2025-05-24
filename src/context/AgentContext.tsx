import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Agent } from '../types/types';

interface AgentContextType {
  agents: Agent[];
  addAgent: (agent: Agent) => void;
  updateAgent: (id: string, updatedAgent: Partial<Agent>) => void;
  deleteAgent: (id: string) => void;
  getAgentById: (id: string) => Agent | null;
  createChildAgent: (childData: Partial<Agent>) => void;
}

export const AgentContext = createContext<AgentContextType>({
  agents: [],
  addAgent: () => {},
  updateAgent: () => {},
  deleteAgent: () => {},
  getAgentById: () => null,
  createChildAgent: () => {}
});

interface AgentProviderProps {
  children: ReactNode;
}

export const AgentProvider: React.FC<AgentProviderProps> = ({ children }) => {
  // Initialize with sample agents for demonstration
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: '1',
      name: 'MasterAgent',
      description: 'A powerful root-level agent capable of creating specialized child agents for specific tasks.',
      level: 1,
      intelligence: 9,
      autonomy: 8,
      creativity: 7,
      capabilities: ['research', 'coding', 'analysis', 'planning'],
      parentId: null,
      childIds: [],
      createdAt: new Date().toISOString()
    }
  ]);

  // Load agents from localStorage on initial render
  useEffect(() => {
    const savedAgents = localStorage.getItem('agents');
    if (savedAgents) {
      setAgents(JSON.parse(savedAgents));
    }
  }, []);

  // Save agents to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('agents', JSON.stringify(agents));
  }, [agents]);

  const addAgent = (agent: Agent) => {
    // If this agent has a parent, update the parent's childIds
    const newAgents = [...agents];
    
    if (agent.parentId) {
      const parentIndex = newAgents.findIndex(a => a.id === agent.parentId);
      if (parentIndex !== -1) {
        const parent = newAgents[parentIndex];
        newAgents[parentIndex] = {
          ...parent,
          childIds: [...(parent.childIds || []), agent.id]
        };
      }
    }
    
    setAgents([...newAgents, agent]);
  };

  const updateAgent = (id: string, updatedAgent: Partial<Agent>) => {
    setAgents(agents.map(agent => 
      agent.id === id ? { ...agent, ...updatedAgent } : agent
    ));
  };

  const deleteAgent = (id: string) => {
    const agentToDelete = agents.find(agent => agent.id === id);
    
    if (!agentToDelete) return;
    
    // If the agent has a parent, update the parent's childIds
    let newAgents = [...agents];
    
    if (agentToDelete.parentId) {
      const parentIndex = newAgents.findIndex(a => a.id === agentToDelete.parentId);
      if (parentIndex !== -1) {
        const parent = newAgents[parentIndex];
        newAgents[parentIndex] = {
          ...parent,
          childIds: (parent.childIds || []).filter(childId => childId !== id)
        };
      }
    }
    
    // Remove the agent from the list
    setAgents(newAgents.filter(agent => agent.id !== id));
  };

  const getAgentById = (id: string): Agent | null => {
    return agents.find(agent => agent.id === id) || null;
  };
  
  const createChildAgent = (childData: Partial<Agent>) => {
    if (!childData.parentId) return;
    
    const parentAgent = getAgentById(childData.parentId);
    if (!parentAgent) return;
    
    const newChildAgent: Agent = {
      id: Date.now().toString(),
      name: childData.name || `Child of ${parentAgent.name}`,
      description: childData.description || `A child agent created by ${parentAgent.name}`,
      level: parentAgent.level + 1,
      intelligence: childData.intelligence || Math.max(1, parentAgent.intelligence - 1),
      autonomy: childData.autonomy || parentAgent.autonomy,
      creativity: childData.creativity || parentAgent.creativity,
      capabilities: childData.capabilities || parentAgent.capabilities.slice(0, 2),
      parentId: parentAgent.id,
      childIds: [],
      createdAt: new Date().toISOString()
    };
    
    addAgent(newChildAgent);
  };

  return (
    <AgentContext.Provider
      value={{
        agents,
        addAgent,
        updateAgent,
        deleteAgent,
        getAgentById,
        createChildAgent
      }}
    >
      {children}
    </AgentContext.Provider>
  );
};