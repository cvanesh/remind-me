import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Grid,
  Card,
  CardContent,
  Box,
  Divider,
  Fade,
  Tabs,
  Tab,
  CircularProgress,
  Button,
  Badge
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { getUserAchievements, ACHIEVEMENTS, getUserPoints } from '../utils/gamificationUtils';
import UserLevel from '../components/UserLevel';
import Confetti from 'react-confetti';
import ShareIcon from '@material-ui/icons/Share';
import FilterListIcon from '@material-ui/icons/FilterList';
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';

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
  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
  },
  progressText: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButton: {
    marginTop: theme.spacing(1),
    borderRadius: 20,
    textTransform: 'none',
  },
  filterContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(2),
  },
  badgeContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(1),
  },
  badge: {
    margin: theme.spacing(0, 0.5),
  },
  pointsHighlight: {
    fontWeight: 'bold',
    color: theme.palette.secondary.main,
  },
  achievementStats: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: theme.spacing(2),
  },
  statItem: {
    textAlign: 'center',
  },
}));

const AchievementsPage = () => {
  const classes = useStyles();
  const [userAchievements, setUserAchievements] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [newAchievements, setNewAchievements] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    setTimeout(() => {
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
      
      setIsLoading(false);
    }, 800);
  }, []);
  
  const allAchievements = Object.values(ACHIEVEMENTS);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };
  
  const shareAchievement = (achievement) => {
    if (navigator.share) {
      navigator.share({
        title: 'HabitHeroes Achievement Unlocked!',
        text: `I just unlocked the "${achievement.name}" achievement in HabitHeroes! ${achievement.description}`,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      alert(`Achievement shared: ${achievement.name}`);
    }
  };
  
  // Filter achievements based on selected filter
  const filteredAchievements = allAchievements.filter(achievement => {
    if (filter === 'all') return true;
    if (filter === 'unlocked') return userAchievements.some(a => a.id === achievement.id);
    if (filter === 'locked') return !userAchievements.some(a => a.id === achievement.id);
    return true;
  });
  
  // Calculate achievement stats
  const totalPoints = getUserPoints();
  const completionPercentage = Math.round((userAchievements.length / allAchievements.length) * 100);

  return (
    <Container className={classes.root}>
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      <Typography variant="h1" className={classes.header}>
        Achievements
      </Typography>
      
      {/* User Level Component */}
      <UserLevel />
      
      {/* Achievement Stats */}
      <Paper className={classes.paper}>
        <Box className={classes.achievementStats}>
          <Box className={classes.statItem}>
            <Typography variant="h4">{userAchievements.length}</Typography>
            <Typography variant="body2">Unlocked</Typography>
          </Box>
          <Box className={classes.statItem}>
            <Typography variant="h4">{allAchievements.length - userAchievements.length}</Typography>
            <Typography variant="body2">Remaining</Typography>
          </Box>
          <Box className={classes.statItem}>
            <Typography variant="h4" className={classes.pointsHighlight}>{totalPoints}</Typography>
            <Typography variant="body2">Total Points</Typography>
          </Box>
        </Box>
        
        <Box className={classes.progressContainer}>
          <CircularProgress 
            variant="determinate" 
            value={completionPercentage} 
            size={80} 
            thickness={5} 
            color="secondary" 
          />
          <Box className={classes.progressText}>
            <Typography variant="h6">{completionPercentage}%</Typography>
          </Box>
        </Box>
      </Paper>
      
      {/* Tabs for different views */}
      <Paper className={classes.paper}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Your Achievements" />
          <Tab label="All Achievements" />
        </Tabs>
      </Paper>
      
      {/* Filter options */}
      <Box className={classes.filterContainer}>
        <Button 
          startIcon={<FilterListIcon />} 
          color="primary"
          onClick={() => handleFilterChange(filter === 'all' ? 'unlocked' : filter === 'unlocked' ? 'locked' : 'all')}
        >
          Filter: {filter === 'all' ? 'All' : filter === 'unlocked' ? 'Unlocked' : 'Locked'}
        </Button>
      </Box>
      
      {/* New Achievements Section */}
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
                      <Typography variant="body2" color="primary" style={{ marginTop: 8 }}>
                        +{achievement.points} points
                      </Typography>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        className={classes.shareButton}
                        startIcon={<ShareIcon />}
                        onClick={() => shareAchievement(achievement)}
                      >
                        Share
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Fade>
      )}
      
      {/* Loading state */}
      {isLoading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        /* Achievements Content based on selected tab */
        <Paper className={classes.paper}>
          <Typography variant="h6" gutterBottom>
            {tabValue === 0 ? 
              `Your Achievements (${userAchievements.length}/${allAchievements.length})` : 
              'All Achievements'}
          </Typography>
          
          {userAchievements.length === 0 && tabValue === 0 ? (
            <Box className={classes.emptyState}>
              <Box className={classes.emptyStateIcon}>🏆</Box>
              <Typography variant="h6">No Achievements Yet</Typography>
              <Typography variant="body2" color="textSecondary">
                Complete activities and build streaks to earn achievements!
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {filteredAchievements.map((achievement) => {
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
                        <Box className={classes.badgeContainer}>
                          <Badge 
                            className={classes.badge}
                            badgeContent={`+${achievement.points}`} 
                            color="secondary"
                          />
                          {isUnlocked && (
                            <Badge 
                              className={classes.badge}
                              badgeContent="Unlocked" 
                              color="primary"
                            />
                          )}
                        </Box>
                        {isUnlocked && (
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            className={classes.shareButton}
                            startIcon={<ShareIcon />}
                            onClick={() => shareAchievement(achievement)}
                          >
                            Share
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Paper>
      )}
    </Container>
  );
};

export default AchievementsPage;