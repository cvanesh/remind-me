import React, { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  checkStreakAchievements, 
  checkActivityCountAchievements,
  checkPerfectDayAchievement 
} from '../utils/gamificationUtils';

export const ActivityContext = createContext();

// In your ActivityContext.js
export const ActivityProvider = ({ children }) => {
  const [activities, setActivities] = useState([]);
  const [completedToday, setCompletedToday] = useState([]); // Make sure this is initialized
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
  
  const completeActivity = (id) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    setActivities(prevActivities => {
      const updatedActivities = prevActivities.map(activity => {
        if (activity.id === id) {
          const lastCompletedDate = activity.lastCompleted ? new Date(activity.lastCompleted) : null;
          lastCompletedDate?.setHours(0, 0, 0, 0);
          
          // Check if already completed today
          if (lastCompletedDate && lastCompletedDate.getTime() === today.getTime()) {
            return activity;
          }
          
          // Check if completed yesterday to continue streak
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          
          let newStreak = 1; // Start with 1 for today
          if (lastCompletedDate) {
            if (lastCompletedDate.getTime() === yesterday.getTime()) {
              newStreak = activity.streak + 1; // Continue streak
            }
          }
          
          const updatedActivity = {
            ...activity,
            lastCompleted: today.toISOString(),
            streak: newStreak,
            completedDates: [...(activity.completedDates || []), today.toISOString()]
          };
          
          // Check for streak achievements
          const newAchievements = checkStreakAchievements(id, newStreak);
          if (newAchievements.length > 0) {
            setAchievementNotification(newAchievements[0]);
            
            // Store achievement time
            localStorage.setItem(`achievement_time_${newAchievements[0].id}`, Date.now().toString());
          }
          
          return updatedActivity;
        }
        return activity;
      });
      
      return updatedActivities;
    });
  };
  
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
        completedToday, // Make sure this is included
        addActivity, 
        completeActivity, 
        deleteActivity,
        achievementNotification,
        clearAchievementNotification
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};