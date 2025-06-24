import React from 'react';
import { motion } from 'framer-motion';
import { X, Copy, ExternalLink, Play, Code, CheckCircle, AlertTriangle, Activity } from 'lucide-react';

interface ApiViewerProps {
  endpoint: string;
  sensorName: string;
  onClose: () => void;
}

export default function ApiViewer({ endpoint, sensorName, onClose }: ApiViewerProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  // Mock API status and documentation
  const apiStatus = {
    status: 'active',
    uptime: '99.9%',
    lastResponse: '45ms',
    requestsToday: 1247,
    version: 'v1.0.0'
  };

  const apiDocumentation = {
    baseUrl: endpoint,
    endpoints: [
      {
        method: 'GET',
        path: '/',
        description: 'Get sensor status and information',
        response: {
          status: 'active',
          name: sensorName,
          last_updated: '2024-01-15T10:30:00Z',
          data_points: 1250,
          health: 'healthy'
        }
      },
      {
        method: 'POST',
        path: '/data',
        description: 'Send data to the sensor for processing',
        body: {
          timestamp: '2024-01-15T10:30:00Z',
          value: 75.5,
          metadata: {
            source: 'device_001',
            location: 'room_a'
          }
        },
        response: {
          processed: true,
          result: 'normal',
          confidence: 0.95,
          actions_triggered: ['log_data'],
          next_check: '2024-01-15T10:31:00Z'
        }
      },
      {
        method: 'GET',
        path: '/logs',
        description: 'Retrieve sensor processing logs',
        response: {
          logs: [
            {
              timestamp: '2024-01-15T10:30:00Z',
              level: 'info',
              message: 'Data processed successfully',
              data: { value: 75.5, result: 'normal' }
            },
            {
              timestamp: '2024-01-15T10:29:00Z',
              level: 'info',
              message: 'Sensor logic executed',
              data: { trigger: 'data_received', condition: 'value_in_range' }
            }
          ],
          total: 1250,
          page: 1
        }
      },
      {
        method: 'PUT',
        path: '/config',
        description: 'Update sensor configuration',
        body: {
          threshold: 80,
          alert_enabled: true,
          processing_interval: 60,
          retention_days: 30
        },
        response: {
          updated: true,
          config: {
            threshold: 80,
            alert_enabled: true,
            processing_interval: 60,
            retention_days: 30
          },
          restart_required: false
        }
      }
    ]
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 rounded-xl border border-yellow-400/20 max-w-6xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white flex items-center">
              <Activity className="h-6 w-6 text-green-400 mr-2" />
              {sensorName} API Dashboard
            </h3>
            <p className="text-gray-400">Live API status and documentation</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
          {/* API Status Dashboard */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
              API Status
            </h4>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-300">Status</span>
                </div>
                <p className="text-green-400 font-semibold capitalize">{apiStatus.status}</p>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium text-gray-300">Uptime</span>
                </div>
                <p className="text-white font-semibold">{apiStatus.uptime}</p>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Play className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-300">Response Time</span>
                </div>
                <p className="text-white font-semibold">{apiStatus.lastResponse}</p>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Code className="h-4 w-4 text-purple-400" />
                  <span className="text-sm font-medium text-gray-300">Requests Today</span>
                </div>
                <p className="text-white font-semibold">{apiStatus.requestsToday.toLocaleString()}</p>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-orange-400" />
                  <span className="text-sm font-medium text-gray-300">Version</span>
                </div>
                <p className="text-white font-semibold">{apiStatus.version}</p>
              </div>
            </div>
          </div>

          {/* Base URL */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-white mb-4">Base URL</h4>
            <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
              <code className="text-green-400 font-mono">{endpoint}</code>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => copyToClipboard(endpoint)}
                  className="p-2 text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  onClick={() => window.open(endpoint, '_blank')}
                  className="p-2 text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Authentication */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-white mb-4">Authentication</h4>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-300 mb-3">Include your API key in the request headers:</p>
              <div className="bg-gray-900 rounded p-3">
                <code className="text-green-400 font-mono text-sm">
                  Authorization: Bearer YOUR_API_KEY
                </code>
              </div>
            </div>
          </div>

          {/* Endpoints */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Available Endpoints</h4>
            
            {apiDocumentation.endpoints.map((endpoint, index) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    endpoint.method === 'GET' ? 'bg-green-500/20 text-green-400' :
                    endpoint.method === 'POST' ? 'bg-blue-500/20 text-blue-400' :
                    endpoint.method === 'PUT' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {endpoint.method}
                  </span>
                  <code className="text-white font-mono">{endpoint.path}</code>
                </div>
                
                <p className="text-gray-300 mb-4">{endpoint.description}</p>

                {endpoint.body && (
                  <div className="mb-4">
                    <h5 className="text-white font-medium mb-2">Request Body:</h5>
                    <div className="bg-gray-900 rounded p-3 overflow-x-auto">
                      <pre className="text-green-400 text-sm">
                        {JSON.stringify(endpoint.body, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <h5 className="text-white font-medium mb-2">Response:</h5>
                  <div className="bg-gray-900 rounded p-3 overflow-x-auto">
                    <pre className="text-green-400 text-sm">
                      {JSON.stringify(endpoint.response, null, 2)}
                    </pre>
                  </div>
                </div>

                {/* Try it out button */}
                <div className="flex items-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const fullUrl = `${apiDocumentation.baseUrl}${endpoint.path}`;
                      const curlCommand = endpoint.method === 'GET' 
                        ? `curl -X ${endpoint.method} "${fullUrl}" -H "Authorization: Bearer YOUR_API_KEY"`
                        : `curl -X ${endpoint.method} "${fullUrl}" -H "Authorization: Bearer YOUR_API_KEY" -H "Content-Type: application/json" -d '${JSON.stringify(endpoint.body || {})}'`;
                      
                      copyToClipboard(curlCommand);
                    }}
                    className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-4 py-2 rounded-lg font-medium flex items-center space-x-2 text-sm"
                  >
                    <Code className="h-4 w-4" />
                    <span>Copy cURL</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (endpoint.method === 'GET') {
                        window.open(`${apiDocumentation.baseUrl}${endpoint.path}`, '_blank');
                      } else {
                        alert('Use a tool like Postman or cURL to test POST/PUT requests');
                      }
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 text-sm"
                  >
                    <Play className="h-4 w-4" />
                    <span>Try it</span>
                  </motion.button>
                </div>
              </div>
            ))}
          </div>

          {/* Status Codes */}
          <div className="mt-8">
            <h4 className="text-lg font-semibold text-white mb-4">Status Codes</h4>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-400">200</span>
                  <span className="text-gray-300">Success</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-400">201</span>
                  <span className="text-gray-300">Created</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-400">400</span>
                  <span className="text-gray-300">Bad Request</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-400">401</span>
                  <span className="text-gray-300">Unauthorized</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-400">404</span>
                  <span className="text-gray-300">Not Found</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-400">500</span>
                  <span className="text-gray-300">Server Error</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rate Limiting */}
          <div className="mt-8">
            <h4 className="text-lg font-semibold text-white mb-4">Rate Limiting</h4>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-300 text-sm">
                API requests are limited to 1000 requests per hour per API key. 
                Rate limit information is included in response headers:
              </p>
              <div className="bg-gray-900 rounded p-3 mt-3">
                <code className="text-green-400 text-sm">
                  X-RateLimit-Limit: 1000<br/>
                  X-RateLimit-Remaining: 999<br/>
                  X-RateLimit-Reset: 1642694400
                </code>
              </div>
            </div>
          </div>

          {/* Real-time Monitoring */}
          <div className="mt-8">
            <h4 className="text-lg font-semibold text-white mb-4">Real-time Monitoring</h4>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-300 text-sm mb-3">
                Monitor your sensor in real-time using WebSocket connections:
              </p>
              <div className="bg-gray-900 rounded p-3">
                <code className="text-green-400 text-sm">
                  wss://api.chainsensor.com/v1/sensors/your-sensor/stream
                </code>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}