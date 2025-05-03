import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  LinearProgress 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { getUserLevel, getUserPoints, LEVELS } from '../utils/gamificationUtils';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    borderRadius: 16,
    marginBottom: theme.spacing(3),
  },
  levelIcon: {
    fontSize: '2rem',
    marginRight: theme.spacing(1),
  },
  levelInfo: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  progressContainer: {
    marginTop: theme.spacing(1),
  },
  progress: {
    height: 10,
    borderRadius: 5,
  },
  nextLevelInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(1),
  },
}));

const UserLevel = () => {
  const classes = useStyles();
  const currentLevel = getUserLevel();
  const userPoints = getUserPoints();
  
  // Find the next level
  const nextLevelIndex = LEVELS.findIndex(level => level.level === currentLevel.level) + 1;
  const nextLevel = nextLevelIndex < LEVELS.length ? LEVELS[nextLevelIndex] : null;
  
  // Calculate progress percentage to next level
  let progressPercentage = 100;
  if (nextLevel) {
    const pointsForCurrentLevel = currentLevel.pointsRequired;
    const pointsForNextLevel = nextLevel.pointsRequired;
    const pointsNeeded = pointsForNextLevel - pointsForCurrentLevel;
    const pointsGained = userPoints - pointsForCurrentLevel;
    progressPercentage = Math.min(100, Math.max(0, (pointsGained / pointsNeeded) * 100));
  }

  return (
    <Paper className={classes.root} elevation={3}>
      <Box className={classes.levelInfo}>
        <Box className={classes.levelIcon}>{currentLevel.icon}</Box>
        <Box>
          <Typography variant="h6">
            Level {currentLevel.level}: {currentLevel.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {userPoints} points earned
          </Typography>
        </Box>
      </Box>
      
      {nextLevel && (
        <Box className={classes.progressContainer}>
          <LinearProgress 
            variant="determinate" 
            value={progressPercentage} 
            className={classes.progress}
            color="secondary"
          />
          <Box className={classes.nextLevelInfo}>
            <Typography variant="body2" color="textSecondary">
              {userPoints} / {nextLevel.pointsRequired} points
            </Typography>
            <Typography variant="body2" color="secondary">
              Next: Level {nextLevel.level} {nextLevel.icon}
            </Typography>
          </Box>
        </Box>
      )}
      
      {!nextLevel && (
        <Typography variant="body2" color="secondary">
          Maximum level reached! You're a Habit Hero!
        </Typography>
      )}
    </Paper>
  );
};

export default UserLevel;