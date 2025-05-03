// Achievement types
export const ACHIEVEMENTS = {
  STREAK_3: {
    id: 'streak_3',
    name: 'On Fire!',
    description: 'Complete an activity for 3 days in a row',
    icon: '🔥',
    threshold: 3,
    points: 10
  },
  STREAK_7: {
    id: 'streak_7',
    name: 'Weekly Wonder',
    description: 'Complete an activity for 7 days in a row',
    icon: '🌟',
    threshold: 7,
    points: 25
  },
  STREAK_30: {
    id: 'streak_30',
    name: 'Monthly Master',
    description: 'Complete an activity for 30 days in a row',
    icon: '🏆',
    threshold: 30,
    points: 100
  },
  ACTIVITIES_5: {
    id: 'activities_5',
    name: 'Habit Collector',
    description: 'Add 5 different activities to track',
    icon: '🎯',
    threshold: 5,
    points: 15
  },
  PERFECT_DAY: {
    id: 'perfect_day',
    name: 'Perfect Day',
    description: 'Complete all activities in a single day',
    icon: '🌈',
    points: 20
  },
  FIRST_ACTIVITY: {
    id: 'first_activity',
    name: 'First Step',
    description: 'Complete your first activity',
    icon: '👣',
    points: 5
  },
  PERFECT_WEEK: {
    id: 'perfect_week',
    name: 'Perfect Week',
    description: 'Complete all activities every day for a week',
    icon: '🌠',
    points: 50
  },
  CATEGORY_MASTER: {
    id: 'category_master',
    name: 'Category Master',
    description: 'Complete activities in all categories',
    icon: '🎭',
    points: 30
  },
  COMEBACK_KID: {
    id: 'comeback_kid',
    name: 'Comeback Kid',
    description: 'Resume an activity after a break of 7+ days',
    icon: '🔄',
    points: 15
  }
};

// User levels based on points
export const LEVELS = [
  { level: 1, name: "Beginner", pointsRequired: 0, icon: '🌱' },
  { level: 2, name: "Novice", pointsRequired: 50, icon: '🌿' },
  { level: 3, name: "Apprentice", pointsRequired: 100, icon: '🌲' },
  { level: 4, name: "Adept", pointsRequired: 200, icon: '🌳' },
  { level: 5, name: "Expert", pointsRequired: 350, icon: '🌴' },
  { level: 6, name: "Master", pointsRequired: 500, icon: '🌵' },
  { level: 7, name: "Grandmaster", pointsRequired: 750, icon: '🍀' },
  { level: 8, name: "Legend", pointsRequired: 1000, icon: '🌺' },
  { level: 9, name: "Mythic", pointsRequired: 1500, icon: '🌟' },
  { level: 10, name: "Transcendent", pointsRequired: 2000, icon: '✨' }
];

// Function to calculate user level based on points
export const getUserLevel = () => {
  const points = getUserPoints();
  
  // Find the highest level the user qualifies for
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (points >= LEVELS[i].pointsRequired) {
      return LEVELS[i];
    }
  }
  
  return LEVELS[0]; // Default to level 1
};

// Function to get user points
export const getUserPoints = () => {
  const achievements = getUserAchievements();
  return achievements.reduce((total, achievement) => total + achievement.points, 0);
};

// Function to check for perfect week achievement
export const checkPerfectWeekAchievement = (activities) => {
  const userAchievements = JSON.parse(localStorage.getItem('achievements') || '[]');
  
  // Check if all activities were completed every day for the past 7 days
  const today = new Date();
  const pastWeek = [];
  
  // Generate array of past 7 days in YYYY-MM-DD format
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    pastWeek.push(date.toISOString().split('T')[0]);
  }
  
  // Check if each activity was completed on each day of the past week
  const allCompletedEveryDay = activities.every(activity => {
    if (!activity.completedDates || activity.completedDates.length === 0) {
      return false;
    }
    
    // Convert completed dates to YYYY-MM-DD format
    const formattedCompletedDates = activity.completedDates.map(date => 
      new Date(date).toISOString().split('T')[0]
    );
    
    // Check if each day in the past week is in the completed dates
    return pastWeek.every(day => formattedCompletedDates.includes(day));
  });
  
  if (allCompletedEveryDay && activities.length > 0 && !userAchievements.includes(ACHIEVEMENTS.PERFECT_WEEK.id)) {
    // Award perfect week achievement
    const updatedAchievements = [
      ...userAchievements,
      ACHIEVEMENTS.PERFECT_WEEK.id
    ];
    localStorage.setItem('achievements', JSON.stringify(updatedAchievements));
    return [ACHIEVEMENTS.PERFECT_WEEK];
  }
  
  return [];
};

// Function to check for category master achievement
export const checkCategoryMasterAchievement = (activities) => {
  const userAchievements = JSON.parse(localStorage.getItem('achievements') || '[]');
  
  // Get all unique categories that have activities
  const categories = [...new Set(activities.map(activity => activity.category).filter(Boolean))];
  
  // Check if there are activities in all predefined categories (excluding "Other")
  const allCategoriesCovered = categories.length >= 7; // Assuming 7 main categories + "Other"
  
  if (allCategoriesCovered && !userAchievements.includes(ACHIEVEMENTS.CATEGORY_MASTER.id)) {
    // Award category master achievement
    const updatedAchievements = [
      ...userAchievements,
      ACHIEVEMENTS.CATEGORY_MASTER.id
    ];
    localStorage.setItem('achievements', JSON.stringify(updatedAchievements));
    return [ACHIEVEMENTS.CATEGORY_MASTER];
  }
  
  return [];
};

// Function to check for comeback kid achievement
export const checkComebackAchievement = (activityId, lastCompletedDate) => {
  const userAchievements = JSON.parse(localStorage.getItem('achievements') || '[]');
  
  if (!lastCompletedDate) {
    return [];
  }
  
  const today = new Date();
  const lastCompleted = new Date(lastCompletedDate);
  const daysDifference = Math.floor((today - lastCompleted) / (1000 * 60 * 60 * 24));
  
  if (daysDifference >= 7 && !userAchievements.includes(ACHIEVEMENTS.COMEBACK_KID.id)) {
    // Award comeback kid achievement
    const updatedAchievements = [
      ...userAchievements,
      ACHIEVEMENTS.COMEBACK_KID.id
    ];
    localStorage.setItem('achievements', JSON.stringify(updatedAchievements));
    return [ACHIEVEMENTS.COMEBACK_KID];
  }
  
  return [];
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