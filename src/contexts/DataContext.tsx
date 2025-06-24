import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export interface Dataset {
  id: string;
  name: string;
  type: string;
  size: string;
  content?: string;
  status: 'processed' | 'processing' | 'error';
  created_at: string;
}

export interface Sensor {
  id: string;
  name: string;
  dataset_id: string;
  logic: LogicBlock[];
  api_endpoint?: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface LogicBlock {
  id: string;
  type: 'condition' | 'action' | 'trigger';
  content: string;
  editable?: boolean;
}

export interface Activity {
  id: string;
  action: string;
  type: string;
  dataset_id?: string;
  sensor_id?: string;
  created_at: string;
}

export interface Deployment {
  id: string;
  sensor_id: string;
  platform: string;
  api_endpoint: string;
  status: 'deploying' | 'deployed' | 'error';
  created_at: string;
}

interface DataContextType {
  datasets: Dataset[];
  sensors: Sensor[];
  activities: Activity[];
  deployments: Deployment[];
  storageUsed: number;
  storageLimit: number;
  isLoading: boolean;
  addDataset: (dataset: Omit<Dataset, 'id' | 'created_at' | 'status'>) => Promise<void>;
  deleteDataset: (id: string) => Promise<void>;
  addSensor: (sensor: Omit<Sensor, 'id' | 'created_at' | 'status'>) => Promise<void>;
  updateSensor: (id: string, updates: Partial<Sensor>) => Promise<void>;
  addActivity: (activity: Omit<Activity, 'id' | 'created_at'>) => Promise<void>;
  addDeployment: (deployment: Omit<Deployment, 'id' | 'created_at' | 'status'>) => Promise<void>;
  updateDeployment: (id: string, updates: Partial<Deployment>) => Promise<void>;
  getDatasetById: (id: string) => Dataset | undefined;
  getSensorById: (id: string) => Sensor | undefined;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const storageLimit = 10; // 10GB

  // Calculate storage used from datasets
  const storageUsed = datasets.reduce((total, dataset) => {
    const sizeInGB = parseFloat(dataset.size.replace(/[^\d.]/g, '')) / 1000;
    return total + sizeInGB;
  }, 0);

  // Load data when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshData();
    } else {
      // Clear data when user logs out
      setDatasets([]);
      setSensors([]);
      setActivities([]);
      setDeployments([]);
    }
  }, [isAuthenticated, user]);

  const refreshData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Load datasets
      const { data: datasetsData, error: datasetsError } = await supabase
        .from('datasets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (datasetsError) throw datasetsError;
      setDatasets(datasetsData || []);

      // Load sensors
      const { data: sensorsData, error: sensorsError } = await supabase
        .from('sensors')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (sensorsError) throw sensorsError;
      setSensors(sensorsData || []);

      // Load activities
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (activitiesError) throw activitiesError;
      setActivities(activitiesData || []);

      // Load deployments
      const { data: deploymentsData, error: deploymentsError } = await supabase
        .from('deployments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (deploymentsError) throw deploymentsError;
      setDeployments(deploymentsData || []);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addDataset = async (dataset: Omit<Dataset, 'id' | 'created_at' | 'status'>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('datasets')
      .insert({
        user_id: user.id,
        name: dataset.name,
        type: dataset.type,
        size: dataset.size,
        content: dataset.content,
        status: 'processing',
      })
      .select()
      .single();

    if (error) throw error;

    // Add to local state
    setDatasets(prev => [data, ...prev]);

    // Add activity
    await addActivity({
      action: `Uploaded ${dataset.name}`,
      type: 'upload',
      dataset_id: data.id,
    });

    // Simulate processing
    setTimeout(async () => {
      await supabase
        .from('datasets')
        .update({ status: 'processed' })
        .eq('id', data.id);
      
      setDatasets(prev => prev.map(d => 
        d.id === data.id ? { ...d, status: 'processed' } : d
      ));
    }, 2000);
  };

  const deleteDataset = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    const dataset = datasets.find(d => d.id === id);
    if (!dataset) return;

    const { error } = await supabase
      .from('datasets')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    setDatasets(prev => prev.filter(d => d.id !== id));

    await addActivity({
      action: `Deleted ${dataset.name}`,
      type: 'delete',
    });
  };

  const addSensor = async (sensor: Omit<Sensor, 'id' | 'created_at' | 'status'>) => {
    if (!user) throw new Error('User not authenticated');

    const apiEndpoint = `https://api.chainsensor.com/v1/${sensor.name.toLowerCase().replace(/\s+/g, '-')}`;

    const { data, error } = await supabase
      .from('sensors')
      .insert({
        user_id: user.id,
        name: sensor.name,
        dataset_id: sensor.dataset_id,
        logic: sensor.logic,
        api_endpoint: apiEndpoint,
        status: 'active',
      })
      .select()
      .single();

    if (error) throw error;

    // Add to local state immediately
    setSensors(prev => [data, ...prev]);

    await addActivity({
      action: `Created sensor: ${sensor.name}`,
      type: 'create',
      sensor_id: data.id,
    });

    // Return the created sensor
    return data;
  };

  const updateSensor = async (id: string, updates: Partial<Sensor>) => {
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('sensors')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    setSensors(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const addActivity = async (activity: Omit<Activity, 'id' | 'created_at'>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('activities')
      .insert({
        user_id: user.id,
        action: activity.action,
        type: activity.type,
        dataset_id: activity.dataset_id,
        sensor_id: activity.sensor_id,
      })
      .select()
      .single();

    if (error) throw error;

    setActivities(prev => [data, ...prev.slice(0, 9)]);
  };

  const addDeployment = async (deployment: Omit<Deployment, 'id' | 'created_at' | 'status'>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('deployments')
      .insert({
        user_id: user.id,
        sensor_id: deployment.sensor_id,
        platform: deployment.platform,
        api_endpoint: deployment.api_endpoint,
        status: 'deploying',
      })
      .select()
      .single();

    if (error) throw error;

    setDeployments(prev => [data, ...prev]);

    // Simulate deployment process
    setTimeout(async () => {
      await updateDeployment(data.id, { status: 'deployed' });
    }, 3000);

    return data;
  };

  const updateDeployment = async (id: string, updates: Partial<Deployment>) => {
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('deployments')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    setDeployments(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const getDatasetById = (id: string) => {
    return datasets.find(d => d.id === id);
  };

  const getSensorById = (id: string) => {
    return sensors.find(s => s.id === id);
  };

  return (
    <DataContext.Provider value={{
      datasets,
      sensors,
      activities,
      deployments,
      storageUsed,
      storageLimit,
      isLoading,
      addDataset,
      deleteDataset,
      addSensor,
      updateSensor,
      addActivity,
      addDeployment,
      updateDeployment,
      getDatasetById,
      getSensorById,
      refreshData,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}