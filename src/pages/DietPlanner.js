import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Utensils, 
  Plus, 
  Minus, 
  Target, 
  TrendingUp, 
  Clock,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Zap,
  Apple,
  Droplets
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useOllama } from '../contexts/OllamaContext';
import LoadingSpinner from '../components/LoadingSpinner';

const DietPlanner = () => {
  const { currentUser, updateProgress, addAchievement } = useUser();
  const { profile, progress } = currentUser || {};
  const { generateDietPlan, isLoading } = useOllama();
  const [dietPlan, setDietPlan] = useState(null);
  const [todaysMeals, setTodaysMeals] = useState([]);
  const [todaysCalories, setTodaysCalories] = useState(0);
  const [waterIntake, setWaterIntake] = useState(0);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [newMeal, setNewMeal] = useState({ name: '', calories: '', mealType: 'breakfast' });

  const mealTypes = [
    { id: 'breakfast', name: 'Breakfast', icon: '🌅', color: 'warning' },
    { id: 'lunch', name: 'Lunch', icon: '☀️', color: 'success' },
    { id: 'dinner', name: 'Dinner', icon: '🌙', color: 'primary' },
    { id: 'snack', name: 'Snack', icon: '🍎', color: 'secondary' }
  ];

  const sampleFoods = [
    { name: 'Oatmeal', calories: 150, category: 'breakfast' },
    { name: 'Banana', calories: 105, category: 'snack' },
    { name: 'Chicken Breast', calories: 165, category: 'lunch' },
    { name: 'Brown Rice', calories: 220, category: 'lunch' },
    { name: 'Salmon', calories: 206, category: 'dinner' },
    { name: 'Broccoli', calories: 55, category: 'dinner' },
    { name: 'Greek Yogurt', calories: 100, category: 'snack' },
    { name: 'Almonds', calories: 164, category: 'snack' }
  ];

  useEffect(() => {
    if (profile?.recommendations?.diet) {
      setDietPlan(profile.recommendations.diet);
    }
    
    // Load today's meals from progress
    const today = new Date().toDateString();
    const todaysData = progress.dietHistory?.find(day => 
      new Date(day.date).toDateString() === today
    );
    
    if (todaysData) {
      setTodaysMeals(todaysData.meals || []);
      setTodaysCalories(todaysData.totalCalories || 0);
      setWaterIntake(todaysData.waterIntake || 0);
    }
  }, [profile, progress]);

  // Safety check to prevent errors if profile is not loaded yet
  if (!profile) {
    return <LoadingSpinner />;
  }

  const generateNewDietPlan = async () => {
    try {
      const plan = await generateDietPlan(profile);
      setDietPlan(plan);
    } catch (error) {
      console.error('Error generating diet plan:', error);
    }
  };

  const addMeal = () => {
    if (newMeal.name && newMeal.calories) {
      const meal = {
        ...newMeal,
        id: Date.now(),
        calories: parseInt(newMeal.calories),
        timestamp: new Date().toISOString()
      };
      
      const updatedMeals = [...todaysMeals, meal];
      const totalCalories = updatedMeals.reduce((sum, meal) => sum + meal.calories, 0);
      
      setTodaysMeals(updatedMeals);
      setTodaysCalories(totalCalories);
      setNewMeal({ name: '', calories: '', mealType: 'breakfast' });
      setShowAddMeal(false);
      
      // Update progress
      updateDietProgress(updatedMeals, totalCalories);
    }
  };

  const removeMeal = (mealId) => {
    const updatedMeals = todaysMeals.filter(meal => meal.id !== mealId);
    const totalCalories = updatedMeals.reduce((sum, meal) => sum + meal.calories, 0);
    
    setTodaysMeals(updatedMeals);
    setTodaysCalories(totalCalories);
    updateDietProgress(updatedMeals, totalCalories);
  };

  const updateDietProgress = (meals, totalCalories) => {
    const today = new Date().toDateString();
    const existingDayIndex = progress.dietHistory?.findIndex(day => 
      new Date(day.date).toDateString() === today
    ) || -1;

    const dayData = {
      date: new Date().toISOString(),
      meals,
      totalCalories,
      waterIntake
    };

    let updatedHistory;
    if (existingDayIndex >= 0) {
      updatedHistory = [...progress.dietHistory];
      updatedHistory[existingDayIndex] = dayData;
    } else {
      updatedHistory = [...(progress.dietHistory || []), dayData];
    }

    updateProgress({
      dietHistory: updatedHistory,
      dailyCalories: totalCalories,
      consistency: {
        ...progress.consistency,
        diet: Math.min(100, (progress.consistency?.diet || 0) + 2)
      }
    });
  };

  const addWater = (amount) => {
    const newWaterIntake = waterIntake + amount;
    setWaterIntake(newWaterIntake);
    
    const today = new Date().toDateString();
    const existingDayIndex = progress.dietHistory?.findIndex(day => 
      new Date(day.date).toDateString() === today
    ) || -1;

    const dayData = {
      date: new Date().toISOString(),
      meals: todaysMeals,
      totalCalories: todaysCalories,
      waterIntake: newWaterIntake
    };

    let updatedHistory;
    if (existingDayIndex >= 0) {
      updatedHistory = [...progress.dietHistory];
      updatedHistory[existingDayIndex] = dayData;
    } else {
      updatedHistory = [...(progress.dietHistory || []), dayData];
    }

    updateProgress({ dietHistory: updatedHistory });
  };

  const getCalorieGoal = () => {
    // Simple calorie calculation based on goals
    const baseCalories = profile?.gender === 'Male' ? 2000 : 1800;
    const weight = parseFloat(profile?.weight) || 70;
    const height = profile?.height || '170cm';
    
    if (profile?.fitnessGoals?.includes('Lose Weight')) {
      return Math.round(baseCalories - 500);
    } else if (profile?.fitnessGoals?.includes('Gain Weight')) {
      return Math.round(baseCalories + 500);
    } else if (profile?.fitnessGoals?.includes('Build Muscle')) {
      return Math.round(baseCalories + 300);
    }
    
    return baseCalories;
  };

  const getCalorieProgress = () => {
    const goal = getCalorieGoal();
    return Math.min(100, (todaysCalories / goal) * 100);
  };

  const getWaterGoal = () => {
    const weight = parseFloat(profile?.weight) || 70;
    return Math.round(weight * 35); // 35ml per kg
  };

  const getWaterProgress = () => {
    const goal = getWaterGoal();
    return Math.min(100, (waterIntake / goal) * 100);
  };

  const calorieGoal = getCalorieGoal();
  const waterGoal = getWaterGoal();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-100 mb-4">Diet Planner</h1>
        <p className="text-gray-400 text-lg">Track your nutrition and stay on target</p>
      </div>

      {/* AI Generated Diet Plan */}
      {dietPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 border-success-200 bg-success-50"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-success-800 flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              AI Generated Diet Plan
            </h2>
            <button
              onClick={generateNewDietPlan}
              disabled={isLoading}
              className="btn btn-success btn-sm"
            >
              {isLoading ? <LoadingSpinner size="sm" text="" /> : 'Regenerate'}
            </button>
          </div>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-sm text-success-700">
              {dietPlan.substring(0, 500)}...
            </div>
          </div>
          <button className="btn btn-success mt-4">
            View Full Plan
          </button>
        </motion.div>
      )}

      {/* Daily Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calorie Tracking */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-6"
        >
          <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center">
            <Target className="h-5 w-5 text-primary-600 mr-2" />
            Daily Calories
          </h2>
          
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-primary-600 mb-2">
              {todaysCalories}
            </div>
            <div className="text-gray-400">
              of {calorieGoal} calories
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${
                getCalorieProgress() >= 100 ? 'bg-success-600' : 'bg-primary-600'
              }`}
              style={{ width: `${getCalorieProgress()}%` }}
            />
          </div>

          <div className="flex justify-between text-sm text-gray-400">
            <span>{Math.round(getCalorieProgress())}% Complete</span>
            <span>{calorieGoal - todaysCalories} remaining</span>
          </div>

          {getCalorieProgress() >= 100 && (
            <div className="mt-4 p-3 bg-success-100 rounded-lg">
              <div className="flex items-center text-success-800">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">Daily goal achieved! 🎉</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Water Tracking */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-6"
        >
          <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center">
            <Droplets className="h-5 w-5 text-blue-600 mr-2" />
            Water Intake
          </h2>
          
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {waterIntake}ml
            </div>
            <div className="text-gray-400">
              of {waterGoal}ml goal
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${getWaterProgress()}%` }}
            />
          </div>

          <div className="flex justify-between text-sm text-gray-400 mb-4">
            <span>{Math.round(getWaterProgress())}% Complete</span>
            <span>{waterGoal - waterIntake}ml remaining</span>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => addWater(250)}
              className="btn btn-secondary btn-sm flex-1"
            >
              +250ml
            </button>
            <button
              onClick={() => addWater(500)}
              className="btn btn-primary btn-sm flex-1"
            >
              +500ml
            </button>
          </div>
        </motion.div>
      </div>

      {/* Meals */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-100">Today's Meals</h2>
          <button
            onClick={() => setShowAddMeal(!showAddMeal)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Meal</span>
          </button>
        </div>

        {/* Add Meal Form */}
        {showAddMeal && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="card p-6"
          >
            <h3 className="text-lg font-bold text-gray-100 mb-4">Add New Meal</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label text-gray-300">Food Name</label>
                <input
                  type="text"
                  value={newMeal.name}
                  onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                  placeholder="e.g., Grilled Chicken"
                  className="input w-full"
                />
              </div>
              <div>
                <label className="label text-gray-300">Calories</label>
                <input
                  type="number"
                  value={newMeal.calories}
                  onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                  placeholder="e.g., 250"
                  className="input w-full"
                />
              </div>
              <div>
                <label className="label text-gray-300">Meal Type</label>
                <select
                  value={newMeal.mealType}
                  onChange={(e) => setNewMeal({ ...newMeal, mealType: e.target.value })}
                  className="input w-full"
                >
                  {mealTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex space-x-3 mt-4">
              <button onClick={addMeal} className="btn btn-success">
                Add Meal
              </button>
              <button 
                onClick={() => setShowAddMeal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Meal Types */}
        {mealTypes.map((mealType, index) => {
          const meals = todaysMeals.filter(meal => meal.mealType === mealType.id);
          const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);

          return (
            <motion.div
              key={mealType.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{mealType.icon}</span>
                  <h3 className="text-lg font-bold text-gray-100">{mealType.name}</h3>
                </div>
                <div className="text-sm text-gray-400">
                  {totalCalories} calories
                </div>
              </div>

              {meals.length > 0 ? (
                <div className="space-y-3">
                  {meals.map((meal) => (
                    <div key={meal.id} className="flex items-center justify-between p-3 bg-dark-bg rounded-lg">
                      <div>
                        <div className="font-medium text-gray-100">{meal.name}</div>
                        <div className="text-sm text-gray-400">
                          {new Date(meal.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-300">
                          {meal.calories} cal
                        </span>
                        <button
                          onClick={() => removeMeal(meal.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Utensils className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No meals logged yet</p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Quick Add Foods */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card p-6"
      >
        <h2 className="text-xl font-bold text-gray-100 mb-4">Quick Add Foods</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {sampleFoods.map((food, index) => (
            <button
              key={index}
              onClick={() => {
                setNewMeal({
                  name: food.name,
                  calories: food.calories.toString(),
                  mealType: food.category
                });
                setShowAddMeal(true);
              }}
              className="p-3 text-left border border-gray-800 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <div className="font-medium text-gray-100">{food.name}</div>
              <div className="text-sm text-gray-400">{food.calories} cal</div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Nutrition Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card p-6 border-blue-200 bg-blue-50"
      >
        <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
          <Apple className="h-5 w-5 mr-2" />
          Nutrition Tips
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <h3 className="font-medium mb-2">💡 Hydration</h3>
            <p>Drink water throughout the day, not just during meals. Aim for 8-10 glasses daily.</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">🥗 Balanced Meals</h3>
            <p>Include protein, carbs, and healthy fats in each meal for sustained energy.</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">⏰ Meal Timing</h3>
            <p>Eat every 3-4 hours to maintain stable blood sugar and energy levels.</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">📊 Portion Control</h3>
            <p>Use your hand as a guide: palm for protein, fist for carbs, thumb for fats.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DietPlanner;
