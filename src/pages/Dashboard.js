import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  Utensils, 
  Trophy, 
  Zap,
  Heart,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Activity,
  Dumbbell
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useOllama } from '../contexts/OllamaContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { currentUser } = useUser();
  const { generateMotivationalMessage, isLoading } = useOllama();
  const [motivationalMessage, setMotivationalMessage] = useState('');
  const [todaysWorkout, setTodaysWorkout] = useState(null);
  const [todaysDiet, setTodaysDiet] = useState(null);

  useEffect(() => {
    // Generate motivational message
    const generateMessage = async () => {
      try {
        if (currentUser?.profile?.name) {
          const message = await generateMotivationalMessage(currentUser.profile, 'dashboard');
          setMotivationalMessage(message);
        }
      } catch (error) {
        console.error('Error generating motivational message:', error);
        setMotivationalMessage("You're doing great! Keep up the amazing work on your fitness journey!");
      }
    };

    if (currentUser?.profile?.name) {
      generateMessage();
    }
  }, [currentUser, generateMotivationalMessage]);
  
  if (!currentUser) {
    return <LoadingSpinner />;
  }

  const { profile, progress, recommendations } = currentUser;

  const getBMI = () => {
    if (!profile.height || !profile.weight) return null;
    
    // Convert height to meters (assuming format like "5'8" or "173cm")
    let heightInMeters;
    if (profile.height.includes("'")) {
      const [feet, inches] = profile.height.split("'").map(Number);
      heightInMeters = (feet * 12 + inches) * 0.0254;
    } else {
      heightInMeters = parseFloat(profile.height) / 100;
    }
    
    const weightInKg = parseFloat(profile.weight);
    return (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'warning' };
    if (bmi < 25) return { category: 'Normal', color: 'success' };
    if (bmi < 30) return { category: 'Overweight', color: 'warning' };
    return { category: 'Obese', color: 'danger' };
  };

  const getStreakEmoji = (streak) => {
    if (streak >= 30) return '🔥';
    if (streak >= 14) return '⚡';
    if (streak >= 7) return '💪';
    if (streak >= 3) return '⭐';
    return '🌱';
  };

  const getLevelProgress = () => {
    const currentLevel = progress.level || 1;
    const pointsInLevel = progress.points % 100;
    const progressPercentage = (pointsInLevel / 100) * 100;
    
    return {
      currentLevel,
      pointsInLevel,
      progressPercentage,
      pointsToNext: 100 - pointsInLevel
    };
  };

  const stats = [
    {
      title: 'Current Streak',
      value: `${progress.streak || 0} days`,
      icon: Zap,
      color: 'primary',
      emoji: getStreakEmoji(progress.streak || 0)
    },
    {
      title: 'Total Points',
      value: progress.points || 0,
      icon: Trophy,
      color: 'warning',
      emoji: '🏆'
    },
    {
      title: 'Workout Consistency',
      value: `${progress.consistency?.workouts || 0}%`,
      icon: Activity,
      color: 'success',
      emoji: '💪'
    },
    {
      title: 'Diet Consistency',
      value: `${progress.consistency?.diet || 0}%`,
      icon: Utensils,
      color: 'success',
      emoji: '🥗'
    }
  ];

  const quickActions = [
    {
      title: 'Log Workout',
      description: 'Record today\'s workout',
      icon: Calendar,
      color: 'primary',
      href: '/workout'
    },
    {
      title: 'Track Calories',
      description: 'Log your meals',
      icon: Utensils,
      color: 'success',
      href: '/diet'
    },
    {
      title: 'View Progress',
      description: 'Check your growth',
      icon: TrendingUp,
      color: 'warning',
      href: '/progress'
    },
    {
      title: 'Earn Rewards',
      description: 'See your achievements',
      icon: Trophy,
      color: 'danger',
      href: '/rewards'
    }
  ];

  const levelProgress = getLevelProgress();
  const bmi = getBMI();
  const bmiCategory = bmi ? getBMICategory(bmi) : null;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {profile.name}! 👋
            </h1>
            <p className="text-primary-100 text-lg">
              {motivationalMessage || "Ready to crush your fitness goals today?"}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <div className="text-2xl font-bold">Level {levelProgress.currentLevel}</div>
              <div className="text-primary-200">Fitness Warrior</div>
            </div>
          </div>
        </div>
        
        {/* Level Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-primary-200 mb-2">
            <span>{levelProgress.pointsInLevel} / 100 XP</span>
            <span>{levelProgress.pointsToNext} to next level</span>
          </div>
          <div className="w-full bg-primary-700 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${levelProgress.progressPercentage}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
              <div className="mt-2 text-2xl">{stat.emoji}</div>
            </motion.div>
          );
        })}
      </div>

      {/* BMI and Health Info */}
      {bmi && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Heart className="h-5 w-5 text-red-500 mr-2" />
            Health Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{bmi}</div>
              <div className="text-sm text-gray-600">BMI</div>
              <div className={`text-sm font-medium text-${bmiCategory.color}-600`}>
                {bmiCategory.category}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{profile.weight} kg</div>
              <div className="text-sm text-gray-600">Current Weight</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{profile.height}</div>
              <div className="text-sm text-gray-600">Height</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Training Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="card p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Dumbbell className="h-5 w-5 text-primary-600 mr-2" />
          Training Preferences
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Training Methods</h3>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(profile.trainingMethod) ? (
                profile.trainingMethod.map((method, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
                  >
                    {method}
                  </span>
                ))
              ) : (
                <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                  {profile.trainingMethod}
                </span>
              )}
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Available Equipment</h3>
            <div className="flex flex-wrap gap-2">
              {profile.availableEquipment?.map((equipment, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-success-100 text-success-800 rounded-full text-sm font-medium"
                >
                  {equipment}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Experience Level</h3>
              <p className="text-gray-600">{profile.experience}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Available Time</h3>
              <p className="text-gray-600">{profile.availableTime}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.a
                key={action.title}
                href={action.href}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-4 rounded-lg border-2 border-${action.color}-200 hover:border-${action.color}-400 transition-colors cursor-pointer`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-${action.color}-100`}>
                    <Icon className={`h-5 w-5 text-${action.color}-600`} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </motion.div>

      {/* Today's Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workout Recommendation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="card p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 text-primary-600 mr-2" />
            Today's Workout
          </h2>
          {recommendations.workout ? (
            <div className="space-y-3">
              <div className="p-3 bg-primary-50 rounded-lg">
                <p className="text-sm text-primary-800">
                  {recommendations.workout.substring(0, 200)}...
                </p>
              </div>
              <button className="btn btn-primary w-full">
                View Full Workout Plan
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No workout plan generated yet</p>
              <button className="btn btn-primary mt-4">
                Generate Workout Plan
              </button>
            </div>
          )}
        </motion.div>

        {/* Diet Recommendation */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="card p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Utensils className="h-5 w-5 text-success-600 mr-2" />
            Today's Nutrition
          </h2>
          {recommendations.diet ? (
            <div className="space-y-3">
              <div className="p-3 bg-success-50 rounded-lg">
                <p className="text-sm text-success-800">
                  {recommendations.diet.substring(0, 200)}...
                </p>
              </div>
              <button className="btn btn-success w-full">
                View Full Diet Plan
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <Utensils className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No diet plan generated yet</p>
              <button className="btn btn-success mt-4">
                Generate Diet Plan
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Achievements */}
      {progress.achievements && progress.achievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Trophy className="h-5 w-5 text-warning-600 mr-2" />
            Recent Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {progress.achievements.slice(-3).map((achievement, index) => (
              <div key={index} className="p-4 bg-warning-50 rounded-lg border border-warning-200">
                <div className="flex items-center space-x-3">
                  <Trophy className="h-6 w-6 text-warning-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">{achievement.name}</h3>
                    <p className="text-sm text-gray-600">+{achievement.points} points</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
