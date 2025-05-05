import React, { useContext, useState } from 'react';
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
  Chip,
  Card,
  CardContent,
  IconButton
} from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import { getIconComponent } from '../utils/iconUtils';
import AchievementNotification from '../components/AchievementNotification';

// In the useStyles section of HomePage.js

// In the useStyles section
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
    height: 24,
    fontSize: '0.75rem',
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
    pointerEvents: 'none',
  },
  completedIcon: {
    fontSize: 60,
    color: theme.palette.primary.main,
    opacity: 0.7,
  },
  completeButton: {
    borderRadius: 20,
    textTransform: 'none',
    fontWeight: 'bold',
    minWidth: 100,
  },
  completedButton: {
    borderRadius: 20,
    textTransform: 'none',
    fontWeight: 'bold',
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.success.main,
    },
    minWidth: 100,
  },
  noActivities: {
    textAlign: 'center',
    padding: theme.spacing(4),
  },
  dateHeader: {
    textAlign: 'center',
    marginBottom: theme.spacing(2),
  },
  categorySection: {
    marginBottom: theme.spacing(3),
  },
  categoryHeader: {
    padding: theme.spacing(1, 2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(1),
    fontWeight: 'bold',
    color: theme.palette.text.secondary,
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
}));

// In your HomePage.js
const HomePage = () => {
  const classes = useStyles();
  const { activities, completedToday, completeActivity, resetActivityCompletion } = useContext(ActivityContext);
  
  // Add a null check for activities and completedToday
  const safeActivities = activities || [];
  const safeCompletedToday = completedToday || [];
  
  const today = new Date();
  const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', dateOptions);

  // Group activities by category
  const groupedActivities = safeActivities.reduce((groups, activity) => {
    const category = activity.category || 'General';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(activity);
    return groups;
  }, {});

  // Sort categories alphabetically, but keep 'General' at the top
  const sortedCategories = Object.keys(groupedActivities).sort((a, b) => {
    if (a === 'General') return -1;
    if (b === 'General') return 1;
    return a.localeCompare(b);
  });

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
        <div>
          {sortedCategories.map(category => (
            <div key={category} className={classes.categorySection}>
              <Typography variant="h6" className={classes.categoryHeader}>
                {category}
              </Typography>
              
              <Grid container spacing={2}>
                {groupedActivities[category].map((activity) => {
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
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Box display="flex" alignItems="center" style={{ maxWidth: '60%' }}>
                            <Avatar className={classes.activityIcon} style={{ color: activity.color }}>
                              <IconComponent fontSize="large" />
                            </Avatar>
                            <Box>
                              <Typography variant="h6" noWrap>
                                {activity.name}
                              </Typography>
                              {activity.streak > 0 && (
                                <Chip
                                  icon={<EmojiEventsIcon style={{ fontSize: 16 }} />}
                                  label={`${activity.streak} day streak!`}
                                  size="small"
                                  className={classes.streakChip}
                                />
                              )}
                            </Box>
                          </Box>
                          <Button
                            variant="contained"
                            color={isCompleted ? "default" : "primary"}
                            className={isCompleted ? classes.completedButton : classes.completeButton}
                            onClick={() => isCompleted ? resetActivityCompletion(activity.id) : completeActivity(activity.id)}
                          >
                            {isCompleted ? "Completed!" : "Complete!"}
                          </Button>
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
            </div>
          ))}
        </div>
      )}
    </Container>
  );
};

export default HomePage;

// Remove the ActivityCard component as it's not being used