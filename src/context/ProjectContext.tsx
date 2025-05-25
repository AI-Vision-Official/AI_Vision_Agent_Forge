import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Project } from '../types/types';

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Project) => void;
  updateProject: (id: string, updatedProject: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProjectById: (id: string) => Project | null;
  getProjectsByAgentId: (agentId: string) => Project[];
}

export const ProjectContext = createContext<ProjectContextType>({
  projects: [],
  addProject: () => {},
  updateProject: () => {},
  deleteProject: () => {},
  getProjectById: () => null,
  getProjectsByAgentId: () => []
});

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  const addProject = (project: Project) => {
    setProjects([...projects, project]);
  };

  const updateProject = (id: string, updatedProject: Partial<Project>) => {
    setProjects(projects.map(project => 
      project.id === id ? { ...project, ...updatedProject } : project
    ));
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(project => project.id !== id));
  };

  const getProjectById = (id: string): Project | null => {
    return projects.find(project => project.id === id) || null;
  };

  const getProjectsByAgentId = (agentId: string): Project[] => {
    return projects.filter(project => project.assignedAgentId === agentId);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        addProject,
        updateProject,
        deleteProject,
        getProjectById,
        getProjectsByAgentId
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};