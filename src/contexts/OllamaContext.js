import React, { createContext, useContext, useState } from 'react';

const OllamaContext = createContext();

const BACKEND_URL = 'http://localhost:5000';

export function OllamaProvider({ children }) {
  const [isConnected, setIsConnected] = useState(true); // Always true — Gemini is cloud-based
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // checkConnection now just verifies our backend is reachable
  const checkConnection = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/users`);
      if (res.ok) {
        setIsConnected(true);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const generateResponse = async (prompt) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setIsLoading(false);
      return data.response;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  const generateWorkoutPlan = async (userProfile) => {
    const prompt = `You are a professional fitness trainer. Based on the following user profile, create a comprehensive, personalized workout plan.

User Profile:
- Name: ${userProfile.name}
- Age: ${userProfile.age}
- Gender: ${userProfile.gender}
- Height: ${userProfile.height}
- Weight: ${userProfile.weight} kg
- Body Type: ${userProfile.bodyType}
- Activity Level: ${userProfile.activityLevel}
- Fitness Goals: ${Array.isArray(userProfile.fitnessGoals) ? userProfile.fitnessGoals.join(', ') : userProfile.fitnessGoals}
- Training Methods: ${Array.isArray(userProfile.trainingMethod) ? userProfile.trainingMethod.join(', ') : userProfile.trainingMethod}
- Available Equipment: ${Array.isArray(userProfile.availableEquipment) ? userProfile.availableEquipment.join(', ') : userProfile.availableEquipment}
- Experience Level: ${userProfile.experience}
- Available Time per week: ${userProfile.availableTime}
- Injuries/Limitations: ${Array.isArray(userProfile.injuries) ? userProfile.injuries.join(', ') : userProfile.injuries || 'None'}
- Medical Conditions: ${Array.isArray(userProfile.medicalConditions) ? userProfile.medicalConditions.join(', ') : userProfile.medicalConditions || 'None'}

Please provide a detailed, structured weekly workout plan including:
1. Weekly schedule (which days, which muscle groups)
2. Specific exercises with sets, reps, and rest periods
3. Warm-up and cool-down routines
4. Progression plan for 4 weeks
5. Safety tips and form cues
6. Expected results timeline

Format the response clearly with headers and bullet points.`;

    return await generateResponse(prompt);
  };

  const generateDietPlan = async (userProfile) => {
    const prompt = `You are a professional nutritionist. Based on the following user profile, create a detailed, personalized diet plan.

User Profile:
- Name: ${userProfile.name}
- Age: ${userProfile.age}
- Gender: ${userProfile.gender}
- Height: ${userProfile.height}
- Weight: ${userProfile.weight} kg
- Activity Level: ${userProfile.activityLevel}
- Fitness Goals: ${Array.isArray(userProfile.fitnessGoals) ? userProfile.fitnessGoals.join(', ') : userProfile.fitnessGoals}
- Monthly Food Budget: ${userProfile.budget}
- Dietary Preferences: ${Array.isArray(userProfile.foodPreferences) ? userProfile.foodPreferences.join(', ') : userProfile.foodPreferences}
- Food Allergies: ${Array.isArray(userProfile.allergies) ? userProfile.allergies.join(', ') : userProfile.allergies || 'None'}
- Medical Conditions: ${Array.isArray(userProfile.medicalConditions) ? userProfile.medicalConditions.join(', ') : userProfile.medicalConditions || 'None'}
- Cooking Skills: ${userProfile.cookingSkills}
- Meal Prep Time Available: ${userProfile.mealPrepTime}

Please provide:
1. Daily calorie target with macronutrient breakdown (protein/carbs/fats in grams)
2. Meal timing and frequency recommendations
3. A 7-day sample meal plan with approximate calories per meal
4. Grocery shopping list for the week
5. Meal prep tips for the week
6. Pre/post workout nutrition advice
7. Hydration guidelines
8. Budget-friendly swaps

Format the response clearly with headers and bullet points.`;

    return await generateResponse(prompt);
  };

  const generateProgressAnalysis = async (userProfile, progressData) => {
    const prompt = `You are an expert fitness coach. Analyse the following user's progress and provide actionable insights.

User Goals: ${Array.isArray(userProfile.fitnessGoals) ? userProfile.fitnessGoals.join(', ') : userProfile.fitnessGoals}
Training Methods: ${Array.isArray(userProfile.trainingMethod) ? userProfile.trainingMethod.join(', ') : userProfile.trainingMethod}
Target Timeline: ${userProfile.timeline}

Progress Data:
- Current Weight: ${progressData.currentWeight || 'Not tracked'}
- Weight Change: ${progressData.weightChange || 'Not available'}
- Workout Consistency: ${progressData.consistency?.workouts || 0}%
- Diet Consistency: ${progressData.consistency?.diet || 0}%
- Current Streak: ${progressData.streak || 0} days
- Points Earned: ${progressData.points || 0}
- Level: ${progressData.level || 1}
- Recent Achievements: ${progressData.achievements?.slice(-3).map(a => a.name).join(', ') || 'None yet'}

Please provide:
1. Overall progress assessment
2. What the user is doing well
3. Key areas for improvement
4. Specific, actionable recommendations for the next 2 weeks
5. Encouragement and motivation
6. Any goal adjustments you'd recommend

Be honest but encouraging.`;

    return await generateResponse(prompt);
  };

  const generateMotivationalMessage = async (userProfile, context = 'general') => {
    const prompt = `You are an inspiring fitness coach. Write a short, personalized motivational message for this user.

User's Name: ${userProfile.name || 'Athlete'}
Goals: ${Array.isArray(userProfile.fitnessGoals) ? userProfile.fitnessGoals.join(', ') : (userProfile.fitnessGoals || 'general fitness')}
Current Streak: ${userProfile.progress?.streak || 0} days
Level: ${userProfile.progress?.level || 1}
Context: ${context}

Write a motivational message (2-3 sentences max) that:
- Feels personal and genuine (use their name)
- Acknowledges their specific goals
- Provides one concrete tip
- Ends with high energy

Do not use generic platitudes. Make it feel like it's from a real coach who knows them.`;

    return await generateResponse(prompt);
  };

  const value = {
    isConnected,
    isLoading,
    error,
    checkConnection,
    generateResponse,
    generateWorkoutPlan,
    generateDietPlan,
    generateProgressAnalysis,
    generateMotivationalMessage,
  };

  return (
    <OllamaContext.Provider value={value}>
      {children}
    </OllamaContext.Provider>
  );
}

export function useOllama() {
  const context = useContext(OllamaContext);
  if (!context) {
    throw new Error('useOllama must be used within an OllamaProvider');
  }
  return context;
}
