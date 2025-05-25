export type SubscriptionTier = 'free' | 'basic' | 'pro' | 'business';

export interface Subscription {
  tier: SubscriptionTier;
  features: string[];
  priceMonthly: number;
  priceYearly: number;
  maxAgents: number;
  maxProjects: number;
  specializedAgents: boolean;
  githubIntegration: boolean;
  vsCodeIntegration: boolean;
  priority: boolean;
  support: string;
}

export type AgentSpecialization = 
  | 'website_builder'
  | 'app_developer'
  | 'ecommerce'
  | 'data_analyst'
  | 'ai_researcher'
  | 'code_assistant'
  | 'system_architect'
  | 'quantum_computing'
  | 'blockchain'
  | 'neural_interface';

export interface Agent {
  id: string;
  name: string;
  description: string;
  level: number;
  intelligence: number;
  autonomy: number;
  creativity: number;
  capabilities: string[];
  specialization?: AgentSpecialization;
  techStack?: string[];
  aiModel?: string;
  parentId: string | null;
  childIds?: string[];
  createdAt: string;
  projects?: Project[];
  learningProgress?: number;
  adaptabilityScore?: number;
  neuralCapacity?: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  type: 'website' | 'application' | 'ecommerce' | 'other';
  status: 'planning' | 'in_progress' | 'reviewing' | 'completed';
  githubUrl?: string;
  previewUrl?: string;
  createdAt: string;
  updatedAt: string;
  assignedAgentId: string;
  techStack: string[];
  features: string[];
  progress: number;
}

export interface Task {
  id: string;
  description: string;
  assignedAgentId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  projectId?: string;
  priority: 'low' | 'medium' | 'high';
  estimatedTime?: number;
  dependencies?: string[];
}