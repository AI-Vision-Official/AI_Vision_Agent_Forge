import { useContext } from 'react';
import { ProjectContext } from '../context/ProjectContext';

export const useProjects = () => {
  return useContext(ProjectContext);
};