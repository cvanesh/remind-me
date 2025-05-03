// Achievement types
export const ACHIEVEMENTS = {
  STREAK_3: {
    id: 'streak_3',
    name: 'On Fire!',
    description: 'Complete an activity for 3 days in a row',
    icon: '🔥',
    threshold: 3,
  },
  STREAK_7: {
    id: 'streak_7',
    name: 'Weekly Wonder',
    description: 'Complete an activity for 7 days in a row',
    icon: '🌟',
    threshold: 7,
  },
  STREAK_30: {
    id: 'streak_30',
    name: 'Monthly Master',
    description: 'Complete an activity for 30 days in a row',
    icon: '🏆',
    threshold: 30,
  },
  ACTIVITIES_5: {
    id: 'activities_5',
    name: 'Habit Collector',
    description: 'Add 5 different activities to track',
    icon: '🎯',
    threshold: 5,
  },
  PERFECT_DAY: {
    id: 'perfect_day',
    name: 'Perfect Day',
    description: 'Complete all activities in a single day',
    icon: '🌈',
  },
  FIRST_ACTIVITY: {
    id: 'first_activity',
    name: 'First Step',
    description: 'Complete your first activity',
    icon: '👣',
  },
};

// Function to check and award streak achievements
export const checkStreakAchievements = (activityId, streak) => {
  const userAchievements = JSON.parse(localStorage.getItem('achievements') || '[]');
  let newAchievements = [];
  
  // Check streak achievements
  if (streak === 3 && !userAchievements.includes(ACHIEVEMENTS.STREAK_3.id)) {
    newAchievements.push(ACHIEVEMENTS.STREAK_3);
  }
  
  if (streak === 7 && !userAchievements.includes(ACHIEVEMENTS.STREAK_7.id)) {
    newAchievements.push(ACHIEVEMENTS.STREAK_7);
  }
  
  if (streak === 30 && !userAchievements.includes(ACHIEVEMENTS.STREAK_30.id)) {
    newAchievements.push(ACHIEVEMENTS.STREAK_30);
  }
  
  // Save new achievements
  if (newAchievements.length > 0) {
    const updatedAchievements = [
      ...userAchievements,
      ...newAchievements.map(a => a.id)
    ];
    localStorage.setItem('achievements', JSON.stringify(updatedAchievements));
  }
  
  return newAchievements;
};

// Function to check and award activity count achievements
export const checkActivityCountAchievements = (activityCount) => {
  const userAchievements = JSON.parse(localStorage.getItem('achievements') || '[]');
  let newAchievements = [];
  
  if (activityCount === 1 && !userAchievements.includes(ACHIEVEMENTS.FIRST_ACTIVITY.id)) {
    newAchievements.push(ACHIEVEMENTS.FIRST_ACTIVITY);
  }
  
  if (activityCount === 5 && !userAchievements.includes(ACHIEVEMENTS.ACTIVITIES_5.id)) {
    newAchievements.push(ACHIEVEMENTS.ACTIVITIES_5);
  }
  
  // Save new achievements
  if (newAchievements.length > 0) {
    const updatedAchievements = [
      ...userAchievements,
      ...newAchievements.map(a => a.id)
    ];
    localStorage.setItem('achievements', JSON.stringify(updatedAchievements));
  }
  
  return newAchievements;
};

// Function to check for perfect day achievement
export const checkPerfectDayAchievement = (activities) => {
  const userAchievements = JSON.parse(localStorage.getItem('achievements') || '[]');
  
  // Check if all activities are completed for today
  const today = new Date().toISOString().split('T')[0];
  const allCompleted = activities.every(activity => {
    const lastCompletedDate = activity.lastCompleted ? 
      new Date(activity.lastCompleted).toISOString().split('T')[0] : null;
    return lastCompletedDate === today;
  });
  
  if (allCompleted && activities.length > 0 && !userAchievements.includes(ACHIEVEMENTS.PERFECT_DAY.id)) {
    // Award perfect day achievement
    const updatedAchievements = [
      ...userAchievements,
      ACHIEVEMENTS.PERFECT_DAY.id
    ];
    localStorage.setItem('achievements', JSON.stringify(updatedAchievements));
    return [ACHIEVEMENTS.PERFECT_DAY];
  }
  
  return [];
};

// Function to get all user achievements
export const getUserAchievements = () => {
  const achievementIds = JSON.parse(localStorage.getItem('achievements') || '[]');
  return achievementIds.map(id => {
    return Object.values(ACHIEVEMENTS).find(a => a.id === id);
  }).filter(Boolean);
};