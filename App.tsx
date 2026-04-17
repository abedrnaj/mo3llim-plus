import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeContext';
import { AuthProvider, useAuth } from './components/AuthContext';
import Layout from './components/Layout';
import Home from './components/Home';
import LessonPlannerForm from './components/LessonPlannerForm';
import LessonPlanDisplay from './components/LessonPlanDisplay';
import Community from './components/Community';
import Guide from './components/Guide';
import Profile from './components/Profile';
import LoginPage from './components/LoginPage';

const AppContent: React.FC = () => {
  const { isLoggedIn, isAuthReady } = useAuth();
  const [result, setResult] = useState<any>(null);

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/planner" element={
          <div className="max-w-5xl mx-auto space-y-12 px-4">
            <LessonPlannerForm onResult={setResult} />
            <LessonPlanDisplay data={result} />
          </div>
        } />
        <Route path="/community" element={<Community />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
