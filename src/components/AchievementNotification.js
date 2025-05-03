import React, { useContext, useEffect } from 'react';
import { 
  Snackbar, 
  Card, 
  CardContent, 
  Typography, 
  Box,
  Button
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ActivityContext } from '../context/ActivityContext';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  achievementCard: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    padding: theme.spacing(1, 2),
    maxWidth: 320,
  },
  achievementIcon: {
    fontSize: '2.5rem',
    marginRight: theme.spacing(2),
  },
  achievementContent: {
    flex: 1,
  },
  viewButton: {
    marginTop: theme.spacing(1),
    borderRadius: 20,
    textTransform: 'none',
  },
}));

const AchievementNotification = () => {
  const classes = useStyles();
  const { achievementNotification, clearAchievementNotification } = useContext(ActivityContext);
  const history = useHistory();
  
  useEffect(() => {
    if (achievementNotification) {
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        clearAchievementNotification();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [achievementNotification, clearAchievementNotification]);
  
  const handleViewAchievements = () => {
    clearAchievementNotification();
    history.push('/achievements');
  };
  
  if (!achievementNotification) return null;
  
  return (
    <Snackbar
      open={!!achievementNotification}
      autoHideDuration={5000}
      onClose={clearAchievementNotification}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Card className={classes.achievementCard}>
        <Box className={classes.achievementIcon}>
          {achievementNotification.icon}
        </Box>
        <CardContent className={classes.achievementContent}>
          <Typography variant="h6" component="h2">
            Achievement Unlocked!
          </Typography>
          <Typography variant="body1">
            {achievementNotification.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {achievementNotification.description}
          </Typography>
          <Button 
            variant="outlined" 
            color="primary" 
            size="small"
            className={classes.viewButton}
            onClick={handleViewAchievements}
          >
            View Achievements
          </Button>
        </CardContent>
      </Card>
    </Snackbar>
  );
};

export default AchievementNotification;