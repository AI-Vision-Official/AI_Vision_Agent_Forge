import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { CreateAgent } from './pages/CreateAgent';
import { AgentDetails } from './pages/AgentDetails';
import { ManageTasks } from './pages/ManageTasks';
import { SubscriptionPlans } from './pages/SubscriptionPlans';
import { SubscriptionSuccess } from './pages/SubscriptionSuccess';
import { ProjectDashboard } from './pages/ProjectDashboard';
import { Header } from './components/Header';
import { AgentProvider } from './context/AgentContext';
import { TaskProvider } from './context/TaskContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { ProjectProvider } from './context/ProjectContext';

function App() {
  return (
    <Router>
      <SubscriptionProvider>
        <ProjectProvider>
          <AgentProvider>
            <TaskProvider>
              <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100">
                <Header />
                <div className="container mx-auto px-4 py-8">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/create-agent" element={<CreateAgent />} />
                    <Route path="/agent/:id" element={<AgentDetails />} />
                    <Route path="/tasks" element={<ManageTasks />} />
                    <Route path="/subscription" element={<SubscriptionPlans />} />
                    <Route path="/subscription/success" element={<SubscriptionSuccess />} />
                    <Route path="/projects" element={<ProjectDashboard />} />
                  </Routes>
                </div>
              </div>
            </TaskProvider>
          </AgentProvider>
        </ProjectProvider>
      </SubscriptionProvider>
    </Router>
  );
}

export default App;