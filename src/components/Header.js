import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Dumbbell, 
  User, 
  Calendar, 
  Utensils, 
  TrendingUp, 
  Trophy,
  Settings,
  LogOut,
  Users,
  Crown,
  Menu,
  Activity
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import UserManager from './UserManager';
import Leaderboard from './Leaderboard';
// import ProfileComparison from './ProfileComparison';

const Header = () => {
  const location = useLocation();
  const { currentUser, resetAll } = useUser();
  const [showUserManager, setShowUserManager] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  // const [showProfileComparison, setShowProfileComparison] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Dumbbell },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Workout', href: '/workout', icon: Calendar },
    { name: 'Diet', href: '/diet', icon: Utensils },
    { name: 'Progress', href: '/progress', icon: TrendingUp },
    { name: 'Rewards', href: '/rewards', icon: Trophy },
    { name: 'Live PR', href: '/live-workout', icon: Activity },
  ];

  const handleLogout = () => {
    resetAll();
  };

  const avatars = [
    { id: 'default', emoji: '👤' },
    { id: 'fitness', emoji: '💪' },
    { id: 'runner', emoji: '🏃' },
    { id: 'yoga', emoji: '🧘' },
    { id: 'swimmer', emoji: '🏊' },
    { id: 'cyclist', emoji: '🚴' },
    { id: 'climber', emoji: '🧗' },
    { id: 'dancer', emoji: '💃' },
    { id: 'martial', emoji: '🥋' },
    { id: 'gamer', emoji: '🎮' },
    { id: 'chef', emoji: '👨‍🍳' },
    { id: 'artist', emoji: '🎨' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-black/60 backdrop-blur-md shadow-sm border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="bg-primary-600 p-2 rounded-lg shadow-[0_0_15px_rgba(124,58,237,0.5)]">
              <Dumbbell className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-100">FitnessAI</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary-600/20 text-primary-400'
                      : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-2">
            {/* Leaderboard Button */}
            <button
              onClick={() => setShowLeaderboard(true)}
              className="p-2 text-gray-400 hover:text-primary-400 transition-colors"
              title="Leaderboard"
            >
              <Crown className="h-5 w-5" />
            </button>

            {/* User Manager Button */}
            <button
              onClick={() => setShowUserManager(true)}
              className="p-2 text-gray-400 hover:text-primary-400 transition-colors"
              title="Manage Users"
            >
              <Users className="h-5 w-5" />
            </button>

            {/* Current User Info */}
            {currentUser && (
              <div className="hidden sm:flex items-center space-x-2 ml-2 pl-4 border-l border-gray-700">
                <div className="text-2xl">
                  {avatars.find(a => a.id === currentUser.user.avatar)?.emoji || '👤'}
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-200">
                    {currentUser.user.username}
                  </div>
                  <div className="text-xs text-gray-400">
                    Level {currentUser.progress?.level || 1} • {currentUser.progress?.points || 0} pts
                  </div>
                </div>
              </div>
            )}
            
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-danger-400 transition-colors ml-2"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-800">
          <nav className="flex space-x-1 py-2 overflow-x-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-primary-600/20 text-primary-400'
                      : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Modals */}
      <UserManager 
        isOpen={showUserManager} 
        onClose={() => setShowUserManager(false)} 
      />
      <Leaderboard 
        isOpen={showLeaderboard} 
        onClose={() => setShowLeaderboard(false)} 
      />
      {/* <ProfileComparison 
        isOpen={showProfileComparison} 
        onClose={() => setShowProfileComparison(false)} 
      /> */}
    </header>
  );
};

export default Header;
