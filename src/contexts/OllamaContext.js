import React, { createContext, useContext, useState } from 'react';

const OllamaContext = createContext();

export function OllamaProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkConnection = async () => {
    try {
      const response = await fetch('http://localhost:11434/api/tags');
      if (response.ok) {
        setIsConnected(true);
        setError(null);
        return true;
      } else {
        setIsConnected(false);
        setError('Ollama server not responding');
        return false;
      }
    } catch (err) {
      setIsConnected(false);
      setError('Cannot connect to Ollama server. Please make sure Ollama is running.');
      return false;
    }
  };

  const generateResponse = async (prompt, model = 'llama3.2') => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 2000
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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
    const prompt = `You are a professional fitness trainer and nutritionist. Based on the following user profile, create a comprehensive workout plan.

User Profile:
- Name: ${userProfile.name}
- Age: ${userProfile.age}
- Gender: ${userProfile.gender}
- Height: ${userProfile.height}
- Weight: ${userProfile.weight}
- Body Type: ${userProfile.bodyType}
- Activity Level: ${userProfile.activityLevel}
- Fitness Goals: ${userProfile.fitnessGoals.join(', ')}
- Training Methods: ${Array.isArray(userProfile.trainingMethod) ? userProfile.trainingMethod.join(', ') : userProfile.trainingMethod}
- Available Equipment: ${userProfile.availableEquipment.join(', ')}
- Experience Level: ${userProfile.experience}
- Available Time: ${userProfile.availableTime}
- Injuries/Medical Conditions: ${userProfile.injuries.join(', ') || 'None'}
- Current Fitness Level: Strength: ${userProfile.strengthLevel}, Endurance: ${userProfile.enduranceLevel}

Please provide a detailed workout plan that incorporates their selected training methods. Include:
1. Weekly schedule with specific days, combining different training methods
2. Exercise selection with proper form instructions for each training method
3. Sets, reps, and rest periods tailored to each method
4. How to blend different training methods effectively
5. Progression plan across all selected methods
6. Safety considerations for each training type
7. Modifications for different fitness levels
8. Expected timeline for results
9. Tips for transitioning between different training methods

Format the response in a clear, structured way that's easy to follow.`;

    return await generateResponse(prompt);
  };

  const generateDietPlan = async (userProfile) => {
    const prompt = `You are a professional nutritionist. Based on the following user profile, create a comprehensive diet plan.

User Profile:
- Name: ${userProfile.name}
- Age: ${userProfile.age}
- Gender: ${userProfile.gender}
- Height: ${userProfile.height}
- Weight: ${userProfile.weight}
- Body Type: ${userProfile.bodyType}
- Activity Level: ${userProfile.activityLevel}
- Fitness Goals: ${userProfile.fitnessGoals.join(', ')}
- Budget: ${userProfile.budget}
- Food Preferences: ${userProfile.foodPreferences.join(', ')}
- Allergies: ${userProfile.allergies.join(', ') || 'None'}
- Medical Conditions: ${userProfile.medicalConditions.join(', ') || 'None'}
- Current Diet: ${userProfile.currentDiet}
- Cooking Skills: ${userProfile.cookingSkills}
- Meal Prep Time: ${userProfile.mealPrepTime}
- Eating Out Frequency: ${userProfile.eatingOutFrequency}
- Favorite Foods: ${userProfile.favoriteFoods.join(', ')}
- Disliked Foods: ${userProfile.dislikedFoods.join(', ')}

Please provide a detailed diet plan including:
1. Daily calorie target
2. Macronutrient breakdown (protein, carbs, fats)
3. Meal timing and frequency
4. Specific food recommendations
5. Sample meal plans for different days
6. Budget-friendly alternatives
7. Supplement recommendations
8. Hydration guidelines
9. Pre/post workout nutrition
10. Shopping list suggestions

Format the response in a clear, structured way with practical meal ideas.`;

    return await generateResponse(prompt);
  };

  const generateProgressAnalysis = async (userProfile, progressData) => {
    const prompt = `You are a fitness coach analyzing a user's progress. Based on their profile and progress data, provide insights and recommendations.

User Profile:
- Goals: ${userProfile.fitnessGoals.join(', ')}
- Training Methods: ${Array.isArray(userProfile.trainingMethod) ? userProfile.trainingMethod.join(', ') : userProfile.trainingMethod}
- Timeline: ${userProfile.timeline}

Progress Data:
- Current Weight: ${progressData.currentWeight || 'Not tracked'}
- Weight Change: ${progressData.weightChange || 'Not available'}
- Workout Consistency: ${progressData.consistency?.workouts || 0}%
- Diet Consistency: ${progressData.consistency?.diet || 0}%
- Current Streak: ${progressData.streak || 0} days
- Recent Achievements: ${progressData.achievements?.slice(-3).map(a => a.name).join(', ') || 'None'}

Please provide:
1. Progress analysis and insights
2. What's working well
3. Areas for improvement
4. Specific recommendations for the next phase
5. Motivation and encouragement
6. Goal adjustments if needed
7. Tips for better consistency

Be encouraging but honest about areas that need work.`;

    return await generateResponse(prompt);
  };

  const generateMotivationalMessage = async (userProfile, context = 'general') => {
    const prompt = `You are a motivational fitness coach. Generate an encouraging and personalized message for this user.

User Profile:
- Name: ${userProfile.name}
- Goals: ${userProfile.fitnessGoals.join(', ')}
- Current Streak: ${userProfile.progress?.streak || 0} days
- Level: ${userProfile.progress?.level || 1}

Context: ${context}

Generate a motivational message that:
1. Acknowledges their efforts
2. Reinforces their goals
3. Provides encouragement
4. Includes a specific tip or advice
5. Is personalized and genuine

Keep it concise but impactful (2-3 sentences).`;

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
    generateMotivationalMessage
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
