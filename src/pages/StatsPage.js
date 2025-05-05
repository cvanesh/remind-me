import React, { useContext, useEffect, useState } from 'react';
import { ActivityContext } from '../context/ActivityContext';
import { 
  Container, 
  Typography, 
  Paper, 
  Box,
  Grid,
  LinearProgress,
  Divider
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