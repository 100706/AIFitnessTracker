import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Edit3, 
  Save, 
  X, 
  Target, 
  Dumbbell, 
  Utensils,
  Heart,
  Clock,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const Profile = () => {
  const { currentUser, updateProfile } = useUser();
  const { profile } = currentUser || {};
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  // Safety check to prevent errors if profile is not loaded yet
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    setEditData({ ...profile });
    setIsEditing(true);
  };

  const handleSave = () => {
    updateProfile(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({});
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const profileSections = [
    {
      title: 'Basic Information',
      icon: User,
      color: 'primary',
      fields: [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'age', label: 'Age', type: 'number' },
        { key: 'gender', label: 'Gender', type: 'text' }
      ]
    },
    {
      title: 'Body Metrics',
      icon: Target,
      color: 'success',
      fields: [
        { key: 'height', label: 'Height', type: 'text' },
        { key: 'weight', label: 'Weight', type: 'text' },
        { key: 'bodyType', label: 'Body Type', type: 'text' },
        { key: 'activityLevel', label: 'Activity Level', type: 'text' }
      ]
    },
    {
      title: 'Fitness Goals',
      icon: Dumbbell,
      color: 'warning',
      fields: [
        { key: 'fitnessGoals', label: 'Goals', type: 'array' },
        { key: 'timeline', label: 'Timeline', type: 'text' },
        { key: 'priority', label: 'Priority', type: 'text' }
      ]
    },
    {
      title: 'Training Preferences',
      icon: Dumbbell,
      color: 'danger',
      fields: [
        { key: 'trainingMethod', label: 'Training Methods', type: 'array' },
        { key: 'availableEquipment', label: 'Available Equipment', type: 'array' },
        { key: 'experience', label: 'Experience Level', type: 'text' },
        { key: 'availableTime', label: 'Available Time', type: 'text' }
      ]
    },
    {
      title: 'Diet & Nutrition',
      icon: Utensils,
      color: 'primary',
      fields: [
        { key: 'budget', label: 'Food Budget', type: 'text' },
        { key: 'foodPreferences', label: 'Food Preferences', type: 'array' },
        { key: 'allergies', label: 'Allergies', type: 'array' },
        { key: 'cookingSkills', label: 'Cooking Skills', type: 'text' }
      ]
    },
    {
      title: 'Lifestyle & Health',
      icon: Heart,
      color: 'success',
      fields: [
        { key: 'sleepSchedule', label: 'Sleep Schedule', type: 'text' },
        { key: 'stressLevel', label: 'Stress Level', type: 'text' },
        { key: 'workSchedule', label: 'Work Schedule', type: 'text' },
        { key: 'smoking', label: 'Smoking', type: 'text' },
        { key: 'alcohol', label: 'Alcohol', type: 'text' }
      ]
    }
  ];

  const renderField = (field, value) => {
    if (isEditing) {
      if (field.type === 'array') {
        return (
          <div className="space-y-2">
            {Array.isArray(value) ? value.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={item || ''}
                  onChange={(e) => {
                    const newArray = [...value];
                    newArray[index] = e.target.value;
                    handleInputChange(field.key, newArray);
                  }}
                  className="input flex-1"
                />
                <button
                  onClick={() => {
                    const newArray = value.filter((_, i) => i !== index);
                    handleInputChange(field.key, newArray);
                  }}
                  className="btn btn-danger btn-sm"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )) : []}
            <button
              onClick={() => {
                const newArray = Array.isArray(value) ? [...value, ''] : [''];
                handleInputChange(field.key, newArray);
              }}
              className="btn btn-secondary btn-sm"
            >
              Add Item
            </button>
          </div>
        );
      }

      return (
        <input
          type={field.type}
          value={value || ''}
          onChange={(e) => handleInputChange(field.key, e.target.value)}
          className="input w-full"
        />
      );
    }

    if (field.type === 'array') {
      return (
        <div className="flex flex-wrap gap-2">
          {Array.isArray(value) ? value.map((item, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
              {item || 'Empty'}
            </span>
          )) : (
            <span className="text-gray-500">Not specified</span>
          )}
        </div>
      );
    }

    return <span className="text-gray-900">{value || 'Not specified'}</span>;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">Manage your personal information and preferences</p>
        </div>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="btn btn-success flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
              <button onClick={handleCancel} className="btn btn-secondary flex items-center space-x-2">
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            </>
          ) : (
            <button onClick={handleEdit} className="btn btn-primary flex items-center space-x-2">
              <Edit3 className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Profile Sections */}
      <div className="space-y-6">
        {profileSections.map((section, sectionIndex) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
              className="card p-6"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className={`p-2 rounded-lg bg-${section.color}-100`}>
                  <Icon className={`h-5 w-5 text-${section.color}-600`} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.fields.map((field) => {
                  const value = isEditing ? editData[field.key] : profile[field.key];
                  return (
                    <div key={field.key} className="space-y-2">
                      <label className="label text-gray-700">
                        {field.label}
                      </label>
                      {renderField(field, value)}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Health Warnings */}
      {(profile.injuries?.length > 0 || profile.medicalConditions?.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card p-6 border-warning-200 bg-warning-50"
        >
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-5 w-5 text-warning-600" />
            <h2 className="text-xl font-bold text-warning-800">Health Considerations</h2>
          </div>
          
          {profile.injuries?.length > 0 && (
            <div className="mb-4">
              <h3 className="font-medium text-warning-800 mb-2">Current Injuries:</h3>
              <div className="flex flex-wrap gap-2">
                {profile.injuries && Array.isArray(profile.injuries) ? profile.injuries.map((injury, index) => (
                  <span key={index} className="px-3 py-1 bg-warning-200 rounded-full text-sm text-warning-800">
                    {injury}
                  </span>
                )) : (
                  <span className="text-gray-500">None</span>
                )}
              </div>
            </div>
          )}

          {profile.medicalConditions?.length > 0 && (
            <div>
              <h3 className="font-medium text-warning-800 mb-2">Medical Conditions:</h3>
              <div className="flex flex-wrap gap-2">
                {profile.medicalConditions && Array.isArray(profile.medicalConditions) ? profile.medicalConditions.map((condition, index) => (
                  <span key={index} className="px-3 py-1 bg-warning-200 rounded-full text-sm text-warning-800">
                    {condition}
                  </span>
                )) : (
                  <span className="text-gray-500">None</span>
                )}
              </div>
            </div>
          )}

          <div className="mt-4 p-3 bg-warning-100 rounded-lg">
            <p className="text-sm text-warning-800">
              <strong>Important:</strong> Please consult with your healthcare provider before starting any new exercise or diet program, especially if you have injuries or medical conditions.
            </p>
          </div>
        </motion.div>
      )}

      {/* Reset Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="card p-6 border-danger-200"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">Danger Zone</h2>
        <p className="text-gray-600 mb-4">
          This will reset your entire profile and you'll need to complete the questionnaire again.
        </p>
        <button 
          onClick={() => {
            if (window.confirm('Are you sure you want to reset your profile? This action cannot be undone.')) {
              // This would be handled by the UserContext
              window.location.reload();
            }
          }}
          className="btn btn-danger"
        >
          Reset Profile
        </button>
      </motion.div>
    </div>
  );
};

export default Profile;
