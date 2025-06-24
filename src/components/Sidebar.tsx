import React from 'react';
import { motion } from 'framer-motion';
import { Home, FolderOpen, Settings, Rocket, HelpCircle, LogOut, Cpu, Database, MessageSquare } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const menuItems = [
  { icon: Home, label: 'Overview', path: '/dashboard' },
  { icon: FolderOpen, label: 'My Data', path: '/my-data' },
  { icon: Settings, label: 'Create Sensor', path: '/create-sensor' },
  { icon: Rocket, label: 'Deploy Sensor', path: '/deploy' },
  { icon: Database, label: 'Data Marketplace', path: '/data-marketplace' },
  { icon: MessageSquare, label: 'AI Chat', path: '/ai-chat' },
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: HelpCircle, label: 'Help', path: '/help' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="fixed left-0 top-0 h-full w-64 bg-gray-900/95 backdrop-blur-md border-r border-yellow-500/20 z-40"
    >
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <Cpu className="h-8 w-8 text-yellow-400" />
          <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
            ChainSensor
          </span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <motion.button
                key={item.path}
                whileHover={{ x: 4 }}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-yellow-400/20 to-amber-500/20 text-yellow-400 border border-yellow-400/30'
                    : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-800/50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </motion.button>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <motion.button
            whileHover={{ x: 4 }}
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:text-red-400 hover:bg-gray-800/50 transition-all"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}