import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Scale, 
  Ruler,
  Activity,
  Heart,
  Zap,
  Trophy,
  BarChart3,
  Plus,
  Edit3
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useOllama } from '../contexts/OllamaContext';
import LoadingSpinner from '../components/LoadingSpinner';

const ProgressTracker = () => {
  const { currentUser, updateProgress } = useUser();
  const { profile, progress } = currentUser || {};
  const { generateProgressAnalysis, isLoading } = useOllama();
  const [analysis, setAnalysis] = useState('');
  const [showWeightForm, setShowWeightForm] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newMeasurements, setNewMeasurements] = useState({
    chest: '',
    waist: '',
    hips: '',
    arms: '',
    thighs: ''
  });

  useEffect(() => {
    if (progress.workoutHistory?.length > 0 || progress.dietHistory?.length > 0) {
      generateAnalysis();
    }
  }, [progress]);

  // Safety check to prevent errors if profile is not loaded yet
  if (!profile) {
    return <LoadingSpinner />;
  }

  const generateAnalysis = async () => {
    try {
      const analysisText = await generateProgressAnalysis(profile, progress);
      setAnalysis(analysisText);
    } catch (error) {
      console.error('Error generating progress analysis:', error);
      setAnalysis("Keep up the great work! Your consistency is paying off. Continue following your plan and you'll see amazing results.");
    }
  };

  const addWeightEntry = () => {
    if (newWeight) {
      const weightEntry = {
        date: new Date().toISOString(),
        weight: parseFloat(newWeight)
      };

      const updatedWeights = [...(progress.weeklyWeight || []), weightEntry];
      updateProgress({ weeklyWeight: updatedWeights });
      setNewWeight('');
      setShowWeightForm(false);
    }
  };

  const addMeasurements = () => {
    const measurementEntry = {
      date: new Date().toISOString(),
      measurements: { ...newMeasurements }
    };

    const updatedMeasurements = [...(progress.weeklyMeasurements || []), measurementEntry];
    updateProgress({ weeklyMeasurements: updatedMeasurements });
    setNewMeasurements({
      chest: '',
      waist: '',
      hips: '',
      arms: '',
      thighs: ''
    });
  };

  const getWeightChange = () => {
    if (!progress.weeklyWeight || progress.weeklyWeight.length < 2) return 0;
    
    const latest = progress.weeklyWeight[progress.weeklyWeight.length - 1];
    const previous = progress.weeklyWeight[progress.weeklyWeight.length - 2];
    
    return latest.weight - previous.weight;
  };

  const getConsistencyScore = () => {
    const workoutConsistency = progress.consistency?.workouts || 0;
    const dietConsistency = progress.consistency?.diet || 0;
    const sleepConsistency = progress.consistency?.sleep || 0;
    const hydrationConsistency = progress.consistency?.hydration || 0;
    
    return Math.round((workoutConsistency + dietConsistency + sleepConsistency + hydrationConsistency) / 4);
  };

  const getStreakMilestones = () => {
    const streak = progress.streak || 0;
    const milestones = [
      { days: 3, name: 'Getting Started', emoji: '🌱' },
      { days: 7, name: 'One Week Strong', emoji: '💪' },
      { days: 14, name: 'Two Week Warrior', emoji: '⚡' },
      { days: 30, name: 'Monthly Master', emoji: '🔥' },
      { days: 60, name: 'Two Month Champion', emoji: '🏆' },
      { days: 90, name: 'Quarterly Legend', emoji: '👑' }
    ];

    return milestones.filter(milestone => streak >= milestone.days);
  };

  const stats = [
    {
      title: 'Current Streak',
      value: `${progress.streak || 0} days`,
      icon: Zap,
      color: 'primary',
      change: progress.streak > 0 ? '+' : '0'
    },
    {
      title: 'Total Points',
      value: progress.points || 0,
      icon: Trophy,
      color: 'warning',
      change: '+'
    },
    {
      title: 'Consistency Score',
      value: `${getConsistencyScore()}%`,
      icon: Target,
      color: 'success',
      change: getConsistencyScore() > 70 ? '+' : ''
    },
    {
      title: 'Workouts Completed',
      value: progress.workoutHistory?.length || 0,
      icon: Activity,
      color: 'danger',
      change: '+'
    }
  ];

  const recentAchievements = progress.achievements?.slice(-5) || [];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-100 mb-4">Progress Tracker</h1>
        <p className="text-gray-400 text-lg">Monitor your fitness journey and celebrate achievements</p>
      </div>

      {/* AI Analysis */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 border-primary-200 bg-primary-50"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-primary-800 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              AI Progress Analysis
            </h2>
            <button
              onClick={generateAnalysis}
              disabled={isLoading}
              className="btn btn-primary btn-sm"
            >
              {isLoading ? <LoadingSpinner size="sm" text="" /> : 'Refresh Analysis'}
            </button>
          </div>
          <div className="prose max-w-none">
            <p className="text-primary-700 whitespace-pre-wrap">{analysis}</p>
          </div>
        </motion.div>
      )}

      {/* Stats Overview */}
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
                  <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-100">{stat.value}</p>
                  <p className="text-sm text-green-600">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Weight Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-100 flex items-center">
              <Scale className="h-5 w-5 text-primary-600 mr-2" />
              Weight Tracking
            </h2>
            <button
              onClick={() => setShowWeightForm(!showWeightForm)}
              className="btn btn-primary btn-sm flex items-center space-x-1"
            >
              <Plus className="h-4 w-4" />
              <span>Add Weight</span>
            </button>
          </div>

          {showWeightForm && (
            <div className="mb-4 p-4 bg-dark-bg rounded-lg">
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  placeholder="Enter weight (kg)"
                  className="input flex-1"
                />
                <button onClick={addWeightEntry} className="btn btn-success">
                  Add
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {progress.weeklyWeight?.length > 0 
                  ? progress.weeklyWeight[progress.weeklyWeight.length - 1].weight 
                  : profile?.weight} kg
              </div>
              <div className="text-sm text-gray-400">
                {getWeightChange() !== 0 && (
                  <span className={getWeightChange() > 0 ? 'text-red-600' : 'text-green-600'}>
                    {getWeightChange() > 0 ? '+' : ''}{getWeightChange().toFixed(1)} kg from last entry
                  </span>
                )}
              </div>
            </div>

            {progress.weeklyWeight && progress.weeklyWeight.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium text-gray-300">Recent Entries</h3>
                {progress.weeklyWeight.slice(-5).map((entry, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-dark-bg rounded">
                    <span className="text-sm text-gray-400">
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                    <span className="font-medium">{entry.weight} kg</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Body Measurements */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-100 flex items-center">
              <Ruler className="h-5 w-5 text-success-600 mr-2" />
              Body Measurements
            </h2>
            <button
              onClick={addMeasurements}
              className="btn btn-success btn-sm flex items-center space-x-1"
            >
              <Plus className="h-4 w-4" />
              <span>Add Measurements</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label text-gray-300">Chest (cm)</label>
                <input
                  type="number"
                  value={newMeasurements.chest}
                  onChange={(e) => setNewMeasurements({ ...newMeasurements, chest: e.target.value })}
                  className="input w-full"
                  placeholder="Chest"
                />
              </div>
              <div>
                <label className="label text-gray-300">Waist (cm)</label>
                <input
                  type="number"
                  value={newMeasurements.waist}
                  onChange={(e) => setNewMeasurements({ ...newMeasurements, waist: e.target.value })}
                  className="input w-full"
                  placeholder="Waist"
                />
              </div>
              <div>
                <label className="label text-gray-300">Hips (cm)</label>
                <input
                  type="number"
                  value={newMeasurements.hips}
                  onChange={(e) => setNewMeasurements({ ...newMeasurements, hips: e.target.value })}
                  className="input w-full"
                  placeholder="Hips"
                />
              </div>
              <div>
                <label className="label text-gray-300">Arms (cm)</label>
                <input
                  type="number"
                  value={newMeasurements.arms}
                  onChange={(e) => setNewMeasurements({ ...newMeasurements, arms: e.target.value })}
                  className="input w-full"
                  placeholder="Arms"
                />
              </div>
            </div>

            {progress.weeklyMeasurements && progress.weeklyMeasurements.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium text-gray-300">Recent Measurements</h3>
                {progress.weeklyMeasurements.slice(-3).map((entry, index) => (
                  <div key={index} className="p-3 bg-dark-bg rounded">
                    <div className="text-sm text-gray-400 mb-2">
                      {new Date(entry.date).toLocaleDateString()}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(entry.measurements).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="capitalize">{key}:</span>
                          <span className="font-medium">{value}cm</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Streak Milestones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-6"
      >
        <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center">
          <Trophy className="h-5 w-5 text-warning-600 mr-2" />
          Streak Milestones
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {getStreakMilestones().map((milestone, index) => (
            <div key={index} className="text-center p-4 bg-warning-50 rounded-lg border border-warning-200">
              <div className="text-2xl mb-2">{milestone.emoji}</div>
              <div className="font-medium text-warning-800">{milestone.name}</div>
              <div className="text-sm text-warning-600">{milestone.days} days</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center">
            <Trophy className="h-5 w-5 text-warning-600 mr-2" />
            Recent Achievements
          </h2>
          <div className="space-y-3">
            {recentAchievements.map((achievement, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-warning-50 rounded-lg border border-warning-200">
                <div className="flex items-center space-x-3">
                  <Trophy className="h-5 w-5 text-warning-600" />
                  <div>
                    <div className="font-medium text-gray-100">{achievement.name}</div>
                    <div className="text-sm text-gray-400">{achievement.description}</div>
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

      {/* Workout History */}
      {progress.workoutHistory && progress.workoutHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-6"
        >
          <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center">
            <Activity className="h-5 w-5 text-danger-600 mr-2" />
            Workout History
          </h2>
          <div className="space-y-3">
            {progress.workoutHistory.slice(-10).map((workout, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-dark-bg rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                  <div>
                    <div className="font-medium text-gray-100">
                      {new Date(workout.date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-400">
                      {workout.exercises?.length || 0} exercises • {Math.floor(workout.duration / 60)}m {workout.duration % 60}s
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Completed
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProgressTracker;
