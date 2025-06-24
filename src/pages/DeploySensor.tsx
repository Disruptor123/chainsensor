import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Cloud, 
  Server, 
  Globe, 
  Zap, 
  CheckCircle, 
  AlertCircle,
  Copy,
  ExternalLink,
  Settings,
  Monitor,
  Activity,
  Shield,
  Eye
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import Sidebar from '../components/Sidebar';
import AnimatedBackground from '../components/AnimatedBackground';

export default function DeploySensor() {
  const { sensors } = useData();
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedSensor, setSelectedSensor] = useState('');
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'deploying' | 'deployed' | 'error'>('idle');
  const [apiEndpoint, setApiEndpoint] = useState('');

  const platforms = [
    {
      id: 'aws',
      name: 'AWS Lambda',
      icon: Cloud,
      description: 'Serverless deployment with auto-scaling',
      pricing: 'Pay per request',
      features: ['Auto-scaling', 'Global CDN', 'High availability']
    },
    {
      id: 'vercel',
      name: 'Vercel',
      icon: Globe,
      description: 'Edge functions with instant deployment',
      pricing: 'Free tier available',
      features: ['Edge computing', 'Instant deployment', 'Analytics']
    },
    {
      id: 'railway',
      name: 'Railway',
      icon: Server,
      description: 'Simple cloud deployment platform',
      pricing: 'Usage-based pricing',
      features: ['Simple setup', 'Database included', 'Monitoring']
    }
  ];

  const handleDeploy = () => {
    if (!selectedSensor || !selectedPlatform) {
      alert('Please select a sensor and platform');
      return;
    }

    setDeploymentStatus('deploying');
    
    // Simulate deployment process
    setTimeout(() => {
      const sensor = sensors.find(s => s.id === selectedSensor);
      setDeploymentStatus('deployed');
      setApiEndpoint(sensor?.apiEndpoint || 'https://api.chainsensor.com/v1/sensor');
    }, 3000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const viewApiEndpoint = (endpoint: string) => {
    // Open API endpoint in new tab
    window.open(endpoint, '_blank');
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
            <h1 className="text-3xl font-bold text-white mb-2">Deploy Sensor</h1>
            <p className="text-gray-400">Deploy your intelligent sensors to the cloud and make them accessible worldwide</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Panel - Sensor Selection */}
            <div className="lg:col-span-1 space-y-6">
              {/* Select Sensor */}
              <div className="bg-gray-900/50 backdrop-blur-md p-6 rounded-xl border border-yellow-400/20">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Zap className="h-5 w-5 text-yellow-400 mr-2" />
                  Select Sensor
                </h3>
                
                {sensors.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">No sensors available. Create a sensor first!</p>
                ) : (
                  <div className="space-y-3">
                    {sensors.map((sensor) => (
                      <motion.div
                        key={sensor.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedSensor(sensor.id)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedSensor === sensor.id
                            ? 'border-yellow-400 bg-yellow-400/10'
                            : 'border-gray-600 hover:border-yellow-400/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium">{sensor.name}</p>
                            <p className="text-gray-400 text-sm">Created: {sensor.created}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {selectedSensor === sensor.id && (
                              <CheckCircle className="h-5 w-5 text-yellow-400" />
                            )}
                            {sensor.apiEndpoint && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  viewApiEndpoint(sensor.apiEndpoint!);
                                }}
                                className="p-1 text-gray-400 hover:text-yellow-400 transition-colors"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Deployment Settings */}
              <div className="bg-gray-900/50 backdrop-blur-md p-6 rounded-xl border border-yellow-400/20">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Settings className="h-5 w-5 text-yellow-400 mr-2" />
                  Deployment Settings
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Environment
                    </label>
                    <select className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400">
                      <option value="production">Production</option>
                      <option value="staging">Staging</option>
                      <option value="development">Development</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Region
                    </label>
                    <select className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400">
                      <option value="us-east-1">US East (N. Virginia)</option>
                      <option value="us-west-2">US West (Oregon)</option>
                      <option value="eu-west-1">Europe (Ireland)</option>
                      <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="auto-scaling"
                      className="rounded border-gray-600 bg-gray-800 text-yellow-400 focus:ring-yellow-400"
                    />
                    <label htmlFor="auto-scaling" className="text-sm text-gray-300">
                      Enable auto-scaling
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="monitoring"
                      className="rounded border-gray-600 bg-gray-800 text-yellow-400 focus:ring-yellow-400"
                      defaultChecked
                    />
                    <label htmlFor="monitoring" className="text-sm text-gray-300">
                      Enable monitoring & alerts
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Platform Selection & Deployment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Platform Selection */}
              <div className="bg-gray-900/50 backdrop-blur-md p-6 rounded-xl border border-yellow-400/20">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Cloud className="h-5 w-5 text-yellow-400 mr-2" />
                  Choose Deployment Platform
                </h3>
                
                <div className="grid md:grid-cols-3 gap-4">
                  {platforms.map((platform) => (
                    <motion.div
                      key={platform.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedPlatform(platform.id)}
                      className={`p-6 rounded-lg border cursor-pointer transition-all ${
                        selectedPlatform === platform.id
                          ? 'border-yellow-400 bg-yellow-400/10'
                          : 'border-gray-600 hover:border-yellow-400/50'
                      }`}
                    >
                      <div className="flex flex-col items-center text-center">
                        <platform.icon className="h-12 w-12 text-yellow-400 mb-3" />
                        <h4 className="text-white font-semibold mb-2">{platform.name}</h4>
                        <p className="text-gray-400 text-sm mb-3">{platform.description}</p>
                        <p className="text-yellow-400 text-xs font-medium mb-3">{platform.pricing}</p>
                        
                        <div className="space-y-1">
                          {platform.features.map((feature, index) => (
                            <div key={index} className="flex items-center text-xs text-gray-300">
                              <CheckCircle className="h-3 w-3 text-green-400 mr-1" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Deployment Status */}
              <div className="bg-gray-900/50 backdrop-blur-md p-6 rounded-xl border border-yellow-400/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Monitor className="h-5 w-5 text-yellow-400 mr-2" />
                    Deployment Status
                  </h3>
                  
                  {deploymentStatus === 'idle' && selectedPlatform && selectedSensor && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDeploy}
                      className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-6 py-3 rounded-lg font-semibold"
                    >
                      Deploy Sensor
                    </motion.button>
                  )}
                </div>

                {deploymentStatus === 'idle' && (
                  <div className="text-center py-12">
                    <Cloud className="h-16 w-16 text-gray-400 mx-auto mb-4 opacity-50" />
                    <p className="text-gray-400">Select a sensor and platform to get started</p>
                  </div>
                )}

                {deploymentStatus === 'deploying' && (
                  <div className="text-center py-12">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="h-16 w-16 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"
                    />
                    <p className="text-white font-medium mb-2">Deploying your sensor...</p>
                    <p className="text-gray-400 text-sm">This may take a few minutes</p>
                  </div>
                )}

                {deploymentStatus === 'deployed' && (
                  <div className="space-y-6">
                    <div className="text-center py-6">
                      <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                      <p className="text-white font-medium mb-2">Deployment Successful!</p>
                      <p className="text-gray-400 text-sm">Your sensor is now live and accessible</p>
                    </div>

                    {/* API Endpoint */}
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-300">API Endpoint</span>
                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => copyToClipboard(apiEndpoint)}
                            className="p-1 text-gray-400 hover:text-yellow-400 transition-colors"
                          >
                            <Copy className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => viewApiEndpoint(apiEndpoint)}
                            className="p-1 text-gray-400 hover:text-yellow-400 transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <code className="flex-1 bg-gray-900 px-3 py-2 rounded text-green-400 text-sm font-mono">
                          {apiEndpoint}
                        </code>
                      </div>
                    </div>

                    {/* Deployment Info */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-gray-800/30 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Activity className="h-4 w-4 text-green-400" />
                          <span className="text-sm font-medium text-gray-300">Status</span>
                        </div>
                        <p className="text-green-400 font-semibold">Active</p>
                      </div>
                      
                      <div className="bg-gray-800/30 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Globe className="h-4 w-4 text-blue-400" />
                          <span className="text-sm font-medium text-gray-300">Region</span>
                        </div>
                        <p className="text-white">US East</p>
                      </div>
                      
                      <div className="bg-gray-800/30 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Shield className="h-4 w-4 text-purple-400" />
                          <span className="text-sm font-medium text-gray-300">Security</span>
                        </div>
                        <p className="text-white">HTTPS/SSL</p>
                      </div>
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