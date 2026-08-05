import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './contexts/UserContext';
import { OllamaProvider } from './contexts/OllamaContext';
import Header from './components/Header';
import Questionnaire from './pages/Questionnaire';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import WorkoutPlanner from './pages/WorkoutPlanner';
import DietPlanner from './pages/DietPlanner';
import ProgressTracker from './pages/ProgressTracker';
import Rewards from './pages/Rewards';
import LiveWorkout from './pages/LiveWorkout';
import LoadingSpinner from './components/LoadingSpinner';
import UserManager from './components/UserManager';

function AppContent() {
  const { currentUser, createUser } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [showUserManager, setShowUserManager] = useState(false);

  useEffect(() => {
    // Check if there are any users, if not show user manager
    const savedData = localStorage.getItem('fitnessAIMultiUser');
    if (savedData) {
      const userData = JSON.parse(savedData);
      if (!userData.users || Object.keys(userData.users).length === 0) {
        setShowUserManager(true);
      }
    } else {
      setShowUserManager(true);
    }
    setIsLoading(false);
  }, []);

  // const handleCreateFirstUser = (userData) => {
  //   createUser(userData);
  //   setShowUserManager(false);
  // };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // If no current user, show user manager
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-100 mb-4">Welcome to FitnessAI</h1>
          <p className="text-xl text-gray-400 mb-8">Create your first user profile to get started</p>
          <button
            onClick={() => setShowUserManager(true)}
            className="btn btn-primary btn-lg"
          >
            Create User Profile
          </button>
        </div>
        <UserManager 
          isOpen={showUserManager} 
          onClose={() => setShowUserManager(false)} 
        />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-dark-bg text-gray-200">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route 
              path="/" 
              element={
                currentUser.profile?.completed ? 
                <Navigate to="/dashboard" replace /> : 
                <Questionnaire />
              } 
            />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/workout" element={<WorkoutPlanner />} />
            <Route path="/diet" element={<DietPlanner />} />
            <Route path="/progress" element={<ProgressTracker />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/live-workout" element={<LiveWorkout />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <UserProvider>
      <OllamaProvider>
        <AppContent />
      </OllamaProvider>
    </UserProvider>
  );
}

export default App;
