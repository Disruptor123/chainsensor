import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  Zap, 
  Code, 
  Play, 
  Settings, 
  Plus, 
  ArrowRight, 
  Brain,
  Cpu,
  Activity,
  AlertTriangle,
  CheckCircle,
  Save,
  Edit,
  X
} from 'lucide-react';
import { useData, LogicBlock } from '../contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AnimatedBackground from '../components/AnimatedBackground';

export default function CreateSensor() {
  const { datasets, addSensor } = useData();
  const navigate = useNavigate();
  const [selectedDataset, setSelectedDataset] = useState('');
  const [sensorName, setSensorName] = useState('');
  const [buildMode, setBuildMode] = useState<'visual' | 'ai' | 'code'>('visual');
  const [logicBlocks, setLogicBlocks] = useState<LogicBlock[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [customCode, setCustomCode] = useState('');
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const logicTemplates = [
    { type: 'condition', icon: AlertTriangle, label: 'IF Condition', color: 'from-blue-500 to-cyan-500' },
    { type: 'action', icon: Zap, label: 'THEN Action', color: 'from-yellow-400 to-amber-500' },
    { type: 'trigger', icon: Activity, label: 'Trigger Event', color: 'from-green-500 to-emerald-500' },
  ];

  const addLogicBlock = (type: 'condition' | 'action' | 'trigger') => {
    const newBlock: LogicBlock = {
      id: Date.now().toString(),
      type,
      content: type === 'condition' ? 'value > threshold' : 
               type === 'action' ? 'send notification' : 'on data change',
      editable: true
    };
    setLogicBlocks([...logicBlocks, newBlock]);
  };

  const generateAILogic = () => {
    const selectedData = datasets.find(d => d.id === selectedDataset);
    if (!selectedData) {
      alert('Please select a dataset first');
      return;
    }

    // Simulate AI generation based on data type
    let aiBlocks: LogicBlock[] = [];
    
    switch (selectedData.type) {
      case 'health':
        aiBlocks = [
          { id: '1', type: 'trigger', content: 'on_data_received()' },
          { id: '2', type: 'condition', content: 'heart_rate > 140 OR blood_pressure > 180' },
          { id: '3', type: 'action', content: 'send_alert("Health anomaly detected")' },
        ];
        break;
      case 'environment':
        aiBlocks = [
          { id: '1', type: 'trigger', content: 'on_sensor_reading()' },
          { id: '2', type: 'condition', content: 'temperature > 35 OR humidity < 20' },
          { id: '3', type: 'action', content: 'activate_climate_control()' },
        ];
        break;
      case 'movement':
        aiBlocks = [
          { id: '1', type: 'trigger', content: 'on_motion_detected()' },
          { id: '2', type: 'condition', content: 'acceleration > 2.5' },
          { id: '3', type: 'action', content: 'log_activity("High movement detected")' },
        ];
        break;
      default:
        aiBlocks = [
          { id: '1', type: 'trigger', content: 'on_data_change()' },
          { id: '2', type: 'condition', content: 'value > average + 2*std_dev' },
          { id: '3', type: 'action', content: 'send_notification("Anomaly detected")' },
        ];
    }
    
    setLogicBlocks(aiBlocks);
  };

  const startEditing = (blockId: string, currentContent: string) => {
    setEditingBlock(blockId);
    setEditContent(currentContent);
  };

  const saveEdit = () => {
    setLogicBlocks(prev => prev.map(block => 
      block.id === editingBlock ? { ...block, content: editContent } : block
    ));
    setEditingBlock(null);
    setEditContent('');
  };

  const cancelEdit = () => {
    setEditingBlock(null);
    setEditContent('');
  };

  const removeBlock = (blockId: string) => {
    setLogicBlocks(prev => prev.filter(block => block.id !== blockId));
  };

  const generateCode = () => {
    if (buildMode === 'code') {
      return customCode;
    }

    const triggers = logicBlocks.filter(b => b.type === 'trigger');
    const conditions = logicBlocks.filter(b => b.type === 'condition');
    const actions = logicBlocks.filter(b => b.type === 'action');

    return `{
  "sensor_name": "${sensorName || 'Untitled Sensor'}",
  "dataset": "${selectedDataset}",
  "logic": {
    "triggers": [${triggers.map(t => `"${t.content}"`).join(', ')}],
    "conditions": [${conditions.map(c => `"${c.content}"`).join(', ')}],
    "actions": [${actions.map(a => `"${a.content}"`).join(', ')}]
  },
  "output_format": "api_endpoint",
  "created": "${new Date().toISOString()}"
}`;
  };

  const runTest = () => {
    if (buildMode === 'code' && !customCode.trim()) {
      setTestResult('Error: No code to test');
      return;
    }

    if (buildMode === 'visual' && logicBlocks.length === 0) {
      setTestResult('Error: No logic blocks to test');
      return;
    }

    // Simulate test execution
    setTimeout(() => {
      setTestResult('✅ Test passed! Sensor logic executed successfully.\n\nSimulated output:\n- Trigger activated\n- Condition evaluated: true\n- Action executed: notification sent');
    }, 1000);
  };

  const saveSensor = async () => {
    if (!sensorName.trim()) {
      alert('Please enter a sensor name');
      return;
    }

    if (!selectedDataset) {
      alert('Please select a dataset');
      return;
    }

    if (buildMode === 'visual' && logicBlocks.length === 0) {
      alert('Please add some logic blocks');
      return;
    }

    if (buildMode === 'code' && !customCode.trim()) {
      alert('Please write some code');
      return;
    }

    setIsSaving(true);
    
    try {
      await addSensor({
        name: sensorName,
        dataset_id: selectedDataset,
        logic: buildMode === 'code' ? [{ id: '1', type: 'action', content: customCode }] : logicBlocks
      });

      alert('Sensor saved successfully!');
      
      // Reset form
      setSensorName('');
      setSelectedDataset('');
      setLogicBlocks([]);
      setCustomCode('');
      
      // Navigate to deploy page
      navigate('/deploy');
    } catch (error) {
      console.error('Error saving sensor:', error);
      alert('Error saving sensor. Please try again.');
    } finally {
      setIsSaving(false);
    }
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
            <h1 className="text-3xl font-bold text-white mb-2">Create Intelligent Sensor</h1>
            <p className="text-gray-400">Transform your data into smart, responsive sensors with AI-powered logic</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Panel - Configuration */}
            <div className="lg:col-span-1 space-y-6">
              {/* Dataset Selection */}
              <div className="bg-gray-900/50 backdrop-blur-md p-6 rounded-xl border border-yellow-400/20">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Database className="h-5 w-5 text-yellow-400 mr-2" />
                  Select Dataset
                </h3>
                
                {datasets.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">No datasets available. Upload some data first!</p>
                ) : (
                  <div className="space-y-3">
                    {datasets.map((dataset) => (
                      <motion.div
                        key={dataset.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedDataset(dataset.id)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedDataset === dataset.id
                            ? 'border-yellow-400 bg-yellow-400/10'
                            : 'border-gray-600 hover:border-yellow-400/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium">{dataset.name}</p>
                            <p className="text-gray-400 text-sm">{dataset.type} • {dataset.size}</p>
                          </div>
                          {selectedDataset === dataset.id && (
                            <CheckCircle className="h-5 w-5 text-yellow-400" />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sensor Configuration */}
              <div className="bg-gray-900/50 backdrop-blur-md p-6 rounded-xl border border-yellow-400/20">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Settings className="h-5 w-5 text-yellow-400 mr-2" />
                  Sensor Settings
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Sensor Name
                    </label>
                    <input
                      type="text"
                      value={sensorName}
                      onChange={(e) => setSensorName(e.target.value)}
                      placeholder="e.g., Heart Rate Monitor"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-white placeholder-gray-400 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Build Mode
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: 'visual', label: 'Visual', icon: Cpu },
                        { key: 'ai', label: 'AI Auto', icon: Brain },
                        { key: 'code', label: 'Code', icon: Code },
                      ].map((mode) => (
                        <motion.button
                          key={mode.key}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setBuildMode(mode.key as any)}
                          className={`p-3 rounded-lg border transition-all ${
                            buildMode === mode.key
                              ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400'
                              : 'border-gray-600 text-gray-300 hover:border-yellow-400/50'
                          }`}
                        >
                          <mode.icon className="h-4 w-4 mx-auto mb-1" />
                          <span className="text-xs">{mode.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Auto-Build */}
              {buildMode === 'ai' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-6 rounded-xl border border-purple-400/30"
                >
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Brain className="h-5 w-5 text-purple-400 mr-2" />
                    AI Auto-Build
                  </h3>
                  <p className="text-gray-300 mb-4 text-sm">
                    Let our AI analyze your dataset and automatically generate intelligent sensor logic.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={generateAILogic}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-lg font-semibold"
                  >
                    Generate Smart Logic
                  </motion.button>
                </motion.div>
              )}
            </div>

            {/* Right Panel - Logic Builder */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900/50 backdrop-blur-md rounded-xl border border-yellow-400/20 h-full">
                <div className="p-6 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white flex items-center">
                      <Zap className="h-5 w-5 text-yellow-400 mr-2" />
                      Sensor Logic Builder
                    </h3>
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowPreview(!showPreview)}
                        className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <Code className="h-4 w-4 mr-2 inline" />
                        {showPreview ? 'Hide' : 'Show'} Code
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={saveSensor}
                        disabled={isSaving}
                        className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-black rounded-lg font-semibold disabled:opacity-50"
                      >
                        <Save className="h-4 w-4 mr-2 inline" />
                        {isSaving ? 'Saving...' : 'Save Sensor'}
                      </motion.button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {buildMode === 'visual' && (
                    <div className="space-y-6">
                      {/* Logic Block Templates */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-3">Add Logic Blocks</h4>
                        <div className="flex flex-wrap gap-3">
                          {logicTemplates.map((template, index) => (
                            <motion.button
                              key={index}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => addLogicBlock(template.type)}
                              className={`flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r ${template.color} text-white font-medium`}
                            >
                              <Plus className="h-4 w-4" />
                              <template.icon className="h-4 w-4" />
                              <span>{template.label}</span>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Logic Flow */}
                      <div className="min-h-96 border-2 border-dashed border-gray-600 rounded-lg p-6">
                        {logicBlocks.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <Cpu className="h-16 w-16 mb-4 opacity-50" />
                            <p className="text-lg font-medium mb-2">Build Your Sensor Logic</p>
                            <p className="text-sm text-center">
                              Add logic blocks above to create intelligent sensor behavior.<br />
                              Connect conditions, actions, and triggers to define how your sensor responds.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {logicBlocks.map((block, index) => (
                              <motion.div
                                key={block.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className={`p-4 rounded-lg border-l-4 ${
                                  block.type === 'condition' ? 'border-blue-400 bg-blue-500/10' :
                                  block.type === 'action' ? 'border-yellow-400 bg-yellow-400/10' :
                                  'border-green-400 bg-green-500/10'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3 flex-1">
                                    <div className={`p-2 rounded-lg ${
                                      block.type === 'condition' ? 'bg-blue-500/20' :
                                      block.type === 'action' ? 'bg-yellow-400/20' :
                                      'bg-green-500/20'
                                    }`}>
                                      {block.type === 'condition' ? <AlertTriangle className="h-4 w-4 text-blue-400" /> :
                                       block.type === 'action' ? <Zap className="h-4 w-4 text-yellow-400" /> :
                                       <Activity className="h-4 w-4 text-green-400" />}
                                    </div>
                                    <div className="flex-1">
                                      {editingBlock === block.id ? (
                                        <div className="flex items-center space-x-2">
                                          <input
                                            type="text"
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-1 text-white text-sm"
                                            onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                                          />
                                          <button
                                            onClick={saveEdit}
                                            className="p-1 text-green-400 hover:text-green-300"
                                          >
                                            <CheckCircle className="h-4 w-4" />
                                          </button>
                                          <button
                                            onClick={cancelEdit}
                                            className="p-1 text-red-400 hover:text-red-300"
                                          >
                                            <X className="h-4 w-4" />
                                          </button>
                                        </div>
                                      ) : (
                                        <div>
                                          <p className="text-white font-medium">
                                            {block.type.toUpperCase()}: {block.content}
                                          </p>
                                          <p className="text-gray-400 text-sm">
                                            {block.type === 'condition' ? 'When this condition is met' :
                                             block.type === 'action' ? 'Execute this action' :
                                             'Triggered by this event'}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {editingBlock !== block.id && (
                                      <>
                                        <button
                                          onClick={() => startEditing(block.id, block.content)}
                                          className="p-1 text-gray-400 hover:text-yellow-400"
                                        >
                                          <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                          onClick={() => removeBlock(block.id)}
                                          className="p-1 text-gray-400 hover:text-red-400"
                                        >
                                          <X className="h-4 w-4" />
                                        </button>
                                      </>
                                    )}
                                    {index < logicBlocks.length - 1 && (
                                      <ArrowRight className="h-5 w-5 text-gray-400" />
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {buildMode === 'code' && (
                    <div className="space-y-4">
                      <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm">
                        <div className="text-green-400 mb-2">// Sensor Logic Code Template</div>
                        <div className="text-gray-300">
                          <div className="text-blue-400">function</div> <span className="text-yellow-400">processSensorData</span>(data) {'{'}
                          <div className="ml-4 text-gray-300">
                            <div className="text-purple-400">if</div> (data.value {'>'} <span className="text-orange-400">threshold</span>) {'{'}
                            <div className="ml-4">
                              <span className="text-green-400">sendAlert</span>(<span className="text-orange-400">"Threshold exceeded"</span>);
                            </div>
                            <div>{'}'}</div>
                          </div>
                          <div>{'}'}</div>
                        </div>
                      </div>
                      <textarea
                        value={customCode}
                        onChange={(e) => setCustomCode(e.target.value)}
                        className="w-full h-64 bg-gray-800 border border-gray-600 rounded-lg p-4 text-white font-mono text-sm focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                        placeholder="Write your custom sensor logic here..."
                      />
                      <div className="flex items-center space-x-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={runTest}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
                        >
                          <Play className="h-4 w-4" />
                          <span>Run Test</span>
                        </motion.button>
                        {testResult && (
                          <div className={`flex-1 p-3 rounded-lg text-sm ${
                            testResult.includes('Error') 
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : 'bg-green-500/20 text-green-400 border border-green-500/30'
                          }`}>
                            <pre className="whitespace-pre-wrap">{testResult}</pre>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {showPreview && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 bg-gray-800 rounded-lg p-4"
                    >
                      <h4 className="text-white font-medium mb-3">Generated Code Preview</h4>
                      <pre className="text-green-400 text-sm overflow-x-auto">
                        {generateCode()}
                      </pre>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Test Sensor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-6 rounded-xl border border-green-400/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                  <Play className="h-5 w-5 text-green-400 mr-2" />
                  Test Your Sensor
                </h3>
                <p className="text-gray-300">
                  Run a simulation with sample data to verify your sensor logic works correctly.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={runTest}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Run Test
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}