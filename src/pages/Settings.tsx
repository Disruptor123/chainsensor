import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Shield, 
  Key, 
  Database, 
  Palette,
  Save,
  Eye,
  EyeOff,
  Trash2,
  Download
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Sidebar from '../components/Sidebar';
import AnimatedBackground from '../components/AnimatedBackground';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showApiKey, setShowApiKey] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true
  });

  const { theme, accentColor, setTheme, setAccentColor } = useTheme();

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'data', label: 'Data Management', icon: Database },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  const accentColors = [
    { name: 'yellow', class: 'bg-yellow-400', active: accentColor === 'yellow' },
    { name: 'blue', class: 'bg-blue-500', active: accentColor === 'blue' },
    { name: 'green', class: 'bg-green-500', active: accentColor === 'green' },
    { name: 'purple', class: 'bg-purple-500', active: accentColor === 'purple' },
    { name: 'red', class: 'bg-red-500', active: accentColor === 'red' },
  ];

  const handleThemeChange = (newTheme: 'dark' | 'light' | 'auto') => {
    setTheme(newTheme);
    // Apply theme changes to document
    if (newTheme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  };

  const handleAccentColorChange = (color: string) => {
    setAccentColor(color);
    // Apply accent color changes
    document.documentElement.style.setProperty('--accent-color', color);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <AnimatedBackground />
      <Sidebar />
      
      <div className="ml-64 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
            <p className="text-gray-400">Manage your account preferences and application settings</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900/50 backdrop-blur-md rounded-xl border border-yellow-400/20 p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                        activeTab === tab.id
                          ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'
                          : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                      }`}
                    >
                      <tab.icon className="h-5 w-5" />
                      <span className="font-medium">{tab.label}</span>
                    </motion.button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
              <div className="bg-gray-900/50 backdrop-blur-md rounded-xl border border-yellow-400/20 p-8">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white mb-6">Profile Settings</h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          defaultValue="John"
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          defaultValue="Doe"
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        defaultValue="john.doe@example.com"
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Tell us about yourself..."
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-white placeholder-gray-400"
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-6 py-3 rounded-lg font-semibold flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </motion.button>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white mb-6">Notification Preferences</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                        <div>
                          <h3 className="text-white font-medium">Email Notifications</h3>
                          <p className="text-gray-400 text-sm">Receive updates via email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.email}
                            onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                        <div>
                          <h3 className="text-white font-medium">Push Notifications</h3>
                          <p className="text-gray-400 text-sm">Browser push notifications</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.push}
                            onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                        <div>
                          <h3 className="text-white font-medium">SMS Notifications</h3>
                          <p className="text-gray-400 text-sm">Text message alerts</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.sms}
                            onChange={(e) => setNotifications({...notifications, sms: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white mb-6">Security Settings</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Current Password
                            </label>
                            <input
                              type="password"
                              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-white"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              New Password
                            </label>
                            <input
                              type="password"
                              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-white"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-white"
                            />
                          </div>
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="mt-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-6 py-3 rounded-lg font-semibold"
                        >
                          Update Password
                        </motion.button>
                      </div>

                      <div className="border-t border-gray-700 pt-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Two-Factor Authentication</h3>
                        <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                          <div>
                            <p className="text-white font-medium">Enable 2FA</p>
                            <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium"
                          >
                            Enable
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* API Keys Tab */}
                {activeTab === 'api' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white mb-6">API Keys</h2>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-800/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-medium">Production API Key</h3>
                          <div className="flex items-center space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setShowApiKey(!showApiKey)}
                              className="p-1 text-gray-400 hover:text-yellow-400 transition-colors"
                            >
                              {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </div>
                        <code className="block bg-gray-900 px-3 py-2 rounded text-green-400 text-sm font-mono">
                          {showApiKey ? 'sk_live_1234567890abcdef' : '••••••••••••••••••••••••••••••••'}
                        </code>
                        <p className="text-gray-400 text-xs mt-2">Created on Jan 15, 2024</p>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-6 py-3 rounded-lg font-semibold"
                      >
                        Generate New Key
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* Data Management Tab */}
                {activeTab === 'data' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white mb-6">Data Management</h2>
                    
                    <div className="space-y-6">
                      <div className="p-4 bg-gray-800/30 rounded-lg">
                        <h3 className="text-white font-medium mb-2">Export Data</h3>
                        <p className="text-gray-400 text-sm mb-4">Download all your data in JSON format</p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
                        >
                          <Download className="h-4 w-4" />
                          <span>Export Data</span>
                        </motion.button>
                      </div>

                      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <h3 className="text-red-400 font-medium mb-2">Delete Account</h3>
                        <p className="text-gray-400 text-sm mb-4">
                          Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium"
                        >
                          Delete Account
                        </motion.button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Appearance Tab */}
                {activeTab === 'appearance' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white mb-6">Appearance</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-white font-medium mb-3">Theme</h3>
                        <div className="grid grid-cols-3 gap-4">
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            onClick={() => handleThemeChange('dark')}
                            className={`p-4 rounded-lg border cursor-pointer transition-all ${
                              theme === 'dark' ? 'border-yellow-400 bg-yellow-400/10' : 'border-gray-600 hover:border-yellow-400/50'
                            }`}
                          >
                            <div className="w-full h-16 bg-black rounded mb-2"></div>
                            <p className="text-white text-sm text-center">Dark</p>
                          </motion.div>
                          
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            onClick={() => handleThemeChange('light')}
                            className={`p-4 rounded-lg border cursor-pointer transition-all ${
                              theme === 'light' ? 'border-yellow-400 bg-yellow-400/10' : 'border-gray-600 hover:border-yellow-400/50 opacity-50'
                            }`}
                          >
                            <div className="w-full h-16 bg-white rounded mb-2"></div>
                            <p className="text-white text-sm text-center">Light</p>
                          </motion.div>
                          
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            onClick={() => handleThemeChange('auto')}
                            className={`p-4 rounded-lg border cursor-pointer transition-all ${
                              theme === 'auto' ? 'border-yellow-400 bg-yellow-400/10' : 'border-gray-600 hover:border-yellow-400/50 opacity-50'
                            }`}
                          >
                            <div className="w-full h-16 bg-gradient-to-r from-gray-800 to-white rounded mb-2"></div>
                            <p className="text-white text-sm text-center">Auto</p>
                          </motion.div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-white font-medium mb-3">Accent Color</h3>
                        <div className="flex space-x-3">
                          {accentColors.map((color) => (
                            <motion.div
                              key={color.name}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleAccentColorChange(color.name)}
                              className={`w-8 h-8 rounded-full cursor-pointer border-2 ${color.class} ${
                                color.active ? 'border-white' : 'border-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-6 py-3 rounded-lg font-semibold flex items-center space-x-2"
                      >
                        <Save className="h-4 w-4" />
                        <span>Save Appearance</span>
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}