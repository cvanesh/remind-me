// Function to request notification permission
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }
  
  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

// Function to schedule a notification
export const scheduleNotification = (activity, time) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }
  
  // Store the scheduled notification in localStorage
  const scheduledNotifications = JSON.parse(localStorage.getItem('scheduledNotifications') || '[]');
  
  const notification = {
    id: Date.now(),
    activityId: activity.id,
    activityName: activity.name,
    time: time,
  };
  
  scheduledNotifications.push(notification);
  localStorage.setItem('scheduledNotifications', JSON.stringify(scheduledNotifications));
  
  // Schedule the notification
  const timeUntilNotification = new Date(time).getTime() - Date.now();
  if (timeUntilNotification > 0) {
    setTimeout(() => {
      showNotification(activity.name);
    }, timeUntilNotification);
  }
};

// Function to show a notification
export const showNotification = (title) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }
  
  const notification = new Notification(`Time for ${title}!`, {
    body: 'Don\'t forget to complete this activity to keep your streak going!',
    icon: '/logo192.png',
  });
  
  notification.onclick = () => {
    window.focus();
    notification.close();
  };
};

// Function to check for due notifications (call this when app starts)
export const checkDueNotifications = () => {
  if (!localStorage.getItem('notifications') === 'true') {
    return;
  }
  
  const scheduledNotifications = JSON.parse(localStorage.getItem('scheduledNotifications') || '[]');
  const now = Date.now();
  
  scheduledNotifications.forEach(notification => {
    const notificationTime = new Date(notification.time).getTime();
    
    if (notificationTime <= now) {
      // Show notification if it's due
      showNotification(notification.activityName);
      
      // Remove this notification from the list
      const updatedNotifications = scheduledNotifications.filter(n => n.id !== notification.id);
      localStorage.setItem('scheduledNotifications', JSON.stringify(updatedNotifications));
    } else {
      // Schedule future notifications
      const timeUntilNotification = notificationTime - now;
      setTimeout(() => {
        showNotification(notification.activityName);
      }, timeUntilNotification);
    }
  });
};