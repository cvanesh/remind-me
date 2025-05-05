import React, { createContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from '../hooks/usePerformance';
import { 
  checkStreakAchievements, 
  checkActivityCountAchievements,
  checkPerfectDayAchievement 
} from '../utils/gamificationUtils';

export const ActivityContext = createContext();

// In your ActivityContext.js
export const ActivityProvider = ({ children }) => {
  const [activities, setActivities] = useLocalStorage('activities', []);
  const [completedToday, setCompletedToday] = useLocalStorage('completedToday', []);
  const [achievements, setAchievements] = useLocalStorage('achievements', []);
  const [achievementNotification, setAchievementNotification] = useState(null);
  
  useEffect(() => {
    const storedActivities = localStorage.getItem('activities');
    if (storedActivities) {
      setActivities(JSON.parse(storedActivities));
    }
  }, []);
  
  useEffect(() => {
    if (activities.length > 0) {
      localStorage.setItem('activities', JSON.stringify(activities));
      
      // Check for perfect day achievement
      const newAchievements = checkPerfectDayAchievement(activities);
      if (newAchievements.length > 0) {
        setAchievementNotification(newAchievements[0]);
        
        // Store achievement time
        localStorage.setItem(`achievement_time_${newAchievements[0].id}`, Date.now().toString());
      }
    }
  }, [activities]);
  
  const addActivity = (activity) => {
    const newActivity = {
      ...activity,
      id: uuidv4(),
      streak: 0,
      lastCompleted: null,
      completedDates: [],
      category: activity.category || 'General', // Add default category
    };
    
    const updatedActivities = [...activities, newActivity];
    setActivities(updatedActivities);
    
    // Check for activity count achievements
    const newAchievements = checkActivityCountAchievements(updatedActivities.length);
    if (newAchievements.length > 0) {
      setAchievementNotification(newAchievements[0]);
      
      // Store achievement time
      localStorage.setItem(`achievement_time_${newAchievements[0].id}`, Date.now().toString());
    }
  };
  
  // Check for achievements after completing an activity
  const checkAchievements = useCallback((activityId) => {
    // Implementation of achievement checking logic
    // This would check for various conditions and add achievements
    // when appropriate
    
    // For example:
    const activity = activities.find(a => a.id === activityId);
    if (!activity) return;
    
    // Check for streak achievements
    if (activity.streak === 7) {
      // Add a 7-day streak achievement
      const newAchievement = {
        id: uuidv4(),
        name: "Week Warrior",
        description: `Completed ${activity.name} for 7 days in a row!`,
        icon: "🔥",
        earnedAt: new Date().toISOString(),
        points: 50
      };
      
      // Check if achievement already exists
      if (!achievements.some(a => a.name === newAchievement.name)) {
        setAchievements(prev => [...prev, newAchievement]);
      }
    }
    
    // Add more achievement checks as needed
    
  }, [activities, achievements, setAchievements]);
  
  const completeActivity = useCallback((activityId) => {
    if (completedToday.includes(activityId)) return;
    
    const today = new Date().toISOString().split('T')[0];
    
    setCompletedToday(prev => [...prev, activityId]);
    
    setActivities(prevActivities => 
      prevActivities.map(activity => {
        if (activity.id === activityId) {
          const completedDates = [...(activity.completedDates || []), today];
          return {
            ...activity,
            completedDates,
            streak: activity.streak + 1,
            lastCompleted: new Date().toISOString()
          };
        }
        return activity;
      })
    );
    
    // Check for achievements after completing an activity
    checkAchievements(activityId);
  }, [completedToday, setCompletedToday, setActivities, checkAchievements]);
  
  // Add new function to reset activity completion
  const resetActivityCompletion = useCallback((activityId) => {
    // Remove from completedToday
    setCompletedToday(prev => prev.filter(id => id !== activityId));
    
    // Update the activity
    setActivities(prevActivities => 
      prevActivities.map(activity => {
        if (activity.id === activityId) {
          // Get today's date in ISO format
          const today = new Date().toISOString().split('T')[0];
          
          // Remove today's date from completedDates
          const completedDates = (activity.completedDates || [])
            .filter(date => !date.startsWith(today));
          
          // Decrease streak if it was increased today
          const streak = Math.max(0, activity.streak - 1);
          
          // Update lastCompleted to the most recent date in completedDates
          const lastCompleted = completedDates.length > 0 
            ? completedDates[completedDates.length - 1] 
            : null;
          
          return {
            ...activity,
            completedDates,
            streak,
            lastCompleted
          };
        }
        return activity;
      })
    );
  }, [setCompletedToday, setActivities]);
  
  const deleteActivity = (id) => {
    setActivities(prevActivities => 
      prevActivities.filter(activity => activity.id !== id)
    );
  };
  
  const clearAchievementNotification = () => {
    setAchievementNotification(null);
  };
  
  return (
    <ActivityContext.Provider 
      value={{ 
        activities, 
        completedToday, 
        addActivity, 
        completeActivity,
        resetActivityCompletion, // Add the new function to the context
        deleteActivity,
        achievements
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};