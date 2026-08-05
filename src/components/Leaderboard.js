import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Crown, 
  Medal, 
  Star, 
  Zap, 
  Target, 
  TrendingUp,
  Users,
  Calendar,
  Activity,
  Award,
  Flame
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const Leaderboard = ({ isOpen, onClose }) => {
  const { 
    currentUserId, 
    currentUser, 
    getAllUsers, 
    generateLeaderboard,
    leaderboard,
    updateLeaderboard 
  } = useUser();
  
  const [selectedCategory, setSelectedCategory] = useState('points');
  const [timeframe, setTimeframe] = useState('all');

  useEffect(() => {
    updateLeaderboard();
  }, [updateLeaderboard]);

  const categories = [
    { id: 'points', name: 'Total Points', icon: Trophy, color: 'warning' },
    { id: 'streak', name: 'Current Streak', icon: Flame, color: 'danger' },
    { id: 'workouts', name: 'Workouts', icon: Activity, color: 'primary' },
    { id: 'level', name: 'Level', icon: Star, color: 'success' },
    { id: 'consistency', name: 'Consistency', icon: Target, color: 'secondary' }
  ];

  const timeframes = [
    { id: 'all', name: 'All Time' },
    { id: 'week', name: 'This Week' },
    { id: 'month', name: 'This Month' }
  ];

  const getSortedUsers = () => {
    const allUsers = getAllUsers();
    
    return allUsers
      .filter(user => {
        if (!user.progress) return false;
        
        switch (selectedCategory) {
          case 'points':
            return user.progress.points > 0;
          case 'streak':
            return user.progress.streak > 0;
          case 'workouts':
            return user.progress.workoutHistory?.length > 0;
          case 'level':
            return user.progress.level > 1;
          case 'consistency':
            return user.progress.consistency?.workouts > 0;
          default:
            return true;
        }
      })
      .sort((a, b) => {
        switch (selectedCategory) {
          case 'points':
            return (b.progress?.points || 0) - (a.progress?.points || 0);
          case 'streak':
            return (b.progress?.streak || 0) - (a.progress?.streak || 0);
          case 'workouts':
            return (b.progress?.workoutHistory?.length || 0) - (a.progress?.workoutHistory?.length || 0);
          case 'level':
            return (b.progress?.level || 1) - (a.progress?.level || 1);
          case 'consistency':
            return (b.progress?.consistency?.workouts || 0) - (a.progress?.consistency?.workouts || 0);
          default:
            return 0;
        }
      })
      .slice(0, 20); // Top 20
  };

  const getValue = (user, category) => {
    switch (category) {
      case 'points':
        return user.progress?.points || 0;
      case 'streak':
        return user.progress?.streak || 0;
      case 'workouts':
        return user.progress?.workoutHistory?.length || 0;
      case 'level':
        return user.progress?.level || 1;
      case 'consistency':
        return user.progress?.consistency?.workouts || 0;
      default:
        return 0;
    }
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 1:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 2:
        return <Award className="h-6 w-6 text-orange-500" />;
      default:
        return <span className="text-lg font-bold text-gray-400">#{index + 1}</span>;
    }
  };

  const getRankColor = (index) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 1:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 2:
        return 'bg-gradient-to-r from-orange-400 to-orange-600';
      default:
        return 'bg-gradient-to-r from-primary-400 to-primary-600';
    }
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

  const sortedUsers = getSortedUsers();
  const currentUserRank = sortedUsers.findIndex(user => user.id === currentUserId) + 1;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-dark-cardSolid rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-warning-600 to-warning-800 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Trophy className="h-6 w-6" />
              <h2 className="text-2xl font-bold">Leaderboard</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Current User Rank */}
          {currentUser && currentUserRank > 0 && (
            <div className="mb-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">
                    {avatars.find(a => a.id === currentUser.user.avatar)?.emoji || '👤'}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-primary-800">
                      Your Rank: #{currentUserRank}
                    </h3>
                    <p className="text-primary-600">
                      {getValue({ progress: currentUser.progress }, selectedCategory)} {categories.find(c => c.id === selectedCategory)?.name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-600">
                    {getValue({ progress: currentUser.progress }, selectedCategory)}
                  </div>
                  <div className="text-sm text-primary-600">
                    {categories.find(c => c.id === selectedCategory)?.name}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="mb-6 space-y-4">
            <div>
              <label className="label text-gray-300 mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? `bg-${category.color}-100 text-${category.color}-700 border-2 border-${category.color}-300`
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="label text-gray-300 mb-2">Timeframe</label>
              <div className="flex gap-2">
                {timeframes.map((tf) => (
                  <button
                    key={tf.id}
                    onClick={() => setTimeframe(tf.id)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      timeframe === tf.id
                        ? 'bg-primary-100 text-primary-700 border-2 border-primary-300'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    {tf.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-100 mb-4">
              Top {sortedUsers.length} Users
            </h3>
            
            {sortedUsers.map((user, index) => {
              const value = getValue(user, selectedCategory);
              const isCurrentUser = user.id === currentUserId;
              
              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isCurrentUser
                      ? 'border-primary-500 bg-primary-50'
                      : index < 3
                      ? 'border-warning-300 bg-warning-50'
                      : 'border-gray-800 hover:border-gray-700 hover:bg-dark-bg'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-full ${getRankColor(index)} flex items-center justify-center text-white font-bold text-lg`}>
                          {index < 3 ? getRankIcon(index) : `#${index + 1}`}
                        </div>
                        {isCurrentUser && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-dark-cardSolid rounded-full"></div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">
                          {avatars.find(a => a.id === user.user.avatar)?.emoji || '👤'}
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">{user.user.username}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span className="flex items-center space-x-1">
                              <Zap className="h-4 w-4" />
                              <span>{user.progress?.points || 0} pts</span>
                            </span>
                            <span>Level {user.progress?.level || 1}</span>
                            <span className="flex items-center space-x-1">
                              <Flame className="h-4 w-4" />
                              <span>{user.progress?.streak || 0} days</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-100">{value}</div>
                      <div className="text-sm text-gray-400">
                        {categories.find(c => c.id === selectedCategory)?.name}
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar for Top 3 */}
                  {index < 3 && (
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            index === 0 ? 'bg-yellow-500' :
                            index === 1 ? 'bg-gray-400' :
                            'bg-orange-500'
                          }`}
                          style={{ 
                            width: `${Math.min(100, (value / (sortedUsers[0] ? getValue(sortedUsers[0], selectedCategory) : 1)) * 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Stats Summary */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-dark-bg rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-100">
                {sortedUsers.length}
              </div>
              <div className="text-sm text-gray-400">Total Users</div>
            </div>
            <div className="p-4 bg-dark-bg rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-100">
                {sortedUsers[0] ? getValue(sortedUsers[0], selectedCategory) : 0}
              </div>
              <div className="text-sm text-gray-400">Highest Score</div>
            </div>
            <div className="p-4 bg-dark-bg rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-100">
                {Math.round(sortedUsers.reduce((sum, user) => sum + getValue(user, selectedCategory), 0) / sortedUsers.length) || 0}
              </div>
              <div className="text-sm text-gray-400">Average Score</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Leaderboard;
