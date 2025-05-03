import React, { useContext } from 'react';
import { ActivityContext } from '../context/ActivityContext';
import { makeStyles } from '@material-ui/core/styles';
import { 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Button,
  Box,
  Avatar,
  Chip
} from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';
import { getIconComponent } from '../utils/iconUtils';
import AchievementNotification from '../components/AchievementNotification';

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
  activityCard: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: 16,
    transition: 'transform 0.2s',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-3px)',
    },
  },
  activityIcon: {
    width: 50,
    height: 50,
    marginRight: theme.spacing(2),
    backgroundColor: 'transparent',
  },
  streakChip: {
    marginLeft: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
    fontWeight: 'bold',
  },
  completedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedIcon: {
    fontSize: 60,
    color: theme.palette.primary.main,
  },
  completeButton: {
    borderRadius: 20,
    fontWeight: 'bold',
  },
  noActivities: {
    textAlign: 'center',
    padding: theme.spacing(4),
  },
  dateHeader: {
    textAlign: 'center',
    marginBottom: theme.spacing(2),
  },
}));

// In your HomePage.js
const HomePage = () => {
  const classes = useStyles();
  const { activities, completedToday, completeActivity } = useContext(ActivityContext);
  
  // Add a null check for activities and completedToday
  const safeActivities = activities || [];
  const safeCompletedToday = completedToday || [];
  
  const today = new Date();
  const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', dateOptions);

  return (
    <Container className={classes.root}>
      <AchievementNotification />
      <Typography variant="h1" className={classes.header}>
        HabitHeroes
      </Typography>
      
      <Typography variant="h2" className={classes.dateHeader}>
        {formattedDate}
      </Typography>
      
      {safeActivities.length === 0 ? (
        <Paper className={classes.noActivities}>
          <Typography variant="h6">
            No activities yet! Add some to get started.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {safeActivities.map((activity) => {
            const isCompleted = safeCompletedToday.includes(activity.id);
            const IconComponent = getIconComponent(activity.icon || 'book');
            
            return (
              <Grid item xs={12} key={activity.id}>
                <Paper 
                  className={classes.activityCard} 
                  style={{ 
                    borderLeft: `8px solid ${activity.color}`,
                    opacity: isCompleted ? 0.8 : 1
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <Avatar className={classes.activityIcon} style={{ color: activity.color }}>
                      <IconComponent fontSize="large" />
                    </Avatar>
                    <Box flexGrow={1}>
                      <Typography variant="h6">
                        {activity.name}
                        {activity.streak > 0 && (
                          <Chip
                            icon={<EmojiEventsIcon />}
                            label={`${activity.streak} day streak!`}
                            size="small"
                            className={classes.streakChip}
                          />
                        )}
                      </Typography>
                    </Box>
                    {!isCompleted ? (
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.completeButton}
                        onClick={() => completeActivity(activity.id)}
                      >
                        Complete!
                      </Button>
                    ) : (
                      <CheckCircleIcon color="primary" fontSize="large" />
                    )}
                  </Box>
                  
                  {isCompleted && (
                    <Box className={classes.completedOverlay}>
                      <CheckCircleIcon className={classes.completedIcon} />
                    </Box>
                  )}
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default HomePage;