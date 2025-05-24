import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, ListTodo, Plus, Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <Brain className="mr-2 h-5 w-5" /> },
    { path: '/tasks', label: 'Tasks', icon: <ListTodo className="mr-2 h-5 w-5" /> },
    { path: '/create-agent', label: 'Create Agent', icon: <Plus className="mr-2 h-5 w-5" /> }
  ];

  return (
    <header className="bg-slate-900/80 backdrop-blur-lg sticky top-0 z-10 border-b border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <Brain className="h-8 w-8 text-teal-400" />
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-teal-400 to-purple-500 bg-clip-text text-transparent">
              AgentForge
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md transition-all duration-200 ${
                  location.pathname === item.path 
                    ? 'bg-slate-700/50 text-teal-400' 
                    : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-slate-300 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-700 animate-fadeIn">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-3 rounded-md transition-all duration-200 ${
                    location.pathname === item.path 
                      ? 'bg-slate-700/50 text-teal-400' 
                      : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};