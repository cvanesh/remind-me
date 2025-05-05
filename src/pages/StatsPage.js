import React, { useContext, useEffect, useState } from 'react';
import { ActivityContext } from '../context/ActivityContext';
import { 
  Container, 
  Typography, 
  Paper, 
  Box,
  Grid,
  LinearProgress,
  Divider,
  Chip
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import { getIconComponent } from '../utils/iconUtils';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(10),
  },
  header: {
    textAlign: 'center',
    marginBottom: theme.spacing(3),
    color: theme.palette.primary.main,
  },
  paper: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    borderRadius: 16,
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  statIcon: {
    marginRight: theme.spacing(2),
    color: theme.palette.secondary.main,
  },
  progressContainer: {
    marginTop: theme.spacing(1),
  },
  progress: {
    height: 10,
    borderRadius: 5,
  },
  streakIcon: {
    color: theme.palette.secondary.main,
    marginRight: theme.spacing(1),
  },
  activityIcon: {
    marginRight: theme.spacing(2),
    fontSize: 30,
  },
  divider: {
    margin: theme.spacing(3, 0),
  },
}));

const StatsPage = () => {
  const classes = useStyles();
  const { activities } = useContext(ActivityContext);
  const [completedToday, setCompletedToday] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  
  // Calculate completed activities for today
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayCompleted = activities.filter(activity => {
      if (!activity.lastCompleted) return false;
      const lastCompletedDate = new Date(activity.lastCompleted);
      lastCompletedDate.setHours(0, 0, 0, 0);
      return lastCompletedDate.getTime() === today.getTime();
    });
    
    setCompletedToday(todayCompleted);
    
    // Calculate category stats
    const categories = {};
    
    // Group activities by category
    activities.forEach(activity => {
      const category = activity.category || 'General';
      if (!categories[category]) {
        categories[category] = {
          name: category,
          total: 0,
          completed: 0,
          streakSum: 0,
          longestStreak: 0,
          activities: []
        };
      }
      
      categories[category].total += 1;
      categories[category].activities.push(activity);
      
      if (todayCompleted.some(a => a.id === activity.id)) {
        categories[category].completed += 1;
      }
      
      categories[category].streakSum += activity.streak || 0;
      
      if ((activity.streak || 0) > categories[category].longestStreak) {
        categories[category].longestStreak = activity.streak || 0;
      }
    });
    
    // Convert to array and calculate percentages
    const statsArray = Object.values(categories).map(cat => ({
      ...cat,
      completionRate: cat.total > 0 ? (cat.completed / cat.total) * 100 : 0,
      averageStreak: cat.total > 0 ? cat.streakSum / cat.total : 0
    }));
    
    // Sort by completion rate (highest first)
    statsArray.sort((a, b) => b.completionRate - a.completionRate);
    
    setCategoryStats(statsArray);
  }, [activities]);
  
  // Calculate completion percentage for today
  const completionPercentage = activities.length > 0
    ? (completedToday.length / activities.length) * 100
    : 0;
  
  // Find the longest streak
  const longestStreak = activities.reduce((max, activity) => 
    activity.streak > max ? activity.streak : max, 0);
  
  // Find the activity with the longest streak
  const activityWithLongestStreak = activities.find(
    activity => activity.streak === longestStreak
  );

  return (
    <Container className={classes.root}>
      <Typography variant="h1" className={classes.header}>
        Your Stats
      </Typography>
      
      <Paper className={classes.paper} elevation={3}>
        <Typography variant="h5" gutterBottom>
          Today's Progress
        </Typography>
        
        <Box className={classes.progressContainer}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body1">
              {completedToday.length} of {activities.length} activities completed
            </Typography>
            <Typography variant="body1" color="primary">
              {completionPercentage.toFixed(0)}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={completionPercentage} 
            className={classes.progress}
            color="primary"
          />
        </Box>
      </Paper>
      
      <Paper className={classes.paper} elevation={3}>
        <Typography variant="h5" gutterBottom>
          Category Performance
        </Typography>
        
        {categoryStats.length === 0 ? (
          <Typography variant="body1">
            No categories to display yet.
          </Typography>
        ) : (
          categoryStats.map((category) => (
            <Box key={category.name} mb={3}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">
                  {category.name}
                </Typography>
                <Chip 
                  label={`${category.completed}/${category.total}`}
                  color="primary"
                  size="small"
                />
              </Box>
              
              <Box className={classes.progressContainer}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="textSecondary">
                    Completion Rate
                  </Typography>
                  <Typography variant="body2" color="primary">
                    {category.completionRate.toFixed(0)}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={category.completionRate} 
                  className={classes.progress}
                  color="primary"
                />
              </Box>
              
              <Box mt={1}>
                <Typography variant="body2" color="textSecondary">
                  Average Streak: {category.averageStreak.toFixed(1)} days
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Longest Streak: {category.longestStreak} days
                </Typography>
              </Box>
            </Box>
          ))
        )}
      </Paper>
      
      <Paper className={classes.paper} elevation={3}>
        <Typography variant="h5" gutterBottom>
          Streaks
        </Typography>
        
        {longestStreak > 0 ? (
          <Box>
            <Box className={classes.statItem}>
              <WhatshotIcon className={classes.statIcon} fontSize="large" />
              <Box>
                <Typography variant="h6">
                  Longest Streak: {longestStreak} days
                </Typography>
                {activityWithLongestStreak && (
                  <Typography variant="body2" color="textSecondary">
                    {activityWithLongestStreak.name}
                  </Typography>
                )}
              </Box>
            </Box>
            
            <Divider className={classes.divider} />
            
            <Typography variant="h6" gutterBottom>
              Current Streaks:
            </Typography>
            
            <Grid container spacing={2}>
              {activities
                .filter(activity => activity.streak > 0)
                .sort((a, b) => b.streak - a.streak)
                .map(activity => {
                  const IconComponent = getIconComponent(activity.icon);
                  return (
                    <Grid item xs={12} key={activity.id}>
                      <Box display="flex" alignItems="center">
                        <IconComponent 
                          className={classes.activityIcon} 
                          style={{ color: activity.color }} 
                        />
                        <Box flexGrow={1}>
                          <Typography variant="body1">
                            {activity.name}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center">
                          <EmojiEventsIcon className={classes.streakIcon} />
                          <Typography variant="body1" fontWeight="bold">
                            {activity.streak} days
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  );
                })}
            </Grid>
            
            {activities.filter(activity => activity.streak > 0).length === 0 && (
              <Typography variant="body1" align="center" color="textSecondary">
                No active streaks yet. Complete activities to start building streaks!
              </Typography>
            )}
          </Box>
        ) : (
          <Typography variant="body1" align="center" color="textSecondary">
            Complete activities daily to build streaks!
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default StatsPage;