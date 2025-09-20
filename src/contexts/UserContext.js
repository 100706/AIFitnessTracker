import React, { createContext, useContext, useReducer, useEffect } from 'react';

const UserContext = createContext();

const initialState = {
  currentUserId: null,
  users: {},
  profiles: {},
  progress: {},
  recommendations: {},
  leaderboard: [],
  challenges: [],
  social: {
    following: [],
    followers: [],
    friends: [],
    blocked: []
  }
};

function userReducer(state, action) {
  switch (action.type) {
    case 'CREATE_USER':
      const newUserId = action.payload.id;
      return {
        ...state,
        currentUserId: newUserId,
        users: {
          ...state.users,
          [newUserId]: {
            id: newUserId,
            username: action.payload.username,
            email: action.payload.email,
            avatar: action.payload.avatar || 'default',
            theme: action.payload.theme || 'light',
            createdAt: new Date().toISOString(),
            lastActive: new Date().toISOString()
          }
        },
        profiles: {
          ...state.profiles,
          [newUserId]: {
            name: '',
            age: '',
            gender: '',
            height: '',
            weight: '',
            bodyType: '',
            activityLevel: '',
            fitnessGoals: [],
            trainingMethod: '',
            budget: '',
            foodPreferences: [],
            allergies: [],
            medicalConditions: [],
            experience: '',
            availableTime: '',
            availableEquipment: [],
            motivation: '',
            challenges: [],
            lifestyle: '',
            sleepSchedule: '',
            stressLevel: '',
            currentDiet: '',
            favoriteFoods: [],
            dislikedFoods: [],
            cookingSkills: '',
            mealPrepTime: '',
            eatingOutFrequency: '',
            supplements: [],
            injuries: [],
            flexibility: '',
            cardiovascularHealth: '',
            strengthLevel: '',
            enduranceLevel: '',
            balance: '',
            coordination: '',
            mentalHealth: '',
            socialSupport: '',
            workSchedule: '',
            commuteTime: '',
            familyObligations: '',
            socialLife: '',
            hobbies: [],
            stressRelief: [],
            energyLevels: '',
            hydration: '',
            smoking: '',
            alcohol: '',
            medications: [],
            previousInjuries: [],
            currentPain: [],
            mobilityIssues: [],
            posture: '',
            flexibilityGoals: '',
            strengthGoals: '',
            enduranceGoals: '',
            weightGoals: '',
            bodyCompositionGoals: '',
            performanceGoals: [],
            aestheticGoals: [],
            healthGoals: [],
            timeline: '',
            priority: '',
            commitment: '',
            accountability: '',
            tracking: '',
            support: '',
            resources: '',
            environment: '',
            barriers: [],
            facilitators: [],
            rewards: [],
            punishments: [],
            milestones: [],
            celebrations: [],
            setbacks: [],
            learnings: [],
            adaptations: [],
            preferences: {},
            customizations: {},
            notes: '',
            completed: false
          }
        },
        progress: {
          ...state.progress,
          [newUserId]: {
            dailyCalories: 0,
            weeklyWeight: [],
            weeklyMeasurements: [],
            workoutHistory: [],
            dietHistory: [],
            consistency: {
              workouts: 0,
              diet: 0,
              sleep: 0,
              hydration: 0
            },
            achievements: [],
            streak: 0,
            points: 0,
            level: 1
          }
        },
        recommendations: {
          ...state.recommendations,
          [newUserId]: {
            workout: null,
            diet: null,
            supplements: null,
            lifestyle: null
          }
        }
      };

    case 'SWITCH_USER':
      return {
        ...state,
        currentUserId: action.payload
      };

    case 'UPDATE_PROFILE':
      if (!state.currentUserId) return state;
      return {
        ...state,
        profiles: {
          ...state.profiles,
          [state.currentUserId]: { 
            ...state.profiles[state.currentUserId], 
            ...action.payload 
          }
        }
      };

    case 'COMPLETE_QUESTIONNAIRE':
      if (!state.currentUserId) return state;
      return {
        ...state,
        profiles: {
          ...state.profiles,
          [state.currentUserId]: { 
            ...state.profiles[state.currentUserId], 
            ...action.payload, 
            completed: true 
          }
        }
      };

    case 'UPDATE_PROGRESS':
      if (!state.currentUserId) return state;
      return {
        ...state,
        progress: {
          ...state.progress,
          [state.currentUserId]: { 
            ...state.progress[state.currentUserId], 
            ...action.payload 
          }
        }
      };

    case 'UPDATE_RECOMMENDATIONS':
      if (!state.currentUserId) return state;
      return {
        ...state,
        recommendations: {
          ...state.recommendations,
          [state.currentUserId]: { 
            ...state.recommendations[state.currentUserId], 
            ...action.payload 
          }
        }
      };

    case 'ADD_ACHIEVEMENT':
      if (!state.currentUserId) return state;
      const currentProgress = state.progress[state.currentUserId];
      return {
        ...state,
        progress: {
          ...state.progress,
          [state.currentUserId]: {
            ...currentProgress,
            achievements: [...currentProgress.achievements, action.payload],
            points: currentProgress.points + action.payload.points
          }
        }
      };

    case 'UPDATE_STREAK':
      if (!state.currentUserId) return state;
      const currentProgress2 = state.progress[state.currentUserId];
      return {
        ...state,
        progress: {
          ...state.progress,
          [state.currentUserId]: {
            ...currentProgress2,
            streak: action.payload,
            points: currentProgress2.points + (action.payload > currentProgress2.streak ? 10 : 0)
          }
        }
      };

    case 'UPDATE_LEADERBOARD':
      return {
        ...state,
        leaderboard: action.payload
      };

    case 'ADD_CHALLENGE':
      return {
        ...state,
        challenges: [...state.challenges, action.payload]
      };

    case 'FOLLOW_USER':
      return {
        ...state,
        social: {
          ...state.social,
          following: [...state.social.following, action.payload]
        }
      };

    case 'UNFOLLOW_USER':
      return {
        ...state,
        social: {
          ...state.social,
          following: state.social.following.filter(id => id !== action.payload)
        }
      };

    case 'UPDATE_USER_CUSTOMIZATION':
      if (!state.currentUserId) return state;
      return {
        ...state,
        users: {
          ...state.users,
          [state.currentUserId]: {
            ...state.users[state.currentUserId],
            ...action.payload
          }
        }
      };

    case 'DELETE_USER':
      const { [action.payload]: deletedUser, ...remainingUsers } = state.users;
      const { [action.payload]: deletedProfile, ...remainingProfiles } = state.profiles;
      const { [action.payload]: deletedProgress, ...remainingProgress } = state.progress;
      const { [action.payload]: deletedRecommendations, ...remainingRecommendations } = state.recommendations;
      
      return {
        ...state,
        currentUserId: state.currentUserId === action.payload ? null : state.currentUserId,
        users: remainingUsers,
        profiles: remainingProfiles,
        progress: remainingProgress,
        recommendations: remainingRecommendations
      };

    case 'RESET_ALL':
      return initialState;

    default:
      return state;
  }
}

export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    // Load user data from localStorage
    const savedData = localStorage.getItem('fitnessAIMultiUser');
    if (savedData) {
      const userData = JSON.parse(savedData);
      // Restore the entire state
      Object.keys(userData.users || {}).forEach(userId => {
        dispatch({ type: 'CREATE_USER', payload: userData.users[userId] });
      });
      if (userData.currentUserId) {
        dispatch({ type: 'SWITCH_USER', payload: userData.currentUserId });
      }
      // Restore profiles, progress, and recommendations
      if (userData.profiles) {
        Object.keys(userData.profiles).forEach(userId => {
          dispatch({ type: 'UPDATE_PROFILE', payload: userData.profiles[userId] });
        });
      }
      if (userData.progress) {
        Object.keys(userData.progress).forEach(userId => {
          dispatch({ type: 'UPDATE_PROGRESS', payload: userData.progress[userId] });
        });
      }
      if (userData.recommendations) {
        Object.keys(userData.recommendations).forEach(userId => {
          dispatch({ type: 'UPDATE_RECOMMENDATIONS', payload: userData.recommendations[userId] });
        });
      }
    }
  }, []);

  useEffect(() => {
    // Save user data to localStorage whenever state changes
    localStorage.setItem('fitnessAIMultiUser', JSON.stringify(state));
  }, [state]);

  // Helper function to get current user data
  const getCurrentUser = () => {
    if (!state.currentUserId) return null;
    return {
      user: state.users[state.currentUserId],
      profile: state.profiles[state.currentUserId],
      progress: state.progress[state.currentUserId],
      recommendations: state.recommendations[state.currentUserId]
    };
  };

  // Helper function to get all users for leaderboard
  const getAllUsers = () => {
    return Object.keys(state.users).map(userId => ({
      id: userId,
      user: state.users[userId],
      profile: state.profiles[userId],
      progress: state.progress[userId]
    }));
  };

  // Helper function to generate leaderboard
  const generateLeaderboard = () => {
    const allUsers = getAllUsers();
    return allUsers
      .filter(user => user.progress && user.progress.points > 0)
      .sort((a, b) => b.progress.points - a.progress.points)
      .slice(0, 50); // Top 50 users
  };

  const createUser = (userData) => {
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    dispatch({ type: 'CREATE_USER', payload: { id: userId, ...userData } });
    return userId;
  };

  const switchUser = (userId) => {
    dispatch({ type: 'SWITCH_USER', payload: userId });
  };

  const updateProfile = (profileData) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: profileData });
  };

  const completeQuestionnaire = (questionnaireData) => {
    dispatch({ type: 'COMPLETE_QUESTIONNAIRE', payload: questionnaireData });
  };

  const updateProgress = (progressData) => {
    dispatch({ type: 'UPDATE_PROGRESS', payload: progressData });
  };

  const updateRecommendations = (recommendations) => {
    dispatch({ type: 'UPDATE_RECOMMENDATIONS', payload: recommendations });
  };

  const addAchievement = (achievement) => {
    dispatch({ type: 'ADD_ACHIEVEMENT', payload: achievement });
  };

  const updateStreak = (streak) => {
    dispatch({ type: 'UPDATE_STREAK', payload: streak });
  };

  const updateLeaderboard = () => {
    const leaderboard = generateLeaderboard();
    dispatch({ type: 'UPDATE_LEADERBOARD', payload: leaderboard });
  };

  const addChallenge = (challenge) => {
    dispatch({ type: 'ADD_CHALLENGE', payload: challenge });
  };

  const followUser = (userId) => {
    dispatch({ type: 'FOLLOW_USER', payload: userId });
  };

  const unfollowUser = (userId) => {
    dispatch({ type: 'UNFOLLOW_USER', payload: userId });
  };

  const updateUserCustomization = (customization) => {
    dispatch({ type: 'UPDATE_USER_CUSTOMIZATION', payload: customization });
  };

  const deleteUser = (userId) => {
    dispatch({ type: 'DELETE_USER', payload: userId });
  };

  const resetAll = () => {
    dispatch({ type: 'RESET_ALL' });
    localStorage.removeItem('fitnessAIMultiUser');
  };

  const currentUser = getCurrentUser();

  const value = {
    ...state,
    currentUser,
    getAllUsers,
    generateLeaderboard,
    createUser,
    switchUser,
    updateProfile,
    completeQuestionnaire,
    updateProgress,
    updateRecommendations,
    addAchievement,
    updateStreak,
    updateLeaderboard,
    addChallenge,
    followUser,
    unfollowUser,
    updateUserCustomization,
    deleteUser,
    resetAll
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
