import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  Calendar, 
  Gift,
  Award,
  Crown,
  Medal,
  Flame,
  CheckCircle,
  Lock,
  Unlock
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const Rewards = () => {
  const { currentUser, addAchievement, updateStreak } = useUser();
  const { profile, progress } = currentUser || {};
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Rewards', icon: Trophy },
    { id: 'streak', name: 'Streak Rewards', icon: Flame },
    { id: 'workout', name: 'Workout Rewards', icon: Target },
    { id: 'diet', name: 'Diet Rewards', icon: Star },
    { id: 'milestone', name: 'Milestones', icon: Award }
  ];

  const rewards = [
    // Streak Rewards
    {
      id: 'streak_3',
      name: 'Getting Started',
      description: 'Complete 3 days in a row',
      icon: Flame,
      category: 'streak',
      requirement: 3,
      points: 50,
      unlocked: (progress.streak || 0) >= 3,
      emoji: '🌱'
    },
    {
      id: 'streak_7',
      name: 'One Week Warrior',
      description: 'Complete 7 days in a row',
      icon: Flame,
      category: 'streak',
      requirement: 7,
      points: 100,
      unlocked: (progress.streak || 0) >= 7,
      emoji: '💪'
    },
    {
      id: 'streak_14',
      name: 'Two Week Champion',
      description: 'Complete 14 days in a row',
      icon: Flame,
      category: 'streak',
      requirement: 14,
      points: 250,
      unlocked: (progress.streak || 0) >= 14,
      emoji: '⚡'
    },
    {
      id: 'streak_30',
      name: 'Monthly Master',
      description: 'Complete 30 days in a row',
      icon: Flame,
      category: 'streak',
      requirement: 30,
      points: 500,
      unlocked: (progress.streak || 0) >= 30,
      emoji: '🔥'
    },
    {
      id: 'streak_60',
      name: 'Two Month Legend',
      description: 'Complete 60 days in a row',
      icon: Flame,
      category: 'streak',
      requirement: 60,
      points: 1000,
      unlocked: (progress.streak || 0) >= 60,
      emoji: '👑'
    },
    {
      id: 'streak_90',
      name: 'Quarterly King',
      description: 'Complete 90 days in a row',
      icon: Flame,
      category: 'streak',
      requirement: 90,
      points: 2000,
      unlocked: (progress.streak || 0) >= 90,
      emoji: '🏆'
    },

    // Workout Rewards
    {
      id: 'workout_5',
      name: 'First Steps',
      description: 'Complete 5 workouts',
      icon: Target,
      category: 'workout',
      requirement: 5,
      points: 100,
      unlocked: (progress.workoutHistory?.length || 0) >= 5,
      emoji: '🚀'
    },
    {
      id: 'workout_10',
      name: 'Building Momentum',
      description: 'Complete 10 workouts',
      icon: Target,
      category: 'workout',
      requirement: 10,
      points: 200,
      unlocked: (progress.workoutHistory?.length || 0) >= 10,
      emoji: '💪'
    },
    {
      id: 'workout_25',
      name: 'Workout Warrior',
      description: 'Complete 25 workouts',
      icon: Target,
      category: 'workout',
      requirement: 25,
      points: 500,
      unlocked: (progress.workoutHistory?.length || 0) >= 25,
      emoji: '⚔️'
    },
    {
      id: 'workout_50',
      name: 'Fitness Fanatic',
      description: 'Complete 50 workouts',
      icon: Target,
      category: 'workout',
      requirement: 50,
      points: 1000,
      unlocked: (progress.workoutHistory?.length || 0) >= 50,
      emoji: '🏋️'
    },
    {
      id: 'workout_100',
      name: 'Century Club',
      description: 'Complete 100 workouts',
      icon: Target,
      category: 'workout',
      requirement: 100,
      points: 2500,
      unlocked: (progress.workoutHistory?.length || 0) >= 100,
      emoji: '💯'
    },

    // Diet Rewards
    {
      id: 'diet_7',
      name: 'Healthy Eater',
      description: 'Track meals for 7 days',
      icon: Star,
      category: 'diet',
      requirement: 7,
      points: 100,
      unlocked: (progress.dietHistory?.length || 0) >= 7,
      emoji: '🥗'
    },
    {
      id: 'diet_14',
      name: 'Nutrition Ninja',
      description: 'Track meals for 14 days',
      icon: Star,
      category: 'diet',
      requirement: 14,
      points: 200,
      unlocked: (progress.dietHistory?.length || 0) >= 14,
      emoji: '🥕'
    },
    {
      id: 'diet_30',
      name: 'Diet Master',
      description: 'Track meals for 30 days',
      icon: Star,
      category: 'diet',
      requirement: 30,
      points: 500,
      unlocked: (progress.dietHistory?.length || 0) >= 30,
      emoji: '🍎'
    },

    // Milestone Rewards
    {
      id: 'points_100',
      name: 'Point Collector',
      description: 'Earn 100 points',
      icon: Award,
      category: 'milestone',
      requirement: 100,
      points: 0,
      unlocked: (progress.points || 0) >= 100,
      emoji: '⭐'
    },
    {
      id: 'points_500',
      name: 'Point Hunter',
      description: 'Earn 500 points',
      icon: Award,
      category: 'milestone',
      requirement: 500,
      points: 0,
      unlocked: (progress.points || 0) >= 500,
      emoji: '🌟'
    },
    {
      id: 'points_1000',
      name: 'Point Master',
      description: 'Earn 1000 points',
      icon: Award,
      category: 'milestone',
      requirement: 1000,
      points: 0,
      unlocked: (progress.points || 0) >= 1000,
      emoji: '💫'
    },
    {
      id: 'points_2500',
      name: 'Point Legend',
      description: 'Earn 2500 points',
      icon: Award,
      category: 'milestone',
      requirement: 2500,
      points: 0,
      unlocked: (progress.points || 0) >= 2500,
      emoji: '👑'
    },
    {
      id: 'level_5',
      name: 'Level 5 Achiever',
      description: 'Reach level 5',
      icon: Crown,
      category: 'milestone',
      requirement: 5,
      points: 0,
      unlocked: (progress.level || 1) >= 5,
      emoji: '🏆'
    },
    {
      id: 'level_10',
      name: 'Level 10 Master',
      description: 'Reach level 10',
      icon: Crown,
      category: 'milestone',
      requirement: 10,
      points: 0,
      unlocked: (progress.level || 1) >= 10,
      emoji: '👑'
    }
  ];

  const filteredRewards = selectedCategory === 'all' 
    ? rewards 
    : rewards.filter(reward => reward.category === selectedCategory);

  const unlockedRewards = rewards.filter(reward => reward.unlocked);
  const lockedRewards = rewards.filter(reward => !reward.unlocked);

  const getProgressPercentage = (reward) => {
    switch (reward.category) {
      case 'streak':
        return Math.min(100, ((progress.streak || 0) / reward.requirement) * 100);
      case 'workout':
        return Math.min(100, ((progress.workoutHistory?.length || 0) / reward.requirement) * 100);
      case 'diet':
        return Math.min(100, ((progress.dietHistory?.length || 0) / reward.requirement) * 100);
      case 'milestone':
        if (reward.id.includes('points')) {
          return Math.min(100, ((progress.points || 0) / reward.requirement) * 100);
        } else if (reward.id.includes('level')) {
          return Math.min(100, ((progress.level || 1) / reward.requirement) * 100);
        }
        return 0;
      default:
        return 0;
    }
  };

  const getCurrentValue = (reward) => {
    switch (reward.category) {
      case 'streak':
        return progress.streak || 0;
      case 'workout':
        return progress.workoutHistory?.length || 0;
      case 'diet':
        return progress.dietHistory?.length || 0;
      case 'milestone':
        if (reward.id.includes('points')) {
          return progress.points || 0;
        } else if (reward.id.includes('level')) {
          return progress.level || 1;
        }
        return 0;
      default:
        return 0;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Rewards & Achievements</h1>
        <p className="text-gray-600 text-lg">Earn points, unlock achievements, and level up your fitness journey</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 text-center"
        >
          <div className="text-3xl font-bold text-primary-600 mb-2">{progress.points || 0}</div>
          <div className="text-gray-600">Total Points</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 text-center"
        >
          <div className="text-3xl font-bold text-warning-600 mb-2">{progress.level || 1}</div>
          <div className="text-gray-600">Current Level</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6 text-center"
        >
          <div className="text-3xl font-bold text-success-600 mb-2">{unlockedRewards.length}</div>
          <div className="text-gray-600">Achievements Unlocked</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6 text-center"
        >
          <div className="text-3xl font-bold text-danger-600 mb-2">{progress.streak || 0}</div>
          <div className="text-gray-600">Current Streak</div>
        </motion.div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary-100 text-primary-700 border-2 border-primary-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRewards.map((reward, index) => {
          const Icon = reward.icon;
          const progressPercentage = getProgressPercentage(reward);
          const currentValue = getCurrentValue(reward);

          return (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`card p-6 relative overflow-hidden ${
                reward.unlocked 
                  ? 'border-success-200 bg-success-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              {/* Unlocked Badge */}
              {reward.unlocked && (
                <div className="absolute top-4 right-4">
                  <CheckCircle className="h-6 w-6 text-success-600" />
                </div>
              )}

              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{reward.emoji}</div>
                <div className={`p-3 rounded-lg mx-auto w-fit ${
                  reward.unlocked ? 'bg-success-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`h-6 w-6 ${
                    reward.unlocked ? 'text-success-600' : 'text-gray-400'
                  }`} />
                </div>
              </div>

              <div className="text-center mb-4">
                <h3 className={`text-lg font-bold mb-2 ${
                  reward.unlocked ? 'text-success-800' : 'text-gray-700'
                }`}>
                  {reward.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{reward.description}</p>
                {reward.points > 0 && (
                  <div className="text-sm font-medium text-warning-600">
                    +{reward.points} points
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>{currentValue} / {reward.requirement}</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      reward.unlocked ? 'bg-success-600' : 'bg-primary-600'
                    }`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Status */}
              <div className="text-center">
                {reward.unlocked ? (
                  <div className="flex items-center justify-center space-x-2 text-success-700">
                    <Unlock className="h-4 w-4" />
                    <span className="text-sm font-medium">Unlocked!</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2 text-gray-500">
                    <Lock className="h-4 w-4" />
                    <span className="text-sm">Locked</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Achievements */}
      {progress.achievements && progress.achievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Trophy className="h-5 w-5 text-warning-600 mr-2" />
            Recent Achievements
          </h2>
          <div className="space-y-3">
            {progress.achievements.slice(-5).map((achievement, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-warning-50 rounded-lg border border-warning-200">
                <div className="flex items-center space-x-3">
                  <Trophy className="h-5 w-5 text-warning-600" />
                  <div>
                    <div className="font-medium text-gray-900">{achievement.name}</div>
                    <div className="text-sm text-gray-600">{achievement.description}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-warning-600">+{achievement.points} pts</div>
                  <div className="text-xs text-gray-500">
                    {new Date(achievement.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Level Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Crown className="h-5 w-5 text-warning-600 mr-2" />
          Level Progress
        </h2>
        <div className="text-center mb-4">
          <div className="text-3xl font-bold text-warning-600 mb-2">
            Level {progress.level || 1}
          </div>
          <div className="text-gray-600">
            {(progress.points || 0) % 100} / 100 XP to next level
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-warning-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${((progress.points || 0) % 100)}%` }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Rewards;
