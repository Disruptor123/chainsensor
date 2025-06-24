import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, Trash2, Eye, HardDrive, X } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import Sidebar from '../components/Sidebar';
import AnimatedBackground from '../components/AnimatedBackground';

export default function MyData() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedDataType, setSelectedDataType] = useState('');
  const [viewingFile, setViewingFile] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { datasets, storageUsed, storageLimit, addDataset, deleteDataset } = useData();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    
    try {
      for (const file of files) {
        const reader = new FileReader();
        
        await new Promise((resolve, reject) => {
          reader.onload = async (e) => {
            try {
              const content = e.target?.result as string;
              await addDataset({
                name: file.name,
                type: selectedDataType || getFileType(file.name),
                size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                content: content
              });
              resolve(null);
            } catch (error) {
              reject(error);
            }
          };
          
          reader.onerror = reject;
          reader.readAsText(file);
        });
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error uploading files. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getFileType = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'csv':
      case 'xlsx':
        return 'data';
      case 'json':
        return 'structured';
      case 'wav':
      case 'mp3':
        return 'audio';
      case 'mp4':
        return 'video';
      default:
        return 'other';
    }
  };

  const handleViewFile = (file: any) => {
    setViewingFile(file);
  };

  const handleDeleteFile = async (id: string) => {
    if (confirm('Are you sure you want to delete this file?')) {
      try {
        await deleteDataset(id);
      } catch (error) {
        console.error('Error deleting file:', error);
        alert('Error deleting file. Please try again.');
      }
    }
  };

  const storagePercentage = (storageUsed / storageLimit) * 100;

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
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">My Data</h1>
            <p className="text-gray-400">Upload and manage your datasets for sensor creation</p>
          </div>

          {/* Upload Section */}
          <div className="mb-8">
            <motion.div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                dragActive 
                  ? 'border-yellow-400 bg-yellow-400/10' 
                  : 'border-gray-600 hover:border-yellow-400/50'
              }`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="h-16 w-16 border-4 border-yellow-400 border-t-transparent rounded-full mb-4"
                  />
                  <h3 className="text-xl font-semibold text-white mb-2">Uploading...</h3>
                  <p className="text-gray-400">Please wait while we process your files</p>
                </div>
              ) : (
                <>
                  <Upload className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Drag & Drop Files Here
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Or click to browse files
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    Supported formats: .csv, .json, .xlsx, .txt, .wav, .mp4, .mp3
                  </p>
                  
                  <div className="flex items-center justify-center space-x-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileInput}
                      className="hidden"
                      accept=".csv,.json,.xlsx,.txt,.wav,.mp4,.mp3"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-6 py-3 rounded-lg font-semibold"
                    >
                      Browse Files
                    </motion.button>
                    
                    <select 
                      value={selectedDataType}
                      onChange={(e) => setSelectedDataType(e.target.value)}
                      className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white"
                    >
                      <option value="">Auto-detect type</option>
                      <option value="health">Health</option>
                      <option value="environment">Environment</option>
                      <option value="behavior">Behavior</option>
                      <option value="movement">Movement</option>
                      <option value="audio">Audio</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                </>
              )}
            </motion.div>
          </div>

          {/* Storage Usage */}
          <div className="mb-8">
            <div className="bg-gray-900/50 backdrop-blur-md p-6 rounded-xl border border-yellow-400/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <HardDrive className="h-5 w-5 text-yellow-400" />
                  <span className="text-white font-semibold">Storage Usage</span>
                </div>
                <span className="text-gray-400">{storageUsed.toFixed(1)} GB / {storageLimit} GB</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-amber-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(storagePercentage, 100)}%` }} 
                />
              </div>
            </div>
          </div>

          {/* Files Table */}
          <div className="bg-gray-900/50 backdrop-blur-md rounded-xl border border-yellow-400/20 overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">Uploaded Files ({datasets.length})</h2>
            </div>
            
            {datasets.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <File className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No files uploaded yet</p>
                <p className="text-sm">Upload your first dataset to get started</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Size</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Uploaded</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datasets.map((file, index) => (
                      <motion.tr
                        key={file.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="border-b border-gray-700 hover:bg-gray-800/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <File className="h-5 w-5 text-yellow-400" />
                            <span className="text-white">{file.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            file.type === 'health' ? 'bg-red-500/20 text-red-400' :
                            file.type === 'movement' ? 'bg-blue-500/20 text-blue-400' :
                            file.type === 'environment' ? 'bg-green-500/20 text-green-400' :
                            'bg-purple-500/20 text-purple-400'
                          }`}>
                            {file.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-300">{file.size}</td>
                        <td className="px-6 py-4 text-gray-300">{formatTimeAgo(file.created_at)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            file.status === 'processed' ? 'bg-green-500/20 text-green-400' :
                            file.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {file.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleViewFile(file)}
                              className="p-2 text-gray-400 hover:text-yellow-400 transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteFile(file.id)}
                              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>

        {/* File Viewer Modal */}
        {viewingFile && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 rounded-xl border border-yellow-400/20 max-w-4xl w-full max-h-[80vh] overflow-hidden"
            >
              <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Viewing: {viewingFile.name}</h3>
                <button
                  onClick={() => setViewingFile(null)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 overflow-auto max-h-96">
                <pre className="text-gray-300 text-sm whitespace-pre-wrap">
                  {typeof viewingFile.content === 'string' 
                    ? viewingFile.content.slice(0, 2000) + (viewingFile.content.length > 2000 ? '\n\n... (truncated)' : '')
                    : 'Binary file - preview not available'
                  }
                </pre>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}