import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  User, 
  Settings, 
  Trash2, 
  Edit3,
  Crown,
  Trophy,
  Zap,
  Star,
  Palette,
  Camera
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const UserManager = ({ isOpen, onClose }) => {
  const { 
    users, 
    currentUserId, 
    currentUser, 
    createUser, 
    switchUser, 
    deleteUser, 
    updateUserCustomization,
    getAllUsers 
  } = useUser();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    avatar: 'default',
    theme: 'light'
  });
  const [customization, setCustomization] = useState({
    avatar: currentUser?.user?.avatar || 'default',
    theme: currentUser?.user?.theme || 'light'
  });

  const avatars = [
    { id: 'default', name: 'Default', emoji: '👤' },
    { id: 'fitness', name: 'Fitness', emoji: '💪' },
    { id: 'runner', name: 'Runner', emoji: '🏃' },
    { id: 'yoga', name: 'Yoga', emoji: '🧘' },
    { id: 'swimmer', name: 'Swimmer', emoji: '🏊' },
    { id: 'cyclist', name: 'Cyclist', emoji: '🚴' },
    { id: 'climber', name: 'Climber', emoji: '🧗' },
    { id: 'dancer', name: 'Dancer', emoji: '💃' },
    { id: 'martial', name: 'Martial Arts', emoji: '🥋' },
    { id: 'gamer', name: 'Gamer', emoji: '🎮' },
    { id: 'chef', name: 'Chef', emoji: '👨‍🍳' },
    { id: 'artist', name: 'Artist', emoji: '🎨' }
  ];

  const themes = [
    { id: 'light', name: 'Light', color: '#ffffff' },
    { id: 'dark', name: 'Dark', color: '#1f2937' },
    { id: 'blue', name: 'Ocean Blue', color: '#0ea5e9' },
    { id: 'green', name: 'Forest Green', color: '#22c55e' },
    { id: 'purple', name: 'Royal Purple', color: '#8b5cf6' },
    { id: 'orange', name: 'Sunset Orange', color: '#f97316' },
    { id: 'pink', name: 'Rose Pink', color: '#ec4899' },
    { id: 'red', name: 'Fire Red', color: '#ef4444' }
  ];

  const handleCreateUser = () => {
    if (newUser.username.trim()) {
      const userId = createUser(newUser);
      switchUser(userId);
      setNewUser({ username: '', email: '', avatar: 'default', theme: 'light' });
      setShowCreateForm(false);
    }
  };

  const handleSwitchUser = (userId) => {
    switchUser(userId);
    onClose();
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      deleteUser(userId);
    }
  };

  const handleUpdateCustomization = () => {
    updateUserCustomization(customization);
    setShowCustomization(false);
  };

  const allUsers = getAllUsers();
  const sortedUsers = allUsers.sort((a, b) => (b.progress?.points || 0) - (a.progress?.points || 0));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-dark-cardSolid rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="h-6 w-6" />
              <h2 className="text-2xl font-bold">User Management</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Current User Info */}
          {currentUser && (
            <div className="mb-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">
                    {avatars.find(a => a.id === currentUser.user.avatar)?.emoji || '👤'}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-primary-800">
                      {currentUser.user.username}
                    </h3>
                    <p className="text-primary-600">
                      Level {currentUser.progress?.level || 1} • {currentUser.progress?.points || 0} points
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCustomization(true)}
                  className="btn btn-primary btn-sm flex items-center space-x-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Customize</span>
                </button>
              </div>
            </div>
          )}

          {/* Create New User */}
          <div className="mb-6">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="btn btn-success w-full flex items-center justify-center space-x-2"
            >
              <UserPlus className="h-5 w-5" />
              <span>Create New User</span>
            </button>

            <AnimatePresence>
              {showCreateForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 bg-dark-bg rounded-lg border"
                >
                  <h3 className="font-bold text-lg mb-4">Create New User</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label text-gray-300">Username</label>
                      <input
                        type="text"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        placeholder="Enter username"
                        className="input w-full"
                      />
                    </div>
                    <div>
                      <label className="label text-gray-300">Email (Optional)</label>
                      <input
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        placeholder="Enter email"
                        className="input w-full"
                      />
                    </div>
                    <div>
                      <label className="label text-gray-300">Avatar</label>
                      <div className="grid grid-cols-6 gap-2">
                        {avatars.map(avatar => (
                          <button
                            key={avatar.id}
                            onClick={() => setNewUser({ ...newUser, avatar: avatar.id })}
                            className={`p-2 rounded-lg border-2 transition-colors ${
                              newUser.avatar === avatar.id 
                                ? 'border-primary-500 bg-primary-100' 
                                : 'border-gray-800 hover:border-gray-700'
                            }`}
                          >
                            <div className="text-2xl">{avatar.emoji}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="label text-gray-300">Theme</label>
                      <div className="grid grid-cols-4 gap-2">
                        {themes.map(theme => (
                          <button
                            key={theme.id}
                            onClick={() => setNewUser({ ...newUser, theme: theme.id })}
                            className={`p-2 rounded-lg border-2 transition-colors ${
                              newUser.theme === theme.id 
                                ? 'border-primary-500' 
                                : 'border-gray-800 hover:border-gray-700'
                            }`}
                            style={{ backgroundColor: theme.color }}
                          >
                            <div className="text-xs text-center text-white font-medium">
                              {theme.name}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-3 mt-4">
                    <button onClick={handleCreateUser} className="btn btn-success">
                      Create User
                    </button>
                    <button 
                      onClick={() => setShowCreateForm(false)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Users List */}
          <div>
            <h3 className="text-lg font-bold text-gray-100 mb-4">All Users</h3>
            <div className="space-y-3">
              {sortedUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    user.id === currentUserId
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-800 hover:border-gray-700 hover:bg-dark-bg'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="text-3xl">
                          {avatars.find(a => a.id === user.user.avatar)?.emoji || '👤'}
                        </div>
                        {index < 3 && (
                          <div className="absolute -top-1 -right-1">
                            {index === 0 && <Crown className="h-4 w-4 text-yellow-500" />}
                            {index === 1 && <Trophy className="h-4 w-4 text-gray-400" />}
                            {index === 2 && <Star className="h-4 w-4 text-orange-500" />}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{user.user.username}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span className="flex items-center space-x-1">
                            <Zap className="h-4 w-4" />
                            <span>{user.progress?.points || 0} pts</span>
                          </span>
                          <span>Level {user.progress?.level || 1}</span>
                          <span>{user.progress?.streak || 0} day streak</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {user.id !== currentUserId && (
                        <button
                          onClick={() => handleSwitchUser(user.id)}
                          className="btn btn-primary btn-sm"
                        >
                          Switch
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="btn btn-danger btn-sm"
                        disabled={Object.keys(users).length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Customization Modal */}
        <AnimatePresence>
          {showCustomization && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-dark-cardSolid rounded-xl p-6 max-w-md w-full mx-4"
              >
                <h3 className="text-xl font-bold mb-4">Customize Profile</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="label text-gray-300">Avatar</label>
                    <div className="grid grid-cols-6 gap-2">
                      {avatars.map(avatar => (
                        <button
                          key={avatar.id}
                          onClick={() => setCustomization({ ...customization, avatar: avatar.id })}
                          className={`p-2 rounded-lg border-2 transition-colors ${
                            customization.avatar === avatar.id 
                              ? 'border-primary-500 bg-primary-100' 
                              : 'border-gray-800 hover:border-gray-700'
                          }`}
                        >
                          <div className="text-2xl">{avatar.emoji}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="label text-gray-300">Theme</label>
                    <div className="grid grid-cols-4 gap-2">
                      {themes.map(theme => (
                        <button
                          key={theme.id}
                          onClick={() => setCustomization({ ...customization, theme: theme.id })}
                          className={`p-2 rounded-lg border-2 transition-colors ${
                            customization.theme === theme.id 
                              ? 'border-primary-500' 
                              : 'border-gray-800 hover:border-gray-700'
                          }`}
                          style={{ backgroundColor: theme.color }}
                        >
                          <div className="text-xs text-center text-white font-medium">
                            {theme.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <button onClick={handleUpdateCustomization} className="btn btn-primary">
                    Save Changes
                  </button>
                  <button 
                    onClick={() => setShowCustomization(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default UserManager;
