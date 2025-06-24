import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import MyData from './pages/MyData';
import CreateSensor from './pages/CreateSensor';
import DeploySensor from './pages/DeploySensor';
import DataMarketplace from './pages/DataMarketplace';
import AiChat from './pages/AiChat';
import Settings from './pages/Settings';
import Help from './pages/Help';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" />;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <Router>
            <div className="min-h-screen bg-black text-white">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/my-data" element={
                  <ProtectedRoute>
                    <MyData />
                  </ProtectedRoute>
                } />
                <Route path="/create-sensor" element={
                  <ProtectedRoute>
                    <CreateSensor />
                  </ProtectedRoute>
                } />
                <Route path="/deploy" element={
                  <ProtectedRoute>
                    <DeploySensor />
                  </ProtectedRoute>
                } />
                <Route path="/data-marketplace" element={
                  <ProtectedRoute>
                    <DataMarketplace />
                  </ProtectedRoute>
                } />
                <Route path="/ai-chat" element={
                  <ProtectedRoute>
                    <AiChat />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
                <Route path="/help" element={
                  <ProtectedRoute>
                    <Help />
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </Router>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;