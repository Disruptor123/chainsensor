/*
  # Create ChainSensor Database Schema

  1. New Tables
    - `profiles` - User profile information
    - `datasets` - User uploaded datasets
    - `sensors` - Created sensors
    - `activities` - Recent user activities
    - `deployments` - Sensor deployments
    - `api_keys` - User API keys
    - `marketplace_datasets` - Marketplace datasets
    - `notifications` - User notification preferences

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
    - Add policies for marketplace datasets to be publicly readable
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create datasets table
CREATE TABLE IF NOT EXISTS datasets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  type text NOT NULL,
  size text NOT NULL,
  content text,
  status text DEFAULT 'processing' CHECK (status IN ('processing', 'processed', 'error')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create sensors table
CREATE TABLE IF NOT EXISTS sensors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  dataset_id uuid REFERENCES datasets(id) ON DELETE CASCADE NOT NULL,
  logic jsonb NOT NULL DEFAULT '[]',
  api_endpoint text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action text NOT NULL,
  type text NOT NULL,
  dataset_id uuid REFERENCES datasets(id) ON DELETE SET NULL,
  sensor_id uuid REFERENCES sensors(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create deployments table
CREATE TABLE IF NOT EXISTS deployments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  sensor_id uuid REFERENCES sensors(id) ON DELETE CASCADE NOT NULL,
  platform text NOT NULL,
  api_endpoint text NOT NULL,
  status text DEFAULT 'deploying' CHECK (status IN ('deploying', 'deployed', 'error')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  key_hash text NOT NULL,
  key_preview text NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_used timestamptz
);

-- Create marketplace_datasets table
CREATE TABLE IF NOT EXISTS marketplace_datasets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  type text NOT NULL,
  size text NOT NULL,
  format text NOT NULL,
  rating numeric DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  downloads integer DEFAULT 0,
  author text NOT NULL,
  tags text[] DEFAULT '{}',
  preview text NOT NULL,
  content text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email boolean DEFAULT true,
  push boolean DEFAULT false,
  sms boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensors ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create policies for datasets
CREATE POLICY "Users can read own datasets"
  ON datasets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own datasets"
  ON datasets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own datasets"
  ON datasets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own datasets"
  ON datasets
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for sensors
CREATE POLICY "Users can read own sensors"
  ON sensors
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sensors"
  ON sensors
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sensors"
  ON sensors
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sensors"
  ON sensors
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for activities
CREATE POLICY "Users can read own activities"
  ON activities
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activities"
  ON activities
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policies for deployments
CREATE POLICY "Users can read own deployments"
  ON deployments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own deployments"
  ON deployments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own deployments"
  ON deployments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for api_keys
CREATE POLICY "Users can read own api_keys"
  ON api_keys
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own api_keys"
  ON api_keys
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own api_keys"
  ON api_keys
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for marketplace_datasets (publicly readable)
CREATE POLICY "Anyone can read marketplace datasets"
  ON marketplace_datasets
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert marketplace datasets"
  ON marketplace_datasets
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policies for notifications
CREATE POLICY "Users can read own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notifications"
  ON notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_datasets_user_id ON datasets(user_id);
CREATE INDEX IF NOT EXISTS idx_sensors_user_id ON sensors(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_deployments_user_id ON deployments(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_datasets_type ON marketplace_datasets(type);

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  
  INSERT INTO public.notifications (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();