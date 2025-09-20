# Development Guide for FitnessAI

## Quick Start for Development

1. **Clone the repository** (after uploading to GitHub):
   ```bash
   git clone https://github.com/yourusername/fitness-ai.git
   cd fitness-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start Ollama** (required for AI features):
   ```bash
   ollama serve
   ```

4. **Start the development server**:
   ```bash
   npm start
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.js       # Navigation header
│   ├── LoadingSpinner.js
│   ├── UserManager.js  # User creation/management
│   └── Leaderboard.js  # User comparison features
├── contexts/           # React Context for state management
│   ├── UserContext.js  # User data, profiles, progress
│   └── OllamaContext.js # AI integration
├── pages/              # Main application pages
│   ├── Questionnaire.js # User onboarding
│   ├── Dashboard.js    # Main dashboard
│   ├── Profile.js      # User profile management
│   ├── WorkoutPlanner.js # Workout planning
│   ├── DietPlanner.js  # Diet planning
│   ├── ProgressTracker.js # Progress tracking
│   └── Rewards.js      # Gamification system
└── App.js             # Main app component
```

## Key Features to Extend

### 1. Adding New Pages
- Create new component in `src/pages/`
- Add route in `src/App.js`
- Update navigation in `src/components/Header.js`

### 2. Adding New User Data Fields
- Update the initial state in `src/contexts/UserContext.js`
- Add form fields in `src/pages/Questionnaire.js`
- Update profile display in `src/pages/Profile.js`

### 3. Adding New AI Features
- Add new functions in `src/contexts/OllamaContext.js`
- Create prompts for specific use cases
- Integrate with existing pages

### 4. Adding New Rewards/Achievements
- Update rewards list in `src/pages/Rewards.js`
- Add achievement logic in `src/contexts/UserContext.js`
- Update progress tracking

## Common Development Tasks

### Adding a New User Field
1. Add to initial state in `UserContext.js`
2. Add form input in `Questionnaire.js`
3. Add display in `Profile.js`
4. Update any relevant tracking logic

### Adding a New Page
1. Create component in `src/pages/`
2. Add route in `App.js`
3. Add navigation link in `Header.js`
4. Import and use `useUser` hook for data access

### Modifying AI Prompts
1. Edit functions in `src/contexts/OllamaContext.js`
2. Test with different user profiles
3. Adjust prompt parameters as needed

## Testing Checklist

Before committing changes:
- [ ] All pages load without errors
- [ ] User creation works
- [ ] Profile switching works
- [ ] AI features work (if Ollama is running)
- [ ] Progress tracking works
- [ ] Rewards system works
- [ ] Responsive design works on mobile

## Deployment Notes

- The app uses `localStorage` for data persistence
- AI features require Ollama to be running
- No backend server required for basic functionality
- Can be deployed to any static hosting service

## Future Enhancement Ideas

1. **Backend Integration**
   - User authentication
   - Cloud data storage
   - Real-time updates

2. **Mobile App**
   - React Native version
   - Push notifications
   - Offline support

3. **Advanced Features**
   - Video exercise demos
   - Nutrition database integration
   - Wearable device integration
   - Social features (friends, groups)

4. **Analytics**
   - User behavior tracking
   - Progress analytics
   - A/B testing framework
