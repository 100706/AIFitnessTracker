import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useOllama } from '../contexts/OllamaContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Target, 
  Dumbbell, 
  Utensils, 
  Heart, 
  Clock, 
  DollarSign,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Questionnaire = () => {
  const { completeQuestionnaire, currentUser } = useUser();
  const { checkConnection, generateWorkoutPlan, generateDietPlan, isLoading } = useOllama();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ollamaConnected, setOllamaConnected] = useState(false);

  const steps = [
    { id: 'basic', title: 'Basic Information', icon: User, color: 'primary' },
    { id: 'body', title: 'Body Metrics', icon: Target, color: 'success' },
    { id: 'goals', title: 'Fitness Goals', icon: Dumbbell, color: 'warning' },
    { id: 'training', title: 'Training Preferences', icon: Dumbbell, color: 'danger' },
    { id: 'diet', title: 'Diet & Nutrition', icon: Utensils, color: 'primary' },
    { id: 'lifestyle', title: 'Lifestyle & Health', icon: Heart, color: 'success' },
    { id: 'constraints', title: 'Constraints & Preferences', icon: Clock, color: 'warning' },
    { id: 'review', title: 'Review & Complete', icon: CheckCircle, color: 'primary' }
  ];

  const questions = {
    basic: [
      {
        id: 'name',
        type: 'text',
        label: 'What\'s your name?',
        placeholder: 'Enter your full name',
        required: true
      },
      {
        id: 'age',
        type: 'number',
        label: 'How old are you?',
        placeholder: 'Enter your age',
        required: true,
        min: 13,
        max: 100
      },
      {
        id: 'gender',
        type: 'select',
        label: 'What\'s your gender?',
        options: ['Male', 'Female', 'Non-binary', 'Prefer not to say'],
        required: true
      }
    ],
    body: [
      {
        id: 'height',
        type: 'text',
        label: 'What\'s your height?',
        placeholder: 'e.g., 5\'8" or 173cm',
        required: true
      },
      {
        id: 'weight',
        type: 'number',
        label: 'What\'s your current weight?',
        placeholder: 'Enter weight in kg or lbs',
        required: true,
        min: 30,
        max: 300
      },
      {
        id: 'bodyType',
        type: 'select',
        label: 'How would you describe your current body type?',
        options: [
          'Skinny',
          'Skinny Fat',
          'Average',
          'Athletic',
          'Overweight',
          'Obese',
          'Muscular',
          'Curvy'
        ],
        required: true
      },
      {
        id: 'activityLevel',
        type: 'select',
        label: 'How would you describe your current activity level?',
        options: [
          'Sedentary (little to no exercise)',
          'Lightly Active (light exercise 1-3 days/week)',
          'Moderately Active (moderate exercise 3-5 days/week)',
          'Very Active (hard exercise 6-7 days/week)',
          'Extremely Active (very hard exercise, physical job)'
        ],
        required: true
      }
    ],
    goals: [
      {
        id: 'fitnessGoals',
        type: 'multiselect',
        label: 'What are your primary fitness goals? (Select all that apply)',
        options: [
          'Lose Weight',
          'Gain Weight',
          'Build Muscle',
          'Increase Strength',
          'Improve Endurance',
          'Better Flexibility',
          'Improve Balance',
          'Better Posture',
          'Increase Energy',
          'Reduce Stress',
          'Improve Sleep',
          'General Health',
          'Athletic Performance',
          'Body Recomposition',
          'Tone Up'
        ],
        required: true
      },
      {
        id: 'timeline',
        type: 'select',
        label: 'What\'s your target timeline for achieving these goals?',
        options: [
          '1-3 months',
          '3-6 months',
          '6-12 months',
          '1-2 years',
          'Long-term lifestyle change'
        ],
        required: true
      },
      {
        id: 'priority',
        type: 'select',
        label: 'What\'s your highest priority right now?',
        options: [
          'Weight Loss',
          'Muscle Gain',
          'Strength Building',
          'Endurance',
          'Flexibility',
          'Overall Health',
          'Stress Relief',
          'Energy Improvement'
        ],
        required: true
      }
    ],
    training: [
      {
        id: 'trainingMethod',
        type: 'multiselect',
        label: 'What training methods interest you? (Select all that apply)',
        options: [
          'Gym Training',
          'Calisthenics (Bodyweight)',
          'Home Workouts (Minimal Equipment)',
          'Outdoor Activities',
          'Sports',
          'Yoga/Pilates',
          'CrossFit',
          'Powerlifting',
          'Olympic Lifting',
          'Mixed Training'
        ],
        required: true
      },
      {
        id: 'availableEquipment',
        type: 'multiselect',
        label: 'What equipment do you have access to?',
        options: [
          'Full Gym Access',
          'Dumbbells',
          'Barbell',
          'Resistance Bands',
          'Kettlebell',
          'Pull-up Bar',
          'Yoga Mat',
          'Treadmill',
          'Stationary Bike',
          'Elliptical',
          'Rowing Machine',
          'No Equipment',
          'Outdoor Space',
          'Swimming Pool'
        ],
        required: true
      },
      {
        id: 'experience',
        type: 'select',
        label: 'What\'s your fitness experience level?',
        options: [
          'Complete Beginner',
          'Beginner (1-6 months)',
          'Intermediate (6 months - 2 years)',
          'Advanced (2+ years)',
          'Expert (5+ years)'
        ],
        required: true
      },
      {
        id: 'availableTime',
        type: 'select',
        label: 'How much time can you dedicate to workouts per week?',
        options: [
          '30 minutes or less',
          '1-2 hours',
          '3-4 hours',
          '5-6 hours',
          '7+ hours'
        ],
        required: true
      }
    ],
    diet: [
      {
        id: 'budget',
        type: 'select',
        label: 'What\'s your monthly food budget?',
        options: [
          'Very Low ($100-200)',
          'Low ($200-400)',
          'Moderate ($400-600)',
          'High ($600-800)',
          'Very High ($800+)'
        ],
        required: true
      },
      {
        id: 'foodPreferences',
        type: 'multiselect',
        label: 'What are your dietary preferences?',
        options: [
          'No Restrictions',
          'Vegetarian',
          'Vegan',
          'Pescatarian',
          'Keto',
          'Paleo',
          'Mediterranean',
          'Low Carb',
          'High Protein',
          'Gluten Free',
          'Dairy Free',
          'Halal',
          'Kosher'
        ],
        required: true
      },
      {
        id: 'allergies',
        type: 'multiselect',
        label: 'Do you have any food allergies?',
        options: [
          'None',
          'Nuts',
          'Dairy',
          'Gluten',
          'Shellfish',
          'Eggs',
          'Soy',
          'Fish',
          'Sesame',
          'Other'
        ],
        required: true
      },
      {
        id: 'cookingSkills',
        type: 'select',
        label: 'How would you rate your cooking skills?',
        options: [
          'Beginner (can follow simple recipes)',
          'Intermediate (can cook most meals)',
          'Advanced (can create and modify recipes)',
          'Expert (professional level)'
        ],
        required: true
      },
      {
        id: 'mealPrepTime',
        type: 'select',
        label: 'How much time can you spend on meal prep per week?',
        options: [
          'No time for meal prep',
          '1-2 hours',
          '3-4 hours',
          '5-6 hours',
          '7+ hours'
        ],
        required: true
      }
    ],
    lifestyle: [
      {
        id: 'sleepSchedule',
        type: 'select',
        label: 'How many hours of sleep do you typically get?',
        options: [
          'Less than 5 hours',
          '5-6 hours',
          '6-7 hours',
          '7-8 hours',
          '8+ hours'
        ],
        required: true
      },
      {
        id: 'stressLevel',
        type: 'select',
        label: 'How would you rate your current stress level?',
        options: [
          'Very Low',
          'Low',
          'Moderate',
          'High',
          'Very High'
        ],
        required: true
      },
      {
        id: 'workSchedule',
        type: 'select',
        label: 'What\'s your typical work schedule?',
        options: [
          '9-5 Regular',
          'Shift Work',
          'Night Shift',
          'Irregular Hours',
          'Work from Home',
          'Student',
          'Unemployed',
          'Retired'
        ],
        required: true
      },
      {
        id: 'smoking',
        type: 'select',
        label: 'Do you smoke?',
        options: ['Never', 'Occasionally', 'Regularly', 'Recently Quit'],
        required: true
      },
      {
        id: 'alcohol',
        type: 'select',
        label: 'How often do you drink alcohol?',
        options: [
          'Never',
          'Rarely (1-2 drinks/month)',
          'Occasionally (1-2 drinks/week)',
          'Regularly (3-4 drinks/week)',
          'Frequently (5+ drinks/week)'
        ],
        required: true
      }
    ],
    constraints: [
      {
        id: 'injuries',
        type: 'multiselect',
        label: 'Do you have any current injuries or limitations?',
        options: [
          'None',
          'Back Pain',
          'Knee Issues',
          'Shoulder Problems',
          'Ankle/Foot Issues',
          'Wrist/Elbow Problems',
          'Neck Pain',
          'Hip Issues',
          'Other'
        ],
        required: true
      },
      {
        id: 'medicalConditions',
        type: 'multiselect',
        label: 'Do you have any medical conditions?',
        options: [
          'None',
          'Diabetes',
          'High Blood Pressure',
          'Heart Disease',
          'Arthritis',
          'Asthma',
          'Thyroid Issues',
          'Depression/Anxiety',
          'Other'
        ],
        required: true
      },
      {
        id: 'motivation',
        type: 'select',
        label: 'What motivates you most?',
        options: [
          'Health Benefits',
          'Physical Appearance',
          'Performance Goals',
          'Social Recognition',
          'Personal Achievement',
          'Stress Relief',
          'Energy Improvement',
          'Longevity'
        ],
        required: true
      },
      {
        id: 'challenges',
        type: 'multiselect',
        label: 'What are your biggest challenges?',
        options: [
          'Lack of Time',
          'Lack of Motivation',
          'Lack of Knowledge',
          'Lack of Support',
          'Financial Constraints',
          'Physical Limitations',
          'Emotional Eating',
          'Inconsistent Schedule',
          'Perfectionism',
          'Fear of Failure'
        ],
        required: true
      }
    ]
  };

  useEffect(() => {
    checkConnection().then(setOllamaConnected);
  }, [checkConnection]);

  const handleInputChange = (questionId, value) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Generate AI recommendations
      let workoutPlan = null;
      let dietPlan = null;

      if (ollamaConnected) {
        try {
          workoutPlan = await generateWorkoutPlan(formData);
          dietPlan = await generateDietPlan(formData);
        } catch (error) {
          console.error('Error generating AI recommendations:', error);
        }
      }

      // Complete questionnaire
      completeQuestionnaire({
        ...formData,
        recommendations: {
          workout: workoutPlan,
          diet: dietPlan
        }
      });
    } catch (error) {
      console.error('Error completing questionnaire:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question) => {
    const value = formData[question.id] || '';

    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className="input w-full"
            required={question.required}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className="input w-full"
            min={question.min}
            max={question.max}
            required={question.required}
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="input w-full"
            required={question.required}
          >
            <option value="">Select an option</option>
            {question.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'multiselect':
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-2">
            {question.options.map(option => (
              <label key={option} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleInputChange(question.id, [...selectedValues, option]);
                    } else {
                      handleInputChange(question.id, selectedValues.filter(v => v !== option));
                    }
                  }}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    const stepQuestions = questions[steps[currentStep].id];
    if (!stepQuestions) return true;

    return stepQuestions.every(question => {
      if (!question.required) return true;
      const value = formData[question.id];
      if (question.type === 'multiselect') {
        return Array.isArray(value) && value.length > 0;
      }
      return value && value.toString().trim() !== '';
    });
  };

  const getProgressPercentage = () => {
    return ((currentStep + 1) / steps.length) * 100;
  };

  if (isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-lg text-gray-600">Generating your personalized fitness plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to FitnessAI
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Let's create your personalized fitness journey
        </p>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-primary-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
        <p className="text-sm text-gray-500">
          Step {currentStep + 1} of {steps.length}
        </p>
      </div>

      {/* Ollama Connection Status */}
      {!ollamaConnected && (
        <div className="mb-6 p-4 bg-warning-50 border border-warning-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-warning-600 mr-2" />
            <p className="text-warning-800">
              AI features are not available. Please make sure Ollama is running with the llama3.2 model.
            </p>
          </div>
        </div>
      )}

      {/* Step Navigation */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-2">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div
                key={step.id}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? `bg-${step.color}-100 text-${step.color}-700` 
                    : isCompleted 
                    ? 'bg-success-100 text-success-700' 
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium hidden sm:block">{step.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Question Form */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="card p-8"
        >
          {steps[currentStep].id === 'review' ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(formData).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <h3 className="font-medium text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    <p className="text-gray-600">
                      {Array.isArray(value) ? value.join(', ') : value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {steps[currentStep].title}
              </h2>
              {questions[steps[currentStep].id]?.map((question) => (
                <div key={question.id} className="space-y-2">
                  <label className="label text-gray-700">
                    {question.label}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderQuestion(question)}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="btn btn-secondary flex items-center space-x-2 disabled:opacity-50"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>

        {currentStep === steps.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="btn btn-primary flex items-center space-x-2"
          >
            <span>Complete Setup</span>
            <CheckCircle className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="btn btn-primary flex items-center space-x-2 disabled:opacity-50"
          >
            <span>Next</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Questionnaire;
