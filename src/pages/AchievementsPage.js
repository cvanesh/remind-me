import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Divider,
  Fade
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { getUserAchievements, ACHIEVEMENTS } from '../utils/gamificationUtils';
import Confetti from 'react-confetti';

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
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
    borderRadius: 16,
  },
  achievementCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 16,
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)',
    },
  },
  achievementUnlocked: {
    border: `2px solid ${theme.palette.primary.main}`,
  },
  achievementLocked: {
    opacity: 0.7,
    filter: 'grayscale(1)',
  },
  achievementIcon: {
    fontSize: '3rem',
    textAlign: 'center',
    padding: theme.spacing(2),
  },
  achievementContent: {
    flexGrow: 1,
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  emptyState: {
    textAlign: 'center',
    padding: theme.spacing(4),
  },
  emptyStateIcon: {
    fontSize: '4rem',
    marginBottom: theme.spacing(2),
  },
}));

const AchievementsPage = () => {
  const classes = useStyles();
  const [userAchievements, setUserAchievements] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [newAchievements, setNewAchievements] = useState([]);
  
  useEffect(() => {
    const achievements = getUserAchievements();
    setUserAchievements(achievements);
    
    // Check for new achievements (those earned in the last 5 minutes)
    const recentAchievements = achievements.filter(achievement => {
      const achievementTime = localStorage.getItem(`achievement_time_${achievement.id}`);
      if (!achievementTime) return false;
      
      const timeDiff = Date.now() - parseInt(achievementTime);
      return timeDiff < 5 * 60 * 1000; // 5 minutes
    });
    
    if (recentAchievements.length > 0) {
      setNewAchievements(recentAchievements);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, []);
  
  const allAchievements = Object.values(ACHIEVEMENTS);
  
  return (
    <Container className={classes.root}>
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      <Typography variant="h1" className={classes.header}>
        Achievements
      </Typography>
      
      {newAchievements.length > 0 && (
        <Fade in={true} timeout={1000}>
          <Paper className={classes.paper} style={{ backgroundColor: '#f9f0ff' }}>
            <Typography variant="h6" gutterBottom>
              🎉 New Achievements Unlocked!
            </Typography>
            <Grid container spacing={2}>
              {newAchievements.map((achievement) => (
                <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                  <Card className={`${classes.achievementCard} ${classes.achievementUnlocked}`}>
                    <Box className={classes.achievementIcon}>
                      {achievement.icon}
                    </Box>
                    <CardContent className={classes.achievementContent}>
                      <Typography variant="h6" component="h2">
                        {achievement.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {achievement.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Fade>
      )}
      
      <Paper className={classes.paper}>
        <Typography variant="h6" gutterBottom>
          Your Achievements ({userAchievements.length}/{allAchievements.length})
        </Typography>
        
        {userAchievements.length === 0 ? (
          <Box className={classes.emptyState}>
            <Box className={classes.emptyStateIcon}>🏆</Box>
            <Typography variant="h6">No Achievements Yet</Typography>
            <Typography variant="body2" color="textSecondary">
              Complete activities and build streaks to earn achievements!
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {allAchievements.map((achievement) => {
              const isUnlocked = userAchievements.some(a => a.id === achievement.id);
              return (
                <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                  <Card className={`${classes.achievementCard} ${isUnlocked ? classes.achievementUnlocked : classes.achievementLocked}`}>
                    <Box className={classes.achievementIcon}>
                      {achievement.icon}
                    </Box>
                    <CardContent className={classes.achievementContent}>
                      <Typography variant="h6" component="h2">
                        {achievement.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {achievement.description}
                      </Typography>
                      {isUnlocked && (
                        <Typography variant="body2" color="primary" style={{ marginTop: 8 }}>
                          Unlocked! 🎉
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default AchievementsPage;