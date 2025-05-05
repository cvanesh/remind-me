import React, { useContext, useState } from 'react';
import { ActivityContext } from '../context/ActivityContext';
import { makeStyles } from '@material-ui/core/styles';
import { 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Box,
  Avatar,
  Chip,
  IconButton
} from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';
import { getIconComponent } from '../utils/iconUtils';
import AchievementNotification from '../components/AchievementNotification';

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
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: theme.shadows[2],
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
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedIcon: {
    color: theme.palette.success.main,
  },
  pendingIcon: {
    color: theme.palette.text.secondary,
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

  // Handle activity card click
  const handleActivityClick = (activityId) => {
    const isCompleted = safeCompletedToday.includes(activityId);
    if (isCompleted) {
      resetActivityCompletion(activityId);
    } else {
      completeActivity(activityId);
    }
  };

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
                        onClick={() => handleActivityClick(activity.id)}
                      >
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Box display="flex" alignItems="center" style={{ maxWidth: '70%' }}>
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
                          
                          {/* Simple status indicator */}
                          <div className={classes.statusIndicator}>
                            {isCompleted ? (
                              <CheckCircleIcon 
                                className={classes.completedIcon} 
                                fontSize="large"
                              />
                            ) : (
                              <RadioButtonUncheckedIcon 
                                className={classes.pendingIcon} 
                                fontSize="large"
                              />
                            )}
                          </div>
                        </Box>
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