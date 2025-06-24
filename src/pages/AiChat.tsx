import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Code, 
  Download, 
  Copy, 
  Play,
  Terminal,
  FileText,
  Zap,
  Brain,
  MessageSquare,
  Trash2,
  Plus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import Sidebar from '../components/Sidebar';
import AnimatedBackground from '../components/AnimatedBackground';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  code?: string;
  language?: string;
}

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export default function AiChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('nodejs');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const languages = [
    { id: 'nodejs', name: 'Node.js', icon: '🟢' },
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'javascript', name: 'JavaScript', icon: '🟨' },
    { id: 'typescript', name: 'TypeScript', icon: '🔷' },
    { id: 'go', name: 'Go', icon: '🔵' },
    { id: 'rust', name: 'Rust', icon: '🦀' },
  ];

  useEffect(() => {
    loadChatSessions();
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatSessions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error loading chat sessions:', error);
    }
  };

  const createNewSession = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          title: 'New Chat Session',
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentSession(data.id);
      setMessages([]);
      setSessions(prev => [data, ...prev]);
    } catch (error) {
      console.error('Error creating new session:', error);
    }
  };

  const loadSession = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setCurrentSession(sessionId);
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading session:', error);
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;

      setSessions(prev => prev.filter(s => s.id !== sessionId));
      
      if (currentSession === sessionId) {
        setCurrentSession(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const generateAIResponse = async (userMessage: string): Promise<{ content: string; code?: string; language?: string }> => {
    // Simulate AI response generation
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const prompts = {
      sensor: {
        content: `Here's a complete sensor integration example for ${selectedLanguage}:

This code creates a sensor data processor that can handle real-time data streams and integrate with your ChainSensor deployment. The implementation includes:

1. **Data Collection**: Connects to your sensor API endpoint
2. **Processing Logic**: Applies the logic you defined in ChainSensor
3. **Response Handling**: Executes actions based on sensor conditions
4. **Error Handling**: Robust error management and retry logic

The code is production-ready and includes proper error handling, logging, and configuration management.`,
        code: selectedLanguage === 'nodejs' ? `const express = require('express');
const axios = require('axios');
const WebSocket = require('ws');

class SensorProcessor {
  constructor(apiEndpoint, apiKey) {
    this.apiEndpoint = apiEndpoint;
    this.apiKey = apiKey;
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(express.json());
    this.app.use((req, res, next) => {
      console.log(\`\${new Date().toISOString()} - \${req.method} \${req.path}\`);
      next();
    });
  }

  setupRoutes() {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({ status: 'healthy', timestamp: new Date().toISOString() });
    });

    // Sensor data endpoint
    this.app.post('/sensor/data', async (req, res) => {
      try {
        const result = await this.processSensorData(req.body);
        res.json(result);
      } catch (error) {
        console.error('Error processing sensor data:', error);
        res.status(500).json({ error: 'Processing failed' });
      }
    });

    // Real-time sensor stream
    this.app.get('/sensor/stream', (req, res) => {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const sendData = () => {
        const data = this.generateMockSensorData();
        res.write(\`data: \${JSON.stringify(data)}\\n\\n\`);
      };

      const interval = setInterval(sendData, 1000);
      
      req.on('close', () => {
        clearInterval(interval);
      });
    });
  }

  async processSensorData(data) {
    // Apply sensor logic from ChainSensor
    const processed = {
      timestamp: new Date().toISOString(),
      input: data,
      processed: true
    };

    // Send to ChainSensor API
    try {
      const response = await axios.post(this.apiEndpoint, processed, {
        headers: {
          'Authorization': \`Bearer \${this.apiKey}\`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        result: response.data,
        processed
      };
    } catch (error) {
      throw new Error(\`ChainSensor API error: \${error.message}\`);
    }
  }

  generateMockSensorData() {
    return {
      timestamp: new Date().toISOString(),
      temperature: 20 + Math.random() * 15,
      humidity: 40 + Math.random() * 40,
      pressure: 1000 + Math.random() * 50,
      motion: Math.random() > 0.8
    };
  }

  start(port = 3000) {
    this.app.listen(port, () => {
      console.log(\`Sensor processor running on port \${port}\`);
      console.log(\`Health check: http://localhost:\${port}/health\`);
      console.log(\`Sensor stream: http://localhost:\${port}/sensor/stream\`);
    });
  }
}

// Usage
const processor = new SensorProcessor(
  'https://api.chainsensor.com/v1/your-sensor',
  'your-api-key-here'
);

processor.start();

module.exports = SensorProcessor;` : 
selectedLanguage === 'python' ? `import asyncio
import aiohttp
import json
import logging
from datetime import datetime
from typing import Dict, Any
import websockets
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
import uvicorn

class SensorProcessor:
    def __init__(self, api_endpoint: str, api_key: str):
        self.api_endpoint = api_endpoint
        self.api_key = api_key
        self.app = FastAPI(title="ChainSensor Processor")
        self.setup_routes()
        
        # Configure logging
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)

    def setup_routes(self):
        @self.app.get("/health")
        async def health_check():
            return {
                "status": "healthy",
                "timestamp": datetime.now().isoformat()
            }

        @self.app.post("/sensor/data")
        async def process_sensor_data(data: Dict[Any, Any]):
            try:
                result = await self.process_data(data)
                return result
            except Exception as e:
                self.logger.error(f"Error processing sensor data: {e}")
                raise HTTPException(status_code=500, detail="Processing failed")

        @self.app.get("/sensor/stream")
        async def sensor_stream():
            return StreamingResponse(
                self.generate_sensor_stream(),
                media_type="text/event-stream"
            )

    async def process_data(self, data: Dict[Any, Any]) -> Dict[str, Any]:
        """Process sensor data using ChainSensor logic"""
        processed = {
            "timestamp": datetime.now().isoformat(),
            "input": data,
            "processed": True
        }

        # Send to ChainSensor API
        async with aiohttp.ClientSession() as session:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            try:
                async with session.post(
                    self.api_endpoint,
                    json=processed,
                    headers=headers
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        return {
                            "success": True,
                            "result": result,
                            "processed": processed
                        }
                    else:
                        raise Exception(f"API returned status {response.status}")
                        
            except Exception as e:
                raise Exception(f"ChainSensor API error: {e}")

    async def generate_sensor_stream(self):
        """Generate real-time sensor data stream"""
        while True:
            data = self.generate_mock_data()
            yield f"data: {json.dumps(data)}\\n\\n"
            await asyncio.sleep(1)

    def generate_mock_data(self) -> Dict[str, Any]:
        """Generate mock sensor data"""
        import random
        return {
            "timestamp": datetime.now().isoformat(),
            "temperature": 20 + random.random() * 15,
            "humidity": 40 + random.random() * 40,
            "pressure": 1000 + random.random() * 50,
            "motion": random.random() > 0.8
        }

    def start(self, host: str = "0.0.0.0", port: int = 8000):
        """Start the sensor processor server"""
        self.logger.info(f"Starting sensor processor on {host}:{port}")
        uvicorn.run(self.app, host=host, port=port)

# Usage
if __name__ == "__main__":
    processor = SensorProcessor(
        api_endpoint="https://api.chainsensor.com/v1/your-sensor",
        api_key="your-api-key-here"
    )
    processor.start()` : `// JavaScript/TypeScript Sensor Processor
class SensorProcessor {
  constructor(apiEndpoint, apiKey) {
    this.apiEndpoint = apiEndpoint;
    this.apiKey = apiKey;
    this.isProcessing = false;
  }

  async processSensorData(data) {
    if (this.isProcessing) {
      throw new Error('Already processing data');
    }

    this.isProcessing = true;
    
    try {
      const processed = {
        timestamp: new Date().toISOString(),
        input: data,
        processed: true
      };

      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': \`Bearer \${this.apiKey}\`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(processed)
      });

      if (!response.ok) {
        throw new Error(\`API error: \${response.status}\`);
      }

      const result = await response.json();
      
      return {
        success: true,
        result,
        processed
      };
    } finally {
      this.isProcessing = false;
    }
  }

  startRealTimeProcessing(callback) {
    const interval = setInterval(async () => {
      try {
        const mockData = this.generateMockData();
        const result = await this.processSensorData(mockData);
        callback(null, result);
      } catch (error) {
        callback(error, null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }

  generateMockData() {
    return {
      timestamp: new Date().toISOString(),
      temperature: 20 + Math.random() * 15,
      humidity: 40 + Math.random() * 40,
      pressure: 1000 + Math.random() * 50,
      motion: Math.random() > 0.8
    };
  }
}

// Usage
const processor = new SensorProcessor(
  'https://api.chainsensor.com/v1/your-sensor',
  'your-api-key-here'
);

// Process single data point
processor.processSensorData({ value: 25.5 })
  .then(result => console.log('Processed:', result))
  .catch(error => console.error('Error:', error));

// Start real-time processing
const stopProcessing = processor.startRealTimeProcessing((error, result) => {
  if (error) {
    console.error('Processing error:', error);
  } else {
    console.log('Real-time result:', result);
  }
});

export default SensorProcessor;`,
        language: selectedLanguage
      },
      api: {
        content: `Here's a complete API integration guide for connecting to your ChainSensor deployment:

This implementation provides:
1. **Authentication**: Secure API key management
2. **Data Validation**: Input validation and sanitization  
3. **Error Handling**: Comprehensive error management
4. **Rate Limiting**: Built-in rate limiting for API calls
5. **Monitoring**: Request logging and performance metrics

The code includes examples for both REST API and WebSocket connections.`,
        code: selectedLanguage === 'nodejs' ? `const axios = require('axios');
const rateLimit = require('express-rate-limit');

class ChainSensorAPI {
  constructor(baseURL, apiKey) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': \`Bearer \${this.apiKey}\`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(\`Making request to: \${config.url}\`);
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  async getSensorStatus(sensorId) {
    try {
      const response = await this.client.get(\`/sensors/\${sensorId}/status\`);
      return response.data;
    } catch (error) {
      throw new Error(\`Failed to get sensor status: \${error.message}\`);
    }
  }

  async sendSensorData(sensorId, data) {
    try {
      const payload = {
        timestamp: new Date().toISOString(),
        data: data,
        sensor_id: sensorId
      };

      const response = await this.client.post(\`/sensors/\${sensorId}/data\`, payload);
      return response.data;
    } catch (error) {
      throw new Error(\`Failed to send sensor data: \${error.message}\`);
    }
  }

  async getSensorLogs(sensorId, limit = 100) {
    try {
      const response = await this.client.get(\`/sensors/\${sensorId}/logs\`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(\`Failed to get sensor logs: \${error.message}\`);
    }
  }

  async updateSensorConfig(sensorId, config) {
    try {
      const response = await this.client.put(\`/sensors/\${sensorId}/config\`, config);
      return response.data;
    } catch (error) {
      throw new Error(\`Failed to update sensor config: \${error.message}\`);
    }
  }

  // WebSocket connection for real-time data
  connectWebSocket(sensorId, onMessage, onError) {
    const WebSocket = require('ws');
    const wsUrl = this.baseURL.replace('http', 'ws') + \`/sensors/\${sensorId}/stream\`;
    
    const ws = new WebSocket(wsUrl, {
      headers: {
        'Authorization': \`Bearer \${this.apiKey}\`
      }
    });

    ws.on('open', () => {
      console.log('WebSocket connected');
    });

    ws.on('message', (data) => {
      try {
        const parsed = JSON.parse(data);
        onMessage(parsed);
      } catch (error) {
        onError(error);
      }
    });

    ws.on('error', onError);

    return ws;
  }
}

module.exports = ChainSensorAPI;` : `import aiohttp
import asyncio
import json
import websockets
from typing import Dict, Any, Optional, Callable

class ChainSensorAPI:
    def __init__(self, base_url: str, api_key: str):
        self.base_url = base_url.rstrip('/')
        self.api_key = api_key
        self.session = None

    async def __aenter__(self):
        self.session = aiohttp.ClientSession(
            headers={
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json'
            },
            timeout=aiohttp.ClientTimeout(total=10)
        )
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()

    async def get_sensor_status(self, sensor_id: str) -> Dict[str, Any]:
        """Get sensor status"""
        url = f"{self.base_url}/sensors/{sensor_id}/status"
        
        async with self.session.get(url) as response:
            if response.status == 200:
                return await response.json()
            else:
                raise Exception(f"Failed to get sensor status: {response.status}")

    async def send_sensor_data(self, sensor_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Send data to sensor"""
        url = f"{self.base_url}/sensors/{sensor_id}/data"
        
        payload = {
            "timestamp": datetime.now().isoformat(),
            "data": data,
            "sensor_id": sensor_id
        }

        async with self.session.post(url, json=payload) as response:
            if response.status == 200:
                return await response.json()
            else:
                raise Exception(f"Failed to send sensor data: {response.status}")

    async def get_sensor_logs(self, sensor_id: str, limit: int = 100) -> Dict[str, Any]:
        """Get sensor logs"""
        url = f"{self.base_url}/sensors/{sensor_id}/logs"
        params = {"limit": limit}

        async with self.session.get(url, params=params) as response:
            if response.status == 200:
                return await response.json()
            else:
                raise Exception(f"Failed to get sensor logs: {response.status}")

    async def update_sensor_config(self, sensor_id: str, config: Dict[str, Any]) -> Dict[str, Any]:
        """Update sensor configuration"""
        url = f"{self.base_url}/sensors/{sensor_id}/config"

        async with self.session.put(url, json=config) as response:
            if response.status == 200:
                return await response.json()
            else:
                raise Exception(f"Failed to update sensor config: {response.status}")

    async def connect_websocket(self, sensor_id: str, on_message: Callable, on_error: Callable):
        """Connect to sensor WebSocket stream"""
        ws_url = self.base_url.replace('http', 'ws') + f"/sensors/{sensor_id}/stream"
        
        extra_headers = {
            'Authorization': f'Bearer {self.api_key}'
        }

        try:
            async with websockets.connect(ws_url, extra_headers=extra_headers) as websocket:
                print("WebSocket connected")
                
                async for message in websocket:
                    try:
                        data = json.loads(message)
                        await on_message(data)
                    except json.JSONDecodeError as e:
                        await on_error(e)
                        
        except Exception as e:
            await on_error(e)

# Usage example
async def main():
    async with ChainSensorAPI("https://api.chainsensor.com/v1", "your-api-key") as api:
        # Get sensor status
        status = await api.get_sensor_status("sensor-123")
        print("Status:", status)

        # Send data
        result = await api.send_sensor_data("sensor-123", {"temperature": 25.5})
        print("Result:", result)

if __name__ == "__main__":
    asyncio.run(main())`,
        language: selectedLanguage
      }
    };

    // Determine response type based on user message
    if (userMessage.toLowerCase().includes('sensor') || userMessage.toLowerCase().includes('integration')) {
      return prompts.sensor;
    } else if (userMessage.toLowerCase().includes('api') || userMessage.toLowerCase().includes('endpoint')) {
      return prompts.api;
    } else {
      return {
        content: `I can help you create backend code for sensor integration! Here are some things I can assist with:

🔧 **Sensor Integration**: Complete code for connecting your backend to ChainSensor APIs
📡 **Real-time Processing**: WebSocket connections and streaming data handlers  
🛠️ **API Clients**: Full-featured API clients with error handling and authentication
🔄 **Data Processing**: Custom logic for processing sensor data
📊 **Monitoring**: Logging, metrics, and health checks
🚀 **Deployment**: Production-ready code with proper configuration

What specific integration would you like me to help you build? Just describe your use case and I'll generate the complete code for you!`,
        code: `// Example: Quick sensor data processor
const processSensorData = async (data) => {
  try {
    const response = await fetch('https://api.chainsensor.com/v1/your-sensor', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        data: data
      })
    });
    
    return await response.json();
  } catch (error) {
    console.error('Sensor processing error:', error);
    throw error;
  }
};`,
        language: 'javascript'
      };
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Save user message to database
      if (currentSession) {
        await supabase
          .from('chat_messages')
          .insert({
            session_id: currentSession,
            role: 'user',
            content: userMessage.content,
            user_id: user?.id
          });
      }

      // Generate AI response
      const aiResponse = await generateAIResponse(userMessage.content);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse.content,
        code: aiResponse.code,
        language: aiResponse.language,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Save assistant message to database
      if (currentSession) {
        await supabase
          .from('chat_messages')
          .insert({
            session_id: currentSession,
            role: 'assistant',
            content: assistantMessage.content,
            code: assistantMessage.code,
            language: assistantMessage.language,
            user_id: user?.id
          });

        // Update session title if it's the first message
        const session = sessions.find(s => s.id === currentSession);
        if (session && session.title === 'New Chat Session') {
          const title = userMessage.content.slice(0, 50) + (userMessage.content.length > 50 ? '...' : '');
          await supabase
            .from('chat_sessions')
            .update({ title })
            .eq('id', currentSession);
          
          setSessions(prev => prev.map(s => 
            s.id === currentSession ? { ...s, title } : s
          ));
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  const downloadCode = (code: string, language: string) => {
    const extension = language === 'nodejs' ? 'js' : language === 'python' ? 'py' : 'js';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sensor-integration.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
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
      
      <div className="ml-64 flex h-screen">
        {/* Chat Sessions Sidebar */}
        <div className="w-80 bg-gray-900/50 backdrop-blur-md border-r border-yellow-400/20 p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <MessageSquare className="h-5 w-5 text-yellow-400 mr-2" />
              Chat Sessions
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={createNewSession}
              className="p-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-colors"
            >
              <Plus className="h-4 w-4" />
            </motion.button>
          </div>

          <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
            {sessions.map((session) => (
              <motion.div
                key={session.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => loadSession(session.id)}
                className={`p-3 rounded-lg cursor-pointer transition-all group ${
                  currentSession === session.id
                    ? 'bg-yellow-400/20 border border-yellow-400/30'
                    : 'bg-gray-800/30 hover:bg-gray-800/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{session.title}</p>
                    <p className="text-gray-400 text-xs">{formatTimeAgo(session.updated_at)}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(session.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-400 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center">
                  <Brain className="h-6 w-6 text-yellow-400 mr-2" />
                  AI Code Assistant
                </h1>
                <p className="text-gray-400">Generate backend code for sensor integration</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                >
                  {languages.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.icon} {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-white mb-2">Welcome to AI Code Assistant</h3>
                <p className="text-gray-400 mb-6">
                  I can help you generate backend code for sensor integration in multiple languages.
                </p>
                <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {[
                    { icon: Zap, title: 'Sensor Integration', desc: 'Complete sensor API integration code' },
                    { icon: Terminal, title: 'Real-time Processing', desc: 'WebSocket and streaming handlers' },
                    { icon: Code, title: 'API Clients', desc: 'Full-featured API client libraries' },
                    { icon: FileText, title: 'Documentation', desc: 'Code examples with explanations' },
                  ].map((item, index) => (
                    <div key={index} className="bg-gray-800/30 p-4 rounded-lg">
                      <item.icon className="h-6 w-6 text-yellow-400 mb-2" />
                      <h4 className="text-white font-medium mb-1">{item.title}</h4>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-4xl ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`flex items-start space-x-3 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`p-2 rounded-full ${
                        message.role === 'user' 
                          ? 'bg-yellow-400 text-black' 
                          : 'bg-gray-700 text-yellow-400'
                      }`}>
                        {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </div>
                      
                      <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                        <div className={`p-4 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-yellow-400/20 border border-yellow-400/30'
                            : 'bg-gray-800/50 border border-gray-600'
                        }`}>
                          <p className="text-white whitespace-pre-wrap">{message.content}</p>
                          
                          {message.code && (
                            <div className="mt-4 bg-gray-900 rounded-lg overflow-hidden">
                              <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
                                <div className="flex items-center space-x-2">
                                  <Code className="h-4 w-4 text-yellow-400" />
                                  <span className="text-sm font-medium text-white">
                                    {languages.find(l => l.id === message.language)?.name || 'Code'}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => copyCode(message.code!)}
                                    className="p-1 text-gray-400 hover:text-yellow-400 transition-colors"
                                  >
                                    <Copy className="h-4 w-4" />
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => downloadCode(message.code!, message.language!)}
                                    className="p-1 text-gray-400 hover:text-yellow-400 transition-colors"
                                  >
                                    <Download className="h-4 w-4" />
                                  </motion.button>
                                </div>
                              </div>
                              <pre className="p-4 text-sm text-gray-300 overflow-x-auto">
                                <code>{message.code}</code>
                              </pre>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTimeAgo(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-full bg-gray-700 text-yellow-400">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-gray-800/50 border border-gray-600 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="h-4 w-4 border-2 border-yellow-400 border-t-transparent rounded-full"
                      />
                      <span className="text-gray-300">Generating code...</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-6 border-t border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Describe the backend code you need for sensor integration..."
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-white placeholder-gray-400 pr-12"
                  disabled={isLoading}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
            
            <div className="mt-2 text-xs text-gray-400">
              💡 Try: "Create a Node.js sensor processor", "Python API client for ChainSensor", "Real-time data streaming code"
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}