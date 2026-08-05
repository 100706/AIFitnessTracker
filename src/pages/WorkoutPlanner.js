import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Target, 
  Dumbbell, 
  Play, 
  Pause, 
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Zap,
  Heart,
  Timer
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useOllama } from '../contexts/OllamaContext';
import LoadingSpinner from '../components/LoadingSpinner';

const WorkoutPlanner = () => {
  const { currentUser, updateProgress, addAchievement } = useUser();
  const { profile, progress } = currentUser || {};
  const { generateWorkoutPlan, isLoading } = useOllama();
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    if (profile?.recommendations?.workout) {
      setWorkoutPlan(profile.recommendations.workout);
    }
  }, [profile]);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
      }, 1000);
    } else if (!isTimerRunning && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  // Safety check to prevent errors if profile is not loaded yet
  if (!profile) {
    return <LoadingSpinner />;
  }

  const generateNewWorkout = async () => {
    try {
      const plan = await generateWorkoutPlan(profile);
      setWorkoutPlan(plan);
    } catch (error) {
      console.error('Error generating workout plan:', error);
    }
  };

  const startWorkout = (workout) => {
    setCurrentWorkout(workout);
    setIsWorkoutActive(true);
    setCurrentExercise(0);
    setTimer(0);
    setIsTimerRunning(true);
  };

  const completeExercise = () => {
    if (currentExercise < (currentWorkout?.exercises?.length || 0) - 1) {
      setCurrentExercise(currentExercise + 1);
    } else {
      completeWorkout();
    }
  };

  const completeWorkout = () => {
    setIsWorkoutActive(false);
    setIsTimerRunning(false);
    
    // Update progress
    const newWorkout = {
      date: new Date().toISOString(),
      duration: timer,
      exercises: currentWorkout?.exercises || [],
      completed: true
    };

    updateProgress({
      workoutHistory: [...(progress.workoutHistory || []), newWorkout],
      streak: (progress.streak || 0) + 1,
      consistency: {
        ...progress.consistency,
        workouts: Math.min(100, (progress.consistency?.workouts || 0) + 5)
      }
    });

    // Add achievement
    addAchievement({
      name: 'Workout Completed!',
      description: `Completed ${currentWorkout?.name || 'workout'} in ${formatTime(timer)}`,
      points: 50,
      date: new Date().toISOString()
    });

    setCurrentWorkout(null);
    setCurrentExercise(0);
    setTimer(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const sampleWorkouts = [
    {
      name: 'Upper Body Strength',
      duration: 45,
      difficulty: 'Intermediate',
      exercises: [
        { name: 'Push-ups', sets: 3, reps: 12, rest: 60 },
        { name: 'Pull-ups', sets: 3, reps: 8, rest: 90 },
        { name: 'Dumbbell Press', sets: 3, reps: 10, rest: 60 },
        { name: 'Rows', sets: 3, reps: 10, rest: 60 },
        { name: 'Shoulder Press', sets: 3, reps: 10, rest: 60 }
      ]
    },
    {
      name: 'Lower Body Power',
      duration: 40,
      difficulty: 'Intermediate',
      exercises: [
        { name: 'Squats', sets: 4, reps: 12, rest: 90 },
        { name: 'Lunges', sets: 3, reps: 10, rest: 60 },
        { name: 'Deadlifts', sets: 3, reps: 8, rest: 120 },
        { name: 'Calf Raises', sets: 3, reps: 15, rest: 45 }
      ]
    },
    {
      name: 'Full Body HIIT',
      duration: 30,
      difficulty: 'Advanced',
      exercises: [
        { name: 'Burpees', sets: 4, reps: 10, rest: 30 },
        { name: 'Mountain Climbers', sets: 4, reps: 20, rest: 30 },
        { name: 'Jump Squats', sets: 4, reps: 15, rest: 30 },
        { name: 'Push-ups', sets: 4, reps: 12, rest: 30 }
      ]
    }
  ];

  const getWorkoutRecommendations = () => {
    const goals = profile?.fitnessGoals || [];
    const method = Array.isArray(profile?.trainingMethod) ? profile.trainingMethod.join(', ') : (profile?.trainingMethod || '');
    const equipment = profile?.availableEquipment || [];
    
    if (goals.includes('Build Muscle') && equipment.includes('Full Gym Access')) {
      return sampleWorkouts[0];
    } else if (goals.includes('Lose Weight') && method.includes('HIIT')) {
      return sampleWorkouts[2];
    } else {
      return sampleWorkouts[1];
    }
  };

  const recommendedWorkout = getWorkoutRecommendations();

  if (isWorkoutActive && currentWorkout) {
    const exercise = currentWorkout.exercises[currentExercise];
    const progressPercentage = ((currentExercise + 1) / currentWorkout.exercises.length) * 100;

    return (
      <div className="max-w-4xl mx-auto">
        {/* Workout Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-6 text-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{currentWorkout.name}</h1>
              <p className="text-primary-100">Exercise {currentExercise + 1} of {currentWorkout.exercises.length}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{formatTime(timer)}</div>
              <div className="text-primary-200">Duration</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-primary-700 rounded-full h-2">
              <div 
                className="bg-dark-cardSolid h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-primary-200 mt-2">
              <span>{Math.round(progressPercentage)}% Complete</span>
              <span>{currentWorkout.exercises.length - currentExercise - 1} exercises left</span>
            </div>
          </div>
        </div>

        {/* Current Exercise */}
        <motion.div
          key={currentExercise}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-8 text-center mb-6"
        >
          <div className="mb-6">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Dumbbell className="h-12 w-12 text-primary-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-100 mb-2">{exercise.name}</h2>
            <p className="text-gray-400">Set {currentExercise + 1} of {exercise.sets}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{exercise.sets}</div>
              <div className="text-sm text-gray-400">Sets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{exercise.reps}</div>
              <div className="text-sm text-gray-400">Reps</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{exercise.rest}s</div>
              <div className="text-sm text-gray-400">Rest</div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className={`btn ${isTimerRunning ? 'btn-warning' : 'btn-success'} flex items-center space-x-2`}
            >
              {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span>{isTimerRunning ? 'Pause' : 'Resume'}</span>
            </button>
            <button
              onClick={completeExercise}
              className="btn btn-primary flex items-center space-x-2"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Complete Exercise</span>
            </button>
          </div>
        </motion.div>

        {/* Exercise List */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-gray-100 mb-4">Workout Plan</h3>
          <div className="space-y-3">
            {currentWorkout.exercises.map((ex, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  index === currentExercise
                    ? 'bg-primary-100 border-2 border-primary-300'
                    : index < currentExercise
                    ? 'bg-success-100 border border-success-300'
                    : 'bg-dark-bg border border-gray-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {index < currentExercise ? (
                    <CheckCircle className="h-5 w-5 text-success-600" />
                  ) : index === currentExercise ? (
                    <div className="w-5 h-5 bg-primary-600 rounded-full animate-pulse" />
                  ) : (
                    <div className="w-5 h-5 bg-gray-300 rounded-full" />
                  )}
                  <span className="font-medium">{ex.name}</span>
                </div>
                <div className="text-sm text-gray-400">
                  {ex.sets} sets × {ex.reps} reps
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-100 mb-4">Workout Planner</h1>
        <p className="text-gray-400 text-lg">Choose your workout and start training</p>
      </div>

      {/* AI Generated Workout */}
      {workoutPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 border-primary-200 bg-primary-50"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-primary-800 flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              AI Generated Workout Plan
            </h2>
            <button
              onClick={generateNewWorkout}
              disabled={isLoading}
              className="btn btn-primary btn-sm"
            >
              {isLoading ? <LoadingSpinner size="sm" text="" /> : 'Regenerate'}
            </button>
          </div>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-sm text-primary-700">
              {workoutPlan.substring(0, 500)}...
            </div>
          </div>
          <button className="btn btn-primary mt-4">
            View Full Plan
          </button>
        </motion.div>
      )}

      {/* Quick Workouts */}
      <div>
        <h2 className="text-2xl font-bold text-gray-100 mb-6">Quick Workouts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleWorkouts.map((workout, index) => (
            <motion.div
              key={workout.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-100">{workout.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  workout.difficulty === 'Beginner' ? 'bg-success-100 text-success-700' :
                  workout.difficulty === 'Intermediate' ? 'bg-warning-100 text-warning-700' :
                  'bg-danger-100 text-danger-700'
                }`}>
                  {workout.difficulty}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-400">
                  <Clock className="h-4 w-4 mr-2" />
                  {workout.duration} minutes
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <Target className="h-4 w-4 mr-2" />
                  {workout.exercises.length} exercises
                </div>
              </div>

              <div className="space-y-2 mb-6">
                {workout.exercises.slice(0, 3).map((exercise, exIndex) => (
                  <div key={exIndex} className="flex justify-between text-sm">
                    <span className="text-gray-300">{exercise.name}</span>
                    <span className="text-gray-500">{exercise.sets}×{exercise.reps}</span>
                  </div>
                ))}
                {workout.exercises.length > 3 && (
                  <div className="text-sm text-gray-500">
                    +{workout.exercises.length - 3} more exercises
                  </div>
                )}
              </div>

              <button
                onClick={() => startWorkout(workout)}
                className="btn btn-primary w-full flex items-center justify-center space-x-2"
              >
                <Play className="h-4 w-4" />
                <span>Start Workout</span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recommended Workout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-6 border-success-200 bg-success-50"
      >
        <h2 className="text-xl font-bold text-success-800 mb-4 flex items-center">
          <Heart className="h-5 w-5 mr-2" />
          Recommended for You
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-100">{recommendedWorkout.name}</h3>
            <p className="text-gray-400">
              Based on your goals: {profile?.fitnessGoals?.join(', ') || 'General fitness'}
            </p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {recommendedWorkout.duration} min
              </span>
              <span className="flex items-center">
                <Target className="h-4 w-4 mr-1" />
                {recommendedWorkout.exercises.length} exercises
              </span>
            </div>
          </div>
          <button
            onClick={() => startWorkout(recommendedWorkout)}
            className="btn btn-success flex items-center space-x-2"
          >
            <Play className="h-4 w-4" />
            <span>Start Now</span>
          </button>
        </div>
      </motion.div>

      {/* Workout History */}
      {progress.workoutHistory && progress.workoutHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-6"
        >
          <h2 className="text-xl font-bold text-gray-100 mb-4">Recent Workouts</h2>
          <div className="space-y-3">
            {progress.workoutHistory.slice(-5).map((workout, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-dark-bg rounded-lg">
                <div>
                  <div className="font-medium text-gray-100">
                    {new Date(workout.date).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-400">
                    {workout.exercises?.length || 0} exercises • {formatTime(workout.duration)}
                  </div>
                </div>
                <CheckCircle className="h-5 w-5 text-success-600" />
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default WorkoutPlanner;
