import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Settings, Download, Activity, Database, Zap, BarChart3, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AnimatedBackground from '../components/AnimatedBackground';
import ApiViewer from '../components/ApiViewer';

export default function Dashboard() {
  const { user } = useAuth();
  const { datasets, sensors, activities, storageUsed, storageLimit } = useData();
  const navigate = useNavigate();
  const [viewingApi, setViewingApi] = useState<{ endpoint: string; name: string } | null>(null);

  const quickActions = [
    { 
      icon: Upload, 
      label: 'Upload Dataset', 
      color: 'from-blue-500 to-cyan-500',
      action: () => navigate('/my-data')
    },
    { 
      icon: Settings, 
      label: 'Generate Sensor Logic', 
      color: 'from-yellow-400 to-amber-500',
      action: () => navigate('/create-sensor')
    },
    { 
      icon: Download, 
      label: 'Export Sensor', 
      color: 'from-green-500 to-emerald-500',
      action: () => navigate('/deploy')
    },
  ];

  const stats = [
    { label: 'Datasets Uploaded', value: datasets.length.toString(), icon: Database },
    { label: 'Virtual Sensors', value: sensors.length.toString(), icon: Zap },
    { label: 'API Calls', value: '0', icon: Activity },
    { label: 'Storage Used', value: `${((storageUsed / storageLimit) * 100).toFixed(1)}%`, icon: BarChart3 },
  ];

  const handleViewDataset = (datasetId: string) => {
    const dataset = datasets.find(d => d.id === datasetId);
    if (dataset) {
      alert(`Viewing dataset: ${dataset.name}\nType: ${dataset.type}\nSize: ${dataset.size}`);
    }
  };

  const handleViewApiEndpoint = (sensor: any) => {
    if (sensor.api_endpoint) {
      setViewingApi({
        endpoint: sensor.api_endpoint,
        name: sensor.name
      });
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
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
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0]} 👋
            </h1>
            <p className="text-gray-400">
              You have uploaded {datasets.length} datasets | Created {sensors.length} virtual sensors | {sensors.filter(s => s.status === 'active').length} sensors active
            </p>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {quickActions.map((action, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={action.action}
                  className={`bg-gradient-to-r ${action.color} p-6 rounded-xl cursor-pointer shadow-lg hover:shadow-xl transition-all`}
                >
                  <action.icon className="h-8 w-8 text-white mb-3" />
                  <h3 className="text-lg font-semibold text-white">{action.label}</h3>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">System Stats</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gray-900/50 backdrop-blur-md p-6 rounded-xl border border-yellow-400/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className="h-6 w-6 text-yellow-400" />
                    <span className="text-2xl font-bold text-white">{stat.value}</span>
                  </div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
            <div className="bg-gray-900/50 backdrop-blur-md rounded-xl border border-yellow-400/20 overflow-hidden">
              {activities.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activity. Start by uploading a dataset!</p>
                </div>
              ) : (
                activities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="p-4 border-b border-gray-700 last:border-b-0 hover:bg-gray-800/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'upload' ? 'bg-blue-400' :
                          activity.type === 'create' ? 'bg-yellow-400' : 
                          activity.type === 'delete' ? 'bg-red-400' : 'bg-green-400'
                        }`} />
                        <span className="text-white">{activity.action}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400 text-sm">{formatTimeAgo(activity.created_at)}</span>
                        {activity.dataset_id && (
                          <button
                            onClick={() => handleViewDataset(activity.dataset_id!)}
                            className="p-1 text-gray-400 hover:text-yellow-400 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                        {activity.sensor_id && (
                          <button
                            onClick={() => {
                              const sensor = sensors.find(s => s.id === activity.sensor_id);
                              if (sensor) handleViewApiEndpoint(sensor);
                            }}
                            className="p-1 text-gray-400 hover:text-yellow-400 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.div>

        {/* API Viewer Modal */}
        {viewingApi && (
          <ApiViewer
            endpoint={viewingApi.endpoint}
            sensorName={viewingApi.name}
            onClose={() => setViewingApi(null)}
          />
        )}
      </div>
    </div>
  );
}