import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  Download, 
  Eye, 
  Upload, 
  Search, 
  Filter,
  Star,
  Calendar,
  X,
  CheckCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import AnimatedBackground from '../components/AnimatedBackground';

interface MarketplaceDataset {
  id: string;
  name: string;
  description: string;
  type: string;
  size: string;
  format: string;
  rating: number;
  downloads: number;
  created_at: string;
  author: string;
  tags: string[];
  preview: string;
  content?: string;
}

export default function DataMarketplace() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [viewingDataset, setViewingDataset] = useState<MarketplaceDataset | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [marketplaceDatasets, setMarketplaceDatasets] = useState<MarketplaceDataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadForm, setUploadForm] = useState({
    name: '',
    description: '',
    type: '',
    format: '',
    tags: '',
    file: null as File | null
  });

  useEffect(() => {
    loadMarketplaceDatasets();
  }, []);

  const loadMarketplaceDatasets = async () => {
    try {
      const { data, error } = await supabase
        .from('marketplace_datasets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMarketplaceDatasets(data || []);
    } catch (error) {
      console.error('Error loading marketplace datasets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDatasets = marketplaceDatasets.filter(dataset => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = !selectedType || dataset.type === selectedType;
    return matchesSearch && matchesType;
  });

  const dataTypes = [...new Set(marketplaceDatasets.map(d => d.type))];

  const handleDownload = async (dataset: MarketplaceDataset) => {
    try {
      // Increment download count
      await supabase
        .from('marketplace_datasets')
        .update({ downloads: dataset.downloads + 1 })
        .eq('id', dataset.id);

      // Create download blob
      const blob = new Blob([dataset.content || dataset.preview], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${dataset.name}.${dataset.format.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Update local state
      setMarketplaceDatasets(prev => prev.map(d => 
        d.id === dataset.id ? { ...d, downloads: d.downloads + 1 } : d
      ));

      alert(`Downloaded ${dataset.name} successfully!`);
    } catch (error) {
      console.error('Error downloading dataset:', error);
      alert('Error downloading dataset. Please try again.');
    }
  };

  const handleView = (dataset: MarketplaceDataset) => {
    setViewingDataset(dataset);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !uploadForm.file) {
      alert('Please select a file to upload');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        const preview = content.slice(0, 500) + (content.length > 500 ? '...' : '');

        const { error } = await supabase
          .from('marketplace_datasets')
          .insert({
            name: uploadForm.name,
            description: uploadForm.description,
            type: uploadForm.type,
            size: `${(uploadForm.file!.size / (1024 * 1024)).toFixed(1)} MB`,
            format: uploadForm.format,
            author: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
            tags: uploadForm.tags.split(',').map(tag => tag.trim()),
            preview: preview,
            content: content,
            rating: 0,
            downloads: 0
          });

        if (error) throw error;

        alert('Dataset uploaded successfully!');
        setShowUploadModal(false);
        setUploadForm({
          name: '',
          description: '',
          type: '',
          format: '',
          tags: '',
          file: null
        });
        loadMarketplaceDatasets();
      };

      reader.readAsText(uploadForm.file);
    } catch (error) {
      console.error('Error uploading dataset:', error);
      alert('Error uploading dataset. Please try again.');
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 30) return `${diffInDays} days ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="h-16 w-16 border-4 border-yellow-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Data Marketplace</h1>
                <p className="text-gray-400">Discover and download datasets for your sensor projects</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUploadModal(true)}
                className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-6 py-3 rounded-lg font-semibold flex items-center space-x-2"
              >
                <Upload className="h-5 w-5" />
                <span>Upload Dataset</span>
              </motion.button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search datasets..."
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-white placeholder-gray-400"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="pl-10 pr-8 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-white appearance-none min-w-48"
              >
                <option value="">All Types</option>
                {dataTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Dataset Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDatasets.map((dataset, index) => (
              <motion.div
                key={dataset.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-900/50 backdrop-blur-md p-6 rounded-xl border border-yellow-400/20 hover:border-yellow-400/40 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Database className="h-5 w-5 text-yellow-400" />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      dataset.type === 'health' ? 'bg-red-500/20 text-red-400' :
                      dataset.type === 'environment' ? 'bg-green-500/20 text-green-400' :
                      dataset.type === 'movement' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {dataset.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-300">{dataset.rating.toFixed(1)}</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">{dataset.name}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{dataset.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <span>{dataset.size}</span>
                  <span>{dataset.format}</span>
                  <span>{dataset.downloads} downloads</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {dataset.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>{formatTimeAgo(dataset.created_at)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleView(dataset)}
                      className="p-2 text-gray-400 hover:text-yellow-400 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDownload(dataset)}
                      className="p-2 text-gray-400 hover:text-green-400 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredDatasets.length === 0 && (
            <div className="text-center py-12">
              <Database className="h-16 w-16 text-gray-400 mx-auto mb-4 opacity-50" />
              <p className="text-gray-400 text-lg">No datasets found matching your criteria</p>
            </div>
          )}
        </motion.div>

        {/* Dataset Viewer Modal */}
        {viewingDataset && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 rounded-xl border border-yellow-400/20 max-w-4xl w-full max-h-[80vh] overflow-hidden"
            >
              <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">{viewingDataset.name}</h3>
                <button
                  onClick={() => setViewingDataset(null)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-6 overflow-auto max-h-96">
                <div>
                  <h4 className="text-lg font-medium text-white mb-2">Description</h4>
                  <p className="text-gray-300">{viewingDataset.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-medium text-white mb-2">Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Size:</span>
                        <span className="text-white">{viewingDataset.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Format:</span>
                        <span className="text-white">{viewingDataset.format}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Downloads:</span>
                        <span className="text-white">{viewingDataset.downloads}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Author:</span>
                        <span className="text-white">{viewingDataset.author}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Rating:</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-white">{viewingDataset.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-white mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {viewingDataset.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-white mb-2">Data Preview</h4>
                  <pre className="bg-gray-800 p-4 rounded-lg text-gray-300 text-sm overflow-x-auto">
                    {viewingDataset.preview}
                  </pre>
                </div>

                <div className="flex items-center justify-end space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDownload(viewingDataset)}
                    className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-6 py-3 rounded-lg font-semibold flex items-center space-x-2"
                  >
                    <Download className="h-5 w-5" />
                    <span>Download Dataset</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 rounded-xl border border-yellow-400/20 max-w-2xl w-full"
            >
              <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Upload Dataset to Marketplace</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleUploadSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Dataset Name
                  </label>
                  <input
                    type="text"
                    value={uploadForm.name}
                    onChange={(e) => setUploadForm({...uploadForm, name: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-white"
                    placeholder="Enter dataset name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-white"
                    placeholder="Describe your dataset"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Type
                    </label>
                    <select 
                      value={uploadForm.type}
                      onChange={(e) => setUploadForm({...uploadForm, type: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-white"
                      required
                    >
                      <option value="">Select type</option>
                      <option value="health">Health</option>
                      <option value="environment">Environment</option>
                      <option value="movement">Movement</option>
                      <option value="audio">Audio</option>
                      <option value="energy">Energy</option>
                      <option value="agriculture">Agriculture</option>
                      <option value="transportation">Transportation</option>
                      <option value="weather">Weather</option>
                      <option value="industrial">Industrial</option>
                      <option value="retail">Retail</option>
                      <option value="finance">Finance</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Format
                    </label>
                    <select 
                      value={uploadForm.format}
                      onChange={(e) => setUploadForm({...uploadForm, format: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-white"
                      required
                    >
                      <option value="">Select format</option>
                      <option value="CSV">CSV</option>
                      <option value="JSON">JSON</option>
                      <option value="XML">XML</option>
                      <option value="TXT">TXT</option>
                      <option value="XLSX">XLSX</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={uploadForm.tags}
                    onChange={(e) => setUploadForm({...uploadForm, tags: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-white"
                    placeholder="e.g., health, biometric, sensors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Dataset File
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setUploadForm({...uploadForm, file: e.target.files?.[0] || null})}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-400 file:text-black hover:file:bg-yellow-300"
                    accept=".csv,.json,.xml,.txt,.xlsx"
                    required
                  />
                </div>

                <div className="flex items-center justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-6 py-3 rounded-lg font-semibold flex items-center space-x-2"
                  >
                    <CheckCircle className="h-5 w-5" />
                    <span>Upload Dataset</span>
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}