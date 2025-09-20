# FitnessAI - Multi-User Fitness Companion

A comprehensive multi-user fitness application built with React.js and powered by AI (Llama 3.2 via Ollama) to provide personalized workout plans, diet recommendations, progress tracking, and social features for comparing and competing with other users.

## Features

### 🏋️ Comprehensive Questionnaire
- Detailed 8-step questionnaire covering:
  - Basic information (name, age, gender)
  - Body metrics (height, weight, body type, activity level)
  - Fitness goals and timeline
  - Training preferences and available equipment
  - Diet preferences, budget, and cooking skills
  - Lifestyle factors and health considerations
  - Constraints and challenges

### 🤖 AI-Powered Recommendations
- **Workout Plans**: Personalized exercise routines based on your goals, equipment, and experience level
- **Diet Plans**: Customized nutrition recommendations considering your budget, preferences, and dietary restrictions
- **Progress Analysis**: AI-generated insights and recommendations for continuous improvement

### 📊 Progress Tracking
- **Weight Tracking**: Monitor your weight changes over time
- **Body Measurements**: Track chest, waist, hips, arms, and thighs
- **Workout History**: Complete workout logging with duration and exercises
- **Calorie Tracking**: Daily calorie intake monitoring with meal logging
- **Water Intake**: Hydration tracking with daily goals

### 🏆 Gamification System
- **Points System**: Earn points for completing workouts, tracking meals, and maintaining streaks
- **Achievement System**: Unlock badges for various milestones
- **Level Progression**: Level up based on your total points
- **Streak Tracking**: Maintain consistency with daily streak counters
- **Rewards & Punishments**: Positive reinforcement for good habits

### 👥 Multi-User System
- **Multiple Profiles**: Create and manage multiple user profiles
- **Profile Customization**: Choose from 12+ avatars and 8+ themes
- **User Switching**: Easy switching between different user profiles
- **Profile Management**: Add, edit, and delete user profiles

### 🏆 Social Features & Competition
- **Leaderboard**: Compare your progress with other users
- **Profile Comparison**: Side-by-side comparison of user stats and achievements
- **Ranking System**: Multiple ranking categories (points, streak, workouts, level, consistency)
- **Achievement Sharing**: See what achievements other users have unlocked
- **Progress Tracking**: Monitor your rank and progress relative to others

### 📱 Modern UI/UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Beautiful Animations**: Smooth transitions and micro-interactions
- **Customizable Themes**: 8+ color themes and avatar options
- **Intuitive Navigation**: Easy-to-use interface with clear navigation

## Prerequisites

Before running this application, make sure you have:

1. **Node.js** (version 14 or higher)
2. **Ollama** installed and running
3. **Llama 3.2 model** pulled in Ollama

### Installing Ollama and Llama 3.2

1. Install Ollama from [https://ollama.ai](https://ollama.ai)
2. Pull the Llama 3.2 model:
   ```bash
   ollama pull llama3.2
   ```
3. Start the Ollama server:
   ```bash
   ollama serve
   ```

## Installation

1. Clone or download this project
2. Navigate to the project directory:
   ```bash
   cd fitness-ai
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

1. Start the development server:
   ```bash
   npm start
   ```
2. Open your browser and navigate to `http://localhost:3000`
3. **Create your first user profile** with custom avatar and theme
4. Complete the comprehensive questionnaire to get started
5. **Create additional users** to compare progress and compete
6. Enjoy your personalized multi-user fitness journey!

## Project Structure

```
fitness-ai/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── LoadingSpinner.js
│   │   ├── UserManager.js
│   │   ├── Leaderboard.js
│   │   └── ProfileComparison.js
│   ├── contexts/
│   │   ├── UserContext.js
│   │   └── OllamaContext.js
│   ├── pages/
│   │   ├── Questionnaire.js
│   │   ├── Dashboard.js
│   │   ├── Profile.js
│   │   ├── WorkoutPlanner.js
│   │   ├── DietPlanner.js
│   │   ├── ProgressTracker.js
│   │   └── Rewards.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
└── README.md
```

## Key Technologies

- **React.js** - Frontend framework
- **Tailwind CSS** - Styling and responsive design
- **Framer Motion** - Animations and transitions
- **React Router** - Navigation
- **Ollama API** - AI integration with Llama 3.2
- **Local Storage** - Data persistence

## Features in Detail

### Questionnaire System
The application starts with a comprehensive 8-step questionnaire that gathers:
- Personal information and body metrics
- Fitness goals and preferences
- Training methods and available equipment
- Dietary preferences and budget constraints
- Lifestyle factors and health considerations
- Challenges and motivation factors

### AI Integration
- **Workout Generation**: Creates personalized workout plans based on user profile
- **Diet Planning**: Generates meal plans considering budget, preferences, and goals
- **Progress Analysis**: Provides insights and recommendations for improvement
- **Motivational Messages**: Generates encouraging messages to keep users motivated

### Progress Tracking
- **Weight Monitoring**: Track weight changes with visual progress indicators
- **Body Measurements**: Monitor body composition changes
- **Workout Logging**: Complete workout tracking with exercise details
- **Nutrition Tracking**: Daily calorie and meal logging
- **Consistency Metrics**: Track adherence to workout and diet plans

### Gamification
- **Points System**: Earn points for various activities
- **Achievement Badges**: Unlock rewards for milestones
- **Level Progression**: Level up based on total points
- **Streak Counters**: Maintain daily consistency
- **Progress Visualization**: Visual representation of achievements
- **Multi-User Competition**: Compare and compete with other users
- **Leaderboards**: Rank yourself against other users in multiple categories
- **Profile Comparison**: Side-by-side comparison of achievements and progress

## Customization

The application is highly customizable:
- Modify the questionnaire questions in `src/pages/Questionnaire.js`
- Adjust the AI prompts in `src/contexts/OllamaContext.js`
- Customize the reward system in `src/pages/Rewards.js`
- Update styling in `src/index.css` and `tailwind.config.js`

## Troubleshooting

### Common Issues

1. **Ollama Connection Error**: Make sure Ollama is running and the llama3.2 model is pulled
2. **AI Features Not Working**: Check if Ollama server is accessible at `http://localhost:11434`
3. **Styling Issues**: Ensure Tailwind CSS is properly configured

### Getting Help

If you encounter any issues:
1. Check the browser console for error messages
2. Verify that Ollama is running: `ollama list`
3. Test Ollama connection: `curl http://localhost:11434/api/tags`

## Multi-User Features

### User Management
- **Create Multiple Users**: Add family members, friends, or different fitness personas
- **Profile Customization**: Choose from 12+ avatars and 8+ color themes
- **Easy Switching**: Switch between users with one click
- **User Statistics**: Track individual progress for each user

### Social Competition
- **Leaderboards**: Rank users by points, streak, workouts, level, and consistency
- **Profile Comparison**: Compare detailed stats, achievements, and goals
- **Achievement Sharing**: See what others have accomplished
- **Progress Tracking**: Monitor your rank and improvement over time

### Comparison Categories
- **Overview**: Quick stats comparison
- **Progress**: Detailed progress metrics
- **Achievements**: Compare unlocked badges and milestones
- **Fitness Stats**: Body metrics and fitness levels
- **Goals**: Compare fitness goals and timelines

## Future Enhancements

Potential features for future development:
- Real-time challenges between users
- Integration with fitness wearables
- Advanced analytics and insights
- Meal prep planning and shopping lists
- Video exercise demonstrations
- Integration with nutrition databases
- Mobile app development
- Team challenges and group competitions
- Social media integration for sharing achievements

## License

This project is open source and available under the MIT License.

---

**Start your fitness journey today with FitnessAI!** 🚀💪
