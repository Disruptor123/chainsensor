/*
  # Seed Marketplace Data

  1. Insert sample marketplace datasets
  2. Populate with realistic data for testing
*/

INSERT INTO marketplace_datasets (name, description, type, size, format, rating, downloads, author, tags, preview) VALUES
('Heart Rate Variability Dataset', 'Comprehensive heart rate data from 1000+ subjects during various activities', 'health', '45.2 MB', 'CSV', 4.8, 2341, 'MedTech Research', ARRAY['healthcare', 'biometric', 'cardiology'], 'timestamp,heart_rate,activity,age,gender
2024-01-01 10:00:00,72,resting,25,M
2024-01-01 10:01:00,75,walking,25,M'),

('Environmental Sensor Network', 'Temperature, humidity, and air quality data from urban sensors', 'environment', '128.7 MB', 'JSON', 4.6, 1876, 'Smart City Initiative', ARRAY['environment', 'IoT', 'urban'], '{"timestamp": "2024-01-01T10:00:00Z", "temperature": 22.5, "humidity": 65, "air_quality": 85}'),

('Human Activity Recognition', 'Accelerometer and gyroscope data for activity classification', 'movement', '89.3 MB', 'CSV', 4.9, 3102, 'Motion Analytics Lab', ARRAY['movement', 'accelerometer', 'classification'], 'timestamp,acc_x,acc_y,acc_z,gyro_x,gyro_y,gyro_z,activity
2024-01-01 10:00:00,0.12,-0.05,9.81,0.01,0.02,-0.01,walking'),

('Voice Command Dataset', 'Audio recordings of voice commands in multiple languages', 'audio', '2.1 GB', 'WAV', 4.7, 987, 'Speech Recognition Corp', ARRAY['audio', 'voice', 'commands'], 'Audio files: command_001.wav, command_002.wav, ...
Labels: turn_on_lights, play_music, set_timer'),

('Smart Home Energy Usage', 'Energy consumption patterns from 500 smart homes', 'energy', '67.4 MB', 'CSV', 4.5, 1543, 'Energy Analytics', ARRAY['energy', 'smart-home', 'consumption'], 'timestamp,home_id,device,power_consumption,room
2024-01-01 10:00:00,H001,refrigerator,150,kitchen'),

('Agricultural Soil Sensors', 'Soil moisture, pH, and nutrient data from farming sensors', 'agriculture', '34.8 MB', 'JSON', 4.4, 876, 'AgriTech Solutions', ARRAY['agriculture', 'soil', 'farming'], '{"timestamp": "2024-01-01T10:00:00Z", "moisture": 45.2, "ph": 6.8, "nitrogen": 12.5}'),

('Traffic Flow Monitoring', 'Vehicle count and speed data from highway sensors', 'transportation', '156.2 MB', 'CSV', 4.6, 2187, 'Transport Authority', ARRAY['traffic', 'transportation', 'monitoring'], 'timestamp,location,vehicle_count,average_speed,lane
2024-01-01 10:00:00,Highway_A1,45,65,1'),

('Weather Station Network', 'Meteorological data from 200+ weather stations', 'weather', '203.5 MB', 'CSV', 4.8, 3456, 'National Weather Service', ARRAY['weather', 'meteorology', 'climate'], 'timestamp,station_id,temperature,pressure,wind_speed,precipitation
2024-01-01 10:00:00,WS001,18.5,1013.2,12.3,0.0'),

('Industrial Machine Vibration', 'Vibration sensor data for predictive maintenance', 'industrial', '78.9 MB', 'CSV', 4.7, 1234, 'Industrial IoT Corp', ARRAY['industrial', 'vibration', 'maintenance'], 'timestamp,machine_id,vibration_x,vibration_y,vibration_z,temperature
2024-01-01 10:00:00,M001,0.05,0.03,0.02,45.2'),

('Sleep Pattern Analysis', 'Sleep stage data from wearable devices', 'health', '92.1 MB', 'JSON', 4.9, 2876, 'Sleep Research Institute', ARRAY['health', 'sleep', 'wearable'], '{"timestamp": "2024-01-01T22:00:00Z", "sleep_stage": "deep", "heart_rate": 58, "movement": 0.1}'),

('Retail Customer Behavior', 'Customer movement and interaction data in retail stores', 'retail', '145.3 MB', 'CSV', 4.3, 1654, 'Retail Analytics', ARRAY['retail', 'customer', 'behavior'], 'timestamp,customer_id,zone,dwell_time,interaction
2024-01-01 10:00:00,C001,electronics,120,product_view'),

('Water Quality Monitoring', 'Chemical and biological water quality measurements', 'environment', '56.7 MB', 'CSV', 4.6, 987, 'Environmental Protection', ARRAY['water', 'quality', 'environment'], 'timestamp,location,ph,dissolved_oxygen,turbidity,temperature
2024-01-01 10:00:00,River_A,7.2,8.5,2.1,15.3'),

('Gesture Recognition Dataset', 'Hand gesture data captured using depth cameras', 'gesture', '1.8 GB', 'Binary', 4.8, 1432, 'Computer Vision Lab', ARRAY['gesture', 'computer-vision', 'depth'], 'Depth frames: frame_001.bin, frame_002.bin, ...
Gesture labels: swipe_left, swipe_right, pinch'),

('Financial Market Sentiment', 'Social media sentiment analysis for market prediction', 'finance', '234.6 MB', 'JSON', 4.4, 2109, 'FinTech Analytics', ARRAY['finance', 'sentiment', 'social-media'], '{"timestamp": "2024-01-01T10:00:00Z", "symbol": "AAPL", "sentiment": 0.75, "volume": 1000}'),

('Smart Building Occupancy', 'Room occupancy data from building management systems', 'building', '43.2 MB', 'CSV', 4.5, 876, 'Smart Building Solutions', ARRAY['building', 'occupancy', 'smart'], 'timestamp,room_id,occupancy,temperature,light_level
2024-01-01 10:00:00,R101,3,22.5,450'),

('Drone Flight Telemetry', 'Flight data from autonomous drone missions', 'aerospace', '167.8 MB', 'CSV', 4.7, 1321, 'Aerospace Research', ARRAY['drone', 'telemetry', 'aerospace'], 'timestamp,drone_id,latitude,longitude,altitude,battery,speed
2024-01-01 10:00:00,D001,40.7128,-74.0060,100,85,15.2'),

('Network Traffic Analysis', 'Network packet data for cybersecurity research', 'cybersecurity', '512.4 MB', 'PCAP', 4.6, 1876, 'Cybersecurity Institute', ARRAY['network', 'security', 'packets'], 'Packet capture files: traffic_001.pcap, traffic_002.pcap, ...
Labels: normal, malicious, suspicious'),

('Wearable Fitness Tracking', 'Multi-sensor fitness data from wearable devices', 'fitness', '198.7 MB', 'JSON', 4.8, 3421, 'Fitness Tech Corp', ARRAY['fitness', 'wearable', 'health'], '{"timestamp": "2024-01-01T10:00:00Z", "steps": 1250, "calories": 85, "heart_rate": 78}'),

('Autonomous Vehicle Sensors', 'LiDAR and camera data from self-driving cars', 'automotive', '3.2 GB', 'Binary', 4.9, 987, 'Autonomous Driving Lab', ARRAY['automotive', 'lidar', 'autonomous'], 'LiDAR point clouds: scan_001.pcd, scan_002.pcd, ...
Camera images: img_001.jpg, img_002.jpg'),

('Social Media Engagement', 'User interaction patterns on social platforms', 'social', '287.3 MB', 'JSON', 4.2, 2543, 'Social Analytics', ARRAY['social-media', 'engagement', 'analytics'], '{"timestamp": "2024-01-01T10:00:00Z", "user_id": "U001", "action": "like", "content_type": "post"}');